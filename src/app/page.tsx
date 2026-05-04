"use client";

import { useState, useEffect, useRef } from "react";
import wardIndex from "../../public/data/ward-index.json";

type WardIndexEntry = { slug: string; areas: { name: string; slug: string }[] };
const wardIndexData = wardIndex as Record<string, WardIndexEntry>;
const WARD_NAMES = Object.keys(wardIndexData);

/** 町名の「〇丁目」数字部分を除いたベース名を返す */
function baseTown(s: string): string {
  return s.replace(/[0-9０-９一二三四五六七八九]+丁目.*$/, "").replace(/[0-9０-９]+番地.*$/, "").trim();
}

/** Nominatim の近傍フィールドからエリアを推定する */
function guessArea(areaList: { name: string; slug: string }[], addr: Record<string, string>): { name: string; slug: string } | null {
  const candidates = [
    addr.neighbourhood,
    addr.suburb,
    addr.quarter,
    addr.city_district,
  ].filter(Boolean) as string[];

  for (const cand of candidates) {
    const base = baseTown(cand);
    if (!base) continue;
    const exact = areaList.find((a) => a.name === base || a.name === cand);
    if (exact) return exact;
    const partial = areaList.find((a) => a.name.startsWith(base) || base.startsWith(baseTown(a.name)));
    if (partial) return partial;
  }
  return null;
}

export default function TopPage() {
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedAreaSlug, setSelectedAreaSlug] = useState("");
  const [areas, setAreas] = useState<{ name: string; slug: string }[]>([]);
  const [gpsStatus, setGpsStatus] = useState("");
  const pendingAreaRef = useRef<{ name: string; slug: string } | null>(null);

  useEffect(() => {
    if (selectedWard && wardIndexData[selectedWard]) {
      setAreas(wardIndexData[selectedWard].areas);
      if (pendingAreaRef.current) {
        setSelectedAreaSlug(pendingAreaRef.current.slug);
        pendingAreaRef.current = null;
      } else {
        setSelectedAreaSlug("");
      }
    } else {
      setAreas([]);
      setSelectedAreaSlug("");
    }
  }, [selectedWard]);

  const handleSearch = () => {
    if (selectedWard && selectedAreaSlug) {
      const wardSlug = wardIndexData[selectedWard].slug;
      window.location.href = `/Tokyo/${wardSlug}/${selectedAreaSlug}`;
    } else if (selectedWard) {
      const wardSlug = wardIndexData[selectedWard].slug;
      window.location.href = `/Tokyo/${wardSlug}`;
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("お使いのブラウザはGPSに対応していません");
      return;
    }
    setGpsStatus("現在地を取得中...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ja`
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.county || "";
          const matched = WARD_NAMES.find((w) => city.includes(w));
          if (matched) {
            const areaList = wardIndexData[matched].areas;
            const guessed = guessArea(areaList, addr);
            if (guessed) {
              pendingAreaRef.current = guessed;
              setGpsStatus(`📍 ${matched} ${guessed.name}を検出しました`);
            } else {
              setGpsStatus(`📍 ${matched}を検出しました`);
            }
            setSelectedWard(matched);
          } else {
            setGpsStatus(`現在地: ${city || "不明"} — 東京23区以外はサービス対象外です`);
          }
        } catch {
          setGpsStatus("位置情報の解析に失敗しました");
        }
      },
      () => setGpsStatus("位置情報の取得が拒否されました")
    );
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <h1 className="hero-title">♻️ ゴミカレ</h1>
        <p className="hero-sub">東京23区のごみ収集日を地域別に検索</p>

        <div className="search-box">
          <h2>🔍 地域から調べる</h2>
          <div className="form-row">
            <button className="btn btn-gps" onClick={handleGPS}>
              📍 現在地から自動検索
            </button>
            {gpsStatus && <p style={{ fontSize: ".85rem", color: "#374151" }}>{gpsStatus}</p>}

            <div className="form-group">
              <label>区を選択</label>
              <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                <option value="">-- 区を選択 --</option>
                {WARD_NAMES.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>地域・町名を選択</label>
              <select
                value={selectedAreaSlug}
                onChange={(e) => setSelectedAreaSlug(e.target.value)}
                disabled={!selectedWard}
              >
                <option value="">-- 地域を選択 --</option>
                {areas.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleSearch} disabled={!selectedWard}>
              収集日を確認する →
            </button>
          </div>
        </div>
      </section>

      {/* ── Ward Grid ── */}
      <div className="container">
        <h2 className="section-title">23区から選ぶ</h2>
        <div className="ward-grid">
          {WARD_NAMES.map((ward) => (
            <a
              key={ward}
              href={`/Tokyo/${wardIndexData[ward].slug}`}
              className="ward-card"
            >
              {ward}
              <div className="ward-card-count">
                {wardIndexData[ward].areas.length}地域
              </div>
            </a>
          ))}
        </div>

        {/* ── FAQ / SEO ── */}
        <section className="faq-section" aria-label="よくある質問">
          <h2 className="section-title">よくある質問</h2>
          <div className="faq-item">
            <p className="faq-q">Q. ゴミカレとは？</p>
            <p className="faq-a">東京23区のごみ収集日を地域別に検索できる無料サービスです。燃やすごみ・燃やさないごみ・資源ごみ・プラスチックの収集曜日を一覧表示します。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. GPS機能はどのように使いますか？</p>
            <p className="faq-a">「現在地から自動検索」ボタンを押すと、ブラウザの位置情報を使って現在地の区を自動判定します。許可を求めるダイアログが表示されたら「許可」を選んでください。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. データはいつ更新されますか？</p>
            <p className="faq-a">各区の公式サイトに基づき随時更新しています。祝日や年末年始の特別スケジュールは各区の公式サイトでご確認ください。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 対象エリアは東京23区のみですか？</p>
            <p className="faq-a">現在は東京23区が対象です。順次対応エリアを拡大予定です。</p>
          </div>
        </section>
      </div>
    </>
  );
}

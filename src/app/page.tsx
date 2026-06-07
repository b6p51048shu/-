"use client";

import { useState, useEffect, useRef } from "react";
import wardIndex from "../../public/data/ward-index.json";
import regionIndex from "../../public/data/region-index.json";

type WardIndexEntry = {
  slug: string;
  areas: { name: string; slug: string }[];
  has_bags?: boolean;
};
const wardIndexData = wardIndex as Record<string, WardIndexEntry>;
const regionData = regionIndex as Record<string, string[]>;
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
            setGpsStatus(`現在地: ${city || "不明"} — 現在対象外のエリアです`);
          }
        } catch {
          setGpsStatus("位置情報の解析に失敗しました");
        }
      },
      () => setGpsStatus("位置情報の取得が拒否されました")
    );
  };

  const wards23 = regionData["23区"] ?? [];
  const tamaCities = regionData["多摩地区"] ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <h1 className="hero-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/raccoon.png" className="hero-raccoon" alt="" width={56} height={56} />
          ゴミの日.com
        </h1>
        <p className="hero-sub">東京のごみ収集日・指定ごみ袋を地域別に検索</p>

        <div className="search-box">
          <h2>🔍 地域から調べる</h2>
          <div className="form-row">
            <button className="btn btn-gps" onClick={handleGPS}>
              📍 現在地から自動検索
            </button>
            {gpsStatus && <p style={{ fontSize: ".85rem", color: "#374151" }}>{gpsStatus}</p>}

            <div className="form-group">
              <label>区・市を選択</label>
              <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                <option value="">-- 区・市を選択 --</option>
                <optgroup label="東京23区">
                  {wards23.filter((w) => wardIndexData[w]).map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </optgroup>
                <optgroup label="多摩地区">
                  {tamaCities.filter((w) => wardIndexData[w]).map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </optgroup>
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
          {wards23.filter((w) => wardIndexData[w]).map((ward) => (
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

        {/* ── 多摩地区グリッド ── */}
        {tamaCities.some((w) => wardIndexData[w]) && (
          <>
            <h2 className="section-title" style={{ marginTop: "2.5rem" }}>多摩地区から選ぶ</h2>
            <div className="ward-grid">
              {tamaCities.filter((w) => wardIndexData[w]).map((city) => (
                <a
                  key={city}
                  href={`/Tokyo/${wardIndexData[city].slug}`}
                  className="ward-card"
                >
                  {city}
                  <div className="ward-card-count">
                    {wardIndexData[city].areas.length}地域
                    {wardIndexData[city].has_bags && (
                      <span className="ward-card-bags" title="指定ごみ袋情報あり"> 🛍️</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* ── 粗大ごみ・不用品の導線（お役立ち情報） ── */}
        <section aria-label="粗大ごみ・不用品の処分について">
          <h2 className="section-title" style={{ marginTop: "2.5rem" }}>粗大ごみ・不用品の処分でお困りの方へ</h2>
          <div className="oversized-notice">
            <span className="oversized-notice-icon" aria-hidden="true">🪑</span>
            <div className="oversized-notice-body">
              <p className="oversized-notice-title">粗大ごみは申込制。収集日カレンダーには表示されません</p>
              <p className="oversized-notice-text">
                家具・寝具・自転車などの粗大ごみは、多くの自治体で事前の申し込みが必要で、通常のごみ収集日とは別の扱いです。各区・市のページから、申し込み方法・手数料・受付電話番号を確認できます。
              </p>
              <p className="oversized-notice-text">
                また、戸別収集では原則として申込者が建物の外まで自分で運び出しておく必要があります。タンスやベッド、大型の家電などを運び出すのが難しい場合は、部屋の中から搬出まで対応してくれる不用品回収を利用するという選択肢もあります。費用の目安は下記のガイドでまとめています。
              </p>
              <div className="article-related-links">
                <a href="/guide/funyohin-hiyo" className="btn btn-outline">不用品回収の費用相場を見る</a>
                <a href="/guide" className="btn btn-outline">ごみ・不用品のお役立ちガイド</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ / SEO ── */}
        <section className="faq-section" aria-label="よくある質問">
          <h2 className="section-title">よくある質問</h2>
          <div className="faq-item">
            <p className="faq-q">Q. ゴミの日.comとは？</p>
            <p className="faq-a">東京都内のごみ収集日を地域別に検索できる無料サービスです。燃やすごみ・燃やさないごみ・資源ごみ・プラスチックの収集曜日を一覧表示します。多摩地区では指定ごみ袋の種類・価格情報も確認できます。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. GPS機能はどのように使いますか？</p>
            <p className="faq-a">「現在地から自動検索」ボタンを押すと、ブラウザの位置情報を使って現在地の区・市を自動判定します。許可を求めるダイアログが表示されたら「許可」を選んでください。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 指定ごみ袋とは何ですか？</p>
            <p className="faq-a">多摩地区の多くの市では、ごみを捨てる際に自治体が指定した専用袋（有料）の使用が義務付けられています。袋の色や価格は市によって異なります。対応市のページでサイズ・価格・販売場所を確認できます。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. データはいつ更新されますか？</p>
            <p className="faq-a">各区・市の公式サイトに基づき随時更新しています。祝日や年末年始の特別スケジュールは各自治体の公式サイトでご確認ください。</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 対象エリアはどこですか？</p>
            <p className="faq-a">東京都23区・多摩地区計52自治体に対応しています。今後、神奈川・埼玉・千葉など1都3県や主要都市への対応エリア拡大を予定しています。</p>
          </div>
        </section>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import wardIndex from "../../../public/data/ward-index.json";
import regionIndex from "../../../public/data/region-index.json";
import { getT, scheduleToLocale, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { useParams } from "next/navigation";

type WardIndexEntry = { slug: string; areas: { name: string; slug: string }[]; has_bags?: boolean };
const wardIndexData = wardIndex as Record<string, WardIndexEntry>;
const regionData = regionIndex as Record<string, string[]>;
const WARD_NAMES = Object.keys(wardIndexData);

function baseTown(s: string): string {
  return s.replace(/[0-9０-９一二三四五六七八九]+丁目.*$/, "").replace(/[0-9０-９]+番地.*$/, "").trim();
}

function guessArea(areaList: { name: string; slug: string }[], addr: Record<string, string>) {
  const candidates = [addr.neighbourhood, addr.suburb, addr.quarter, addr.city_district].filter(Boolean) as string[];
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

export default function LocaleTopPage() {
  const params = useParams();
  const locale = (Array.isArray(params.locale) ? params.locale[0] : params.locale) as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : "en";
  const t = getT(validLocale);

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
      window.location.href = `/${validLocale}/Tokyo/${wardIndexData[selectedWard].slug}/${selectedAreaSlug}`;
    } else if (selectedWard) {
      window.location.href = `/${validLocale}/Tokyo/${wardIndexData[selectedWard].slug}`;
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsStatus(t.search.gpsUnsupported); return; }
    setGpsStatus(t.search.gpsDetecting);
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
              setGpsStatus(t.search.gpsFound(matched, guessed.name));
            } else {
              setGpsStatus(t.search.gpsFoundWard(matched));
            }
            setSelectedWard(matched);
          } else {
            setGpsStatus(t.search.gpsOutOfArea(city));
          }
        } catch { setGpsStatus(t.search.gpsError); }
      },
      () => setGpsStatus(t.search.gpsDenied)
    );
  };

  const wards23 = regionData["23区"] ?? [];
  const tamaCities = regionData["多摩地区"] ?? [];

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/raccoon.png" className="hero-raccoon" alt="" width={56} height={56} />
          Gominohi.com
        </h1>
        <p className="hero-sub">{t.site.tagline}</p>

        <div className="search-box">
          <h2>{t.search.heading}</h2>
          <div className="form-row">
            <button className="btn btn-gps" onClick={handleGPS}>{t.search.gpsBtn}</button>
            {gpsStatus && <p style={{ fontSize: ".85rem", color: "#374151" }}>{gpsStatus}</p>}

            <div className="form-group">
              <label>{t.search.wardLabel}</label>
              <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                <option value="">{t.search.wardPlaceholder}</option>
                <optgroup label="Tokyo 23 Wards">
                  {wards23.filter((w) => wardIndexData[w]).map((w) => (
                    <option key={w} value={w}>{wardIndexData[w].slug} ({w})</option>
                  ))}
                </optgroup>
                {tamaCities.some((w) => wardIndexData[w]) && (
                  <optgroup label="Tama Area">
                    {tamaCities.filter((w) => wardIndexData[w]).map((w) => (
                      <option key={w} value={w}>{wardIndexData[w].slug} ({w})</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>{t.search.areaLabel}</label>
              <select value={selectedAreaSlug} onChange={(e) => setSelectedAreaSlug(e.target.value)} disabled={!selectedWard}>
                <option value="">{t.search.areaPlaceholder}</option>
                {areas.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleSearch} disabled={!selectedWard}>
              {t.search.searchBtn}
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">{t.ward.gridTitle}</h2>
        <div className="ward-grid">
          {wards23.filter((w) => wardIndexData[w]).map((ward) => (
            <a key={ward} href={`/${validLocale}/Tokyo/${wardIndexData[ward].slug}`} className="ward-card">
              {wardIndexData[ward].slug}
              <div className="ward-card-count">{t.ward.areas(wardIndexData[ward].areas.length)}</div>
            </a>
          ))}
        </div>

        {/* 多摩地区グリッド */}
        {tamaCities.some((w) => wardIndexData[w]) && (
          <>
            <h2 className="section-title" style={{ marginTop: "2.5rem" }}>{t.ward.tamaGridTitle}</h2>
            <div className="ward-grid">
              {tamaCities.filter((w) => wardIndexData[w]).map((city) => (
                <a key={city} href={`/${validLocale}/Tokyo/${wardIndexData[city].slug}`} className="ward-card">
                  {wardIndexData[city].slug}
                  <div className="ward-card-count">
                    {t.ward.areas(wardIndexData[city].areas.length)}
                    {wardIndexData[city].has_bags && (
                      <span className="ward-card-bags" title={t.ward.bagsBadge}> 🛍️</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        <section className="faq-section" aria-label="FAQ">
          <h2 className="section-title">FAQ</h2>
          {t.faq.map((item, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">Q. {item.q}</p>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

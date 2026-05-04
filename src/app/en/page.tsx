"use client";

import { useState, useEffect, useRef } from "react";
import wardIndex from "../../../public/data/ward-index.json";
import regionIndex from "../../../public/data/region-index.json";
import { en } from "@/lib/i18n";

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

export default function EnTopPage() {
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
      window.location.href = `/en/Tokyo/${wardIndexData[selectedWard].slug}/${selectedAreaSlug}`;
    } else if (selectedWard) {
      window.location.href = `/en/Tokyo/${wardIndexData[selectedWard].slug}`;
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsStatus(en.search.gpsUnsupported); return; }
    setGpsStatus(en.search.gpsDetecting);
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
              setGpsStatus(en.search.gpsFound(matched, guessed.name));
            } else {
              setGpsStatus(en.search.gpsFoundWard(matched));
            }
            setSelectedWard(matched);
          } else {
            setGpsStatus(en.search.gpsOutOfArea(city));
          }
        } catch { setGpsStatus(en.search.gpsError); }
      },
      () => setGpsStatus(en.search.gpsDenied)
    );
  };

  const wards23 = regionData["23区"] ?? [];
  const tamaCities = regionData["多摩地区"] ?? [];

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">♻️ GomiCale</h1>
        <p className="hero-sub">{en.site.tagline}</p>

        <div className="search-box">
          <h2>{en.search.heading}</h2>
          <div className="form-row">
            <button className="btn btn-gps" onClick={handleGPS}>{en.search.gpsBtn}</button>
            {gpsStatus && <p style={{ fontSize: ".85rem", color: "#374151" }}>{gpsStatus}</p>}

            <div className="form-group">
              <label>{en.search.wardLabel}</label>
              <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
                <option value="">{en.search.wardPlaceholder}</option>
                <optgroup label="Tokyo 23 Wards">
                  {wards23.filter((w) => wardIndexData[w]).map((w) => (
                    <option key={w} value={w}>{wardIndexData[w].slug} Ward ({w})</option>
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
              <label>{en.search.areaLabel}</label>
              <select value={selectedAreaSlug} onChange={(e) => setSelectedAreaSlug(e.target.value)} disabled={!selectedWard}>
                <option value="">{en.search.areaPlaceholder}</option>
                {areas.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleSearch} disabled={!selectedWard}>
              {en.search.searchBtn}
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">{en.ward.gridTitle}</h2>
        <div className="ward-grid">
          {wards23.filter((w) => wardIndexData[w]).map((ward) => (
            <a key={ward} href={`/en/Tokyo/${wardIndexData[ward].slug}`} className="ward-card">
              {wardIndexData[ward].slug}
              <div className="ward-card-count">{en.ward.areas(wardIndexData[ward].areas.length)}</div>
            </a>
          ))}
        </div>

        <section className="faq-section" aria-label="FAQ">
          <h2 className="section-title">FAQ</h2>
          {en.faq.map((item, i) => (
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

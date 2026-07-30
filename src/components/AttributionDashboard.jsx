import React, { useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from "recharts";
import { Upload, TrendingUp, Target, RefreshCw } from "lucide-react";

const SAMPLE_CONTENT_CSV = `content_id,platform,title,utm_campaign,views
c1,Reddit,Why exchange liquidity matters more than fees,rdt-liquidity-01,1200
c2,TradingView,BTC range compression idea,tv-btc-range-04,3400
c3,Medium,What actually happens when an exchange gets delisted,med-delist-story,900
c4,Reddit,Comment thread: slippage on low-cap pairs,rdt-slippage-02,300
c5,TradingView,ETH/BTC ratio breakdown,tv-ethbtc-02,5200
c6,Medium,Anatomy of a market-maker outage,med-mm-outage,1100
c7,Reddit,Karma-phase comment on wallet security,rdt-walletsec-03,220
c8,TradingView,Weekly funding rate recap,tv-funding-weekly,2600
c9,Paragraph,Why we're building on-chain proof of reserves,para-reserves-01,1500
c10,Paragraph,The real cost of a bridge hack,para-bridgehack-02,2100`;

const SAMPLE_CONVERSIONS_CSV = `event_id,event_type,utm_campaign
e1,Signup,rdt-liquidity-01
e2,Signup,rdt-liquidity-01
e3,Wallet Install,rdt-liquidity-01
e4,Signup,med-delist-story
e5,Wallet Install,med-delist-story
e6,Signup,med-delist-story
e7,Signup,rdt-slippage-02
e8,Wallet Install,rdt-slippage-02
e9,Signup,tv-btc-range-04
e10,Signup,rdt-walletsec-03
e11,Wallet Install,rdt-walletsec-03
e12,Signup,rdt-walletsec-03
e13,Signup,med-mm-outage
e14,Signup,para-reserves-01
e15,Signup,para-reserves-01
e16,Wallet Install,para-reserves-01
e17,Signup,para-bridgehack-02`;

function parseCSV(text) {
  const result = Papa.parse(text.trim(), { header: true, skipEmptyLines: true });
  return result.data;
}

function joinData(contentRows, conversionRows) {
  const byCampaign = {};
  contentRows.forEach((r) => {
    if (!r.utm_campaign) return;
    byCampaign[r.utm_campaign] = {
      ...r,
      views: Number(r.views) || 0,
      signups: 0,
      installs: 0,
    };
  });
  conversionRows.forEach((r) => {
    const row = byCampaign[r.utm_campaign];
    if (!row) return;
    if ((r.event_type || "").toLowerCase().includes("signup")) row.signups += 1;
    if ((r.event_type || "").toLowerCase().includes("install")) row.installs += 1;
  });
  return Object.values(byCampaign).map((r) => {
    const conversions = r.signups + r.installs;
    const convRate = r.views > 0 ? (conversions / r.views) * 100 : 0;
    return { ...r, conversions, convRate };
  });
}

const PLATFORM_COLOR = {
  Reddit: "#D8573A",
  TradingView: "#3A36E0",
  Medium: "#3C8A5C",
  Paragraph: "#8A5CF6",
};

function UploadBox({ label, onData, hasCustom }) {
  const handleFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => onData(parseCSV(evt.target.result));
      reader.readAsText(file);
    },
    [onData]
  );
  return (
    <label className="flex items-center gap-2 border border-dashed border-[#DEE2DC] rounded-lg px-3 py-2 text-sm text-[#565C63] cursor-pointer hover:border-[#12151A] transition-colors font-body">
      <Upload size={14} />
      <span>{label}</span>
      {hasCustom && <span className="font-plex-mono text-[11px] text-[#3C8A5C] ml-1">custom loaded</span>}
      <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
    </label>
  );
}

export default function AttributionDashboard() {
  const [contentRows, setContentRows] = useState(() => parseCSV(SAMPLE_CONTENT_CSV));
  const [conversionRows, setConversionRows] = useState(() => parseCSV(SAMPLE_CONVERSIONS_CSV));
  const [customContent, setCustomContent] = useState(false);
  const [customConv, setCustomConv] = useState(false);

  const joined = useMemo(() => joinData(contentRows, conversionRows), [contentRows, conversionRows]);

  const ranked = useMemo(
    () => [...joined].sort((a, b) => b.conversions - a.conversions || b.convRate - a.convRate),
    [joined]
  );

  const totals = useMemo(() => {
    const totalViews = joined.reduce((s, r) => s + r.views, 0);
    const totalConversions = joined.reduce((s, r) => s + r.conversions, 0);
    const avgRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;
    return { totalViews, totalConversions, avgRate };
  }, [joined]);

  const topEfficiency = useMemo(() => {
    const withViews = joined.filter((r) => r.views >= 200);
    return [...withViews].sort((a, b) => b.convRate - a.convRate)[0];
  }, [joined]);

  const resetSample = () => {
    setContentRows(parseCSV(SAMPLE_CONTENT_CSV));
    setConversionRows(parseCSV(SAMPLE_CONVERSIONS_CSV));
    setCustomContent(false);
    setCustomConv(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 font-body">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-plex-mono text-xs uppercase tracking-widest text-[#565C63] mb-2">Module</p>
          <h1 className="font-display text-xl font-semibold text-[#12151A]">Distribution attribution</h1>
          <p className="text-sm text-[#565C63] mt-1">
            Which posts actually drive signups and wallet installs — not just views.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UploadBox
            label="Content CSV"
            hasCustom={customContent}
            onData={(rows) => {
              setContentRows(rows);
              setCustomContent(true);
            }}
          />
          <UploadBox
            label="Conversions CSV"
            hasCustom={customConv}
            onData={(rows) => {
              setConversionRows(rows);
              setCustomConv(true);
            }}
          />
          <button
            onClick={resetSample}
            className="flex items-center gap-1 text-sm text-[#565C63] hover:text-[#12151A] px-2 py-2"
          >
            <RefreshCw size={14} /> Reset sample
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#DEE2DC] p-4">
          <p className="font-plex-mono text-[11px] uppercase tracking-widest text-[#8A9088] mb-1">Total conversions</p>
          <p className="font-display text-2xl font-semibold text-[#12151A]">{totals.totalConversions}</p>
          <p className="text-xs text-[#8A9088] mt-1">signups + wallet installs</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#DEE2DC] p-4">
          <p className="font-plex-mono text-[11px] uppercase tracking-widest text-[#8A9088] mb-1">Blended conversion rate</p>
          <p className="font-display text-2xl font-semibold text-[#12151A]">{totals.avgRate.toFixed(2)}%</p>
          <p className="text-xs text-[#8A9088] mt-1">of {totals.totalViews.toLocaleString()} views</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#DEE2DC] p-4">
          <p className="font-plex-mono text-[11px] uppercase tracking-widest text-[#8A9088] mb-1 flex items-center gap-1">
            <Target size={12} /> Most efficient post
          </p>
          <p className="text-sm font-medium text-[#12151A] leading-snug">
            {topEfficiency ? topEfficiency.title : "—"}
          </p>
          <p className="text-xs text-[#8A9088] mt-1">
            {topEfficiency ? `${topEfficiency.convRate.toFixed(2)}% conversion rate` : ""}
          </p>
        </div>
      </div>

      {/* Scatter: views vs conversions */}
      <div className="bg-white rounded-2xl border border-[#DEE2DC] p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-[#3A36E0]" />
          <span className="text-sm font-medium text-[#12151A]">Views vs conversions, by post</span>
        </div>
        <p className="text-xs text-[#8A9088] mb-3">
          Top-right = high reach and high pull. Bottom-right = vanity traffic. Top-left = small but efficient.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DEE2DC" />
            <XAxis type="number" dataKey="views" name="Views" tick={{ fontSize: 11, fill: "#565C63" }} stroke="#DEE2DC" />
            <YAxis type="number" dataKey="conversions" name="Conversions" tick={{ fontSize: 11, fill: "#565C63" }} stroke="#DEE2DC" />
            <ZAxis type="number" dataKey="convRate" range={[60, 400]} name="Conv. rate" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-[#DEE2DC] rounded-lg p-2 text-xs shadow-md font-body">
                    <p className="font-medium text-[#12151A]">{d.title}</p>
                    <p className="text-[#8A9088]">{d.platform}</p>
                    <p className="text-[#565C63]">{d.views} views &middot; {d.conversions} conversions</p>
                    <p className="text-[#565C63]">{d.convRate.toFixed(2)}% rate</p>
                  </div>
                );
              }}
            />
            <Scatter data={joined}>
              {joined.map((entry, i) => (
                <Cell key={i} fill={PLATFORM_COLOR[entry.platform] || "#8A9088"} fillOpacity={0.85} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-[#565C63] flex-wrap">
          {Object.entries(PLATFORM_COLOR).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
              {platform}
            </div>
          ))}
        </div>
      </div>

      {/* Ranked table */}
      <div className="bg-white rounded-2xl border border-[#DEE2DC] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F6F2] font-plex-mono text-[11px] uppercase tracking-widest text-[#8A9088]">
            <tr>
              <th className="text-left px-4 py-2">Post</th>
              <th className="text-left px-4 py-2">Platform</th>
              <th className="text-right px-4 py-2">Views</th>
              <th className="text-right px-4 py-2">Signups</th>
              <th className="text-right px-4 py-2">Installs</th>
              <th className="text-right px-4 py-2">Conv. rate</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.content_id || r.utm_campaign} className="border-t border-[#DEE2DC]">
                <td className="px-4 py-2 text-[#12151A]">{r.title}</td>
                <td className="px-4 py-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${PLATFORM_COLOR[r.platform] || "#8A9088"}1A`,
                      color: PLATFORM_COLOR[r.platform] || "#565C63",
                    }}
                  >
                    {r.platform}
                  </span>
                </td>
                <td className="px-4 py-2 text-right text-[#565C63]">{r.views.toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-[#565C63]">{r.signups}</td>
                <td className="px-4 py-2 text-right text-[#565C63]">{r.installs}</td>
                <td className="px-4 py-2 text-right font-medium text-[#12151A]">{r.convRate.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

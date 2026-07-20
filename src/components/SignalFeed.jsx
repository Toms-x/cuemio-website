import { useState, useEffect, useRef, useCallback } from "react";

/**
 * SignalFeed — illustrative demo of the YEX SEO Intelligence Bot
 *
 * Simulates the bot's alert pipeline for portfolio display: raw signal →
 * AI interpretation → prioritized content-angle alert. Data below is
 * synthetic/illustrative — not real YEX output.
 *
 * Drop into any Astro/React page:
 *   import SignalFeed from "../components/SignalFeed";
 *   <SignalFeed client:load />
 *
 * Requires Tailwind. No external dependencies.
 */

const PRIORITY = {
  URGENT: { label: "URGENT", dot: "#FF5D5D", ring: "rgba(255,93,93,0.35)", text: "#FF8080" },
  OPPORTUNITY: { label: "OPPORTUNITY", dot: "#FFB020", ring: "rgba(255,176,32,0.35)", text: "#FFC94D" },
  MONITOR: { label: "MONITOR", dot: "#4DABF7", ring: "rgba(77,171,247,0.35)", text: "#74C0FC" },
  INSIGHT: { label: "INSIGHT", dot: "#3ECF8E", ring: "rgba(62,207,142,0.35)", text: "#6EE7B7" },
};

const MODULES = ["News", "Market", "Trends", "SEO"];

// Illustrative example signals — not real YEX competitive data.
const SAMPLE_ALERTS = [
  {
    module: "News",
    priority: "URGENT",
    title: "Major exchange pauses withdrawals amid liquidity concerns",
    summary: "Reports surfaced of a mid-tier exchange freezing withdrawals for 6+ hours. Search interest for 'exchange withdrawal frozen' up sharply in the last hour.",
    angle: "Write a same-day explainer: 'What to check before you trust an exchange with your funds' — angle toward proof-of-reserves and instant withdrawal features.",
  },
  {
    module: "Market",
    priority: "OPPORTUNITY",
    title: "ETH funding rate flips negative across major venues",
    summary: "Shorts are now paying longs on ETH perpetuals — a setup that historically precedes short squeezes within 48-72 hours.",
    angle: "Draft: 'Why negative funding rates matter for your next ETH trade' — tie into a perpetuals product walkthrough.",
  },
  {
    module: "Trends",
    priority: "OPPORTUNITY",
    title: "Search interest rising for 'tokenized treasury bills'",
    summary: "Related query volume up 180% over 7 days. Low competition — most existing content is either too technical or too shallow.",
    angle: "1200-word explainer bridging TradFi treasuries to on-chain tokenized versions. Target the comparison-shopping search intent directly.",
  },
  {
    module: "SEO",
    priority: "INSIGHT",
    title: "'Crypto tax calculator 2026' climbed to position 9",
    summary: "Up from position 24 two weeks ago. Impressions have nearly tripled — this page is in striking distance of page one.",
    angle: "Add a comparison table and an FAQ block targeting long-tail variants to push past position 5.",
  },
  {
    module: "News",
    priority: "MONITOR",
    title: "Regulator hints at draft stablecoin framework",
    summary: "Early-stage commentary, no formal proposal yet. Worth tracking but too speculative to act on today.",
    angle: "No content yet — revisit if a formal draft is published. Flagged for the weekly roundup as context.",
  },
  {
    module: "Market",
    priority: "URGENT",
    title: "BTC volume spikes 3.4x above 7-day average",
    summary: "Sharp volume spike with no major news attached — often precedes a volatility event within hours.",
    angle: "Prep a reactive volatility-explainer draft now so it's ready to publish the moment the move resolves.",
  },
  {
    module: "SEO",
    priority: "OPPORTUNITY",
    title: "Competitor gap: 'copy trading vs signal groups'",
    summary: "Two major academy blogs published on copy trading this week; neither compares it against paid signal groups, a common adjacent search.",
    angle: "Own the comparison angle — a fair, structured breakdown ranks well against single-topic competitor posts.",
  },
  {
    module: "Trends",
    priority: "MONITOR",
    title: "'RWA crypto' holding steady, no breakout yet",
    summary: "Consistent moderate interest for 3 weeks running — not spiking, but not fading either.",
    angle: "Good evergreen cluster candidate. Not urgent, but worth a pillar page when the content calendar has room.",
  },
];

function timeAgo(seconds) {
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  return `${m}m ago`;
}

export default function SignalFeed() {
  const [activeModule, setActiveModule] = useState("All");
  const [feed, setFeed] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [signalCount, setSignalCount] = useState(0);
  const [now, setNow] = useState(0);
  const idxRef = useRef(0);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const pushNext = useCallback(() => {
    const item = SAMPLE_ALERTS[idxRef.current % SAMPLE_ALERTS.length];
    idxRef.current += 1;

    setProcessing(item);
    const delay = prefersReducedMotion.current ? 200 : 1100;

    setTimeout(() => {
      setFeed((prev) => [
        { ...item, id: `${Date.now()}-${idxRef.current}`, ts: 0 },
        ...prev,
      ].slice(0, 8));
      setSignalCount((c) => c + 1);
      setProcessing(null);
    }, delay);
  }, []);

  useEffect(() => {
    pushNext();
    const interval = setInterval(pushNext, prefersReducedMotion.current ? 4000 : 4200);
    return () => clearInterval(interval);
  }, [pushNext]);

  useEffect(() => {
    const t = setInterval(() => setNow((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const visibleFeed =
    activeModule === "All" ? feed : feed.filter((a) => a.module === activeModule);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border"
      style={{
        background: "#0B0F14",
        borderColor: "#1C232C",
        fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#1C232C" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: "#3ECF8E",
              boxShadow: "0 0 0 4px rgba(62,207,142,0.15)",
              animation: prefersReducedMotion.current ? "none" : "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span
            className="text-[11px] tracking-[0.18em] uppercase"
            style={{ color: "#8B95A1", fontFamily: "Inter, sans-serif" }}
          >
            Simulated feed · illustrative signals
          </span>
        </div>
        <div
          className="text-[11px] tabular-nums"
          style={{ color: "#5A6472" }}
        >
          {signalCount} signals processed
        </div>
      </div>

      {/* Module filter tabs */}
      <div
        className="flex gap-1 px-5 py-3 border-b overflow-x-auto"
        style={{ borderColor: "#1C232C", fontFamily: "Inter, sans-serif" }}
      >
        {["All", ...MODULES].map((m) => (
          <button
            key={m}
            onClick={() => setActiveModule(m)}
            className="px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors"
            style={{
              color: activeModule === m ? "#0B0F14" : "#8B95A1",
              background: activeModule === m ? "#E8EAED" : "transparent",
              border: `1px solid ${activeModule === m ? "#E8EAED" : "#1C232C"}`,
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="px-5 py-4 space-y-3 min-h-[420px]">
        {processing && (
          <div
            className="rounded-xl border px-4 py-3 flex items-center gap-3"
            style={{ borderColor: "#1C232C", background: "#0F151B" }}
          >
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#5A6472",
                    animation: prefersReducedMotion.current
                      ? "none"
                      : `blink 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </span>
            <span className="text-xs" style={{ color: "#5A6472", fontFamily: "Inter, sans-serif" }}>
              interpreting signal from {processing.module.toLowerCase()}…
            </span>
          </div>
        )}

        {visibleFeed.length === 0 && !processing && (
          <div
            className="text-xs py-12 text-center"
            style={{ color: "#5A6472", fontFamily: "Inter, sans-serif" }}
          >
            No signals in this category yet — switch tabs or wait for the next one.
          </div>
        )}

        {visibleFeed.map((alert, i) => {
          const p = PRIORITY[alert.priority];
          return (
            <div
              key={alert.id}
              className="rounded-xl border px-4 py-3.5"
              style={{
                borderColor: "#1C232C",
                background: "#0F151B",
                animation: prefersReducedMotion.current
                  ? "none"
                  : i === 0
                  ? "slide-in 0.4s ease-out"
                  : "none",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: p.dot, boxShadow: `0 0 0 3px ${p.ring}` }}
                  />
                  <span
                    className="text-[10px] tracking-[0.14em] font-semibold"
                    style={{ color: p.text }}
                  >
                    {p.label}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ color: "#5A6472", background: "#151C24" }}
                  >
                    {alert.module}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: "#3D4653" }}>
                  just now
                </span>
              </div>

              <h3
                className="text-sm font-medium mb-1.5 leading-snug"
                style={{ color: "#E8EAED", fontFamily: "Inter, sans-serif" }}
              >
                {alert.title}
              </h3>
              <p
                className="text-xs leading-relaxed mb-2.5"
                style={{ color: "#8B95A1", fontFamily: "Inter, sans-serif" }}
              >
                {alert.summary}
              </p>

              <div
                className="text-xs rounded-lg px-3 py-2 leading-relaxed"
                style={{
                  background: "#151C24",
                  color: "#B8C0CC",
                  borderLeft: `2px solid ${p.dot}`,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <span style={{ color: p.text, fontWeight: 600 }}>Angle · </span>
                {alert.angle}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { ArrowUpRight, GitBranch, Shield, LineChart } from 'lucide-react';

const STACK = ['Reddit', 'TradingView', 'Medium', 'Paragraph', 'Lark Base', 'Cision', 'Content Ops'];

const PHASES = [
  { phase: '0', name: 'Account foundation', detail: 'No crypto activity; general-interest commenting only' },
  { phase: '1', name: 'Karma in-niche', detail: 'Unbranded comments in relevant subs, no links' },
  { phase: '2', name: 'Authority participation', detail: 'Higher-effort, research-informed comments' },
  { phase: '3', name: 'Soft mentions', detail: 'Brand mentions only when directly relevant, ~1:12 ratio' },
  { phase: '4', name: 'Distribution', detail: 'Content shared only where rules explicitly allow it' },
];

const KPIS = [
  { label: 'Referring domains', start: '40', end: '190' },
  { label: 'Domain rating', start: '22', end: '38' },
  { label: 'Off-page organic traffic', start: '~800/mo', end: '~6,200/mo' },
  { label: 'Earned brand mentions', start: '8', end: '145' },
  { label: 'Reddit karma', start: '0', end: '4,800' },
  { label: 'Competitor mention share', start: '12%', end: '24%' },
];

function KpiCard({ label, start, end }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DEE2DC] p-5">
      <p className="font-plex-mono text-[11px] uppercase tracking-widest text-[#8A9088] mb-3">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-[#8A9088] line-through">{start}</span>
        <ArrowUpRight size={14} className="text-[#8A9088]" />
        <span className="text-2xl font-semibold font-display text-[#12151A]">{end}</span>
      </div>
      <p className="font-plex-mono text-[11px] text-[#8A9088] mt-2">month 1 &rarr; month 10</p>
    </div>
  );
}

export default function OffPageCaseStudy() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 font-body">
      {/* Hero */}
      <header className="mb-12">
        <p className="font-plex-mono text-xs uppercase tracking-widest text-[#565C63] mb-3">Project</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#12151A] leading-tight mb-4">
          Off-page distribution engine
        </h1>
        <p className="text-lg text-[#565C63] leading-relaxed">
          A structured authority and distribution system across Reddit, TradingView, Medium, and
          Paragraph — built to survive Reddit's spam filters, adapt content per platform, and feed
          performance data back into what gets researched next.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {STACK.map((s) => (
            <span key={s} className="text-xs px-2 py-1 bg-[#F5F6F2] text-[#565C63] rounded-md border border-[#DEE2DC]">
              {s}
            </span>
          ))}
        </div>
      </header>

      {/* Problem */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold text-[#12151A] mb-3">The problem</h2>
        <p className="text-[#565C63] leading-relaxed">
          Off-page growth for a crypto exchange blog is usually run as a checklist: post here, post
          there, hope something sticks. That breaks fast on Reddit specifically — crypto accounts get
          flagged and banned almost immediately if they post links or promotional language before
          they've built account history. It happened three times before the real constraint became
          clear: this isn't a content problem, it's a trust and sequencing problem.
        </p>
      </section>

      {/* System */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold text-[#12151A] mb-3 flex items-center gap-2">
          <GitBranch size={18} className="text-[#3A36E0]" /> The system
        </h2>
        <p className="text-[#565C63] leading-relaxed mb-4">
          Market trend research feeds a platform adaptation layer, which rewrites the same
          underlying research per platform — unbranded and comment-first for Reddit, chart-analysis
          writeups for TradingView, long-form articles for Medium, and crypto-native essays for
          Paragraph — before distribution. Cision and Lark Base then track brand-mention lift and
          content performance, feeding the next research cycle.
        </p>
      </section>

      {/* Reddit phases */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold text-[#12151A] mb-3 flex items-center gap-2">
          <Shield size={18} className="text-[#3A36E0]" /> The phased Reddit strategy
        </h2>
        <p className="text-[#565C63] leading-relaxed mb-4">
          Reddit is the highest-risk, highest-value channel, so it runs its own internal phasing.
          This sequencing is what took the account from three bans to zero.
        </p>
        <div className="divide-y divide-[#DEE2DC] border border-[#DEE2DC] rounded-2xl overflow-hidden bg-white">
          {PHASES.map((p) => (
            <div key={p.phase} className="flex gap-4 p-4">
              <div className="font-display text-sm font-semibold text-[#3A36E0] w-6 shrink-0">{p.phase}</div>
              <div>
                <p className="text-sm font-medium text-[#12151A]">{p.name}</p>
                <p className="text-sm text-[#565C63]">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold text-[#12151A] mb-3 flex items-center gap-2">
          <LineChart size={18} className="text-[#3A36E0]" /> Results — 10 months in
        </h2>
        <p className="font-plex-mono text-[11px] uppercase tracking-widest text-[#8A9088] mb-4">
          Illustrative figures pending verified export
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {KPIS.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>
      </section>

      {/* What's next */}
      <section className="mb-4">
        <h2 className="font-display text-xl font-semibold text-[#12151A] mb-3">What I'd automate next</h2>
        <p className="text-[#565C63] leading-relaxed">
          The manual bottleneck is the adaptation layer — rewriting one research piece into four
          platform-specific formats by hand. The next step is routing that through an LLM-assisted
          drafting stage, with a live{' '}
          <a href="/attribution-dashboard" className="text-[#3A36E0] hover:underline">
            attribution layer
          </a>{' '}
          telling the research stage which topics and formats are actually converting, not just
          getting views.
        </p>
      </section>
    </article>
  );
}

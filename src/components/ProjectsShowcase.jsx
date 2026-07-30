// src/components/ProjectsShowcase.jsx
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectsShowcase() {
  // The three core Cuemio modules. Keep this list short — this is the
  // product grid, not a full portfolio.
  const modules = [
    {
      title: 'SEO intelligence bot',
      status: 'Live',
      cueClass: 'is-go',
      description: 'Seven signal sources filtered through an LLM into ranked content angles, delivered to Telegram.',
      thumbnail: '/images/modules/seo-intelligence-bot.svg',
      href: '/seo-intelligence-bot',
    },
    {
      title: 'Off-page distribution engine',
      status: 'Live',
      cueClass: 'is-go',
      description: 'A structured authority and distribution pipeline across Reddit, TradingView, and Medium.',
      thumbnail: '/images/modules/off-page-distribution.svg',
      href: '/off-page-distribution-engine',
    },
    {
      title: 'Finance tracker',
      status: 'Beta',
      cueClass: 'is-standby',
      description: 'A self-built net-worth and cash-flow tracker covering income, expenses, assets, and liabilities.',
      thumbnail: '/images/modules/finance-tracker.svg',
      href: '#',
    },
  ];

  // Supporting work — real, but doesn't need a full card.
  const alsoBuilt = [
    { label: 'Smart contract monitoring system', url: 'https://github.com/Toms-x/smart-contract-monitor' },
    { label: 'AI-powered Reddit lead generation', url: 'https://github.com/Toms-x/automation-projects/tree/main/reddit-ad' },
    { label: 'AI finance research assistant', url: 'https://github.com/Toms-x/automation-projects/tree/main/script-generator' },
    { label: 'SEO content automation dashboard', url: '/vitals-dashboard' },
  ];

  return (
    <section id="projects" className="py-20 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-12">
          <p className="font-plex-mono text-xs uppercase tracking-widest text-[#565C63] mb-3">
            Modules
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#12151A] mb-4">
            The Cuemio systems
          </h2>
          <p className="text-lg text-[#565C63] max-w-3xl leading-relaxed">
            Ships as modules, each one usable on its own.
          </p>
        </div>

        {/* Module cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {modules.map((m) => {
            const hasPage = m.href !== '#';
            const CardTag = hasPage ? 'a' : 'div';
            return (
              <CardTag
                key={m.title}
                {...(hasPage ? { href: m.href } : {})}
                className={`block bg-white rounded-2xl border border-[#DEE2DC] transition-all duration-300 overflow-hidden group ${
                  hasPage
                    ? 'hover:border-[#12151A]/30 hover:shadow-lg hover:shadow-black/5'
                    : 'opacity-80'
                }`}
              >
                <div className="bg-[#F5F6F2] border-b border-[#DEE2DC] aspect-video overflow-hidden">
                  <img
                    src={m.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className={`cue-light ${m.cueClass} font-plex-mono text-[11px] uppercase tracking-widest text-[#565C63] mb-3 inline-flex`}>
                    <span className="dot"></span>
                    {m.status}
                  </span>
                  <h3 className={`font-display text-lg font-semibold text-[#12151A] mb-2 flex items-center justify-between ${hasPage ? 'group-hover:text-[#3A36E0] transition-colors' : ''}`}>
                    {m.title}
                    {hasPage ? (
                      <ArrowUpRight size={18} className="text-[#8A9088] group-hover:text-[#3A36E0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                    ) : (
                      <span className="font-plex-mono text-[10px] uppercase tracking-widest text-[#8A9088] flex-shrink-0">No page yet</span>
                    )}
                  </h3>
                  <p className="text-[#565C63] text-sm leading-relaxed">
                    {m.description}
                </p>
              </div>
            </CardTag>
            );
          })}
        </div>

        {/* Also built — compact, no cards */}
        <div className="mt-10 pt-8 border-t border-[#DEE2DC]">
          <p className="font-plex-mono text-xs uppercase tracking-widest text-[#8A9088] mb-4">Also shipped</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {alsoBuilt.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target={item.url.startsWith('#') || item.url.startsWith('/') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="text-sm text-[#565C63] hover:text-[#3A36E0] transition-colors underline decoration-[#DEE2DC] underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

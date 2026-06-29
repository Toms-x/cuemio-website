// src/components/ContentStrategy.jsx
import React, { useState } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';

export default function ContentStrategy() {
  const [expandedCard, setExpandedCard] = useState(null);

  // Ordered most-recent-first so the page reads as current and senior.
  // NOTE: add logo files at the icon paths below (see /public/images/logos/).
  // For YEX and tomintech you'll need to drop in yex.png and tomintech.svg.
  const companies = [
    {
      id: 'yex',
      name: 'YEX Exchange',
      role: 'SEO Manager',
      period: 'Nov 2025 - Present',
      color: 'from-emerald-600 to-emerald-400',
      icon: '/images/logos/yex.png',
      mainAchievement: 'Leading global organic growth',
      metric: 'Current Role',
      description: 'Own global SEO strategy and organic-channel performance, driving customer acquisition and platform growth across a high-volume content operation.',
      highlights: [
        'Set global SEO strategy across educational, market, and product content',
        'Liaise directly with senior management to align SEO with commercial goals',
        'Built reporting frameworks and dashboards for retrospectives and channel planning',
        'Turn organic search into a predictable acquisition channel'
      ],
      links: []
    },
    {
      id: 'tomintech',
      name: 'tomintech',
      role: 'Founder & Technical Growth Lead',
      period: 'Oct 2024 - Present',
      color: 'from-blue-600 to-blue-400',
      icon: '/images/logos/tomintech.svg',
      mainAchievement: 'Automated content-growth engine',
      metric: 'Where marketing met engineering',
      description: 'Built an automated content-growth engine handling market research, keyword analysis, and content production at scale, plus custom dashboards that turn user behavior into a data-driven SEO strategy.',
      highlights: [
        'Modular signal engine for content-angle discovery',
        'Custom analytics dashboards on user behavior and site performance',
        'Data-driven SEO strategy, built and run end-to-end'
      ],
      links: [
        { label: 'View Projects', url: '#projects', type: 'primary' },
        { label: 'GitHub', url: 'https://github.com/Toms-x', type: 'secondary' }
      ]
    },
    {
      id: 'lbank',
      name: 'LBank',
      role: 'Content Marketer',
      period: 'Oct 2022 - Nov 2024',
      color: 'from-purple-600 to-purple-400',
      icon: '/images/logos/lbank.png',
      mainAchievement: 'Readership grown past 5,000 engaged users',
      metric: '40%+ Engagement Growth',
      description: 'Built content-driven SEO around product features like crypto derivatives, and ran multi-channel distribution and KOL partnerships to compound reach.',
      highlights: [
        'Content-driven SEO for product features (e.g. derivatives)',
        'Multi-channel distribution across X, LinkedIn, and Telegram',
        'Backlink and KOL partnership sourcing',
        'Promotional content aligned to live market trends'
      ],
      links: [
        { label: 'View Campaign Gallery', url: '#', type: 'primary' }
      ]
    },
    {
      id: 'beincrypto',
      name: 'BeInCrypto',
      role: 'Content Strategist',
      period: 'Feb 2021 - Mar 2024',
      color: 'from-cyan-600 to-cyan-400',
      icon: '/images/logos/beincrypto.jpeg',
      mainAchievement: 'Generated over 450k+ organic views',
      metric: '100+ Articles Published',
      description: 'Authored 100+ in-depth guides on Web3. Several articles secured SERP features within 3 months, driving 136,900 monthly organic visitors valued at $289,700 in equivalent Google Ads spend (Semrush).',
      highlights: [
        'Secured top-10 rankings driving 1,700+ monthly visitors per article',
        'In-depth keyword and competitor research on complex blockchain topics',
        'Translated technical finance and blockchain concepts for broad audiences'
      ],
      links: [
        { label: 'View Article Portfolio', url: 'https://beincrypto.com/author/ayotomiwa_oladotun/', type: 'primary' }
      ]
    },
    {
      id: 'dopamine',
      name: 'Web3 Intelligence',
      role: 'Social Media & Content Manager · Dopamine Wallet',
      period: 'May 2022 - May 2024',
      color: 'from-pink-600 to-pink-400',
      icon: '/images/logos/wbi.png',
      mainAchievement: 'Grew community 112% to 186k',
      metric: 'Blog = 30% of site traffic',
      description: 'Built content platforms into growth engines and turned community signal into product and marketing insight.',
      highlights: [
        'Launched and grew the Dopamine Blog to 30% of total website traffic',
        'Grew online community 112% (to 186k) across forums and social',
        'Turned Discord/Telegram/email feedback into actionable insights',
        'Identified industry KOLs for content promotion'
      ],
      links: [
        { label: 'View Case Study', url: '#', type: 'primary' }
      ]
    },
    {
      id: 'freelance',
      name: 'Upwork & Fiverr',
      role: 'Freelance SEO Writer',
      period: 'Jan 2018 - Mar 2024',
      color: 'from-slate-500 to-slate-400',
      icon: '/images/logos/fiverr.svg',
      mainAchievement: 'SEO & content for 400+ clients',
      metric: 'B2B & SaaS',
      description: 'Where the reps happened: SEO and content strategy across hundreds of global B2B and SaaS clients.',
      highlights: [
        'Keyword research and content optimization at volume',
        'Conversion rate optimization for B2B and SaaS',
        'Cross-industry content strategy'
      ],
      links: []
    }
  ];

  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            The Arc
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl">
            From a materials science lab to the growth function at a global exchange. The path wasn't a detour &mdash; it compounded. Each role added a layer: writing that ranks, communities that grow themselves, and the data systems that make both repeatable.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group cursor-pointer"
              onClick={() => setExpandedCard(expandedCard === company.id ? null : company.id)}
            >
              {/* Main Card */}
              <div
                className={`bg-gradient-to-br ${company.color} p-0.5 rounded-lg transition-all duration-300 ${
                  expandedCard === company.id ? 'ring-2 ring-white' : 'hover:shadow-lg hover:shadow-white/20'
                }`}
              >
                <div className="bg-slate-800 rounded-lg p-6 h-full">
                  {/* Icon & Title */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.icon}
                        alt={`${company.name} logo`}
                        className="w-10 h-10 rounded-full object-contain bg-white p-1 flex-shrink-0"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                        <p className="text-sm text-slate-400">{company.period}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 ${
                        expandedCard === company.id ? 'rotate-180' : ''
                      }`}
                      size={24}
                    />
                  </div>

                  {/* Role */}
                  <p className="text-slate-300 font-semibold mb-3">{company.role}</p>

                  {/* Main Achievement */}
                  <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-sm text-slate-400 mb-1">Key Achievement</p>
                    <p className="text-white font-semibold text-lg">{company.mainAchievement}</p>
                  </div>

                  {/* Metric */}
                  <div className="mb-6">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-white font-semibold text-sm bg-gradient-to-r ${company.color}`}
                    >
                      {company.metric}
                    </span>
                  </div>

                  {/* Expandable Section */}
                  {expandedCard === company.id && (
                    <div className="mt-6 pt-6 border-t border-slate-600 animate-in fade-in duration-300">
                      <p className="text-slate-300 mb-4">{company.description}</p>

                      {/* Highlights */}
                      <div className="mb-6">
                        <h3 className="text-white font-semibold mb-3">Key Highlights</h3>
                        <ul className="space-y-2">
                          {company.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex gap-2 text-slate-300 text-sm">
                              <span className="text-blue-400 font-bold">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Links */}
                      {company.links.length > 0 && (
                        <div className="space-y-2">
                          {company.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target={link.url.startsWith('#') ? '_self' : '_blank'}
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`flex items-center justify-between p-3 rounded-lg transition-all group/link ${
                                link.type === 'primary'
                                  ? `bg-gradient-to-r ${company.color} text-white hover:shadow-lg hover:shadow-white/20`
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              <span className="font-semibold">{link.label}</span>
                              <ExternalLink size={16} className="group-hover/link:translate-x-1 transition-transform" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collapsed Preview */}
                  {expandedCard !== company.id && (
                    <p className="text-slate-400 text-sm italic">Click to explore</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12">
          <p className="text-slate-400 text-sm">
            Click any role to view detailed achievements and work samples
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';

const REGION_TABS = ['Global', 'Europe', 'Asia-Pacific', 'Americas', 'Africa', 'Middle East'];

const HIGHLIGHTS = [
  {
    title: 'Conversion',
    description: 'Your overall conversion increased significantly the past week.',
    value: '67.8%',
    change: '+3.4%',
    cta: 'View details',
  },
  {
    title: 'Top markets this week',
    description: 'Weekly top performing markets.',
    markets: [
      { flag: '🇪🇸', name: 'Spain', volume: '$234.2k', change: '+3.4%' },
      { flag: '🇪🇸', name: 'Spain', volume: '$234.2k', change: '+3.4%' },
      { flag: '🇪🇸', name: 'Spain', volume: '$234.2k', change: '+3.4%' },
    ],
    cta: 'View details',
  },
  {
    title: 'Bizum performance',
    description: 'Since enabling Bizum, your conversion in Spain increased.',
    stats: [
      { label: 'Conversion', value: '74%', change: '+9.4%' },
      { label: 'AOV', value: '$234.2k', change: '+3.4%' },
    ],
    cta: 'View details',
  },
  {
    title: 'New payment methods',
    description: '3 new payment methods were enabled.',
    badges: ['DemoPay', 'DemoPayment', 'DemoWallet'],
    cta: 'View performance',
  },
];

const KEY_METRICS = [
  { id: 'conversion', label: 'Conversion', value: '73.2%', change: '+3.45%', positive: true },
  { id: 'volume', label: 'Payment volume', value: '$82,345', change: '-4.56%', positive: false },
  { id: 'fees', label: 'Fees saved', value: '$8.9K', change: '+1.56%', positive: true },
];

const CHART_DAYS = (() => {
  const days = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(2025, 3, 1 + i);
    const base = 45 + i * 1.2 + Math.sin(i * 0.5) * 3;
    const withoutOpt = 40 + i * 0.5 + Math.sin(i * 0.3) * 2;
    days.push({
      date,
      label: `Apr ${date.getDate()}`,
      conversion: Math.min(base, 78),
      withoutOptimization: Math.min(withoutOpt, 55),
      pmEnabled: i === 13 ? 'Bizum' : i === 16 ? 'Klarna' : null,
    });
  }
  return days;
})();

const OVERVIEW_MARKETS = [
  { flag: '🇩🇪', name: 'Spain', volume: '$174.0k', conversionRate: '4.2%', activeShare: '43.2%', conversion: '+5.7%' },
  { flag: '🇫🇷', name: 'France', volume: '$110.2k', conversionRate: '4.2%', activeShare: '43.2%', conversion: '+3.5%' },
  { flag: '🇬🇧', name: 'UK', volume: '$73.0k', conversionRate: '4.0%', activeShare: '41.0%', conversion: '+2.1%' },
];

const PAYMENT_METHODS_TABLE = [
  { name: 'Cards', color: '#675dff', share: '56.3%' },
  { name: 'iDEAL', color: '#00b4d8', share: '19.5%' },
  { name: 'Apple Pay', color: '#2ec4b6', share: '12.8%' },
  { name: 'Klarna', color: '#ff6b6b', share: '6.4%' },
  { name: 'Bancontact', color: '#ffd93d', share: '5.0%' },
];

const AOV_DATA = [
  { name: 'Cards', value: '$124', federated: '$1,640k', rebillAmount: '$4,865', waysOfFailure: '$0.38%', failureRate: '1.04%' },
  { name: 'iDEAL', value: '$87', federated: '$1,108k', rebillAmount: '$2,102', failureRate: '0.84%' },
  { name: 'Klarna', value: '$156', federated: '$845k', rebillAmount: '$4,268', failureRate: '1.76%' },
  { name: 'Apple Pay', value: '$98', federated: '$712k', rebillAmount: '$1,945', failureRate: '0.62%' },
];

export default function CheckoutStudio({ managedMode, onModeChange }) {
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [activeRegion, setActiveRegion] = useState('Europe');
  const [selectedMetric, setSelectedMetric] = useState('conversion');
  const [hoveredDay, setHoveredDay] = useState(null);
  const basePath = useBasePath();
  const navigate = useNavigate();

  const tabs = ['Performance', 'Checkouts', 'Payment links', 'Payment methods', 'Logic', 'Experiments'];

  if (managedMode === 'with-me') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-display-small">Checkout</h1>
          <div className="flex items-center gap-0 mt-4 border-b border-border">
            {tabs.map(tab => {
              const tabId = tab.toLowerCase().replace(/\s+/g, '-');
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-4 py-3 text-label-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tabId
                      ? 'border-[#675dff] text-default'
                      : 'border-transparent text-subdued hover:text-default'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center h-64 text-subdued text-body-medium">
          "Do it with me" mode — coming soon
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-display-small">Checkout</h1>
        <div className="flex items-center gap-0 mt-4 border-b border-border">
          {tabs.map(tab => {
            const tabId = tab.toLowerCase().replace(/\s+/g, '-');
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-3 text-label-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tabId
                    ? 'border-[#675dff] text-default'
                    : 'border-transparent text-subdued hover:text-default'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'payment-methods' && (
        <div className="space-y-8">
          {/* Section 1: Smart Briefing */}
          <section className="bg-offset rounded-xl p-6">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-label-large-emphasized">Dynamic payment methods</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e0d9fb] text-[#533afd]">Optimized by Stripe</span>
                </div>
                <p className="text-body-small text-subdued mt-1">Stripe dynamically shows the right payment methods for your customers to optimize conversion.</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-surface hover:bg-offset">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="13" cy="8" r="1.2" fill="currentColor"/></svg>
              </button>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} className="bg-surface border border-border rounded-lg p-4 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="text-label-medium-emphasized">{h.title}</h3>
                    <p className="text-body-small text-subdued mt-1">{h.description}</p>
                  </div>
                  <div className="mt-3">
                    {h.value && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-heading-large">{h.value}</span>
                        <span className="text-body-small text-[#1ea672]">{h.change}</span>
                      </div>
                    )}
                    {h.markets && (
                      <div className="space-y-1.5">
                        {h.markets.map((m, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-body-small">{m.flag}</span>
                              <span className="text-body-small">{m.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-body-small font-medium">{m.volume}</span>
                              <span className="text-body-small text-[#1ea672]">{m.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {h.stats && (
                      <div className="space-y-1.5">
                        {h.stats.map((s, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <span className="text-body-small text-subdued">{s.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-body-small">{s.value}</span>
                              <span className="text-body-small text-[#1ea672]">{s.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {h.badges && (
                      <div className="flex flex-wrap gap-1.5">
                        {h.badges.map((b, j) => (
                          <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-offset text-default border border-border">
                            <span className="w-3 h-3 rounded-sm bg-[#675dff]" />
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <a href="#" className="text-body-small text-brand mt-3 hover:underline">{h.cta}</a>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Key Metrics with Regional Split */}
          <section>
            {/* Region filters */}
            <div className="flex items-center gap-2 mb-6">
              {REGION_TABS.map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-3 py-1.5 whitespace-nowrap rounded-md transition-colors ${
                    activeRegion === region
                      ? 'border-2 border-default text-label-small-emphasized bg-surface'
                      : 'border border-border text-label-small text-subdued hover:text-default'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Key metrics heading + filters inline */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-label-large-emphasized">Key metrics</h2>
              <div className="flex items-center gap-2">
                <select className="text-[12px] border border-border rounded-md px-2 py-0.5 bg-surface text-subdued">
                  <option>Last 4 weeks</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
                <span className="text-[12px] text-subdued">Compared to</span>
                <select className="text-[12px] border border-border rounded-md px-2 py-0.5 bg-surface text-subdued">
                  <option>Previous period</option>
                </select>
                <span className="text-[12px] text-subdued">Apr 1 - May 1</span>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {KEY_METRICS.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`text-left rounded-lg p-4 transition-colors ${
                    selectedMetric === metric.id
                      ? 'border-2 border-[#675dff] bg-surface'
                      : 'border border-border bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-body-small text-subdued">{metric.label}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-subdued"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/><path d="M6 5.5v2.5M6 3.5h.01" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-heading-medium">{metric.value}</span>
                    <span className={`text-body-small ${metric.positive ? 'text-[#1ea672]' : 'text-[#df1b41]'}`}>{metric.change}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="relative">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 bottom-[32px] w-8 flex flex-col justify-between text-[10px] text-subdued pointer-events-none">
                <span>100%</span>
                <span></span>
                <span></span>
                <span></span>
                <span>0%</span>
              </div>

              {/* Y axis right */}
              <div className="absolute right-0 top-0 bottom-[32px] w-4 flex flex-col justify-between text-[10px] text-subdued pointer-events-none">
                <span>Y</span>
                <span></span>
                <span></span>
                <span></span>
                <span>Y</span>
              </div>

              {/* Chart area */}
              <div className="ml-10 mr-6 relative" style={{ height: 240 }}>
                <svg
                  className="w-full h-full"
                  viewBox="0 0 580 200"
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="580" y2="0" stroke="currentColor" strokeOpacity="0.05" />
                  <line x1="0" y1="50" x2="580" y2="50" stroke="currentColor" strokeOpacity="0.05" />
                  <line x1="0" y1="100" x2="580" y2="100" stroke="currentColor" strokeOpacity="0.05" />
                  <line x1="0" y1="150" x2="580" y2="150" stroke="currentColor" strokeOpacity="0.05" />
                  <line x1="0" y1="200" x2="580" y2="200" stroke="currentColor" strokeOpacity="0.05" />

                  {/* Rate without optimization (grey dashed) */}
                  <polyline
                    fill="none"
                    stroke="#c4c4c4"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    points={CHART_DAYS.map((d, i) => `${(i / 29) * 580},${200 - d.withoutOptimization * 2}`).join(' ')}
                  />

                  {/* Conversion rate (purple solid) */}
                  <polyline
                    fill="none"
                    stroke="#675dff"
                    strokeWidth="2"
                    points={CHART_DAYS.map((d, i) => `${(i / 29) * 580},${200 - d.conversion * 2}`).join(' ')}
                  />

                  {/* Hover dot on conversion line */}
                  {hoveredDay !== null && (
                    <circle
                      cx={(hoveredDay / 29) * 580}
                      cy={200 - CHART_DAYS[hoveredDay].conversion * 2}
                      r="4"
                      fill="#675dff"
                      stroke="white"
                      strokeWidth="2"
                    />
                  )}

                  {/* PM enabled markers */}
                  {CHART_DAYS.map((d, i) => d.pmEnabled ? (
                    <g key={i}>
                      <circle cx={(i / 29) * 580} cy="196" r="5" fill="#e0d9fb" stroke="#675dff" strokeWidth="1" />
                      <text x={(i / 29) * 580} y="199" textAnchor="middle" fontSize="6" fill="#675dff">⚡</text>
                    </g>
                  ) : null)}

                  {/* Hover dashed vertical line */}
                  {hoveredDay !== null && (
                    <line
                      x1={(hoveredDay / 29) * 580}
                      y1="0"
                      x2={(hoveredDay / 29) * 580}
                      y2="200"
                      stroke="#c4c4c4"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Invisible hover rects for each day */}
                  {CHART_DAYS.map((_, i) => (
                    <rect
                      key={i}
                      x={(i / 29) * 580 - 10}
                      y="0"
                      width="20"
                      height="200"
                      fill="transparent"
                      onMouseEnter={() => setHoveredDay(i)}
                    />
                  ))}
                </svg>

                {/* Tooltip */}
                {hoveredDay !== null && (
                  <div
                    className="absolute z-10 bg-surface border border-border rounded-lg shadow-lg px-3 py-2.5 pointer-events-none"
                    style={{
                      left: `${Math.min(Math.max((hoveredDay / 29) * 100, 15), 75)}%`,
                      top: '20px',
                      transform: 'translateX(-50%)',
                      minWidth: 200,
                    }}
                  >
                    <div className="text-label-small-emphasized">{CHART_DAYS[hoveredDay].label} <span className="text-subdued font-normal">2025</span></div>
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-[#675dff]" />
                          <span className="text-body-small">Conversion rate</span>
                        </div>
                        <span className="text-body-small font-medium">{CHART_DAYS[hoveredDay].conversion.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-[#e0e0e0]" />
                          <span className="text-body-small">Rate without optimisation</span>
                        </div>
                        <span className="text-body-small font-medium">{CHART_DAYS[hoveredDay].withoutOptimization.toFixed(1)}%</span>
                      </div>
                      {CHART_DAYS[hoveredDay].pmEnabled && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-[#e0d9fb]" />
                          <span className="text-body-small">{CHART_DAYS[hoveredDay].pmEnabled} enabled</span>
                        </div>
                      )}
                    </div>
                    {CHART_DAYS[hoveredDay].pmEnabled && (
                      <div className="mt-2 pt-2 border-t border-border flex items-start gap-1.5">
                        <span className="text-[#1ea672] mt-0.5">✦</span>
                        <span className="text-body-small text-subdued">Your conversion rate saw a <span className="font-medium text-default">41.31%</span> increase with optimisation.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* X axis labels */}
              <div className="ml-10 mr-6 flex justify-between text-[10px] text-subdued mt-1">
                <span>Apr 1</span>
                <span>Apr</span>
                <span>Apr</span>
                <span>Apr</span>
                <span>May 1</span>
              </div>

              {/* Legend */}
              <div className="ml-10 flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-[2px] bg-[#675dff]" />
                  <span className="text-[11px] text-subdued">Conversion rate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-[2px] bg-[#c4c4c4]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #c4c4c4 0, #c4c4c4 4px, transparent 4px, transparent 7px)' }} />
                  <span className="text-[11px] text-subdued">Rate without optimisation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#e0d9fb] border border-[#675dff]" />
                  <span className="text-[11px] text-subdued">Payment method optimization</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Overview */}
          <section>
            <h2 className="text-label-large-emphasized mb-5">Overview</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Top markets in Europe */}
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <h3 className="text-label-medium-emphasized">Top markets in Europe</h3>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-subdued"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6v3M7 4.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-body-small text-subdued border-b border-border">
                      <th className="text-left py-2 font-normal">Top markets</th>
                      <th className="text-right py-2 font-normal">Payment volume</th>
                      <th className="text-right py-2 font-normal">Conversion rate</th>
                      <th className="text-right py-2 font-normal">Active share</th>
                      <th className="text-right py-2 font-normal">Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OVERVIEW_MARKETS.map((m, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span>{m.flag}</span>
                            <span className="text-body-small">{m.name}</span>
                          </div>
                        </td>
                        <td className="text-right text-body-small">{m.volume}</td>
                        <td className="text-right text-body-small">{m.conversionRate}</td>
                        <td className="text-right text-body-small">{m.activeShare}</td>
                        <td className="text-right text-body-small text-[#1ea672]">{m.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment methods */}
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <h3 className="text-label-medium-emphasized">Payment methods</h3>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-subdued"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6v3M7 4.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <button className="px-2.5 py-1 text-[11px] rounded-full bg-offset text-default border border-border">Share</button>
                  <button className="px-2.5 py-1 text-[11px] rounded-full text-subdued border border-border">Payment volume</button>
                  <button className="px-2.5 py-1 text-[11px] rounded-full text-subdued border border-border">Conversion</button>
                </div>
                {/* Donut placeholder */}
                <div className="flex items-center gap-6">
                  <div className="relative w-[120px] h-[120px]">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      {(() => {
                        let offset = 0;
                        const radius = 45;
                        const circumference = 2 * Math.PI * radius;
                        return PAYMENT_METHODS_TABLE.map((pm, i) => {
                          const share = parseFloat(pm.share) / 100;
                          const dash = share * circumference;
                          const gap = circumference - dash;
                          const el = (
                            <circle
                              key={i}
                              cx="60"
                              cy="60"
                              r={radius}
                              fill="none"
                              stroke={pm.color}
                              strokeWidth="16"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={-offset}
                            />
                          );
                          offset += dash;
                          return el;
                        });
                      })()}
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    {PAYMENT_METHODS_TABLE.map((pm, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pm.color }} />
                          <span className="text-body-small">{pm.name}</span>
                        </div>
                        <span className="text-body-small">{pm.share}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Average order value by payment method */}
            <div>
              <div className="flex items-center gap-1 mb-4">
                <h3 className="text-label-medium-emphasized">Average order value by payment method</h3>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-subdued"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6v3M7 4.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </div>

              {/* AOV Chart placeholder */}
              <div className="border border-border rounded-xl p-5 mb-4">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-heading-medium">$624</span>
                  <span className="text-body-small text-[#1ea672]">+6.2%</span>
                </div>
                <div className="h-[140px] relative">
                  <svg className="w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
                    {/* Multi-line chart for AOV */}
                    <polyline fill="none" stroke="#675dff" strokeWidth="2" points="0,100 50,95 100,90 150,85 200,80 250,75 300,70 350,65 400,60 450,55 500,50 550,45 600,40" />
                    <polyline fill="none" stroke="#00b4d8" strokeWidth="2" points="0,110 50,108 100,105 150,100 200,95 250,90 300,88 350,85 400,82 450,78 500,75 550,72 600,70" />
                    <polyline fill="none" stroke="#2ec4b6" strokeWidth="2" points="0,120 50,118 100,115 150,112 200,108 250,105 300,102 350,98 400,95 450,92 500,88 550,85 600,82" />
                    <polyline fill="none" stroke="#ff6b6b" strokeWidth="2" points="0,90 50,88 100,92 150,95 200,90 250,85 300,82 350,78 400,75 450,72 500,68 550,65 600,60" />
                  </svg>
                </div>
              </div>

              {/* AOV Table */}
              <table className="w-full">
                <thead>
                  <tr className="text-body-small text-subdued border-b border-border">
                    <th className="text-left py-2 font-normal"></th>
                    <th className="text-right py-2 font-normal">Federated volume</th>
                    <th className="text-right py-2 font-normal">Rebill amount</th>
                    <th className="text-right py-2 font-normal">Ways of failures</th>
                    <th className="text-right py-2 font-normal">Failure rate</th>
                  </tr>
                </thead>
                <tbody>
                  {AOV_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-0.5" style={{ backgroundColor: PAYMENT_METHODS_TABLE[i]?.color || '#675dff' }} />
                          <span className="text-body-small">{row.name}</span>
                        </div>
                      </td>
                      <td className="text-right text-body-small">{row.federated}</td>
                      <td className="text-right text-body-small">{row.rebillAmount}</td>
                      <td className="text-right text-body-small">{row.waysOfFailure || '—'}</td>
                      <td className="text-right text-body-small">{row.failureRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

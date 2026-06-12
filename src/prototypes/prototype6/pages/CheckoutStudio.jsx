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

const KEY_METRICS_DATA = {
  conversion: { value: '73.2%', change: '+4.8%' },
  paymentVolume: { value: '$82,345', change: '+8%' },
  feesSaved: { value: '$8.3k', change: '+12%' },
};

const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  before: 62 + Math.random() * 4,
  after: i > 14 ? 68 + Math.random() * 6 : null,
}));

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
  const [metricView, setMetricView] = useState('last-4-weeks');
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

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-label-large-emphasized">Key metrics</h2>
              <div className="flex items-center gap-2">
                <select
                  value={metricView}
                  onChange={(e) => setMetricView(e.target.value)}
                  className="text-body-small border border-border rounded-md px-2 py-1 bg-surface"
                >
                  <option value="last-4-weeks">Last 4 weeks</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <select className="text-body-small border border-border rounded-md px-2 py-1 bg-surface">
                  <option>Compared to</option>
                </select>
                <select className="text-body-small border border-border rounded-md px-2 py-1 bg-surface">
                  <option>Previous period ▾</option>
                </select>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-0.5 bg-[#675dff]" />
                  <span className="text-body-small text-subdued">Conversion rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-heading-medium">{KEY_METRICS_DATA.conversion.value}</span>
                  <span className="text-body-small text-[#1ea672]">{KEY_METRICS_DATA.conversion.change}</span>
                </div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-0.5 bg-[#00b4d8]" />
                  <span className="text-body-small text-subdued">Payment volume</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-heading-medium">{KEY_METRICS_DATA.paymentVolume.value}</span>
                  <span className="text-body-small text-[#1ea672]">{KEY_METRICS_DATA.paymentVolume.change}</span>
                </div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-0.5 bg-[#2ec4b6]" />
                  <span className="text-body-small text-subdued">Fees saved</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-heading-medium">{KEY_METRICS_DATA.feesSaved.value}</span>
                  <span className="text-body-small text-[#1ea672]">{KEY_METRICS_DATA.feesSaved.change}</span>
                </div>
              </div>
            </div>

            {/* Chart with before/after */}
            <div className="border border-border rounded-xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#675dff]" />
                  <span className="text-body-small text-subdued">Conversion rate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#00b4d8]" />
                  <span className="text-body-small text-subdued">Auth without optimization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#2ec4b6]" />
                  <span className="text-body-small text-subdued">Payment method optimization</span>
                </div>
              </div>
              <div className="relative h-[200px] w-full">
                {/* Y axis */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-subdued">
                  <span>80%</span>
                  <span>70%</span>
                  <span>60%</span>
                  <span>50%</span>
                </div>
                {/* Chart area */}
                <div className="ml-10 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="currentColor" strokeOpacity="0.1" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" strokeOpacity="0.1" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="currentColor" strokeOpacity="0.1" />

                    {/* Before line (blue/purple) */}
                    <polyline
                      fill="none"
                      stroke="#675dff"
                      strokeWidth="2"
                      points={CHART_DATA.map((d, i) => `${i * 20},${200 - (d.before - 50) * 6.67}`).join(' ')}
                    />

                    {/* After line (cyan) - only after day 15 */}
                    <polyline
                      fill="none"
                      stroke="#00b4d8"
                      strokeWidth="2"
                      points={CHART_DATA.filter(d => d.after !== null).map((d, i) => `${(i + 15) * 20},${200 - (d.after - 50) * 6.67}`).join(' ')}
                    />

                    {/* Annotation line for "payment method turned on" */}
                    <line x1="300" y1="0" x2="300" y2="200" stroke="#675dff" strokeWidth="1" strokeDasharray="4 2" />
                  </svg>

                  {/* Annotation tooltip */}
                  <div className="absolute top-2 right-[35%] bg-[#1a1a2e] text-white px-3 py-2 rounded-lg text-[11px] shadow-lg">
                    <div className="text-subdued text-[10px]">Apr 15 - PM turned on</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div>
                        <span className="text-[#2ec4b6]">●</span> After: <span className="font-medium">71.4%</span>
                      </div>
                    </div>
                  </div>
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

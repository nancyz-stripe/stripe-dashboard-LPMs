import { useState, useMemo } from 'react';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../sail/Badge';

const PAYMENT_METHODS = [
  { name: 'Cards', icon: '💳', iconBg: 'bg-gray-100', status: 'Enabled', type: 'Cards', popularIn: 'Global' },
  { name: 'Cartes Bancaires', icon: 'CB', iconBg: 'bg-blue-600', iconText: true, status: 'Enabled', type: 'Cards', popularIn: 'France' },
  { name: 'Payment method X', icon: '🏛', iconBg: 'bg-gray-100', status: 'Disabled', type: 'Digital wallet', popularIn: 'Region' },
  { name: 'Alipay', icon: 'A', iconBg: 'bg-blue-500', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'China' },
  { name: 'Amazon Pay', icon: 'pay', iconBg: 'bg-gray-800', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Apple Pay', icon: 'AP', iconBg: 'bg-black', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Google Pay', icon: 'GP', iconBg: 'bg-white border border-border', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Klarna', icon: 'K', iconBg: 'bg-pink-400', iconText: true, status: 'Disabled', type: 'Buy now, pay later', popularIn: 'Global' },
  { name: 'Link', icon: '▶', iconBg: 'bg-green-500', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'PayPal', icon: 'PP', iconBg: 'bg-blue-700', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Revolut Pay', icon: 'R', iconBg: 'bg-black', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Europe, United Kingdom' },
  { name: 'Samsung Pay', icon: 'SP', iconBg: 'bg-blue-900', iconText: true, status: 'Disabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Swish', icon: 'S', iconBg: 'bg-white border border-border', iconText: true, status: 'Disabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'WeChat Pay', icon: 'WC', iconBg: 'bg-green-600', iconText: true, status: 'Disabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Przelewy24', icon: 'P24', iconBg: 'bg-red-600', iconText: true, status: 'Disabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'BLIK', icon: 'B', iconBg: 'bg-black', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'ACH Direct Debit', icon: 'ACH', iconBg: 'bg-blue-500', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Affirm', icon: 'Af', iconBg: 'bg-blue-800', iconText: true, status: 'Disabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'SEPA Direct Debit', icon: 'EU', iconBg: 'bg-blue-600', iconText: true, status: 'Disabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Boleto', icon: 'Bo', iconBg: 'bg-gray-600', iconText: true, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
];

const FILTER_TABS = ['All', 'Enabled', 'Disabled'];

const FILTER_CHIPS = ['Payment method name', 'Type', 'Popular in', 'Recurring payments'];

function PaymentMethodIcon({ method }) {
  return (
    <div className={`w-8 h-8 rounded flex items-center justify-center text-label-small ${method.iconBg} ${method.iconText ? 'text-white' : ''} overflow-hidden shrink-0`}>
      {method.iconText ? (
        <span className="text-[10px] font-bold leading-none">{method.icon}</span>
      ) : (
        <span className="text-base leading-none">{method.icon}</span>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('All');
  const [sortAsc, setSortAsc] = useState(true);

  const counts = useMemo(() => ({
    All: PAYMENT_METHODS.length,
    Enabled: PAYMENT_METHODS.filter(m => m.status === 'Enabled').length,
    Disabled: PAYMENT_METHODS.filter(m => m.status === 'Disabled').length,
  }), []);

  const filtered = useMemo(() => {
    let list = PAYMENT_METHODS;
    if (activeTab === 'Enabled') list = list.filter(m => m.status === 'Enabled');
    if (activeTab === 'Disabled') list = list.filter(m => m.status === 'Disabled');
    return [...list].sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }, [activeTab, sortAsc]);

  return (
    <div className="pb-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-body-small mb-3">
        <span className="text-brand cursor-pointer hover:underline">Settings</span>
        <Icon name="chevronRight" size="xsmall" className="text-subdued" />
        <span className="text-brand cursor-pointer hover:underline">Payments</span>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-heading-xlarge text-default">Payment methods</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1 text-label-small-emphasized text-default bg-surface border border-border rounded-md hover:bg-offset transition-colors">
            <Icon name="eyeOpen" size="xsmall" />
            Review transaction
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 text-label-small-emphasized text-default bg-surface border border-border rounded-md hover:bg-offset transition-colors">
            <Icon name="sparkle" size="xsmall" />
            Create an experiment
          </button>
          <button className="flex items-center justify-center w-7 h-7 text-default bg-surface border border-border rounded-md hover:bg-offset transition-colors">
            <Icon name="more" size="xsmall" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-body-small text-subdued mb-6 max-w-[972px] leading-relaxed">
        Stripe will display payment methods dynamically based on order amount, currency and your configuration. Changes will affect Checkout, Payment Links and Elements. You can also apply{' '}
        <span className="text-brand cursor-pointer hover:underline">custom targeting rules</span>{' '}
        to individual payment methods or create multiple configurations. Learn more about{' '}
        <span className="text-brand cursor-pointer hover:underline">pricing</span>{' '}
        and{' '}
        <span className="text-brand cursor-pointer hover:underline">integration options</span>.
      </p>

      {/* Filter tabs (All / Enabled / Disabled) */}
      <div className="flex gap-3 mb-5">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col gap-1 px-4 py-2.5 rounded-lg border min-w-[200px] transition-colors text-left ${
              activeTab === tab
                ? 'border-brand bg-surface ring-1 ring-brand'
                : 'border-border bg-surface hover:bg-offset'
            }`}
          >
            <span className={`text-label-small ${activeTab === tab ? 'text-brand' : 'text-subdued'}`}>
              {tab}
            </span>
            <span className="text-heading-medium text-default">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-5">
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip}
            className="flex items-center gap-1 px-3 py-1.5 text-label-small text-subdued bg-surface border border-border rounded-full hover:bg-offset transition-colors"
          >
            <Icon name="add" size="xsmall" className="text-subdued" />
            {chip}
          </button>
        ))}
      </div>

      {/* Table toolbar */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-small text-subdued">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Table header */}
        <div className="flex items-center py-2 border-b border-border">
          <div className="w-12 shrink-0" />
          <div
            className="flex-[2] min-w-[160px] flex items-center gap-1 cursor-pointer select-none"
            onClick={() => setSortAsc(!sortAsc)}
          >
            <span className="text-label-small-emphasized text-subdued">Payment method</span>
            <Icon name="arrowUpDown" size="xsmall" className="text-subdued" />
          </div>
          <div className="flex-[1] min-w-[100px]">
            <span className="text-label-small-emphasized text-subdued">Status</span>
          </div>
          <div className="flex-[1.5] min-w-[130px]">
            <span className="text-label-small-emphasized text-subdued">Type</span>
          </div>
          <div className="flex-[1.5] min-w-[130px]">
            <span className="text-label-small-emphasized text-subdued">Popular in</span>
          </div>
          <div className="w-10 shrink-0" />
        </div>

        {/* Table rows */}
        {filtered.map((method) => (
          <div
            key={method.name}
            className="flex items-center py-3 border-b border-border hover:bg-offset transition-colors cursor-pointer group"
          >
            <div className="w-12 shrink-0 flex justify-center">
              <PaymentMethodIcon method={method} />
            </div>
            <div className="flex-[2] min-w-[160px]">
              <span className="text-body-small text-default">{method.name}</span>
            </div>
            <div className="flex-[1] min-w-[100px]">
              <Badge variant={method.status === 'Enabled' ? 'success' : 'default'}>
                {method.status}
              </Badge>
            </div>
            <div className="flex-[1.5] min-w-[130px]">
              <span className="text-body-small text-subdued">{method.type}</span>
            </div>
            <div className="flex-[1.5] min-w-[130px]">
              <span className="text-body-small text-subdued">{method.popularIn}</span>
            </div>
            <div className="w-10 shrink-0 flex justify-center">
              <button className="text-subdued opacity-0 group-hover:opacity-100 transition-opacity hover:text-default">
                <Icon name="more" size="small" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

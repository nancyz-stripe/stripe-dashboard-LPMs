import { useState, useMemo } from 'react';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../sail/Badge';

// Exact order and data from Figma design
const PAYMENT_METHODS = [
  { name: 'Cards', iconType: 'sail', iconName: 'card', iconBg: '#EBEEF1', status: 'Enabled', type: 'Cards', popularIn: 'Global' },
  { name: 'Cartes Bancaires', iconType: 'img', iconSrc: '/pm-icons/cartes-bancaires.svg', iconBg: '#016797', status: 'Enabled', type: 'Cards', popularIn: 'France' },
  { name: 'Payment method X', iconType: 'sail', iconName: 'bank', iconBg: '#EBEEF1', status: 'Disabled', type: 'Digital wallet', popularIn: 'Region' },
  { name: 'Alipay', iconType: 'img', iconSrc: '/pm-icons/alipay.svg', iconBg: '#1c9fe5', status: 'Enabled', type: 'Digital wallet', popularIn: 'China' },
  { name: 'Amazon Pay', iconType: 'img', iconSrc: '/pm-icons/amazon-pay.svg', iconBg: '#333e48', status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Apple Pay', iconType: 'img', iconSrc: '/pm-icons/apple-pay.svg', iconBg: '#f6f8fa', status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Google Pay', iconType: 'img', iconSrc: '/pm-icons/google-pay.svg', iconBg: '#f5f6f8', status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Klarna', iconType: 'text', iconText: 'K', iconBg: '#ffb3c7', iconColor: '#000', status: 'Disabled', type: 'Buy now, pay later', popularIn: 'Global' },
  { name: 'Link', iconType: 'text', iconText: '▶', iconBg: '#00d66f', iconColor: '#011E0F', status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'PayPal', iconType: 'img', iconSrc: '/pm-icons/paypal.svg', iconBg: '#f5f6f8', status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Revolut Pay', iconType: 'img', iconSrc: '/pm-icons/revolut-pay.svg', iconBg: '#191c1f', status: 'Enabled', type: 'Digital wallet', popularIn: 'Europe, United Kingdom' },
  { name: 'Naver Pay', iconType: 'img', iconSrc: '/pm-icons/naver-pay.svg', iconBg: '#00de5a', status: 'Disabled', type: 'Digital wallet', popularIn: 'South Korea' },
  { name: 'PAYCO', iconType: 'img', iconSrc: '/pm-icons/payco.svg', iconBg: '#fa2828', status: 'Disabled', type: 'Digital wallet', popularIn: 'South Korea' },
  { name: 'Samsung Pay', iconType: 'img', iconSrc: '/pm-icons/samsung-pay.svg', iconBg: '#1f4ac7', status: 'Disabled', type: 'Digital wallet', popularIn: 'South Korea' },
  { name: 'WeChat Pay', iconType: 'img', iconSrc: '/pm-icons/wechat-pay.svg', iconBg: '#f0f5f7', status: 'Disabled', type: 'Digital wallet', popularIn: 'China' },
  { name: 'Affirm', iconType: 'img', iconSrc: '/pm-icons/affirm.svg', iconBg: '#4a4af4', status: 'Enabled', type: 'Buy now, pay later', popularIn: 'United States, Canada' },
  { name: 'Afterpay / Clearpay', iconType: 'img', iconSrc: '/pm-icons/afterpay.svg', iconBg: '#00d64f', status: 'Enabled', type: 'Buy now, pay later', popularIn: 'Australia, Canada, New Zealand, United Kingdom, United States' },
  { name: 'Capchase Pay', iconType: 'img', iconSrc: '/pm-icons/capchase-pay.svg', iconBg: '#323231', status: 'Disabled', type: 'Buy now, pay later', popularIn: 'United States' },
  { name: 'Klarna', iconType: 'text', iconText: 'K', iconBg: '#ffb3c7', iconColor: '#000', status: 'Enabled', type: 'Buy now, pay later', popularIn: 'Europe, United States', id: 'klarna-2' },
];

const FILTER_TABS = ['All', 'Enabled', 'Disabled'];
const FILTER_CHIPS = ['Payment method name', 'Type', 'Popular in', 'Recurring payments'];

function PaymentMethodIcon({ method }) {
  if (method.iconType === 'sail') {
    return (
      <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: method.iconBg }}>
        <Icon name={method.iconName} size="small" className="text-icon-default" />
      </div>
    );
  }
  if (method.iconType === 'img') {
    return (
      <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: method.iconBg }}>
        <img src={method.iconSrc} alt={method.name} className="w-[70%] h-[70%] object-contain" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: method.iconBg, color: method.iconColor || '#fff' }}>
      <span className="text-[11px] font-bold leading-none">{method.iconText}</span>
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
    return sortAsc ? list : [...list].reverse();
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
      <div className="flex gap-2 mb-4">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col gap-1 flex-1 p-3 rounded-lg transition-colors text-left overflow-hidden ${
              activeTab === tab
                ? 'border-[1.5px] border-brand bg-surface'
                : 'border border-border bg-surface hover:bg-offset'
            }`}
          >
            <span className={`text-label-medium ${activeTab === tab ? 'text-label-medium-emphasized text-brand' : 'text-subdued'}`}>
              {tab}
            </span>
            <span className={`text-label-large-emphasized ${activeTab === tab ? 'text-brand' : 'text-default'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip}
            className="flex items-center h-6 border border-dashed border-border rounded-full hover:bg-offset transition-colors"
          >
            <span className="flex items-center justify-center pl-1.5">
              <Icon name="addCircle" size="xsmall" className="text-subdued" />
            </span>
            <span className="text-label-small-emphasized text-subdued pl-1.5 pr-2">
              {chip}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="w-12 h-9 shrink-0" />
            <th className="h-9 text-left pr-4" style={{ width: '19%' }}>
              <button
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <span className="text-heading-xsmall text-default">Payment method</span>
                <Icon name="arrowUpDown" size="xsmall" className="text-icon-default" />
              </button>
            </th>
            <th className="h-9 text-left" style={{ width: '11%' }} />
            <th className="h-9 text-left" style={{ width: '17%' }}>
              <span className="text-heading-xsmall text-default">Type</span>
            </th>
            <th className="h-9 text-left">
              <span className="text-heading-xsmall text-default">Popular in</span>
            </th>
            <th className="w-7 h-9" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((method) => (
            <tr
              key={method.id || method.name}
              className="border-b border-border hover:bg-offset transition-colors cursor-pointer group h-12"
            >
              <td className="w-12 pr-3">
                <div className="flex items-center justify-center">
                  <PaymentMethodIcon method={method} />
                </div>
              </td>
              <td className="pr-4">
                <span className="text-label-medium-emphasized text-default">{method.name}</span>
              </td>
              <td className="px-1">
                <Badge variant={method.status === 'Enabled' ? 'success' : 'default'}>
                  {method.status}
                </Badge>
              </td>
              <td>
                <span className="text-label-medium text-subdued">{method.type}</span>
              </td>
              <td>
                <span className="text-label-medium text-subdued truncate block">{method.popularIn}</span>
              </td>
              <td className="w-7">
                <button className="flex items-center justify-center text-subdued hover:text-default">
                  <Icon name="more" size="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

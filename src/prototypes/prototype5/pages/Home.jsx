import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../sail/Badge';

function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M14.5 8a6.5 6.5 0 00-6.5-6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function OverflowMenu({ method, onDisable, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-50 bg-surface border rounded-lg p-1 min-w-[160px]"
      style={{ borderColor: '#D8DEE4', boxShadow: '0px 15px 35px 0px rgba(48,49,61,0.08), 0px 5px 15px 0px rgba(0,0,0,0.12)' }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="flex w-full items-start px-2.5 py-1.5 text-label-medium text-default rounded hover:bg-offset transition-colors"
      >
        View details
      </button>
      {(method.status === 'Enabled' || method.status === 'Pending') && (
        <button
          onClick={(e) => { e.stopPropagation(); onDisable(method); }}
          className="flex w-full items-start px-2.5 py-1.5 text-label-medium text-default rounded hover:bg-offset transition-colors"
        >
          Disable
        </button>
      )}
    </div>
  );
}

// Exact order and data from Figma design
// iconScale: percentage of the 32px container the logo should fill, derived from Figma insets
const PAYMENT_METHODS = [
  { name: 'Cards', iconType: 'sail', iconName: 'card', iconBg: '#EBEEF1', status: 'Enabled', type: 'Cards', popularIn: 'Global' },
  { name: 'Cartes Bancaires', iconType: 'img', iconSrc: '/pm-icons/cartes-bancaires.svg', iconBg: '#016797', iconScale: 75, status: 'Enabled', type: 'Cards', popularIn: 'France' },
  { name: 'Payment method X', iconType: 'sail', iconName: 'bank', iconBg: '#EBEEF1', status: 'Disabled', type: 'Digital wallet', popularIn: 'Region' },
  { name: 'Alipay', iconType: 'img', iconSrc: '/pm-icons/alipay.svg', iconBg: '#1c9fe5', iconScale: 75, status: 'Enabled', type: 'Digital wallet', popularIn: 'China' },
  { name: 'Amazon Pay', iconType: 'img', iconSrc: '/pm-icons/amazon-pay.svg', iconBg: '#333e48', iconScale: 78, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Apple Pay', iconType: 'img', iconSrc: '/pm-icons/apple-pay.svg', iconBg: '#f6f8fa', iconScale: 81, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Google Pay', iconType: 'img', iconSrc: '/pm-icons/google-pay.svg', iconBg: '#f5f6f8', iconScale: 81, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Klarna', iconType: 'full', iconSrc: '/pm-icons/klarna.svg', status: 'Disabled', type: 'Buy now, pay later', popularIn: 'Global' },
  { name: 'Link', iconType: 'full', iconSrc: '/pm-icons/link.svg', status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'PayPal', iconType: 'img', iconSrc: '/pm-icons/paypal.svg', iconBg: '#f5f6f8', iconScale: 55, status: 'Enabled', type: 'Digital wallet', popularIn: 'Global' },
  { name: 'Revolut Pay', iconType: 'img', iconSrc: '/pm-icons/revolut-pay.svg', iconBg: '#191c1f', iconScale: 47, status: 'Enabled', type: 'Digital wallet', popularIn: 'Europe, United Kingdom' },
  { name: 'Naver Pay', iconType: 'img', iconSrc: '/pm-icons/naver-pay.svg', iconBg: '#00de5a', iconScale: 100, status: 'Disabled', type: 'Digital wallet', popularIn: 'South Korea' },
  { name: 'PAYCO', iconType: 'img', iconSrc: '/pm-icons/payco.svg', iconBg: '#fa2828', iconScale: 78, status: 'Disabled', type: 'Digital wallet', popularIn: 'South Korea' },
  { name: 'Samsung Pay', iconType: 'img', iconSrc: '/pm-icons/samsung-pay.svg', iconBg: '#1f4ac7', iconScale: 69, status: 'Disabled', type: 'Digital wallet', popularIn: 'South Korea' },
  { name: 'WeChat Pay', iconType: 'img', iconSrc: '/pm-icons/wechat-pay.svg', iconBg: '#f0f5f7', iconScale: 75, status: 'Disabled', type: 'Digital wallet', popularIn: 'China' },
  { name: 'Affirm', iconType: 'img', iconSrc: '/pm-icons/affirm.svg', iconBg: '#4a4af4', iconScale: 75, status: 'Enabled', type: 'Buy now, pay later', popularIn: 'United States, Canada' },
  { name: 'Afterpay / Clearpay', iconType: 'img', iconSrc: '/pm-icons/afterpay.svg', iconBg: '#00d64f', iconScale: 50, status: 'Enabled', type: 'Buy now, pay later', popularIn: 'Australia, Canada, New Zealand, United Kingdom, United States' },
  { name: 'Capchase Pay', iconType: 'img', iconSrc: '/pm-icons/capchase-pay.svg', iconBg: '#323231', iconScale: 61, status: 'Disabled', type: 'Buy now, pay later', popularIn: 'United States' },
  { name: 'Klarna', iconType: 'full', iconSrc: '/pm-icons/klarna.svg', status: 'Enabled', type: 'Buy now, pay later', popularIn: 'Europe, United States', id: 'klarna-2' },
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
    const scale = method.iconScale || 70;
    return (
      <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: method.iconBg }}>
        <img src={method.iconSrc} alt={method.name} className="object-contain" style={{ width: `${scale}%`, height: `${scale}%` }} />
      </div>
    );
  }
  if (method.iconType === 'full') {
    return (
      <img src={method.iconSrc} alt={method.name} className="w-8 h-8 rounded-sm shrink-0" />
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
  const [statusOverrides, setStatusOverrides] = useState({});
  const [loading, setLoading] = useState({});
  const [openMenu, setOpenMenu] = useState(null);

  const getKey = (method) => method.id || method.name;
  const getStatus = (method) => statusOverrides[getKey(method)] || method.status;

  const handleEnable = useCallback((method) => {
    const key = getKey(method);
    setLoading(prev => ({ ...prev, [key]: true }));
    // "Payment method X" goes to Pending, Klarna goes to Enabled
    const targetStatus = method.name === 'Payment method X' ? 'Pending' : 'Enabled';
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [key]: false }));
      setStatusOverrides(prev => ({ ...prev, [key]: targetStatus }));
    }, 1500);
  }, []);

  const handleDisable = useCallback((method) => {
    const key = getKey(method);
    setStatusOverrides(prev => ({ ...prev, [key]: 'Disabled' }));
    setOpenMenu(null);
  }, []);

  const methods = useMemo(() =>
    PAYMENT_METHODS.map(m => ({ ...m, status: getStatus(m) })),
    [statusOverrides]
  );

  const counts = useMemo(() => ({
    All: methods.length,
    Enabled: methods.filter(m => m.status === 'Enabled').length,
    Disabled: methods.filter(m => m.status === 'Disabled' || m.status === 'Pending').length,
  }), [methods]);

  const filtered = useMemo(() => {
    let list = methods;
    if (activeTab === 'Enabled') list = list.filter(m => m.status === 'Enabled');
    if (activeTab === 'Disabled') list = list.filter(m => m.status === 'Disabled' || m.status === 'Pending');
    return sortAsc ? list : [...list].reverse();
  }, [activeTab, sortAsc, methods]);

  return (
    <div className="pb-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-label-small-emphasized cursor-pointer" style={{ color: '#533AFD' }}>Settings</span>
        <svg width="8" height="8" viewBox="0 0 16 16" fill="none" className="text-subdued shrink-0">
          <path d="M6 3L11 8L6 13" stroke="#6C7688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-label-small-emphasized cursor-pointer" style={{ color: '#533AFD' }}>Payments</span>
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
      <p className="text-body-small text-subdued mb-6 leading-relaxed">
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
            <th className="h-9 text-left pr-16" style={{ width: '22%' }}>
              <button
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <span className="text-heading-xsmall text-default">Payment method</span>
                <Icon name="arrowUpDown" className="text-icon-default" style={{ width: 8, height: 8 }} />
              </button>
            </th>
            <th className="h-9 text-left pr-16" style={{ width: '13%' }} />
            <th className="h-9 text-left pr-16" style={{ width: '18%' }}>
              <span className="text-heading-xsmall text-default">Type</span>
            </th>
            <th className="h-9 text-left">
              <span className="text-heading-xsmall text-default">Popular in</span>
            </th>
            <th className="h-9" />
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
              <td className="pr-16">
                <span className="text-label-medium-emphasized text-default">{method.name}</span>
              </td>
              <td className="px-1 pr-16">
                {method.status === 'Pending' ? (
                  <Badge variant="warning">
                    <span className="flex items-center gap-1">
                      Pending
                      <Icon name="info" style={{ width: 10, height: 10 }} className="text-badge-warning-text" />
                    </span>
                  </Badge>
                ) : (
                  <Badge variant={method.status === 'Enabled' ? 'success' : 'default'}>
                    {method.status}
                  </Badge>
                )}
              </td>
              <td className="pr-16">
                <span className="text-label-medium text-subdued">{method.type}</span>
              </td>
              <td className="pr-2">
                <span className="text-label-medium text-subdued truncate block">{method.popularIn}</span>
              </td>
              <td>
                <div className="flex items-center justify-end">
                  {method.status === 'Disabled' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEnable(method); }}
                      disabled={loading[getKey(method)]}
                      className="flex items-center justify-center h-6 px-2 text-label-small-emphasized text-default bg-surface border border-transparent group-hover:border-border rounded-l-md transition-colors -mr-px group-hover:hover:border-[#99a5b8] relative group-hover:hover:z-10 invisible group-hover:visible min-w-[52px]"
                    >
                      {loading[getKey(method)] ? <Spinner /> : 'Enable'}
                    </button>
                  )}
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === getKey(method) ? null : getKey(method)); }}
                      className={`flex items-center justify-center h-6 w-6 text-icon-default border border-transparent group-hover:border-border transition-colors group-hover:hover:border-[#99a5b8] relative group-hover:hover:z-10 group-hover:bg-surface ${method.status === 'Disabled' ? 'rounded-r-md' : 'group-hover:rounded-md'}`}
                    >
                      <Icon name="more" size="xsmall" />
                    </button>
                    {openMenu === getKey(method) && (
                      <OverflowMenu method={method} onDisable={handleDisable} onClose={() => setOpenMenu(null)} />
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

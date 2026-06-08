import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import ManageModal from '../components/ManageModal';
import DPMChart from '../components/DPMChart';
import { RECENT_UPDATES, RECOMMENDED_METHODS, UPCOMING_UPDATES } from '../data/paymentMethods';

export default function CheckoutStudio({ managedMode, onModeChange }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [enabledRecs, setEnabledRecs] = useState([]);
  const basePath = useBasePath();
  const navigate = useNavigate();

  const tabs = ['Performance', 'Checkouts', 'Payment links', 'Payment methods', 'Logic', 'Experiments'];

  const handleEnableRecommended = (method) => {
    if (method.frictionless) {
      setEnabledRecs(prev => [...prev, method.id]);
    } else {
      navigate(`${basePath}/settings`);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-display-small">Checkout</h1>
        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4 p-1.5 border border-border rounded-lg w-fit">
          {tabs.map(tab => {
            const tabId = tab.toLowerCase().replace(/\s+/g, '-');
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabId)}
                className={`px-3 py-1.5 text-label-small whitespace-nowrap rounded transition-colors ${
                  activeTab === tabId
                    ? 'bg-[#EFECFC] text-[#533AFD] text-label-small-emphasized'
                    : 'text-[#667691] hover:text-default'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment methods tab content */}
      {activeTab === 'payment-methods' && (
        <div className="space-y-6">
          {/* Summary card */}
          <div className="border border-border rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f7f5fd] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#675dff]">
                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-label-large-emphasized">Payment methods: {managedMode ? 'Managed by Stripe' : 'Manual'}</h2>
                  <p className="text-body-small text-subdued mt-0.5">
                    {managedMode
                      ? 'Stripe automatically enables eligible payment methods for your account.'
                      : 'You manually choose which payment methods to enable.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-body-small ${managedMode ? 'bg-[#f7f5fd] text-[#675dff]' : 'bg-offset text-subdued'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${managedMode ? 'bg-[#675dff]' : 'bg-gray-400'}`} />
                  {managedMode ? 'Managed' : 'Manual'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setShowModal(true)}
                className="text-body-small text-brand hover:underline"
              >
                Manage new payment methods
              </button>
              {managedMode && RECENT_UPDATES.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-body-small text-subdued">Recent:</span>
                  {RECENT_UPDATES.slice(0, 2).map(u => (
                    <span key={u.id} className="text-body-small text-default">{u.method} ({u.date})</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming updates (when managed) */}
          {managedMode && UPCOMING_UPDATES.length > 0 && (
            <div className="border border-border rounded-xl p-5">
              <h3 className="text-label-medium-emphasized mb-3">Upcoming payment method updates</h3>
              <div className="space-y-3">
                {UPCOMING_UPDATES.map(update => (
                  <div key={update.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <div>
                        <span className="text-label-small-emphasized">{update.method}</span>
                        <span className="text-body-small text-subdued ml-2">Scheduled for {update.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={update.termsUrl} className="text-body-small text-brand hover:underline">Terms</a>
                      <span className="text-subdued">·</span>
                      <a href={update.pricingUrl} className="text-body-small text-brand hover:underline">Pricing</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DPM Impact chart */}
          <div className="border border-border rounded-xl p-5">
            <DPMChart />
          </div>

          {/* Recommended methods */}
          <div className="border border-border rounded-xl p-5">
            <h3 className="text-label-medium-emphasized mb-1">Recommended methods</h3>
            <p className="text-body-small text-subdued mb-4">Growth opportunities based on your customer locations and transaction patterns.</p>
            <div className="space-y-3">
              {RECOMMENDED_METHODS.map(method => (
                <div key={method.id} className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-offset transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-label-medium-emphasized">{method.name}</span>
                      <span className="text-body-small text-[#675dff] bg-[#f7f5fd] px-2 py-0.5 rounded">{method.impact}</span>
                    </div>
                    <p className="text-body-small text-subdued mt-1">{method.reason}</p>
                    {!method.frictionless && (
                      <span className="inline-flex items-center gap-1 text-body-small text-amber-600 mt-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v4M6 7h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/></svg>
                        Requires setup
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleEnableRecommended(method)}
                    disabled={enabledRecs.includes(method.id)}
                    className={`shrink-0 ml-4 px-3 py-1.5 text-label-small rounded-lg transition-colors ${
                      enabledRecs.includes(method.id)
                        ? 'bg-green-50 text-green-700 cursor-default'
                        : 'bg-[#675dff] text-white hover:bg-[#5a4fee]'
                    }`}
                  >
                    {enabledRecs.includes(method.id) ? 'Enabled' : method.frictionless ? 'Enable' : 'Set up'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview affordance */}
          <div className="border border-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-label-medium-emphasized">Preview customer experience</h3>
              <p className="text-body-small text-subdued mt-0.5">See how payment methods appear to your customers at checkout.</p>
            </div>
            <button className="px-4 py-2 text-label-small border border-border rounded-lg hover:bg-offset transition-colors">
              Preview checkout
            </button>
          </div>
        </div>
      )}

      <ManageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        managedMode={managedMode}
        onModeChange={onModeChange}
      />
    </div>
  );
}

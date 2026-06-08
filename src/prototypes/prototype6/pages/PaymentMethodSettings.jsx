import { useState } from 'react';
import { useBasePath } from '../../../contexts/BasePath';
import ManageModal from '../components/ManageModal';
import PaymentMethodDrawer from '../components/PaymentMethodDrawer';
import { PAYMENT_METHODS, UPCOMING_UPDATES, RECENT_UPDATES } from '../data/paymentMethods';

export default function PaymentMethodSettings({ managedMode, onModeChange, highlightedMethod, onClearHighlight }) {
  const [showModal, setShowModal] = useState(false);
  const [drawerMethod, setDrawerMethod] = useState(highlightedMethod || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('payment-methods');
  const basePath = useBasePath();

  const tabs = ['Payment methods', 'Reviews', 'Rules'];

  const filteredMethods = PAYMENT_METHODS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDrawer = (methodId) => {
    setDrawerMethod(methodId);
    if (onClearHighlight) onClearHighlight();
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-2">
        <span className="text-body-small text-subdued">Settings</span>
        <span className="text-body-small text-subdued mx-1.5">/</span>
        <span className="text-body-small text-default">Payment methods</span>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-display-small">Payment methods</h1>
        {/* Tabs */}
        <div className="flex items-center gap-0 mt-4 border-b border-border -mx-5 md:-mx-8 px-5 md:px-8">
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
        <div className="space-y-6">
          {/* Payment method updates card */}
          <div className="border border-border rounded-xl p-5 bg-surface">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-label-large-emphasized">Payment method updates</h2>
                <p className="text-body-small text-subdued mt-0.5">
                  New eligible payment methods: {managedMode ? (
                    <span className="text-[#675dff] font-medium">Enabled automatically</span>
                  ) : (
                    <span className="text-default font-medium">Manual</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="text-body-small text-brand hover:underline"
              >
                Change preference
              </button>
            </div>

            {managedMode ? (
              <>
                {/* Upcoming updates */}
                {UPCOMING_UPDATES.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-label-small-emphasized text-subdued uppercase tracking-wider mb-2">Upcoming</h3>
                    <div className="space-y-2">
                      {UPCOMING_UPDATES.map(update => (
                        <div key={update.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-offset transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-label-small-emphasized">{update.method}</span>
                            <span className="text-body-small text-subdued">{update.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <a href={update.termsUrl} className="text-body-small text-brand hover:underline">Terms</a>
                            <a href={update.pricingUrl} className="text-body-small text-brand hover:underline">Pricing</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent updates */}
                {RECENT_UPDATES.length > 0 && (
                  <div>
                    <h3 className="text-label-small-emphasized text-subdued uppercase tracking-wider mb-2">Recent</h3>
                    <div className="space-y-2">
                      {RECENT_UPDATES.map(update => (
                        <div key={update.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-offset transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-label-small-emphasized">{update.method}</span>
                            <span className="text-body-small text-subdued">{update.date}</span>
                          </div>
                          <button
                            onClick={() => openDrawer(update.id)}
                            className="text-body-small text-brand hover:underline"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Manual mode */
              <div>
                <h3 className="text-label-small-emphasized text-subdued uppercase tracking-wider mb-2">New methods available</h3>
                <div className="space-y-2">
                  {UPCOMING_UPDATES.map(update => (
                    <div key={update.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-offset transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-label-small-emphasized">{update.method}</span>
                        <span className="text-body-small text-subdued">Available</span>
                      </div>
                      <button
                        onClick={() => openDrawer(update.id)}
                        className="px-3 py-1 text-label-small text-white bg-[#675dff] hover:bg-[#5a4fee] rounded-lg transition-colors"
                      >
                        Review and enable
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search and filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-subdued">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search payment methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-body-small border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-[#675dff]/20 focus:border-[#675dff]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-body-small border border-border rounded-lg px-3 py-2 bg-surface"
            >
              <option value="all">All statuses</option>
              <option value="active">Available</option>
              <option value="requires_setup">Requires setup</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Payment methods list */}
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-5 py-3 bg-offset text-label-small-emphasized text-subdued border-b border-border">
              <span>Payment method</span>
              <span>Region</span>
              <span>Type</span>
              <span>Status</span>
            </div>
            {/* Table rows */}
            {filteredMethods.map(method => (
              <button
                key={method.id}
                onClick={() => openDrawer(method.id)}
                className={`w-full grid grid-cols-[1fr_120px_120px_100px] gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-offset transition-colors text-left ${
                  highlightedMethod === method.id ? 'bg-[#f7f5fd]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{method.icon}</span>
                  <span className="text-label-medium-emphasized">{method.name}</span>
                </div>
                <span className="text-body-small text-subdued self-center">{method.region}</span>
                <span className="text-body-small text-subdued self-center">{method.type}</span>
                <span className="self-center">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-body-small ${
                    method.status === 'active' ? 'bg-green-50 text-green-700' :
                    method.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                    method.status === 'requires_setup' ? 'bg-amber-50 text-amber-700' :
                    'bg-offset text-subdued'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      method.status === 'active' ? 'bg-green-500' :
                      method.status === 'upcoming' ? 'bg-blue-500' :
                      method.status === 'requires_setup' ? 'bg-amber-500' :
                      'bg-gray-400'
                    }`} />
                    {method.status === 'active' ? 'Available' :
                     method.status === 'upcoming' ? 'Upcoming' :
                     method.status === 'requires_setup' ? 'Setup' :
                     'Ineligible'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ManageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        managedMode={managedMode}
        onModeChange={onModeChange}
      />

      <PaymentMethodDrawer
        methodId={drawerMethod}
        isOpen={!!drawerMethod}
        onClose={() => setDrawerMethod(null)}
        managedMode={managedMode}
      />
    </div>
  );
}

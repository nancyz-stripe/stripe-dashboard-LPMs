import { PAYMENT_METHODS, RECENT_UPDATES } from '../data/paymentMethods';

export default function PaymentMethodDrawer({ methodId, isOpen, onClose, managedMode }) {
  if (!isOpen || !methodId) return null;

  const method = PAYMENT_METHODS.find(m => m.id === methodId);
  const update = RECENT_UPDATES.find(u => u.id === methodId);

  if (!method) return null;

  const isManaged = managedMode && method.managedDate;
  const hasSetup = method.setupItems && method.setupItems.length > 0;
  const hasIntegrationOverride = method.id === 'sepa';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-surface w-full max-w-[480px] h-full overflow-y-auto shadow-xl" style={{ animation: 'slideInRight 0.25s ease-out' }}>
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{method.icon}</span>
            <div>
              <h2 className="text-heading-small">{method.name}</h2>
              <p className="text-body-small text-subdued">{method.type} · {method.country}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-subdued hover:text-default p-2 rounded-md hover:bg-offset transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-body-small ${
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
               method.status === 'requires_setup' ? 'Requires setup' :
               'Ineligible'}
            </span>
          </div>

          {/* Managed callout */}
          {isManaged && (
            <div className="bg-[#f7f5fd] border border-[#e8e4fd] rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 text-[#675dff] shrink-0"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <div>
                  <p className="text-label-small-emphasized">Enabled by Stripe on {method.managedDate}</p>
                  <p className="text-body-small text-subdued mt-0.5">
                    {update?.reason || 'This method was automatically enabled based on your account eligibility and customer base.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Integration override warning (vision-state) */}
          {hasIntegrationOverride && method.status === 'requires_setup' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 text-amber-600 shrink-0"><path d="M8 1l7 13H1L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <div>
                  <p className="text-label-small-emphasized text-amber-800">Enabled here but not shown at checkout</p>
                  <p className="text-body-small text-amber-700 mt-0.5">
                    This method is available but not currently presented due to integration settings.{' '}
                    <a href="#" className="underline">View in Checkout Studio</a> · <a href="#" className="underline">Docs</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Requirements / Setup */}
          <div>
            <h3 className="text-label-medium-emphasized mb-3">Requirements</h3>
            {hasSetup ? (
              <div className="space-y-2">
                {method.setupItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${item.complete ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                      {item.complete && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span className="text-body-small">{item.label}</span>
                    {!item.complete && (
                      <span className="ml-auto text-body-small text-brand cursor-pointer hover:underline">Set up</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-600"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-body-small text-green-700">Ready — no additional setup required</span>
              </div>
            )}
          </div>

          {/* Terms & Pricing */}
          <div>
            <h3 className="text-label-medium-emphasized mb-3">Terms & pricing</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-offset transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-subdued"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6h6M5 8h4M5 10h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <span className="text-body-small">Terms of service</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto text-subdued"><path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#" className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-offset transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-subdued"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <span className="text-body-small">Pricing details</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto text-subdued"><path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* Fraud protection */}
          <div>
            <h3 className="text-label-medium-emphasized mb-3">Fraud protection</h3>
            <div className="p-4 rounded-lg bg-offset">
              <p className="text-body-small text-subdued">
                {method.name} transactions are covered by Stripe's standard fraud protection. Radar monitors all payments and applies your configured rules.
              </p>
              <a href="#" className="text-body-small text-brand hover:underline mt-2 inline-block">Learn more about fraud protection</a>
            </div>
          </div>

          {/* Region & availability */}
          <div>
            <h3 className="text-label-medium-emphasized mb-3">Availability</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-body-small text-subdued">Region</p>
                <p className="text-label-small-emphasized mt-0.5">{method.region}</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-body-small text-subdued">Country</p>
                <p className="text-label-small-emphasized mt-0.5">{method.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

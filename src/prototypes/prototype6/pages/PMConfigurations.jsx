import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { PAYMENT_METHODS } from '../data/paymentMethods';

export default function PMConfigurations() {
  const basePath = useBasePath();
  const navigate = useNavigate();
  const [activeConfig, setActiveConfig] = useState('pmc_default');

  const configurations = [
    { id: 'pmc_default', name: 'Payments default', badge: 'Default', methods: 8 },
    { id: 'pmc_subscriptions', name: 'Subscriptions', badge: null, methods: 5 },
    { id: 'pmc_invoices', name: 'Invoices', badge: null, methods: 4 },
  ];

  const methodsInConfig = PAYMENT_METHODS.filter(m => m.status === 'active');

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-2">
        <span className="text-body-small text-subdued">Settings</span>
        <span className="text-body-small text-subdued mx-1.5">/</span>
        <span className="text-body-small text-default">Payment method configurations</span>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-display-small">Payment method configurations</h1>
          <button className="px-4 py-2 text-label-medium border border-border rounded-lg hover:bg-offset transition-colors">
            Create configuration
          </button>
        </div>
        <p className="text-body-medium text-subdued mt-2">
          Configure which payment methods are available for each payment integration.
        </p>
      </div>

      {/* Learn callout — links to Studio */}
      <div className="mb-6 p-4 rounded-xl border border-[#e8e4fd] bg-[#f7f5fd] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#675dff]/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#675dff]">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-label-small-emphasized">Checkout Studio</p>
            <p className="text-body-small text-subdued">Manage checkout presentment and performance in Checkout Studio.</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`${basePath}/checkout-studio`)}
          className="text-body-small text-brand hover:underline whitespace-nowrap"
        >
          Open Checkout Studio
        </button>
      </div>

      {/* Configurations list */}
      <div className="border border-border rounded-xl overflow-hidden">
        {configurations.map(config => (
          <div
            key={config.id}
            className={`px-5 py-4 border-b border-border last:border-0 cursor-pointer hover:bg-offset transition-colors ${activeConfig === config.id ? 'bg-offset' : ''}`}
            onClick={() => setActiveConfig(config.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-subdued">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 6h6M5 8h4M5 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-label-medium-emphasized">{config.name}</span>
                </div>
                {config.badge && (
                  <span className="text-body-small bg-offset text-subdued px-2 py-0.5 rounded">{config.badge}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-body-small text-subdued">{config.methods} methods</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-subdued"><path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active config details */}
      <div className="mt-6 border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-label-large-emphasized">
              {configurations.find(c => c.id === activeConfig)?.name}
            </h2>
            <p className="text-body-small text-subdued mt-0.5">
              ID: {activeConfig} · {methodsInConfig.length} payment methods enabled
            </p>
          </div>
          <button className="p-2 rounded-md hover:bg-offset transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-subdued">
              <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Methods in config */}
        <div className="space-y-1">
          {methodsInConfig.map(method => (
            <div key={method.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-offset transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{method.icon}</span>
                <span className="text-label-small-emphasized">{method.name}</span>
              </div>
              <span className="text-body-small text-subdued">{method.region}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

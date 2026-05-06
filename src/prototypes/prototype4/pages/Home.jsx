import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tabs } from '../../../sail';
import { Icon } from '../../../icons/SailIcons';

function SelectMenu({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-7 px-2 bg-surface border border-border rounded-md shadow-sm text-label-medium-emphasized text-default cursor-pointer hover:bg-offset transition-colors"
      >
        <span className="truncate">{value}</span>
        <Icon name="chevronDown" size="xxsmall" fill="currentColor" className="shrink-0" />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[199]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[200] bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => { onChange(option); setOpen(false); }}
                  className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded text-label-medium text-default hover:bg-offset transition-colors cursor-pointer text-left"
                >
                  <span className="flex-1">{option}</span>
                  {option === value && (
                    <Icon name="checkCircleFilled" size="xxsmall" fill="currentColor" className="text-icon-default shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function PaymentMethodPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 border border-border rounded-full px-2 py-1">
      <span className="flex items-center justify-center size-5 rounded bg-offset shrink-0">
        <Icon name={icon} size="xsmall" fill="currentColor" className="text-icon-subdued" />
      </span>
      <span className="text-label-medium text-subdued">{label}</span>
    </span>
  );
}

function TableRow({ label, children, isLast }) {
  return (
    <div className={`flex items-start py-6 ${isLast ? '' : 'border-b border-border'}`}>
      <div className="w-[232px] shrink-0 pt-0.5">
        <p className="text-label-medium-emphasized text-default">{label}</p>
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

function ResourceCard({ title, description }) {
  return (
    <div className="flex flex-col gap-4 bg-offset rounded-lg p-4 w-[320px]">
      <div className="flex flex-col gap-1">
        <p className="text-label-large-emphasized text-default">{title}</p>
        <p className="text-label-medium text-subdued">{description}</p>
      </div>
      <a href="#" className="flex items-center gap-1 text-label-medium text-brand hover:underline">
        View doc
      </a>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('retries');
  const [subscriptionAction, setSubscriptionAction] = useState('cancel the subscription');
  const [invoiceAction, setInvoiceAction] = useState('leave the invoice overdue');

  const subscriptionOptions = ['cancel the subscription', 'mark the subscription as unpaid', 'leave the subscription past due'];
  const invoiceOptions = ['leave the invoice overdue', 'mark the invoice as uncollectible', 'void the invoice'];

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'retries', label: 'Retries' },
    { key: 'emails', label: 'Emails' },
    { key: 'automations', label: 'Automations' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <div className="flex flex-col gap-1 pt-1.5">
          <h1 className="text-heading-xlarge text-default">Revenue recovery</h1>
          <p className="text-label-large text-subdued">
            Use automated recovery features that reduce and recover failed subscription payments.
          </p>
        </div>
        <div className="mt-4">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'retries' && (
        <div className="flex flex-col gap-10 pb-20">
          {/* Payment method retries */}
          <div>
            <div className="flex flex-col gap-1.5 pb-6">
              <h2 className="text-heading-medium text-default">Payment method retries</h2>
              <p className="text-label-medium text-subdued">Manage failed payment recovery for payment methods.</p>
            </div>

            {/* Table rows */}
            <div className="border-t border-border">
              {/* Card payments row */}
              <TableRow label="Card payments">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-label-medium text-default">Active on subscription payment retries</p>
                    <div className="flex flex-wrap gap-1">
                      <PaymentMethodPill icon="card" label="Cards" />
                    </div>
                  </div>
                  <a href="#" className="text-label-medium text-brand hover:underline w-fit">Manage</a>
                </div>
              </TableRow>

              {/* Local payment methods row */}
              <TableRow label="Local payment methods">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-label-medium text-default">Active on subscription payment retries</p>
                    <div className="flex flex-wrap gap-1">
                      <PaymentMethodPill icon="bank" label="ACH Direct Debit" />
                      <PaymentMethodPill icon="bank" label="Canadian pre-authorized debits" />
                      <PaymentMethodPill icon="bank" label="SEPA Direct Debit" />
                    </div>
                  </div>
                  <a href="#" className="text-label-medium text-brand hover:underline w-fit">Manage</a>
                </div>
              </TableRow>

              {/* Subscription status row */}
              <TableRow label="Subscription status">
                <div className="flex items-center gap-3">
                  <span className="text-label-medium text-default">If all retries for a payment fails,</span>
                  <SelectMenu value={subscriptionAction} options={subscriptionOptions} onChange={setSubscriptionAction} />
                </div>
              </TableRow>

              {/* Invoice status row */}
              <TableRow label="Invoice status" isLast>
                <div className="flex items-center gap-3">
                  <span className="text-label-medium text-default">If all retries for a payment fails,</span>
                  <SelectMenu value={invoiceAction} options={invoiceOptions} onChange={setInvoiceAction} />
                </div>
              </TableRow>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-heading-medium text-default pb-3">Resources</h2>
            <div className="flex gap-4">
              <ResourceCard
                title="Automated recovery"
                description="Learn about automated recovery features that reduce and recover failed payments."
              />
              <ResourceCard
                title="Automations"
                description="Learn how to customise your recovery flows for different customer segments."
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="text-subdued text-body-small">Overview content would go here.</div>
      )}
      {activeTab === 'emails' && (
        <div className="text-subdued text-body-small">Emails content would go here.</div>
      )}
      {activeTab === 'automations' && (
        <div className="text-subdued text-body-small">Automations content would go here.</div>
      )}
    </div>
  );
}

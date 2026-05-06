import { useState, useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Tabs, Button, Radio, Switch, Chip, Tooltip } from '../../../sail';
import { Icon } from '../../../icons/SailIcons';

const LOCAL_PAYMENT_METHODS = [
  { id: 'ach', name: 'ACH Direct Debit', icon: 'bank', enabled: true, retryType: 'Custom retry', maxRetries: 2, description: 'Up to 2 retries in total.' },
  { id: 'au-becs', name: 'Australia BECS Direct Debit', icon: 'bank', enabled: false, retryType: null, maxRetries: 2, description: 'Up to 2 retries in total.' },
  { id: 'bacs', name: 'Bacs Direct Debit', icon: 'bank', enabled: false, retryType: null, maxRetries: 2, description: 'Up to 2 retries in total.' },
  { id: 'pad', name: 'Canadian pre-authorized debits', icon: 'bank', enabled: true, retryType: 'Automatic retry', maxRetries: 2, description: 'Up to 2 retries in total, minimum invoice amount 10 EUR.' },
  { id: 'nz-becs', name: 'New Zealand BECS Direct Debit', icon: 'bank', enabled: false, retryType: null, maxRetries: 2, description: 'Up to 2 retries in total.' },
  { id: 'sepa', name: 'SEPA Direct Debit', icon: 'bank', enabled: true, retryType: 'Custom retry', maxRetries: 2, description: 'Up to 2 retries in total, minimum invoice amount 10 EUR.' },
];

const CUSTOM_RETRY_DAY_OPTIONS = [
  '2 days after the previous attempt',
  '3 days after the previous attempt',
  '5 days after the previous attempt',
  '7 days after the previous attempt',
  '9 days after the previous attempt',
];
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th'];

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

function SelectMenuSmall({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-6 px-2 bg-surface border border-border rounded-md shadow-sm text-label-small-emphasized text-default cursor-pointer hover:bg-offset transition-colors"
      >
        <span className="truncate">{value}</span>
        <Icon name="chevronDown" size="xxsmall" fill="currentColor" className="shrink-0" />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[301]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[302] bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => { onChange(option); setOpen(false); }}
                  className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded text-label-small text-default hover:bg-offset transition-colors cursor-pointer text-left whitespace-nowrap"
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

function CustomRetryControls({ maxRetries }) {
  const [steps, setSteps] = useState([CUSTOM_RETRY_DAY_OPTIONS[0]]);

  const addStep = () => {
    if (steps.length < maxRetries) {
      setSteps([...steps, CUSTOM_RETRY_DAY_OPTIONS[1]]);
    }
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  return (
    <div className="flex flex-col gap-2 pl-[22px]">
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-2 items-center">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <span className="text-label-small text-subdued whitespace-nowrap">{ORDINALS[index]} retry</span>
            <SelectMenuSmall value={step} options={CUSTOM_RETRY_DAY_OPTIONS} onChange={(val) => updateStep(index, val)} />
            <button
              onClick={() => removeStep(index)}
              className="flex items-center justify-center size-5 rounded hover:bg-offset transition-colors cursor-pointer"
            >
              <Icon name="cancel" size="xxsmall" fill="currentColor" className="text-icon-subdued" />
            </button>
          </Fragment>
        ))}
      </div>
      {steps.length < maxRetries && (
        <button
          onClick={addStep}
          className="flex items-center gap-1 text-label-small text-brand hover:underline cursor-pointer w-fit"
        >
          <Icon name="add" size="xxsmall" fill="currentColor" />
          Add retry
        </button>
      )}
    </div>
  );
}

function DrawerAccordionItem({ method, enabled, onToggle, expanded, onExpand }) {
  const [policy, setPolicy] = useState(method.retryType === 'Custom retry' ? 'custom' : 'automatic');

  return (
    <div className="border-b border-border">
      <div
        className="flex items-center gap-2 px-2 py-3 cursor-pointer hover:bg-offset/50 transition-colors"
        onClick={onExpand}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Switch checked={enabled} onChange={onToggle} />
        </div>
        <div className="flex items-center justify-center size-8 rounded bg-offset shrink-0">
          <Icon name={method.icon} size="small" fill="currentColor" className="text-icon-subdued" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label-medium-emphasized text-default">{method.name}</p>
          {enabled && method.retryType && (
            <p className="text-label-small text-subdued">{policy === 'custom' ? 'Custom retry' : 'Automatic retry'}</p>
          )}
        </div>
        <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size="xxsmall" fill="currentColor" className="text-icon-subdued" />
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-label-small text-subdued pb-4">
            {method.description}{' '}
            <span className="text-brand cursor-pointer hover:underline">Learn more</span>
          </p>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Radio
                name={`${method.id}-drawer-policy`}
                value="automatic"
                checked={policy === 'automatic'}
                onChange={() => setPolicy('automatic')}
              />
              <span className="text-label-medium-emphasized text-default">Automatic retries for subscription</span>
              <Tooltip
                placement="bottom"
                content={
                  <span className="text-label-medium text-default">
                    Retry failed payments at the optimal times, powered by Stripe's machine learning. Stripe's recommended default setting is up to 8 retries within 2 weeks.{' '}
                    <a href="https://docs.stripe.com/invoicing/automatic-collection#smart-retries" target="_blank" className="text-brand hover:underline">Learn more</a>
                  </span>
                }
              >
                <Icon name="info" size="xxsmall" fill="currentColor" className="text-icon-subdued cursor-help" />
              </Tooltip>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Radio
                name={`${method.id}-drawer-policy`}
                value="custom"
                checked={policy === 'custom'}
                onChange={() => setPolicy('custom')}
              />
              <span className="text-label-medium-emphasized text-default">Custom retry schedule for subscriptions</span>
              <Tooltip
                placement="bottom"
                content={
                  <span className="text-label-medium text-default">
                    Manually configure failed payment retries until they succeed.
                  </span>
                }
              >
                <Icon name="info" size="xxsmall" fill="currentColor" className="text-icon-subdued cursor-help" />
              </Tooltip>
            </label>

            {policy === 'custom' && (
              <CustomRetryControls maxRetries={method.maxRetries} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ManageDrawer({ open, onClose }) {
  const [methodStates, setMethodStates] = useState(() => {
    const initial = {};
    LOCAL_PAYMENT_METHODS.forEach((m) => { initial[m.id] = m.enabled; });
    return initial;
  });
  const [expandedIds, setExpandedIds] = useState(new Set());

  const handleToggle = (id) => {
    setMethodStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnableAll = () => {
    const updated = { ...methodStates };
    LOCAL_PAYMENT_METHODS.forEach((m) => { updated[m.id] = true; });
    setMethodStates(updated);
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[250] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Drawer panel */}
      <div className="w-[480px] bg-surface flex flex-col shadow-xl animate-[slideInRight_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-heading-small text-default">Manage subscription retries</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded hover:bg-offset transition-colors cursor-pointer"
          >
            <Icon name="cancel" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-label-medium text-subdued pb-4">
            Set up automated recovery features that reduce and recover failed subscription payments.
          </p>

          {/* Filter chips */}
          <div className="flex gap-2 pb-6">
            <Chip label="Payment method name" size="sm" renderDropdown={() => null} />
            <Chip label="Type" size="sm" renderDropdown={() => null} />
            <Chip label="Status" size="sm" renderDropdown={() => null} />
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between pb-3">
            <p className="text-label-medium-emphasized text-default">Local payment methods</p>
            <Button variant="secondary" size="sm" onClick={handleEnableAll}>Enable all</Button>
          </div>

          {/* Payment method list */}
          <div className="border-t border-border">
            {LOCAL_PAYMENT_METHODS.map((method) => (
              <DrawerAccordionItem
                key={method.id}
                method={method}
                enabled={methodStates[method.id]}
                onToggle={() => handleToggle(method.id)}
                expanded={expandedIds.has(method.id)}
                onExpand={() => setExpandedIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(method.id)) next.delete(method.id);
                  else next.add(method.id);
                  return next;
                })}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 py-4 border-t border-border">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onClose}>Save</Button>
        </div>
      </div>
    </div>,
    document.body
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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="text-label-medium text-brand hover:underline w-fit cursor-pointer"
                  >
                    Manage
                  </button>
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

      <ManageDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

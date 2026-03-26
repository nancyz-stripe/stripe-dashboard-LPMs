import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tabs, Badge, Button, Radio, Tooltip } from '../../../sail';
import { Icon } from '../../../icons/SailIcons';

// ============================================================================
// Data & Constants (shared with V1)
// ============================================================================

const PAYMENT_METHODS = [
  { id: 'cards', name: 'Cards', icon: 'card', type: 'card', enabled: true, maxRetries: 3, subtitle: 'Up to 8 retries with Smart Retry.' },
  { id: 'ach', name: 'ACH Direct Debit', icon: 'bank', type: 'bank_debit', enabled: false, maxRetries: 2, subtitle: 'Up to 2 retries in total.' },
  { id: 'bacs', name: 'Bacs Direct Debit', icon: 'bank', type: 'bank_debit', enabled: true, maxRetries: 2, subtitle: 'Up to 2 retries in total.' },
  { id: 'sepa', name: 'SEPA Direct Debit', icon: 'bank', type: 'bank_debit', enabled: true, maxRetries: 2, subtitle: 'Up to 2 retries in total, minimum invoice amount 10 EUR.' },
  { id: 'pad', name: 'Pre-authorised debit in Canada', icon: 'bank', type: 'bank_debit', enabled: false, maxRetries: 2, subtitle: 'Up to 2 retries in total.' },
  { id: 'au-becs', name: 'Australia BECS Direct Debit', icon: 'bank', type: 'bank_debit', enabled: false, maxRetries: 2, subtitle: 'Up to 2 retries in total.' },
  { id: 'nz-becs', name: 'New Zealand BECS Direct Debit', icon: 'bank', type: 'bank_debit', enabled: false, maxRetries: 2, subtitle: 'Up to 2 retries in total.' },
];

const SMART_RETRY_TIMES = ['4 times', '8 times'];
const SMART_RETRY_DURATIONS = ['1 week', '2 weeks', '3 weeks', '1 month', '2 months'];
const CUSTOM_RETRY_DAY_OPTIONS = [
  'Retry 2 days after the previous attempt',
  'Retry 3 days after the previous attempt',
  'Retry 5 days after the previous attempt',
  'Retry 7 days after the previous attempt',
  'Retry 9 days after the previous attempt',
];
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

// ============================================================================
// Shared UI Components
// ============================================================================

function SelectMenu({ value, options, onChange, className = '' }) {
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
        className={`inline-flex items-center gap-1.5 h-7 px-2 bg-surface border border-border rounded-md shadow-sm text-label-medium-emphasized text-default cursor-pointer hover:bg-offset transition-colors ${className}`}
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

function SelectTrigger({ value }) {
  return (
    <button className="inline-flex items-center gap-1.5 h-7 px-2 bg-surface border border-border rounded-md shadow-sm text-label-medium-emphasized text-default cursor-pointer hover:bg-offset transition-colors">
      {value}
      <Icon name="chevronDown" size="xxsmall" fill="currentColor" />
    </button>
  );
}

function CustomRetryControls({ maxRetries, options = CUSTOM_RETRY_DAY_OPTIONS }) {
  const [steps, setSteps] = useState([options[0]]);

  const addStep = () => {
    if (steps.length < maxRetries) {
      setSteps([...steps, options[1]]);
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
      <div className="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-2 items-center w-fit">
        {steps.map((step, index) => (
          <>
            <span key={`label-${index}`} className="text-label-small text-subdued whitespace-nowrap">{ORDINALS[index]} retry</span>
            <SelectMenu key={`select-${index}`} value={step} options={options} onChange={(val) => updateStep(index, val)} />
            <button
              key={`remove-${index}`}
              onClick={() => removeStep(index)}
              className="flex items-center justify-center size-7 rounded-md hover:bg-offset transition-colors cursor-pointer"
            >
              <Icon name="cancel" size="xxsmall" fill="currentColor" className="text-icon-subdued" />
            </button>
          </>
        ))}
      </div>
      {steps.length < maxRetries && (
        <button
          onClick={addStep}
          className="flex items-center gap-1 text-label-medium text-brand hover:underline cursor-pointer w-fit"
        >
          <Icon name="add" size="xxsmall" fill="currentColor" />
          Add retry
        </button>
      )}
    </div>
  );
}

function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return createPortal(
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[300] flex items-center min-h-[44px] bg-[#273951] rounded-md shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] overflow-hidden animate-[slideUp_0.25s_ease-out]">
      <div className="flex items-center px-4 py-2">
        <p className="text-label-medium text-white whitespace-nowrap">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="flex items-center justify-center self-stretch w-[44px] shrink-0 border-l border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <Icon name="cancel" size="xxsmall" fill="white" />
      </button>
    </div>,
    document.body
  );
}

function Spinner() {
  return (
    <svg className="animate-spin size-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OverflowMenu({ onDisable }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.right });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  return (
    <>
      <div ref={wrapRef} className="inline-flex">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        >
          <Icon name="more" size="xxsmall" fill="currentColor" />
        </Button>
      </div>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[199]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[200] bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
            style={{ top: pos.top, right: document.documentElement.clientWidth - pos.left }}
          >
            <div className="p-1">
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); onDisable(); }}
                className="flex items-center w-full px-2.5 py-1.5 rounded text-label-medium text-default hover:bg-offset transition-colors cursor-pointer text-left whitespace-nowrap"
              >
                Disable
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function buildTimesOptions(maxRetries) {
  return Array.from({ length: maxRetries }, (_, i) => `${i + 1} time${i + 1 > 1 ? 's' : ''}`);
}

// ============================================================================
// Retry Config Panels (used in detail view)
// ============================================================================

function CardRetryConfig() {
  const [retryPolicy, setRetryPolicy] = useState('smart');
  const [smartTimes, setSmartTimes] = useState('8 times');
  const [smartDuration, setSmartDuration] = useState('2 weeks');

  return (
    <div className="bg-offset rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio
              name="card-retry-v2"
              value="smart"
              checked={retryPolicy === 'smart'}
              onChange={() => setRetryPolicy('smart')}
            />
            <div className="flex items-center gap-2">
              <span className="text-label-medium-emphasized text-default">Use a Smart Retry policy for subscriptions</span>
              <Tooltip
                placement="bottom"
                content={
                  <span className="text-label-medium text-default">
                    Retry failed payments at the optimal times, powered by Stripe's machine learning.{' '}
                    <a href="#" className="text-brand hover:underline">Learn more</a>
                  </span>
                }
              >
                <Icon name="info" size="xxsmall" fill="currentColor" className="text-icon-subdued cursor-help" />
              </Tooltip>
            </div>
          </label>

          {retryPolicy === 'smart' && (
            <div className="flex items-center gap-2 pl-[22px]">
              <span className="text-label-small text-subdued">Retry up to</span>
              <SelectMenu value={smartTimes} options={SMART_RETRY_TIMES} onChange={setSmartTimes} />
              <span className="text-label-small text-subdued">within</span>
              <SelectMenu value={smartDuration} options={SMART_RETRY_DURATIONS} onChange={setSmartDuration} />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <Radio
              name="card-retry-v2"
              value="custom"
              checked={retryPolicy === 'custom'}
              onChange={() => setRetryPolicy('custom')}
            />
            <div className="flex items-center gap-2">
              <span className="text-label-medium-emphasized text-default">Use a custom retry policy for subscriptions</span>
              <Tooltip
                placement="bottom"
                content={
                  <span className="text-label-medium text-default">
                    Manually configure retry steps.{' '}
                    <a href="#" className="text-brand hover:underline">Learn more</a>
                  </span>
                }
              >
                <Icon name="info" size="xxsmall" fill="currentColor" className="text-icon-subdued cursor-help" />
              </Tooltip>
            </div>
          </label>

          {retryPolicy === 'custom' && (
            <CustomRetryControls maxRetries={3} />
          )}
        </div>
      </div>
    </div>
  );
}

function BankDebitRetryConfig({ method }) {
  const [policy, setPolicy] = useState('automatic');
  const [autoTimes, setAutoTimes] = useState(`${method.maxRetries} times`);
  const timesOptions = buildTimesOptions(method.maxRetries);

  return (
    <div className="bg-offset rounded-lg p-6">
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Radio
            name={`${method.id}-retry-v2`}
            value="automatic"
            checked={policy === 'automatic'}
            onChange={() => setPolicy('automatic')}
          />
          <span className="text-label-medium-emphasized text-default">Use automatic retry schedule for subscriptions</span>
        </label>

        {policy === 'automatic' && (
          <div className="flex items-center gap-2 pl-[22px]">
            <span className="text-label-small text-subdued">Retry up to</span>
            <SelectMenu value={autoTimes} options={timesOptions} onChange={setAutoTimes} />
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <Radio
            name={`${method.id}-retry-v2`}
            value="custom"
            checked={policy === 'custom'}
            onChange={() => setPolicy('custom')}
          />
          <span className="text-label-medium-emphasized text-default">Use a custom retry schedule for subscriptions</span>
        </label>

        {policy === 'custom' && (
          <CustomRetryControls maxRetries={method.maxRetries} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Split Screen Components
// ============================================================================

function PaymentMethodRow({ method, selected, onSelect, status, onEnable, onDisable }) {
  const isEnabled = status === 'enabled';
  const isPending = status === 'pending';

  return (
    <div
      onClick={() => onSelect(method.id)}
      className={`flex items-center gap-3 px-6 py-2.5 cursor-pointer transition-colors relative ${
        selected
          ? 'bg-offset'
          : 'hover:bg-offset/50'
      }`}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-brand rounded-r" />
      )}

      {/* Icon */}
      <div className="flex items-center justify-center size-8 rounded bg-offset shrink-0">
        <Icon name={method.icon} size="small" fill="currentColor" className="text-icon-subdued" />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`text-label-medium ${selected ? 'text-label-medium-emphasized text-default' : 'text-default'}`}>{method.name}</p>
      </div>

      {/* Action */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {isEnabled ? (
          <OverflowMenu onDisable={() => onDisable(method.id)} />
        ) : (
          <Button variant="secondary" size="sm" onClick={() => onEnable(method.id)}>
            {isPending ? <Spinner /> : 'Enable'}
          </Button>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ method, status, onClose, onEnable, onDisable }) {
  if (!method) {
    return (
      <div className="flex items-center justify-center h-full text-subdued text-body-small p-6">
        Select a payment method to configure retries.
      </div>
    );
  }

  const isEnabled = status === 'enabled';
  const typeLabel = method.type === 'card' ? 'Card payment' : 'Bank debit';

  return (
    <div className="flex flex-col gap-4 px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded-sm bg-offset shrink-0">
              <Icon name={method.icon} size="small" fill="currentColor" className="text-icon-subdued" />
            </div>
            <span className="text-heading-small text-default">{method.name}</span>
            {isEnabled ? (
              <Badge variant="success">Enabled</Badge>
            ) : (
              <Badge>Disabled</Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded-md hover:bg-offset transition-colors cursor-pointer"
          >
            <Icon name="cancel" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </button>
        </div>
        <p className="text-label-large text-default">{typeLabel}</p>
      </div>

      {/* Enable/Disable button */}
      {isEnabled ? (
        <Button variant="secondary" className="w-full" onClick={() => onDisable(method.id)}>
          Disable retries
        </Button>
      ) : (
        <Button variant="primary" className="w-full" onClick={() => onEnable(method.id)}>
          Enable retries
        </Button>
      )}

      {/* Choose retry schedule section */}
      <div className="flex flex-col gap-2">
        <p className="text-label-medium-emphasized text-default">Choose retry schedule</p>
        <p className="text-label-small text-subdued">
          {method.subtitle}{' '}
          <span className="text-brand cursor-pointer hover:underline">Learn more</span>
        </p>
      </div>

      {/* Retry config */}
      {method.type === 'card' ? (
        <CardRetryConfig />
      ) : (
        <BankDebitRetryConfig method={method} />
      )}
    </div>
  );
}

// ============================================================================
// Status Cards
// ============================================================================

function SubscriptionStatus() {
  return (
    <div className="flex-1 border border-border rounded-lg p-4">
      <div className="flex flex-col gap-2.5">
        <p className="text-heading-small text-default">Subscription status</p>
        <div className="flex items-center gap-2.5">
          <span className="text-label-small text-subdued">If all retries for a payment fail,</span>
          <SelectTrigger value="cancel the subscription" />
        </div>
      </div>
    </div>
  );
}

function InvoiceStatus() {
  return (
    <div className="flex-1 border border-border rounded-lg p-4">
      <div className="flex flex-col gap-2.5">
        <p className="text-heading-small text-default">Invoice status</p>
        <div className="flex items-center gap-2.5">
          <span className="text-label-small text-subdued">If all retries for a payment fail,</span>
          <SelectTrigger value="leave the invoice overdue" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main V2 Component
// ============================================================================

export default function HomeV2() {
  const [activeTab, setActiveTab] = useState('retries');
  const [selectedMethod, setSelectedMethod] = useState('cards');
  const [toast, setToast] = useState(null);
  const [methodStatuses, setMethodStatuses] = useState(() => {
    const initial = {};
    PAYMENT_METHODS.forEach((m) => {
      initial[m.id] = m.enabled ? 'enabled' : 'disabled';
    });
    return initial;
  });

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'retries', label: 'Retries' },
    { key: 'emails', label: 'Emails' },
    { key: 'automations', label: 'Automations' },
  ];

  const showToast = (msg) => setToast({ key: Date.now(), message: msg });

  const handleEnable = (id) => {
    const name = PAYMENT_METHODS.find((m) => m.id === id)?.name;
    setMethodStatuses((prev) => ({ ...prev, [id]: 'pending' }));
    setTimeout(() => {
      setMethodStatuses((prev) => ({ ...prev, [id]: 'enabled' }));
      showToast(`Billing retries for ${name} is enabled`);
    }, 1200);
  };

  const handleDisable = (id) => {
    const name = PAYMENT_METHODS.find((m) => m.id === id)?.name;
    setMethodStatuses((prev) => ({ ...prev, [id]: 'disabled' }));
    showToast(`Billing retries for ${name} is disabled`);
  };

  const handleEnableAll = () => {
    const toEnable = PAYMENT_METHODS.filter((m) => methodStatuses[m.id] === 'disabled');
    toEnable.forEach((m) => {
      setMethodStatuses((prev) => ({ ...prev, [m.id]: 'pending' }));
      setTimeout(() => {
        setMethodStatuses((prev) => ({ ...prev, [m.id]: 'enabled' }));
      }, 1200);
    });
    showToast('Billing retries for all payment methods are enabled');
  };

  const selectedMethodData = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const hasDisabled = PAYMENT_METHODS.some((m) => methodStatuses[m.id] === 'disabled');

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
        <div className="flex flex-col gap-6 pb-20">
          {/* Status cards row */}
          <div className="flex gap-4">
            <SubscriptionStatus />
            <InvoiceStatus />
          </div>

          {/* Split screen: Payment method list + Detail panel */}
          <div className="flex border border-border rounded-lg overflow-hidden min-h-[500px]">
            {/* Left column — payment method list (60%) */}
            <div className="w-[60%] shrink-0 border-r border-border flex flex-col">
              {/* List header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex flex-col gap-0.5">
                  <p className="text-heading-small text-default">Payment method retries</p>
                  <p className="text-label-small text-subdued">Configure how failed payments are retried for each payment method.</p>
                </div>
                {hasDisabled && (
                  <button
                    onClick={handleEnableAll}
                    className="text-label-small text-brand hover:underline cursor-pointer"
                  >
                    Enable all
                  </button>
                )}
              </div>

              {/* Payment method rows */}
              <div className="flex flex-col">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentMethodRow
                    key={method.id}
                    method={method}
                    selected={selectedMethod === method.id}
                    onSelect={setSelectedMethod}
                    status={methodStatuses[method.id]}
                    onEnable={handleEnable}
                    onDisable={handleDisable}
                  />
                ))}
              </div>
            </div>

            {/* Right column — detail panel */}
            <div className="flex-1 min-w-0">
              <DetailPanel
                method={selectedMethodData}
                status={methodStatuses[selectedMethod]}
                onClose={() => setSelectedMethod(null)}
                onEnable={handleEnable}
                onDisable={handleDisable}
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

      {toast && (
        <Toast key={toast.key} message={toast.message} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}

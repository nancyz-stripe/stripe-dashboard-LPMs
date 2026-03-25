import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tabs, Badge, Button, Radio, Tooltip } from '../../../sail';
import { Icon } from '../../../icons/SailIcons';

const BANK_DEBITS = [
  { id: 'ach', name: 'ACH Direct Debit', retries: 'Up to 2 retries in total.', enabled: false, maxRetries: 2 },
  { id: 'bacs', name: 'Bacs Direct Debit', retries: 'Up to 2 retries in total.', enabled: true, maxRetries: 2 },
  { id: 'sepa', name: 'SEPA Direct Debit', retries: 'Up to 2 retries in total, minimum invoice amount 10 EUR.', enabled: true, expanded: true, maxRetries: 2 },
  { id: 'pad', name: 'Pre-authorised debit in Canada', retries: 'Up to 2 retries in total.', enabled: false, maxRetries: 2 },
  { id: 'au-becs', name: 'Australia BECS Direct Debit', retries: 'Up to 2 retries in total.', enabled: false, maxRetries: 2 },
  { id: 'nz-becs', name: 'New Zealand BECS Direct Debit', retries: 'Up to 2 retries in total.', enabled: false, maxRetries: 2 },
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

function SelectMenu({ value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });

    // Lock body scroll
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
          {/* Backdrop: blocks scroll and captures outside clicks */}
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

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

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

function AccordionItem({ name, subtitle, enabled: defaultEnabled, expanded: defaultExpanded, children }) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const [status, setStatus] = useState(defaultEnabled ? 'enabled' : 'disabled'); // disabled | pending | enabled

  const handleEnable = (e) => {
    e.stopPropagation();
    setStatus('pending');
    setTimeout(() => setStatus('enabled'), 1200);
  };

  const handleDisable = () => {
    setStatus('disabled');
  };

  return (
    <div className="border-b border-border">
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-offset transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-center shrink-0">
          <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size="xxsmall" fill="currentColor" className="text-icon-subdued" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label-medium-emphasized text-default">{name}</p>
          <p className="text-label-small text-subdued">
            {subtitle}{' '}
            <span className="text-brand cursor-pointer hover:underline" onClick={(e) => e.stopPropagation()}>Learn more</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {status === 'enabled' ? (
            <>
              <Badge variant="success">Enabled</Badge>
              <OverflowMenu onDisable={handleDisable} />
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleEnable}>
              {status === 'pending' ? <Spinner /> : 'Enable'}
            </Button>
          )}
        </div>
      </div>
      {expanded && children && (
        <div className="px-3 pt-3 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function CardPaymentRetries() {
  const [retryPolicy, setRetryPolicy] = useState('smart');
  const [smartTimes, setSmartTimes] = useState('8 times');
  const [smartDuration, setSmartDuration] = useState('2 weeks');

  return (
    <div>
      <div className="pb-4">
        <p className="text-label-medium-emphasized text-default">Card payment retries</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {/* Smart retry option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio
              name="card-retry-policy"
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
                    Retry failed payments at the optimal times, powered by Stripe's machine learning. Stripe's recommended default setting is up to 8 retries within 2 weeks.{' '}
                    <a href="https://docs.stripe.com/invoicing/automatic-collection#smart-retries" target="_blank" className="text-brand hover:underline">Learn more</a>
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

          {/* Custom retry option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio
              name="card-retry-policy"
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
                    Manually configure up to 3 steps to retry payments until they succeed.{' '}
                    <a href="https://docs.stripe.com/billing/revenue-recovery" target="_blank" className="text-brand hover:underline">Learn more</a>
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

function buildTimesOptions(maxRetries) {
  return Array.from({ length: maxRetries }, (_, i) => `${i + 1} time${i + 1 > 1 ? 's' : ''}`);
}

function BankDebitRetryControls({ debit }) {
  const [policy, setPolicy] = useState('automatic');
  const [autoTimes, setAutoTimes] = useState(`${debit.maxRetries} times`);
  const timesOptions = buildTimesOptions(debit.maxRetries);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Radio
            name={`${debit.id}-retry-policy`}
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
            name={`${debit.id}-retry-policy`}
            value="custom"
            checked={policy === 'custom'}
            onChange={() => setPolicy('custom')}
          />
          <span className="text-label-medium-emphasized text-default">Use a custom retry schedule for subscriptions</span>
        </label>

        {policy === 'custom' && (
          <CustomRetryControls maxRetries={debit.maxRetries} />
        )}
      </div>
    </div>
  );
}

function BankDebitRetries() {
  return (
    <div>
      <div className="pr-8">
        <p className="text-label-medium-emphasized text-default">Bank debit retries</p>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {BANK_DEBITS.map((debit) => (
          <AccordionItem
            key={debit.id}
            name={debit.name}
            subtitle={debit.retries}
            enabled={debit.enabled}
            expanded={debit.expanded}
          >
            <BankDebitRetryControls debit={debit} />
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

function SubscriptionStatus() {
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <p className="text-label-medium-emphasized text-default">Subscription status</p>
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
    <div>
      <div className="flex flex-col gap-2.5">
        <p className="text-label-medium-emphasized text-default">Invoice status</p>
        <div className="flex items-center gap-2.5">
          <span className="text-label-small text-subdued">If all retries for a payment fail,</span>
          <SelectTrigger value="leave the invoice overdue" />
        </div>
      </div>
    </div>
  );
}

function ResourceLink({ title, linkText = 'View doc' }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-label-medium text-default">{title}</p>
      <a href="#" className="flex items-center gap-1 text-label-medium text-brand hover:underline">
        {linkText}
        <Icon name="chevronRight" size="xxsmall" fill="currentColor" />
      </a>
    </div>
  );
}

function Resources() {
  return (
    <div>
      <p className="text-heading-small text-default pb-2">Resources</p>
      <div className="flex flex-col gap-4">
        <ResourceLink title="Learn about automated recovery features that reduce and recover failed payments" />
        <div className="border-t border-border" />
        <ResourceLink title="ACH retries explained" />
        <div className="border-t border-border" />
        <ResourceLink title="Learn how to customise your recovery flows for different customer segments with Automations" />
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border" />;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('retries');

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
        <div className="flex flex-wrap gap-y-10 gap-x-[108px] pb-20">
          {/* Main column */}
          <div className="flex-1 min-w-[312px] flex flex-col gap-6">
            <CardPaymentRetries />
            <Divider />
            <BankDebitRetries />
            <Divider />
            <SubscriptionStatus />
            <Divider />
            <InvoiceStatus />
          </div>

          {/* Secondary column */}
          <div className="w-[294px] min-w-[240px] shrink-0">
            <Resources />
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

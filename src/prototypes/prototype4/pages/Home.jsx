import { useState } from 'react';
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

const RETRY_DAY_OPTIONS = [
  '1 day after the previous attempt',
  '2 days after the previous attempt',
  '3 days after the previous attempt',
  '5 days after the previous attempt',
  '7 days after the previous attempt',
  '14 days after the previous attempt',
];

function SelectTrigger({ value }) {
  return (
    <button className="inline-flex items-center gap-1.5 h-7 px-2 bg-surface border border-border rounded-md shadow-sm text-label-medium-emphasized text-default cursor-pointer hover:bg-offset transition-colors">
      {value}
      <Icon name="chevronDown" size="xxsmall" fill="currentColor" />
    </button>
  );
}

function CustomRetryControls({ maxRetries }) {
  const [steps, setSteps] = useState(['1 day after the previous attempt']);

  const addStep = () => {
    if (steps.length < maxRetries) {
      setSteps([...steps, '3 days after the previous attempt']);
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
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-label-small text-subdued shrink-0">Retry</span>
          <SelectTrigger value={step} />
          <button
            onClick={() => removeStep(index)}
            className="flex items-center justify-center size-7 rounded-md hover:bg-offset transition-colors cursor-pointer shrink-0"
          >
            <Icon name="cancel" size="xxsmall" fill="currentColor" className="text-icon-subdued" />
          </button>
        </div>
      ))}
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

function AccordionItem({ name, subtitle, enabled, expanded: defaultExpanded, children }) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);

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
          {enabled ? (
            <>
              <Badge variant="success">Enabled</Badge>
              <Button variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>
                <Icon name="more" size="xxsmall" fill="currentColor" />
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>Enable</Button>
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
              <SelectTrigger value="8 times" />
              <span className="text-label-small text-subdued">within</span>
              <SelectTrigger value="2 weeks" />
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

function BankDebitRetries() {
  const [sepaPolicy, setSepaPolicy] = useState('automatic');

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
            {debit.id === 'sepa' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Radio
                      name="sepa-retry-policy"
                      value="automatic"
                      checked={sepaPolicy === 'automatic'}
                      onChange={() => setSepaPolicy('automatic')}
                    />
                    <span className="text-label-medium-emphasized text-default">Use automatic retry schedule for subscriptions</span>
                  </label>

                  {sepaPolicy === 'automatic' && (
                    <div className="flex items-center gap-2 pl-[22px]">
                      <span className="text-label-small text-subdued">Retry up to</span>
                      <SelectTrigger value="2 times" />
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Radio
                      name="sepa-retry-policy"
                      value="custom"
                      checked={sepaPolicy === 'custom'}
                      onChange={() => setSepaPolicy('custom')}
                    />
                    <span className="text-label-medium-emphasized text-default">Use a custom retry schedule for subscriptions</span>
                  </label>

                  {sepaPolicy === 'custom' && (
                    <CustomRetryControls maxRetries={2} />
                  )}
                </div>
              </div>
            )}
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

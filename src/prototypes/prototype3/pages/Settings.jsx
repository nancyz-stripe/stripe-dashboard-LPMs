import { useState } from 'react';
import { Badge, Tabs, Table, Button, Tooltip, Dialog } from '../../../sail';
import { Icon } from '../../../icons/SailIcons';
import Globe from '../components/Globe';

const PAGE_TABS = [
  { key: 'performance', label: 'Performance' },
  { key: 'checkouts', label: 'Checkouts' },
  { key: 'payment-links', label: 'Payment links' },
  { key: 'payment-methods', label: 'Payment methods' },
  { key: 'logic', label: 'Logic' },
  { key: 'experiments', label: 'Experiments' },
];

const REGIONS = ['Global', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa'];

const FILTER_CHIPS = [
  { label: 'Date range', value: 'Year to date', active: true },
  { label: 'Status', active: false },
  { label: 'Popular in', active: false },
  { label: 'Payment method', active: false },
];

const PAYMENT_METHODS = [
  { id: 'apple-pay', name: 'Apple Pay', icon: '🍎', iconBg: 'bg-black', status: 'Enabled', popularIn: 'All regions', sessions: '31.7K', usageRate: '40%', volume: '$310.5K', enabled: true },
  { id: 'cards', name: 'Cards', icon: '💳', iconBg: 'bg-[#d8dee4]', status: 'Enabled', popularIn: 'All regions', sessions: '31.7K', usageRate: '20%', volume: '$290.3K', enabled: true },
  { id: 'link', name: 'Link', icon: '🔗', iconBg: 'bg-[#00d924]', status: 'Enabled', popularIn: 'All regions', sessions: '31.7K', usageRate: '15%', volume: '$220.1K', enabled: true },
  { id: 'amazon-pay', name: 'Amazon Pay', icon: '📦', iconBg: 'bg-[#333e48]', status: 'Enabled', popularIn: 'All regions', sessions: '22.4K', usageRate: '10%', volume: '$170.9K', enabled: true },
  { id: 'klarna', name: 'Klarna', icon: 'K', iconBg: 'bg-[#ffb3c7]', status: 'Enabled', popularIn: 'All regions', sessions: '9.3K', usageRate: '10%', volume: '$110.3K', enabled: true },
  { id: 'google-pay', name: 'Google Pay', icon: 'G', iconBg: 'bg-[#f5f6f8]', status: 'Enabled', popularIn: 'All regions', sessions: '11.7K', usageRate: '5%', volume: '$90.2K', enabled: true },
  { id: 'grabpay', name: 'GrabPay', icon: 'G', iconBg: 'bg-[#00b14f]', status: 'Disabled', popularIn: 'Singapore', sessions: '31.7K', usageRate: '--', volume: '--', enabled: false, recommended: true },
  { id: 'pix', name: 'Pix', icon: 'P', iconBg: 'bg-[#32bcad]', status: 'Disabled', popularIn: 'Brazil', sessions: '22.3K', usageRate: '--', volume: '--', enabled: false, recommended: true },
];

// Global view: cohort cards for each sub-region
const GLOBAL_COHORTS = [
  { region: 'Europe',       coverage: '5 of 19 enabled', eligible: '23k', conversion: '56%' },
  { region: 'Asia-Pacific', coverage: '6 of 11 enabled', eligible: '17k', conversion: '49%' },
  { region: 'Americas',     coverage: '6 of 11 enabled', eligible: '17k', conversion: '76%' },
  { region: 'Middle East',  coverage: '3 of 8 enabled',  eligible: '8k',  conversion: '38%' },
  { region: 'Africa',       coverage: '2 of 6 enabled',  eligible: '5k',  conversion: '32%' },
];
const VISIBLE_COHORTS = 3;

// Per-region detailed data
const REGION_DATA = {
  'Europe': {
    coverage: '5 of 19 enabled',
    eligible: '23k',
    conversion: '21%',
    customerLocation: [
      { country: 'DE', flag: '🇩🇪', pct: 38, color: 'bg-[#96f]' },
      { country: 'NL', flag: '🇳🇱', pct: 28, color: 'bg-[#0055bc]' },
      { country: 'FR', flag: '🇫🇷', pct: 18, color: 'bg-[#00a1c2]' },
      { country: 'Other', flag: null, pct: 16, color: 'bg-[#ed6804]' },
    ],
    authRate: { yours: 21.0, benchmark: 91.9 },
    topPM: { name: 'Cards', pct: '84%' },
    volume: { amount: '$120.2k', pct: '32%' },
    opportunity: 'iDEAL, Giropay, and Bancontact together cover 78% of online transactions across your three largest European markets.',
  },
  'Americas': {
    coverage: '6 of 11 enabled',
    eligible: '17k',
    conversion: '76%',
    customerLocation: [
      { country: 'US', flag: '🇺🇸', pct: 52, color: 'bg-[#96f]' },
      { country: 'BR', flag: '🇧🇷', pct: 22, color: 'bg-[#0055bc]' },
      { country: 'CA', flag: '🇨🇦', pct: 14, color: 'bg-[#00a1c2]' },
      { country: 'Other', flag: null, pct: 12, color: 'bg-[#ed6804]' },
    ],
    authRate: { yours: 76.0, benchmark: 89.5 },
    topPM: { name: 'Cards', pct: '72%' },
    volume: { amount: '$185.4k', pct: '48%' },
    opportunity: 'Pix and OXXO together cover 65% of online transactions in Brazil and Mexico.',
  },
  'Asia-Pacific': {
    coverage: '6 of 11 enabled',
    eligible: '17k',
    conversion: '49%',
    customerLocation: [
      { country: 'JP', flag: '🇯🇵', pct: 32, color: 'bg-[#96f]' },
      { country: 'AU', flag: '🇦🇺', pct: 24, color: 'bg-[#0055bc]' },
      { country: 'SG', flag: '🇸🇬', pct: 18, color: 'bg-[#00a1c2]' },
      { country: 'Other', flag: null, pct: 26, color: 'bg-[#ed6804]' },
    ],
    authRate: { yours: 49.0, benchmark: 85.2 },
    topPM: { name: 'Cards', pct: '58%' },
    volume: { amount: '$94.7k', pct: '24%' },
    opportunity: 'GrabPay, PayNow, and Konbini together cover 62% of online transactions across Singapore and Japan.',
  },
  'Middle East': {
    coverage: '3 of 8 enabled',
    eligible: '8k',
    conversion: '38%',
    customerLocation: [
      { country: 'AE', flag: '🇦🇪', pct: 42, color: 'bg-[#96f]' },
      { country: 'SA', flag: '🇸🇦', pct: 30, color: 'bg-[#0055bc]' },
      { country: 'IL', flag: '🇮🇱', pct: 16, color: 'bg-[#00a1c2]' },
      { country: 'Other', flag: null, pct: 12, color: 'bg-[#ed6804]' },
    ],
    authRate: { yours: 38.0, benchmark: 82.1 },
    topPM: { name: 'Cards', pct: '91%' },
    volume: { amount: '$42.1k', pct: '11%' },
    opportunity: 'Mada and KNET together cover 70% of domestic transactions in Saudi Arabia and Kuwait.',
  },
  'Africa': {
    coverage: '2 of 6 enabled',
    eligible: '5k',
    conversion: '32%',
    customerLocation: [
      { country: 'ZA', flag: '🇿🇦', pct: 48, color: 'bg-[#96f]' },
      { country: 'NG', flag: '🇳🇬', pct: 25, color: 'bg-[#0055bc]' },
      { country: 'KE', flag: '🇰🇪', pct: 15, color: 'bg-[#00a1c2]' },
      { country: 'Other', flag: null, pct: 12, color: 'bg-[#ed6804]' },
    ],
    authRate: { yours: 32.0, benchmark: 78.4 },
    topPM: { name: 'Cards', pct: '88%' },
    volume: { amount: '$28.3k', pct: '7%' },
    opportunity: 'M-Pesa and SnapScan together cover 55% of mobile payments in Kenya and South Africa.',
  },
};

const REGION_LPMS = {
  'Europe': [
    { name: 'SEPA Direct Debit', icon: 'SD', iconBg: 'bg-[#2b6ead]', tier: 'highest', tags: ['Bank debit', 'Recurring'], requiresSetup: true, recurring: true, disputes: true, refunds: true, price: '€0.35', coverage: 'Eurozone', sessions: '15.6K' },
    { name: 'iDEAL', icon: 'iD', iconBg: 'bg-[#cc0066]', tier: 'highest', tags: ['Real-time'], requiresSetup: false, recurring: true, disputes: false, refunds: true, price: '€0.29', coverage: 'Netherlands', sessions: '12.4K' },
    { name: 'Giropay', icon: 'G', iconBg: 'bg-[#003a7d]', tier: 'quick-win', tags: ['Bank redirect'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: '€0.29', coverage: 'Germany', sessions: '9.7K' },
    { name: 'Bancontact', icon: 'B', iconBg: 'bg-[#005498]', tier: 'quick-win', tags: ['Bank redirect'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: '€0.29', coverage: 'Belgium', sessions: '8.1K' },
    { name: 'Klarna Pay Later', icon: 'K', iconBg: 'bg-[#ffb3c7]', tier: 'incremental', tags: ['BNPL'], requiresSetup: true, recurring: false, disputes: true, refunds: true, price: '3.29% + €0.29', coverage: 'EU-wide', sessions: '6.3K' },
    { name: 'Przelewy24', icon: 'P24', iconBg: 'bg-[#d40000]', tier: 'incremental', tags: ['Bank redirect'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: '€0.29', coverage: 'Poland', sessions: '3.2K' },
    { name: 'EPS', icon: 'e', iconBg: 'bg-[#c8036f]', tier: 'incremental', tags: ['Bank redirect'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: '€0.29', coverage: 'Austria', sessions: '2.8K' },
  ],
  'Americas': [
    { name: 'Pix', icon: 'P', iconBg: 'bg-[#32bcad]', tier: 'highest', tags: ['Real-time'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: 'R$0.50', coverage: 'Brazil', sessions: '10.2K' },
    { name: 'ACH Direct Debit', icon: 'AC', iconBg: 'bg-[#1a5276]', tier: 'highest', tags: ['Bank debit', 'Recurring'], requiresSetup: true, recurring: true, disputes: true, refunds: true, price: '$0.80', coverage: 'United States', sessions: '8.9K' },
    { name: 'OXXO', icon: 'Ox', iconBg: 'bg-[#d7263d]', tier: 'quick-win', tags: ['Voucher'], requiresSetup: false, recurring: false, disputes: false, refunds: false, price: 'MX$10', coverage: 'Mexico', sessions: '5.8K' },
    { name: 'Boleto', icon: 'Bo', iconBg: 'bg-[#2d3142]', tier: 'incremental', tags: ['Voucher'], requiresSetup: true, recurring: false, disputes: false, refunds: true, price: 'R$3.50', coverage: 'Brazil', sessions: '4.1K' },
  ],
  'Asia-Pacific': [
    { name: 'Alipay', icon: 'A', iconBg: 'bg-[#1677ff]', tier: 'highest', tags: ['Digital wallet'], requiresSetup: true, recurring: false, disputes: true, refunds: true, price: '2.2% + ¥0.30', coverage: 'China', sessions: '7.2K' },
    { name: 'Konbini', icon: 'Ko', iconBg: 'bg-[#ff6600]', tier: 'highest', tags: ['Voucher'], requiresSetup: false, recurring: false, disputes: false, refunds: false, price: '¥120', coverage: 'Japan', sessions: '6.8K' },
    { name: 'PayPay', icon: 'PP', iconBg: 'bg-[#ff0033]', tier: 'quick-win', tags: ['Digital wallet'], requiresSetup: true, recurring: false, disputes: false, refunds: true, price: '¥100', coverage: 'Japan', sessions: '5.4K' },
    { name: 'GrabPay', icon: 'G', iconBg: 'bg-[#00b14f]', tier: 'quick-win', tags: ['Mobile wallet'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: 'SGD 0.30', coverage: 'Singapore', sessions: '4.5K' },
    { name: 'PayNow', icon: 'PN', iconBg: 'bg-[#7b2d8e]', tier: 'incremental', tags: ['Real-time'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: 'SGD 0.30', coverage: 'Singapore', sessions: '3.1K' },
  ],
  'Middle East': [
    { name: 'Mada', icon: 'M', iconBg: 'bg-[#004d40]', tier: 'highest', tags: ['Debit network'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: 'SAR 1.00', coverage: 'Saudi Arabia', sessions: '6.2K' },
    { name: 'KNET', icon: 'KN', iconBg: 'bg-[#003366]', tier: 'quick-win', tags: ['Debit network'], requiresSetup: false, recurring: false, disputes: false, refunds: true, price: 'KWD 0.05', coverage: 'Kuwait', sessions: '2.4K' },
    { name: 'Fawry', icon: 'F', iconBg: 'bg-[#f9a825]', tier: 'incremental', tags: ['Voucher'], requiresSetup: true, recurring: false, disputes: false, refunds: false, price: 'EGP 3.00', coverage: 'Egypt', sessions: '1.8K' },
  ],
  'Africa': [
    { name: 'M-Pesa', icon: 'MP', iconBg: 'bg-[#4caf50]', tier: 'highest', tags: ['Mobile wallet'], requiresSetup: false, recurring: false, disputes: false, refunds: false, price: 'KES 15', coverage: 'Kenya', sessions: '3.6K' },
    { name: 'SnapScan', icon: 'SS', iconBg: 'bg-[#00aeef]', tier: 'quick-win', tags: ['Digital wallet'], requiresSetup: true, recurring: false, disputes: false, refunds: true, price: 'ZAR 2.50', coverage: 'South Africa', sessions: '2.9K' },
    { name: 'Ozow', icon: 'Oz', iconBg: 'bg-[#1b5e20]', tier: 'incremental', tags: ['Real-time'], requiresSetup: true, recurring: false, disputes: false, refunds: true, price: 'ZAR 3.00', coverage: 'South Africa', sessions: '2.1K' },
  ],
};

const BUCKET_CONFIG = {
  instant: { label: 'Top conversion opportunities',   description: 'Largest coverage gaps — enable instantly with no review needed', badgeVariant: 'success', badgeText: 'Instant enablement', actionLabel: 'Enable all' },
  setup:   { label: 'More conversion opportunities',  description: 'Expand into additional markets with a quick setup process',     badgeVariant: 'warning', badgeText: 'Set up required',    actionLabel: 'Start set up' },
};
const BUCKETS = ['instant', 'setup'];

const METRIC_TOOLTIPS = {
  coverage: 'The number of locally relevant payment methods enabled on your checkout, out of the total available for your customers\' markets.',
  eligible: 'Customers who reached checkout in a market where a local payment method is available but not yet enabled.',
  conversion: 'The percentage of checkout sessions in this region that resulted in a completed payment.',
};

// Country metadata for globe click tooltip (ISO 3166-1 numeric → display data)
const COUNTRY_INFO = {
  276: { name: 'Germany', flag: '🇩🇪', region: 'Europe', volume: '$45.2k', volumeChange: '+12%', share: '38%', shareChange: '+2%', coverage: '5 of 7 enabled' },
  528: { name: 'Netherlands', flag: '🇳🇱', region: 'Europe', volume: '$33.6k', volumeChange: '+8%', share: '28%', shareChange: '-1%', coverage: '4 of 7 enabled' },
  250: { name: 'France', flag: '🇫🇷', region: 'Europe', volume: '$21.5k', volumeChange: '+5%', share: '18%', shareChange: '+1%', coverage: '3 of 7 enabled' },
  826: { name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', volume: '$18.9k', volumeChange: '+3%', share: '16%', shareChange: '-2%', coverage: '4 of 7 enabled' },
  724: { name: 'Spain', flag: '🇪🇸', region: 'Europe', volume: '$12.4k', volumeChange: '+6%', share: '10%', shareChange: '+1%', coverage: '4 of 7 enabled' },
  380: { name: 'Italy', flag: '🇮🇹', region: 'Europe', volume: '$10.1k', volumeChange: '+4%', share: '8%', shareChange: '0%', coverage: '3 of 7 enabled' },
  56:  { name: 'Belgium', flag: '🇧🇪', region: 'Europe', volume: '$8.7k', volumeChange: '+2%', share: '7%', shareChange: '-1%', coverage: '3 of 7 enabled' },
  40:  { name: 'Austria', flag: '🇦🇹', region: 'Europe', volume: '$7.2k', volumeChange: '+9%', share: '6%', shareChange: '+1%', coverage: '2 of 7 enabled' },
  756: { name: 'Switzerland', flag: '🇨🇭', region: 'Europe', volume: '$6.8k', volumeChange: '+7%', share: '6%', shareChange: '0%', coverage: '3 of 7 enabled' },
  616: { name: 'Poland', flag: '🇵🇱', region: 'Europe', volume: '$5.4k', volumeChange: '+15%', share: '5%', shareChange: '+2%', coverage: '2 of 7 enabled' },
  752: { name: 'Sweden', flag: '🇸🇪', region: 'Europe', volume: '$4.9k', volumeChange: '+3%', share: '4%', shareChange: '0%', coverage: '3 of 7 enabled' },
  578: { name: 'Norway', flag: '🇳🇴', region: 'Europe', volume: '$4.1k', volumeChange: '+5%', share: '3%', shareChange: '+1%', coverage: '2 of 7 enabled' },
  208: { name: 'Denmark', flag: '🇩🇰', region: 'Europe', volume: '$3.8k', volumeChange: '+4%', share: '3%', shareChange: '0%', coverage: '2 of 7 enabled' },
  246: { name: 'Finland', flag: '🇫🇮', region: 'Europe', volume: '$3.2k', volumeChange: '+6%', share: '3%', shareChange: '+1%', coverage: '2 of 7 enabled' },
  372: { name: 'Ireland', flag: '🇮🇪', region: 'Europe', volume: '$4.5k', volumeChange: '+8%', share: '4%', shareChange: '+1%', coverage: '2 of 7 enabled' },
  620: { name: 'Portugal', flag: '🇵🇹', region: 'Europe', volume: '$2.9k', volumeChange: '+11%', share: '2%', shareChange: '+1%', coverage: '2 of 7 enabled' },
  203: { name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', volume: '$2.4k', volumeChange: '+7%', share: '2%', shareChange: '0%', coverage: '1 of 7 enabled' },
  840: { name: 'United States', flag: '🇺🇸', region: 'Americas', volume: '$96.4k', volumeChange: '+10%', share: '52%', shareChange: '+3%', coverage: '6 of 8 enabled' },
  124: { name: 'Canada', flag: '🇨🇦', region: 'Americas', volume: '$25.9k', volumeChange: '+6%', share: '14%', shareChange: '-1%', coverage: '4 of 8 enabled' },
  76:  { name: 'Brazil', flag: '🇧🇷', region: 'Americas', volume: '$40.8k', volumeChange: '+18%', share: '22%', shareChange: '+4%', coverage: '3 of 8 enabled' },
  484: { name: 'Mexico', flag: '🇲🇽', region: 'Americas', volume: '$12.2k', volumeChange: '+14%', share: '7%', shareChange: '+2%', coverage: '2 of 8 enabled' },
  32:  { name: 'Argentina', flag: '🇦🇷', region: 'Americas', volume: '$5.6k', volumeChange: '+9%', share: '3%', shareChange: '+1%', coverage: '1 of 8 enabled' },
  152: { name: 'Chile', flag: '🇨🇱', region: 'Americas', volume: '$3.1k', volumeChange: '+7%', share: '2%', shareChange: '0%', coverage: '1 of 8 enabled' },
  170: { name: 'Colombia', flag: '🇨🇴', region: 'Americas', volume: '$2.4k', volumeChange: '+12%', share: '1%', shareChange: '+1%', coverage: '1 of 8 enabled' },
  392: { name: 'Japan', flag: '🇯🇵', region: 'Asia-Pacific', volume: '$30.3k', volumeChange: '+8%', share: '32%', shareChange: '+2%', coverage: '5 of 9 enabled' },
  156: { name: 'China', flag: '🇨🇳', region: 'Asia-Pacific', volume: '$15.7k', volumeChange: '+22%', share: '17%', shareChange: '+5%', coverage: '3 of 9 enabled' },
  410: { name: 'South Korea', flag: '🇰🇷', region: 'Asia-Pacific', volume: '$11.2k', volumeChange: '+11%', share: '12%', shareChange: '+1%', coverage: '3 of 9 enabled' },
  36:  { name: 'Australia', flag: '🇦🇺', region: 'Asia-Pacific', volume: '$22.7k', volumeChange: '+5%', share: '24%', shareChange: '-2%', coverage: '4 of 9 enabled' },
  356: { name: 'India', flag: '🇮🇳', region: 'Asia-Pacific', volume: '$8.5k', volumeChange: '+28%', share: '9%', shareChange: '+4%', coverage: '2 of 9 enabled' },
  702: { name: 'Singapore', flag: '🇸🇬', region: 'Asia-Pacific', volume: '$6.8k', volumeChange: '+9%', share: '7%', shareChange: '+1%', coverage: '3 of 9 enabled' },
  360: { name: 'Indonesia', flag: '🇮🇩', region: 'Asia-Pacific', volume: '$2.1k', volumeChange: '+19%', share: '2%', shareChange: '+1%', coverage: '1 of 9 enabled' },
  764: { name: 'Thailand', flag: '🇹🇭', region: 'Asia-Pacific', volume: '$1.8k', volumeChange: '+15%', share: '2%', shareChange: '+1%', coverage: '1 of 9 enabled' },
  458: { name: 'Malaysia', flag: '🇲🇾', region: 'Asia-Pacific', volume: '$2.4k', volumeChange: '+12%', share: '3%', shareChange: '+1%', coverage: '2 of 9 enabled' },
  554: { name: 'New Zealand', flag: '🇳🇿', region: 'Asia-Pacific', volume: '$4.2k', volumeChange: '+4%', share: '4%', shareChange: '0%', coverage: '3 of 9 enabled' },
  784: { name: 'UAE', flag: '🇦🇪', region: 'Middle East', volume: '$17.6k', volumeChange: '+14%', share: '42%', shareChange: '+3%', coverage: '2 of 5 enabled' },
  682: { name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', volume: '$12.6k', volumeChange: '+18%', share: '30%', shareChange: '+4%', coverage: '1 of 5 enabled' },
  376: { name: 'Israel', flag: '🇮🇱', region: 'Middle East', volume: '$6.7k', volumeChange: '+6%', share: '16%', shareChange: '-1%', coverage: '2 of 5 enabled' },
  792: { name: 'Turkey', flag: '🇹🇷', region: 'Middle East', volume: '$3.8k', volumeChange: '+21%', share: '9%', shareChange: '+3%', coverage: '1 of 5 enabled' },
  634: { name: 'Qatar', flag: '🇶🇦', region: 'Middle East', volume: '$1.4k', volumeChange: '+10%', share: '3%', shareChange: '+1%', coverage: '1 of 5 enabled' },
  710: { name: 'South Africa', flag: '🇿🇦', region: 'Africa', volume: '$13.6k', volumeChange: '+9%', share: '48%', shareChange: '+2%', coverage: '2 of 4 enabled' },
  566: { name: 'Nigeria', flag: '🇳🇬', region: 'Africa', volume: '$7.1k', volumeChange: '+24%', share: '25%', shareChange: '+5%', coverage: '1 of 4 enabled' },
  404: { name: 'Kenya', flag: '🇰🇪', region: 'Africa', volume: '$4.2k', volumeChange: '+16%', share: '15%', shareChange: '+3%', coverage: '1 of 4 enabled' },
  818: { name: 'Egypt', flag: '🇪🇬', region: 'Africa', volume: '$2.3k', volumeChange: '+13%', share: '8%', shareChange: '+2%', coverage: '0 of 4 enabled' },
  504: { name: 'Morocco', flag: '🇲🇦', region: 'Africa', volume: '$1.1k', volumeChange: '+11%', share: '4%', shareChange: '+1%', coverage: '0 of 4 enabled' },
};

function PMIcon({ icon, iconBg }) {
  return (
    <div className={`flex items-center justify-center rounded-sm size-5 text-white text-[10px] font-bold shrink-0 ${iconBg}`}>
      {icon}
    </div>
  );
}

function MeterBar({ segments }) {
  return (
    <div className="flex h-2 w-full rounded-sm overflow-hidden gap-px">
      {segments.map((seg, i) => (
        <div key={i} className={`${seg.color} h-full`} style={{ flex: seg.pct }} />
      ))}
    </div>
  );
}

function FilterChip({ label, value, active }) {
  if (active) {
    return (
      <button className="flex items-center h-6 border border-border rounded-full px-2 gap-1.5 cursor-pointer hover:bg-offset transition-colors">
        <Icon name="cancelCircle" size="xxsmall" className="text-subdued" />
        <span className="text-label-small-emphasized text-default">{label}</span>
        <span className="w-px h-3 bg-[#bac8da]" />
        <span className="text-label-small-emphasized text-brand">{value}</span>
        <Icon name="chevronDown" size="xxsmall" className="text-subdued" />
      </button>
    );
  }
  return (
    <button className="flex items-center h-6 border border-dashed border-[#bac8da] rounded-full px-2 gap-1 cursor-pointer hover:bg-offset transition-colors">
      <span className="size-0.5" />
      <Icon name="addCircleFilled" size="xxsmall" className="text-subdued" />
      <span className="text-label-small-emphasized text-subdued pl-0.5">{label}</span>
    </button>
  );
}

function MetricLabel({ label, tooltipKey }) {
  return (
    <p className="text-label-small text-subdued flex items-center gap-0.5">
      {label}
      <Tooltip content={METRIC_TOOLTIPS[tooltipKey]} placement="bottom">
        <Icon name="info" size="xxsmall" className="text-subdued cursor-help" />
      </Tooltip>
    </p>
  );
}

function CountryTooltip({ country, onClose, globeSize }) {
  if (!country) return null;
  // Clamp position so tooltip stays inside the globe container
  const tooltipW = 200;
  const tooltipH = 160;
  const x = Math.min(country.x + 8, globeSize - tooltipW - 4);
  const y = country.y + 8 + tooltipH > globeSize
    ? Math.max(4, country.y - tooltipH - 8)
    : country.y + 8;

  return (
    <>
      <div className="fixed inset-0 z-[9]" onClick={onClose} />
      <div
        className="absolute z-[10] bg-surface border border-border rounded shadow-[0px_2px_5px_0px_rgba(48,49,61,0.08),0px_1px_1px_0px_rgba(0,0,0,0.12)] w-[200px]"
        style={{ top: y, left: x }}
      >
        <div className="px-2 pt-1.5 pb-2 space-y-1.5">
          {/* Header */}
          <div className="flex items-center gap-1.5">
            <span className="text-label-small">{country.flag}</span>
            <span className="text-heading-xsmall text-default">{country.name}</span>
            <span className="text-label-small text-subdued">Feb 1 - Feb 28</span>
          </div>
          <div className="h-px bg-border" />
          {/* Rows */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-label-small text-subdued">Payment volume</span>
              <div className="flex items-center gap-1">
                <span className="text-label-small-emphasized text-default">{country.volume}</span>
                <span className={`text-label-small ${country.volumeChange.startsWith('+') ? 'text-[#217005]' : 'text-[#c0123c]'}`}>{country.volumeChange}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-small text-subdued">Regional share</span>
              <div className="flex items-center gap-1">
                <span className="text-label-small-emphasized text-default">{country.share}</span>
                <span className={`text-label-small ${country.shareChange.startsWith('+') || country.shareChange === '0%' ? 'text-[#217005]' : 'text-[#c0123c]'}`}>{country.shareChange}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-small text-subdued">LPM coverage</span>
              <span className="text-label-small-emphasized text-default">{country.coverage}</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="w-full">See details</Button>
        </div>
      </div>
    </>
  );
}

function GlobalCohortCard({ region, coverage, eligible, conversion, onOptimize }) {
  return (
    <div className="border border-border rounded-md px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-label-medium-emphasized text-default">{region}</p>
        <button className="text-label-small-emphasized text-brand cursor-pointer hover:underline" onClick={() => onOptimize?.(region)}>Optimize</button>
      </div>
      <div className="flex gap-5 items-start">
        <div>
          <MetricLabel label="Coverage" tooltipKey="coverage" />
          <p className="text-heading-small text-default">{coverage}</p>
        </div>
        <div className="w-px h-9 bg-border" />
        <div>
          <MetricLabel label="Eligible customers" tooltipKey="eligible" />
          <p className="text-heading-small text-default">{eligible}</p>
        </div>
        <div className="w-px h-9 bg-border" />
        <div>
          <MetricLabel label="Conversion" tooltipKey="conversion" />
          <p className="text-heading-small text-default">{conversion}</p>
        </div>
      </div>
    </div>
  );
}

function LpmPropertyIcon({ supported }) {
  if (supported) {
    return <Icon name="check" size="xsmall" className="text-[#217005]" />;
  }
  return <span className="text-subdued">—</span>;
}

function OptimizeModal({ region, onClose, enabledLpms, setEnabledLpms }) {
  if (!region) return null;
  const lpms = REGION_LPMS[region] || [];

  const totalSessions = lpms.reduce((sum, l) => {
    const num = parseFloat(l.sessions.replace('K', ''));
    return sum + num;
  }, 0);
  const sessionsStr = `${totalSessions.toFixed(1)}k`;

  const bucketFilter = (bucketKey) =>
    bucketKey === 'instant' ? (l) => !l.requiresSetup : (l) => l.requiresSetup;

  const enableBucket = (bucketKey) => {
    const items = lpms.filter(bucketFilter(bucketKey));
    setEnabledLpms((prev) => {
      const next = new Set(prev);
      items.forEach((l) => next.add(l.name));
      return next;
    });
  };

  const isBucketEnabled = (bucketKey) => {
    const items = lpms.filter(bucketFilter(bucketKey));
    return items.length > 0 && items.every((l) => enabledLpms.has(l.name));
  };

  const colHeaders = (
    <div className="flex items-center pl-2 border-b border-border">
      <div className="w-[164px] py-2">
        <span className="text-label-small-emphasized text-default">Payment method</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-[124px] py-2">
          <span className="text-label-small-emphasized text-default">Popular in</span>
        </div>
        <div className="w-[121px] py-2">
          <span className="text-label-small-emphasized text-default">Recurring payment</span>
        </div>
        <div className="w-[74px] py-2">
          <span className="text-label-small-emphasized text-default">Disputes</span>
        </div>
        <div className="w-[57px] py-2">
          <span className="text-label-small-emphasized text-default">Refunds</span>
        </div>
        <div className="w-[113px] py-2">
          <span className="text-label-small-emphasized text-default">Price</span>
        </div>
      </div>
    </div>
  );

  const lpmRow = (lpm) => (
    <div key={lpm.name} className="flex items-center pl-2 py-3 border-b border-border last:border-b-0 hover:bg-offset transition-colors">
      <div className="w-[164px]">
        <div className="flex items-center gap-2">
          <PMIcon icon={lpm.icon} iconBg={lpm.iconBg} />
          <span className="text-label-medium-emphasized text-default truncate">{lpm.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-[124px]">
          <span className="text-body-small text-default">{lpm.coverage}</span>
        </div>
        <div className="w-[121px] flex justify-center">
          <LpmPropertyIcon supported={lpm.recurring} />
        </div>
        <div className="w-[74px] flex justify-center">
          <LpmPropertyIcon supported={lpm.disputes} />
        </div>
        <div className="w-[57px] flex justify-center">
          <LpmPropertyIcon supported={lpm.refunds} />
        </div>
        <div className="w-[113px]">
          <span className="text-body-small text-default">{lpm.price}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      open={!!region}
      onClose={onClose}
      title={`Optimize for ${region}`}
      subtitle={`Enable recommended local payment methods to boost conversion in ${region}.`}
      size="xlarge"
    >
      <div className="space-y-6">
        {/* Summary banner */}
        <div className="bg-offset rounded-lg px-4 py-3">
          <span className="text-body-small text-default">
            {lpms.length} local payment methods · {sessionsStr} eligible sessions
          </span>
        </div>

        {/* Bucket sections */}
        {BUCKETS.map((bucketKey) => {
          const items = lpms.filter(bucketFilter(bucketKey));
          if (items.length === 0) return null;
          const config = BUCKET_CONFIG[bucketKey];
          const allEnabled = isBucketEnabled(bucketKey);

          return (
            <div key={bucketKey}>
              {/* Section header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-heading-small text-default">{config.label}</span>
                    <Badge variant={config.badgeVariant}>{config.badgeText}</Badge>
                  </div>
                  <p className="text-body-small text-subdued">{config.description}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => enableBucket(bucketKey)}
                  disabled={allEnabled}
                >
                  {allEnabled ? 'Enabled' : config.actionLabel}
                </Button>
              </div>

              {/* Table */}
              <div className="mt-4">
                {colHeaders}
                {items.map((lpm) => lpmRow(lpm))}
              </div>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [activeRegion, setActiveRegion] = useState('Europe');
  const [cohortPage, setCohortPage] = useState(0);
  const [countryTooltip, setCountryTooltip] = useState(null);
  const [focusCountryId, setFocusCountryId] = useState(null);
  const [optimizeModalRegion, setOptimizeModalRegion] = useState(null);
  const [enabledLpms, setEnabledLpms] = useState(new Set());
  const totalPages = Math.ceil(GLOBAL_COHORTS.length / VISIBLE_COHORTS);
  const canScrollLeft = cohortPage > 0;
  const canScrollRight = cohortPage < totalPages - 1;
  const visibleCohorts = GLOBAL_COHORTS.slice(cohortPage * VISIBLE_COHORTS, (cohortPage + 1) * VISIBLE_COHORTS);

  const handleCountryClick = (countryId, { canvasX, canvasY }) => {
    if (!countryId) {
      setCountryTooltip(null);
      setFocusCountryId(null);
      return;
    }
    const info = COUNTRY_INFO[countryId];
    if (!info) {
      setCountryTooltip(null);
      setFocusCountryId(null);
      return;
    }
    setCountryTooltip({ ...info, x: canvasX, y: canvasY });
    setFocusCountryId(countryId);
    if (info.region && info.region !== activeRegion) {
      setActiveRegion(info.region);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      width: 'grow',
      render: (item) => (
        <div className="flex items-center gap-2">
          <PMIcon icon={item.icon} iconBg={item.iconBg} />
          <span className="text-label-medium-emphasized text-default">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.enabled ? 'success' : 'default'}>{item.status}</Badge>
      ),
    },
    {
      key: 'popularIn',
      header: 'Popular in',
      render: (item) => (
        <span className="text-body-small text-default">{item.popularIn}</span>
      ),
    },
    {
      key: 'sessions',
      header: 'Sessions',
      render: (item) => {
        if (item.recommended) {
          return (
            <span className="inline-flex items-center gap-1 bg-[#f7f5fd] border border-[#e0d9fb] rounded-full px-2 py-0.5 text-label-small text-default">
              {item.sessions}
              <span className="size-1 rounded-full bg-[#c3b6fb]" />
            </span>
          );
        }
        return <span className="text-body-small text-default">{item.sessions}</span>;
      },
    },
    {
      key: 'usageRate',
      header: 'Usage rate',
      render: (item) => (
        <span className="text-body-small text-default">{item.usageRate}</span>
      ),
    },
    {
      key: 'volume',
      header: 'Payment volume',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="text-body-small text-default">{item.volume}</span>
          {item.volume !== '--' && (
            <svg width="32" height="20" viewBox="0 0 32 20" className="text-[#96f]">
              <path d="M2 18 C8 14, 14 6, 20 8 C26 10, 28 4, 30 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <button className="text-subdued hover:text-default cursor-pointer p-1 rounded transition-colors hover:bg-offset">
          <Icon name="more" size="small" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-xlarge text-default mb-1">Checkout</h1>
        <Tabs
          tabs={PAGE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Regional Overview */}
      <div className="space-y-4">
        <h2 className="text-heading-large text-default">Regional overview</h2>

        {/* Region pills */}
        <div className="flex gap-3">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => { setActiveRegion(region); setFocusCountryId(null); setCountryTooltip(null); }}
              className={`px-3 py-1 rounded-md text-label-medium-emphasized cursor-pointer transition-colors ${
                activeRegion === region
                  ? 'border border-brand text-brand'
                  : 'border border-border text-default hover:bg-offset'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics + Globe */}
      <div className="border border-border rounded-lg px-6 py-6">
        <div className="flex min-h-[420px]">
          {/* Left: Key Metrics */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {activeRegion === 'Global' ? (
              <>
                <h3 className="text-heading-medium text-default">Key insights</h3>

                {/* Global Cohort Cards */}
                {visibleCohorts.map((cohort) => (
                  <GlobalCohortCard key={cohort.region} {...cohort} onOptimize={setOptimizeModalRegion} />
                ))}

                {/* Pagination arrows */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setCohortPage((p) => Math.max(0, p - 1))}
                    disabled={!canScrollLeft}
                    className={`flex items-center justify-center size-5 rounded border border-border cursor-pointer transition-colors ${
                      canScrollLeft ? 'text-default hover:bg-offset' : 'text-subdued/30 cursor-default'
                    }`}
                  >
                    <Icon name="chevronLeft" size="xxsmall" />
                  </button>
                  <button
                    onClick={() => setCohortPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={!canScrollRight}
                    className={`flex items-center justify-center size-5 rounded border border-border cursor-pointer transition-colors ${
                      canScrollRight ? 'text-default hover:bg-offset' : 'text-subdued/30 cursor-default'
                    }`}
                  >
                    <Icon name="chevronRight" size="xxsmall" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Regional View Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-medium text-default">Key metrics</h3>
                  <Button variant="primary" size="sm" onClick={() => setOptimizeModalRegion(activeRegion)}>Optimize for {activeRegion}</Button>
                </div>

                {/* Region Cohort Card */}
                <div className="border border-border rounded-md px-4 py-3">
                  <p className="text-label-medium-emphasized text-default mb-2">{activeRegion}</p>
                  <div className="flex gap-5 items-start">
                    <div>
                      <MetricLabel label="Coverage" tooltipKey="coverage" />
                      <p className="text-heading-small text-default">{REGION_DATA[activeRegion]?.coverage}</p>
                    </div>
                    <div className="w-px h-9 bg-border" />
                    <div>
                      <MetricLabel label="Eligible customers" tooltipKey="eligible" />
                      <p className="text-heading-small text-default">{REGION_DATA[activeRegion]?.eligible}</p>
                    </div>
                    <div className="w-px h-9 bg-border" />
                    <div>
                      <MetricLabel label="Conversion" tooltipKey="conversion" />
                      <p className="text-heading-small text-default">{REGION_DATA[activeRegion]?.conversion}</p>
                    </div>
                  </div>
                </div>

                {/* Charts Card */}
                <div className="border border-border rounded-md px-4 py-3 space-y-5">
                  {/* Customer location */}
                  <div className="space-y-1">
                    <p className="text-label-small text-subdued">Customer location</p>
                    <MeterBar segments={REGION_DATA[activeRegion]?.customerLocation || []} />
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {(REGION_DATA[activeRegion]?.customerLocation || []).map((loc) => (
                        <div key={loc.country} className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className={`size-3 rounded-sm ${loc.color}`} />
                            {loc.flag && <span className="text-label-small">{loc.flag}</span>}
                            <span className="text-label-small text-subdued">{loc.country}</span>
                          </div>
                          <span className="text-label-small-emphasized text-default">{loc.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Authorization rate */}
                  <div className="space-y-1">
                    <p className="text-label-small text-subdued">Authorization rate</p>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 bg-offset rounded-sm overflow-hidden">
                          <div className="h-full bg-[#96f] rounded-sm" style={{ width: `${REGION_DATA[activeRegion]?.authRate.yours}%` }} />
                        </div>
                        <span className="text-label-small text-default w-10 text-right">{REGION_DATA[activeRegion]?.authRate.yours.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 bg-offset rounded-sm overflow-hidden">
                          <div className="h-full bg-[#0055bc] rounded-sm" style={{ width: `${REGION_DATA[activeRegion]?.authRate.benchmark}%` }} />
                        </div>
                        <span className="text-label-small text-default w-10 text-right">{REGION_DATA[activeRegion]?.authRate.benchmark.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="size-3 rounded-sm bg-[#96f]" />
                        <span className="text-label-small text-subdued">Your rate</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="size-3 rounded-sm bg-[#0055bc]" />
                        <span className="text-label-small text-subdued">Benchmark</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom stats */}
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-label-small text-subdued">Top payment method</p>
                      <div className="flex items-end gap-2">
                        <span className="text-label-medium-emphasized text-default">{REGION_DATA[activeRegion]?.topPM.name}</span>
                        <span className="text-label-small text-subdued">{REGION_DATA[activeRegion]?.topPM.pct} of volume</span>
                      </div>
                    </div>
                    <div className="w-px h-9 bg-border" />
                    <div>
                      <p className="text-label-small text-subdued">Monthly payment volume</p>
                      <div className="flex items-end gap-2">
                        <span className="text-label-medium-emphasized text-default">{REGION_DATA[activeRegion]?.volume.amount}</span>
                        <span className="text-label-small text-subdued">{REGION_DATA[activeRegion]?.volume.pct} of total volume</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opportunity banner */}
                <div className="flex items-center gap-1 bg-[#f7f5fd] border border-border rounded-lg px-3 py-2">
                  <div className="flex-1">
                    <p className="text-label-small-emphasized text-default">Relevant LPMs not enabled</p>
                    <p className="text-label-small text-subdued">
                      {REGION_DATA[activeRegion]?.opportunity}
                    </p>
                  </div>
                  <span className="size-1 rounded-full bg-[#c3b6fb] shrink-0" />
                </div>
              </>
            )}
          </div>

          {/* Right: Interactive Globe */}
          <div className="hidden lg:flex items-center justify-center ml-12 shrink-0">
            <div className="relative rounded-full" style={{ filter: 'drop-shadow(0 0 24px rgba(147, 120, 255, 0.25)) drop-shadow(0 0 60px rgba(147, 120, 255, 0.1))' }}>
              <Globe size={384} activeRegion={activeRegion} focusCountryId={focusCountryId} onCountryClick={handleCountryClick} />
              <CountryTooltip
                country={countryTooltip}
                onClose={() => { setCountryTooltip(null); setFocusCountryId(null); }}
                globeSize={384}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="space-y-4">
        <h2 className="text-heading-large text-default">Payment methods</h2>

        {/* Filter chips + action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {FILTER_CHIPS.map((chip) => (
              <FilterChip key={chip.label} label={chip.label} value={chip.value} active={chip.active} />
            ))}
          </div>
          <Button variant="secondary" size="sm">
            <span className="flex items-center gap-1.5">
              <Icon name="barChart" size="xsmall" />
              Open report
            </span>
          </Button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={PAYMENT_METHODS}
          rowKey="id"
        />
      </div>

      {/* Optimize Modal */}
      <OptimizeModal
        region={optimizeModalRegion}
        onClose={() => setOptimizeModalRegion(null)}
        enabledLpms={enabledLpms}
        setEnabledLpms={setEnabledLpms}
      />
    </div>
  );
}

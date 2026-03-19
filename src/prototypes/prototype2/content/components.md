---
title: Component showcase
subtitle: A reference of all available Markdoc components and formatting options.
breadcrumbs:
  - label: Home
---

This page demonstrates every docs component available in the stripe-docs template.

## Headings {% #headings %}

Headings use the `{% #anchor %}` syntax to create linkable anchors. The table of contents on the right is auto-generated from all `##` and `###` headings on the page.

### Third-level heading {% #third-level %}

Headings up to level 3 appear in the table of contents.

## Inline formatting {% #inline-formatting %}

Standard markdown formatting works as expected:

- **Bold text** for emphasis
- *Italic text* for secondary emphasis
- `inline code` for code references
- [Standard links](#) for navigation

## Callouts {% #callouts %}

Use callouts to highlight important information. The `type` attribute controls the color and label. An optional `title` overrides the default label.

{% callout %}
This is a default note callout. Use it for general information and tips.
{% /callout %}

{% callout type="caution" %}
This is a caution callout. Use it when users should proceed carefully.
{% /callout %}

{% callout type="warning" %}
This is a warning callout. Use it for critical information that could cause issues.
{% /callout %}

{% callout type="private-preview" %}
This feature is in private preview. Contact us for early access.
{% /callout %}


## Links {% #links %}

The `{% link %}` tag renders styled documentation links: {% link %}View the full API reference{% /link %}

Standard markdown links also work: [Go to the dashboard](#).

## Code blocks {% #code-blocks %}

Fenced code blocks render with syntax highlighting:

```bash
# Install dependencies
npm install stripe
```

```javascript
const stripe = require('stripe')('sk_test_...');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  payment_method_types: ['card'],
});

console.log(paymentIntent.client_secret);
```

```json
{
  "id": "pi_1234567890",
  "object": "payment_intent",
  "amount": 2000,
  "currency": "usd",
  "status": "requires_payment_method"
}
```

## Lists {% #lists %}

### Unordered lists

- First item in the list
- Second item with **bold text** and `inline code`
- Third item with a [link](#)
- Fourth item with a [link](#)

### Ordered lists

1. Create a Stripe account and get your API keys
2. Install the Stripe SDK in your project
3. Configure your server-side integration
4. Test using Stripe's test mode credentials
5. Go live by switching to production keys

## Combined usage {% #combined-usage %}

Components can be composed together naturally. For example, a typical getting started section might look like this:

{% callout %}
Before you begin, make sure you have a Stripe account and your API keys ready.
{% /callout %}

1. Install the {% link %}Stripe Node.js library{% /link %}
2. Configure your API key
3. Create your first payment

```bash
npm install stripe
```

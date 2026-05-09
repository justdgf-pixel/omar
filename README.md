# DigiSouk DZ starter

An Algeria-focused starter for selling digital products through:

- a web storefront built with Next.js
- a mobile app starter built with Expo
- launch notes tailored to local payments and go-to-market realities

## What is included

### Web app

Located in `apps/web`.

It currently includes:

- a landing page with Algeria-specific positioning
- a starter catalog for ebooks, templates, and courses
- a checkout preview that references local payment rails
- launch guidance for the next backend and payment integration steps

### Mobile app

Located in `apps/mobile`.

It currently includes:

- a branded mobile home screen
- featured products and local payment messaging
- a clear structure for evolving into a real buyer app

## Quick start

### Website

```bash
npm run dev:web
```

### Mobile app

```bash
npm run start:mobile
```

### Verification

```bash
npm run verify
```

## Algeria-specific notes

This starter is designed around common local e-commerce expectations:

- CIB and Edahabia should be treated as core online payment options
- BaridiMob and WhatsApp support flows can help reduce trust friction
- digital delivery must be immediate and explicit after confirmed payment
- merchant registration, invoices, tax treatment, and gateway approval should
  be validated before real launch

For a more detailed checklist, see
[`docs/algeria-launch-checklist.md`](docs/algeria-launch-checklist.md).

## Suggested next engineering steps

1. Add authentication for buyers and sellers.
2. Create a real products database and admin dashboard.
3. Add order records, webhook handling, and secure download tokens.
4. Integrate a local payment gateway after business approval.
5. Add Arabic/French localization, analytics, and seller onboarding.

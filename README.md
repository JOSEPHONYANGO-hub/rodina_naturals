# Rodina Naturals

Production-ready e-commerce storefront for Rodina Naturals, built with Next.js 14, Tailwind CSS, PostgreSQL, Prisma, NextAuth, Cloudinary, Stripe, and M-Pesa Daraja.

## Local Setup

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Default seeded admin:

```text
Email: admin@rodinanaturals.co.ke
Password: ChangeMe123!
```

Change this immediately after first deployment.

## Environment

All secrets live in `.env`. Do not commit real keys.

Required production variables:

```text
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_PUBLIC_APP_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_PASSKEY
MPESA_SHORTCODE
MPESA_CALLBACK_URL
MPESA_ENV
```

## Coolify Deployment

1. Push this repository to GitHub.
2. In Coolify, create a new project and add a GitHub application from this repo.
3. Choose Docker Compose deployment.
4. Set the app domain to the `web` service on port `3000`.
5. Add all environment variables from `.env.example`.
6. Deploy.

The Docker startup command runs:

```bash
npx prisma migrate deploy && npm run start
```

This applies Prisma migrations automatically before the application starts.

## Payment Notes

- Stripe uses Checkout Sessions and a webhook at `/api/payments/stripe/webhook`.
- M-Pesa uses STK Push at `/api/payments/mpesa` and callbacks at `/api/payments/mpesa/callback`.
- Set `MPESA_CALLBACK_URL` to your public Coolify domain callback URL.

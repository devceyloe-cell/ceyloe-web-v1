# Production deployment (Vercel)

## Live project

- **Vercel project:** `thilankacs-projects/ceyloe-web`
- **GitHub:** https://github.com/Thilankac/ceyloe-web
- **Region:** Singapore (`sin1` in `vercel.json`)
- **Production URL:** https://ceyloe-web.vercel.app

### Deploy to a different Vercel team (e.g. devceyloe)

The CLI only sees teams for the logged-in user. To deploy under another account/team:

1. `npx vercel login` — sign in with that account (complete the device link in the browser).
2. `npx vercel teams ls` — note the team **slug**.
3. `npx vercel link --yes --project <project-name> --scope <team-slug>`
4. `node scripts/sync-vercel-env.mjs .env.local` — push env vars (edit `.env.local` first, e.g. `MONGODB_URI` from Atlas integration).
5. `npx vercel deploy --prod --yes --no-wait` — then check the deployment in the Vercel dashboard.

If new deployments stay **BLOCKED** or **UNKNOWN**, open the deployment in the dashboard (billing, spend limits, or Hobby usage caps).

## Environment variables (set in Vercel — never commit `.env.local`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Database name (`ceyloe`) |
| `ADMIN_JWT_SECRET` | Signs admin login sessions |
| `RESEND_API_KEY` | Optional — confirmation emails via Resend (best deliverability) |
| `EMAIL_FROM` | Branded sender, e.g. `Ceyloe <noreply@ceyloe.com>` (domain must be verified in Resend) |
| `EMAIL_REPLY_TO` | Optional reply address |
| `OUTLOOK_CLIENT_ID` / `OUTLOOK_REFRESH_TOKEN` / `OUTLOOK_TENANT` | **Required for Outlook mailboxes** — Graph API (SMTP AUTH is often disabled on Outlook) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Optional fallback only (skipped when Graph is configured for Outlook SMTP hosts) |
| `NEXT_PUBLIC_SITE_URL` | Production site URL (Stripe redirects) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `AFTERPAY_MERCHANT_ID` | Afterpay merchant ID (`1202585`) |
| `AFTERPAY_SECRET_KEY` | Afterpay secret from [Afterpay Hub](https://hub.afterpay.com/) (server only) |
| `NEXT_PUBLIC_AFTERPAY_MERCHANT_ID` | Same merchant ID for on-site messaging |
| `AFTERPAY_SANDBOX` | `true` for sandbox API; omit/false for production |
| `AFTERPAY_COUNTRY_CODE` / `NEXT_PUBLIC_AFTERPAY_COUNTRY_CODE` | `AU` (default), `NZ`, `US`, `CA`, or `GB` |
| `AFTERPAY_CURRENCY` / `NEXT_PUBLIC_AFTERPAY_CURRENCY` | Must match merchant account (`AUD` default) |

### Update env in Vercel CLI

```bash
npx vercel env ls
echo "your-value" | npx vercel env add VARIABLE_NAME production --force
```

### Resend (recommended for confirmation emails)

1. Create an API key: [https://resend.com/api-keys](https://resend.com/api-keys)
2. Add domain `ceyloe.com`: [https://resend.com/domains](https://resend.com/domains)
3. Add the SPF / DKIM DNS records Resend shows, wait until status is **Verified**
4. Set env:

```env
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=Ceyloe <noreply@ceyloe.com>
EMAIL_REPLY_TO=apps.ceyloe@outlook.com
```

Until the domain is verified, Resend only allows `onboarding@resend.dev` as From (fine for testing, weaker for spam).

### After first deploy

Set `NEXT_PUBLIC_SITE_URL` to your real production URL, e.g.:

- `https://ceyloe-web.vercel.app` (Vercel default)
- `https://ceyloe.com` (custom domain)

Then redeploy: `npx vercel --prod --yes`

## MongoDB Atlas (required for Vercel)

1. Atlas → **Network Access** → **Add IP Address**
2. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel can connect
3. Confirm cluster is running

## Admin user (production database)

```bash
npm run admin:create -- admin YourSecurePassword admin@ceyloe.com
```

Uses `MONGODB_URI` from `.env.local` (same Atlas cluster as production).

Email is required for MFA (OTP after password). In production, MFA defaults to **on**; toggle it under **Admin → Settings**.

## Deploy commands

```bash
git push origin master          # triggers Vercel if GitHub connected
npx vercel --prod --yes         # manual production deploy
```

## Stripe

- Test keys work for staging; switch to **live** keys (`sk_live_`, `pk_live_`) for real payments
- Add production URL in Stripe Dashboard → Webhooks / redirect URLs if needed

## Local vs production

- `.env.local` — local development only (gitignored)
- `.env.example` — template without secrets (safe to commit)
- Vercel Dashboard → Settings → Environment Variables — production secrets

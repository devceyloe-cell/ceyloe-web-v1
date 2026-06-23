# Production deployment (Vercel)

## Live project

- **Vercel project:** `thilankacs-projects/ceyloe-web`
- **GitHub:** https://github.com/Thilankac/ceyloe-web
- **Region:** Singapore (`sin1` in `vercel.json`)

## Environment variables (set in Vercel — never commit `.env.local`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Database name (`ceyloe`) |
| `ADMIN_JWT_SECRET` | Signs admin login sessions |
| `NEXT_PUBLIC_SITE_URL` | Production site URL (Stripe redirects) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |

### Update env in Vercel CLI

```bash
npx vercel env ls
echo "your-value" | npx vercel env add VARIABLE_NAME production --force
```

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
npm run admin:create -- admin YourSecurePassword
```

Uses `MONGODB_URI` from `.env.local` (same Atlas cluster as production).

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

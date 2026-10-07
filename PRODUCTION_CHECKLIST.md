# Ceyloe Web — Production checklist (Vercel)

**Project:** `thilankacs-projects/ceyloe-web`  
**Repo:** https://github.com/Thilankac/ceyloe-web  
**Default production URL:** https://ceyloe-web.vercel.app/  
**Deploy region:** Singapore (`sin1` — see `vercel.json`)  
**Related docs:** `DEPLOY.md`, `.env.example`, `UPLOAD_TO_BLOB_GUIDE.md`, `VIDEO_HOSTING_OPTIONS.md`

---

## 1. Vercel hosting fees (estimate for this app)

Official pricing: [Vercel Pricing](https://vercel.com/pricing) · [Plans](https://vercel.com/docs/plans) · [Pro plan](https://vercel.com/docs/plans/pro-plan) · [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)

### 1.1 Platform plan (required decision)

| Plan | Monthly base | Best for Ceyloe |
|------|--------------|-----------------|
| **Hobby** | **$0** | Personal / non-commercial only. Vercel states Hobby is not for commercial use. Can pause if limits exceeded. |
| **Pro** | **$20 / deploying seat** | **Recommended for a live gem store** (checkout, admin, commercial traffic). Includes **$20 usage credit** toward metered usage. |
| **Enterprise** | Custom | Large teams, SLAs, advanced security/compliance. |

**Typical starting budget (small–medium traffic):** **~$20–50 USD/month on Pro**, before payment-processor fees. Scale with traffic and video bandwidth.

### 1.2 What this Next.js app consumes on Vercel

| Resource | What uses it in ceyloe-web | Included on Pro (high level) | Overages (indicative) |
|----------|----------------------------|------------------------------|------------------------|
| **Hosting & CDN** | Pages, static assets, API routes | 1 TB Fast Data Transfer, 10M Edge Requests | From ~$0.15/GB transfer, ~$2/1M edge requests after credit ([pricing](https://vercel.com/pricing)) |
| **Serverless / Fluid compute** | Stripe/Afterpay APIs, admin, MongoDB calls, contact form | Billed on demand; **$20 credit** applies first ([functions pricing](https://vercel.com/docs/functions/usage-and-pricing)) | Region-specific (app runs in `sin1`) |
| **Builds** | `npm run build` on each deploy | Turbo build machines on Pro | Extra build minutes if heavy CI |
| **Vercel Blob** | Product videos (~300–400 MB), admin uploads (`CEYLOE_READ_WRITE_TOKEN`) | **5 GB storage** included on Pro | **~$0.023/GB-month** storage; Blob transfer from **~$0.05/GB** ([Blob docs](https://vercel.com/docs/vercel-blob/usage-and-pricing)) |

**Blob ballpark for ~0.4 GB stored:** storage ≈ **$0.01/month** (within Pro included 5 GB).  
**Main Blob cost driver:** **video views** (data transfer + simple read operations), not storage size. See `VIDEO_HOSTING_OPTIONS.md`.

### 1.3 Not billed by Vercel (but required for production)

| Service | Role | Typical cost |
|---------|------|----------------|
| **MongoDB Atlas** | Catalog + admin users | M0 free tier possible; paid clusters from ~$9+/mo |
| **Stripe** | Card payments | Per-transaction fees (live keys in production) |
| **Afterpay** | BNPL | Merchant fees per Afterpay contract |
| **Shopify** | Storefront / Customer Account OAuth | Shopify plan + app |
| **Sanity** | CMS | Free tier or paid by usage |
| **Resend** (optional) | Transactional email | Free tier + paid by volume |
| **Custom domain** | e.g. `ceyloe.com` | Registrar yearly; SSL free on Vercel |

### 1.4 Cost controls on Vercel

- [ ] Team on **Pro** with **Spend Management** and alerts ([plans doc](https://vercel.com/docs/plans))
- [ ] Review **Usage** dashboard monthly (Fast Data Transfer, functions, Blob)
- [ ] Set a sensible **on-demand budget** (default often $200; adjust to your risk tolerance)
- [ ] Monitor **Blob video bandwidth** if traffic grows

---

## 2. Pre-production checklist

### 2.1 Vercel project & Git

- [ ] Vercel project linked to `Thilankac/ceyloe-web`
- [ ] Production branch set (e.g. `master` / `main`)
- [ ] `vercel.json` reviewed: region `sin1`, build `npm run build`
- [ ] Production deploy succeeds: `npx vercel --prod --yes`

### 2.2 Environment variables (Production in Vercel Dashboard)

Copy from `.env.example`; never commit `.env.local`. Optional sync: `node scripts/sync-vercel-env.mjs` (requires Vercel CLI linked).

**Site**

- [ ] `NEXT_PUBLIC_SITE_URL` = final URL (`https://ceyloe.com` or `https://ceyloe-web.vercel.app`)

**Database & admin**

- [ ] `MONGODB_URI`, `MONGODB_DB_NAME=ceyloe`
- [ ] `ADMIN_JWT_SECRET` — long random secret (unique in production)
- [ ] Atlas **Network Access**: allow Vercel (`0.0.0.0/0` or IP allowlist per `DEPLOY.md`)
- [ ] Production admin created: `npm run admin:create -- <user> <password> <email>`
- [ ] Admin MFA tested in production

**Payments**

- [ ] `STRIPE_SECRET_KEY` = **live** `sk_live_...`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = **live** `pk_live_...`
- [ ] Stripe Dashboard: redirect URLs / webhooks use production domain
- [ ] Afterpay: `AFTERPAY_SECRET_KEY`, merchant IDs, country/currency
- [ ] Afterpay: remove or set `AFTERPAY_SANDBOX=false` for live

**Commerce & content**

- [ ] Shopify: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, Customer Account OAuth vars
- [ ] Sanity: `NEXT_PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN` if needed

**Email**

- [ ] `RESEND_API_KEY` + verified domain (`EMAIL_FROM`, `EMAIL_REPLY_TO`) **or** Outlook Graph / SMTP per `DEPLOY.md`
- [ ] Contact / order confirmation emails tested on production

**Media (Vercel Blob)**

- [ ] `CEYLOE_READ_WRITE_TOKEN` (or `BLOB_READ_WRITE_TOKEN`) on Production
- [ ] Blob store linked (see `UPLOAD_TO_BLOB_GUIDE.md`)
- [ ] Product videos resolve on production (public Blob URLs or sync job)
- [ ] Optional: `NEXT_PUBLIC_HERO_VIDEO_URL`, hero poster URLs

**Verify**

- [ ] `npx vercel env ls` — all required vars present for **Production**
- [ ] Redeploy after env changes

### 2.3 Custom domain & DNS

- [ ] Add domain in Vercel → Project → Settings → Domains
- [ ] DNS: apex + `www` (A/CNAME as Vercel instructs)
- [ ] HTTPS certificate issued (automatic)
- [ ] Update `NEXT_PUBLIC_SITE_URL` to canonical domain; redeploy
- [ ] Shopify / Stripe / Afterpay allowlists updated to new domain

### 2.4 Security & compliance

- [ ] No secrets in git; `.env.local` gitignored
- [ ] Admin routes only over HTTPS
- [ ] Review `SECURITY_AUDIT.md` open items (if any still apply)
- [ ] Cookie / privacy policy pages match live analytics & payment flows

---

## 3. Production smoke test (after deploy)

| Area | Check |
|------|--------|
| Home | Loads, hero media, navigation |
| Catalog | MongoDB products load; filters/search |
| Product detail | Images, video (Blob or fallback URL) |
| Cart / checkout | Stripe test → then **live** small transaction |
| Afterpay | Messaging + checkout in target country |
| Shopify login | OAuth redirect URLs on production domain |
| Admin | Login, MFA, product/video upload if used |
| Email | Form + order/confirmation delivery |
| SEO | `NEXT_PUBLIC_SITE_URL` correct; no localhost links |

---

## 4. Ongoing operations

- [ ] Monitor Vercel **Deployments** and **Runtime Logs**
- [ ] MongoDB Atlas backups and alerts enabled
- [ ] Rotate `ADMIN_JWT_SECRET` / API keys on compromise (plan downtime)
- [ ] Document who owns Vercel billing seat and domain registrar

---

## 5. Quick reference commands

```bash
# List / set env (see DEPLOY.md)
npx vercel env ls
echo "value" | npx vercel env add VARIABLE_NAME production --force

# Production deploy
npx vercel --prod --yes

# Or push to connected branch
git push origin master
```

---

## 6. Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Technical | | | Deploy + env complete |
| Business | | | Live payments approved |
| Domain/DNS | | | `ceyloe.com` (or other) live |

**Production go-live date:** _______________  
**Canonical URL:** _______________

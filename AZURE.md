# Azure App Service deployment

## Production build

```bash
npm run build:azure
```

This creates a self-contained **`azure-deploy/`** folder and **`ceyloe-azure.zip`**.

## Deploy with publish profile (Zip Deploy)

```bash
npm run build:azure
npm run deploy:azure -- "C:\path\to\ceyloe.PublishSettings"
```

Uses the **Zip Deploy** profile from your `.PublishSettings` file.

After deploy, set **Application settings** in Azure Portal → **ceyloe** → **Configuration** (see table below). The SCM API cannot set app settings with publish-profile credentials alone.

## Deploy to Azure App Service

### 1. Create the App Service

- **Runtime:** Node 20 LTS (Linux recommended)
- **Region:** Southeast Asia (or nearest to users)

### 2. Application settings (Configuration → Environment variables)

| Variable | Required |
|---|---|
| `MONGODB_URI` | Yes |
| `MONGODB_DB_NAME` | Yes |
| `ADMIN_JWT_SECRET` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Yes — e.g. `https://your-app.azurewebsites.net` |
| `STRIPE_SECRET_KEY` | Yes (for checkout) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes (for checkout) |
| `AFTERPAY_MERCHANT_ID` | `1202585` |
| `AFTERPAY_SECRET_KEY` | Yes (for Afterpay) — from https://hub.afterpay.com/ |
| `NEXT_PUBLIC_AFTERPAY_MERCHANT_ID` | `1202585` |
| `AFTERPAY_CURRENCY` / `NEXT_PUBLIC_AFTERPAY_CURRENCY` | Match merchant account (e.g. `AUD`) |
| `WEBSITES_PORT` | `8080` (Linux) |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `false` (deploy pre-built package) |

Allow MongoDB Atlas network access from Azure (`0.0.0.0/0` or Azure outbound IPs).

### 3. Upload the package

Zip the **contents** of `azure-deploy/` (not the parent folder name alone):

```bash
# PowerShell (from repo root)
Compress-Archive -Path azure-deploy\* -DestinationPath ceyloe-azure.zip -Force
```

Deploy via Azure Portal → **Deployment Center** → ZIP deploy, or:

```bash
az webapp deploy --resource-group <rg> --name <app-name> --src-path ceyloe-azure.zip --type zip
```

### 4. Startup command

**Linux:**

```bash
startup.sh
```

Or: `node server.js` (with `WEBSITES_PORT=8080`).

**Windows:** uses included `web.config` + IISNode (Node 20 stack).

### 5. Admin user

```bash
npm run admin:create -- admin YourSecurePassword
```

Uses `MONGODB_URI` from `.env.local` (same Atlas cluster as production).

## Local smoke test

```bash
npm run build:azure
cd azure-deploy
set PORT=8080
node server.js
```

Open http://localhost:8080

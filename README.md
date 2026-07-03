# 🇰🇪 Kenya News Bot v2

A Node.js WhatsApp bot that monitors Kenyan RSS feeds and Twitter/X accounts, then pushes breaking-news alerts and a daily digest straight to your WhatsApp — including a dedicated **Jobs** category.

## What's new in v2
| Feature | v1 | v2 |
|---|---|---|
| Delivery channel | Email | WhatsApp (Meta Cloud API) |
| Polling | Once/day at 7 AM | Every 30 min + 7 AM digest |
| Duplicate prevention | None | `tracker.js` deduplication |
| Interactive commands | No | `/news /jobs /tech /finance …` |
| Twitter/X coverage | No | Via Nitter RSS bridge |
| Job listings | No | ✅ BrighterMonday, MyJobMag, Nation Jobs, NGO Jobs |
| Deployment type | Worker | Web Service (needed for webhook) |

---

## 📰 Covered Topics
| Category | Keywords |
|---|---|
| 🏛️ Politics | Parliament, cabinet, president, budget, Gen Z protests… |
| 💰 Finance | NSE, CBK, M-Pesa, inflation, KRA, shilling… |
| 💻 Technology | Fintech, AI, startups, 5G, cybersecurity… |
| 📈 Investment | IPO, shares, VC, REIT, bonds, Series A/B… |
| 💼 Jobs | Vacancies, hiring, internship, graduate trainee… |

## 📡 News Sources
**RSS:** Nation Africa, The Standard, Citizen Digital, K24, KBC, Nairobi News, Business Daily Africa, The East African, TechCabal, Disrupt Africa, Techish Kenya, IT News Africa, BrighterMonday, MyJobMag, Nation Jobs, NGO Jobs Kenya

**Twitter/X (via Nitter):** @citizentvkenya, @NationAfrica, @StandardKenya, @BDafrica, @TechCabal

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/kenya-news-bot.git
cd kenya-news-bot
npm install
```

### 2. Set Up Meta WhatsApp Cloud API
1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps → Create App → Business**
2. Add the **WhatsApp** product
3. Note your **Phone Number ID** and generate a **permanent System User token**
4. Under *WhatsApp → Configuration*, set the Webhook URL to:
   ```
   https://your-render-url.onrender.com/webhook
   ```
   And set **Verify Token** to any string you choose (same as `WA_VERIFY_TOKEN` in `.env`)

### 3. Configure Environment
```bash
cp .env.example .env
# Fill in WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN, WA_RECIPIENT_PHONE, WA_VERIFY_TOKEN
```

### 4. Test Locally
```bash
RUN_ON_START=true node index.js
```
Check your WhatsApp. If the digest arrives, you're ready to deploy.

### 5. Deploy to Render
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Blueprint**
3. Connect your repo — Render detects `render.yaml` automatically
4. In the Render dashboard → **Environment**, add your two Telegram vars:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
5. Click **Deploy** — no webhook URL needed, the bot uses long-polling

> **Free-tier tip:** Render free web services spin down after 15 min of inactivity. The 30-min cron keeps the process awake naturally. Upgrade to Starter ($7/mo) for zero cold starts.

---

## 🔒 Reliability: Persistent Storage (recommended)

By default the bot keeps two things in memory only:
- **Dedup history** — which articles it's already alerted you about
- **Feed health** — which sources have been failing repeatedly

In-memory means both reset **every time the app redeploys or restarts** —
you can get duplicate alerts, and dead feeds go back to being retried
every 30 minutes instead of staying auto-paused.

**Fix: connect a free Upstash Redis database (5 minutes, no credit card)**

1. Go to [upstash.com](https://upstash.com) → sign up → **Create Database**
2. Choose the **free tier** (10K commands/day is far more than this bot needs)
3. On the database page, copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Add both to your `.env` (or Railway/Fly environment variables)
5. Redeploy — check `/health`, it should now show `"storage": "persistent (Upstash)"`

No code changes needed — the bot detects these variables automatically
and switches from in-memory to persistent storage on startup.

### Feed auto-pause behaviour

Any feed that fails **8 fetch cycles in a row** gets automatically paused
for 24 hours instead of being retried every 30 minutes. This speeds up
every fetch cycle and keeps logs clean. Paused feeds retry automatically
after the 24h window — no manual action needed. Watch for this in logs:
```
⏸  [Kenya Tenders Portal]: paused for 24h after repeated failures
```


Send any of these to your bot:

| Command | Response |
|---|---|
| `/start` or `/news` | Full digest across all categories |
| `/politics` | Politics & governance only |
| `/finance` | Finance & economy only |
| `/tech` | Technology only |
| `/invest` | Investment & markets only |
| `/jobs` | Latest job vacancies |
| `/help` | Show command list |

---

## 🐦 Twitter/X via Nitter
Nitter is an open-source Twitter front-end that exposes public timelines as RSS. No Twitter API key needed.

If a Nitter instance goes down, replace the host in `feeds.js`:
```js
// Find a live instance at: https://github.com/zedeus/nitter/wiki/Instances
{ name: 'Twitter: @NationAfrica', url: 'https://NEW_NITTER_HOST/NationAfrica/rss', ... }
```

---

## 🗂 Project Structure
```
kenya-news-bot/
├── index.js          ← Express server + cron scheduler + command handler
├── feeds.js          ← RSS sources, Nitter feeds & keyword definitions
├── fetcher.js        ← Parallel RSS fetching (last 24 h)
├── filter.js         ← Keyword-based categorisation + deduplication
├── tracker.js        ← In-memory dedup to prevent re-sending articles
├── telegram.js       ← Telegram Bot API sender + long-poll handler
├── .env.example      ← Config template
├── render.yaml       ← Render web-service deployment config
└── package.json
```

## 📦 Dependencies
| Package | Purpose |
|---|---|
| `express` | HTTP server + /health endpoint (keeps Render awake) |
| `axios` | Telegram API HTTP calls |
| `rss-parser` | Parse RSS/Atom feeds |
| `node-cron` | 30-min poll + daily digest schedule |
| `dotenv` | Load environment variables |

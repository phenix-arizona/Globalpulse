# 🌐 GlobalPulse Bot v6

A Telegram + WhatsApp news aggregator covering **8 regions** and **11 topics** — with a strong focus on Africa, Kenya, and global innovation.

## 🗺 Regions
| Command   | Region       |
|-----------|-------------|
| `/kenya`  | 🇰🇪 Kenya    |
| `/africa` | 🌍 Africa    |
| `/usa`    | 🇺🇸 USA      |
| `/europe` | 🇪🇺 Europe   |
| `/china`  | 🇨🇳 China    |
| `/japan`  | 🇯🇵 Japan    |
| `/korea`  | 🇰🇷 South Korea |
| `/world`  | 🌐 All Regions |

## 📂 Topics
| Command        | Topic                      |
|----------------|---------------------------|
| `/politics`    | 🏛️ Politics & Governance  |
| `/tech`        | 💻 Technology              |
| `/innovation`  | 🚀 Innovation & R&D        |
| `/business`    | 💼 Business & Companies    |
| `/agri`        | 🌾 Agriculture & Food      |
| `/edu`         | 🎓 Education               |
| `/startup`     | 🌱 Startups & Funding      |
| `/research`    | 🔬 Research & Science      |
| `/finance`     | 💰 Finance & Economy       |
| `/invest`      | 📈 Investment & Markets    |
| `/jobs`        | 🗂️ Jobs & Careers          |

## ⏰ Scheduled Digests (EAT)
- **7:00 AM** — 🇰🇪 Kenya digest
- **7:30 AM** — 🌍 Africa digest
- **8:00 AM** — 🌐 Global Tech, Innovation & Business
- **9:00 AM (Mon)** — 📊 Weekly Reports & Research
- **Every 30 min** — 🇰🇪 Kenya real-time alerts

## 📡 Feed Sources (100+)
- **Africa**: AllAfrica, The Africa Report, African Business, TechCabal, Disrupt Africa, VC4A, AGRA, and more
- **Kenya**: Nation Africa, Standard Media, Business Daily Africa, FarmBiz, TechCabal, and more
- **USA**: TechCrunch, Wired, MIT Tech Review, Bloomberg, HBR, Forbes, EdSurge, USDA, and more
- **Europe**: FT, Economist, Politico EU, Sifted, EU-Startups, DW, and more
- **China**: SCMP, Caixin Global, China Daily, Global Times, and more
- **Japan**: Japan Times, NHK World, Nikkei Asia, IEEE Spectrum, and more
- **Korea**: Korea Herald, Yonhap, ETNews, Korea Joongang Daily, and more
- **Global**: BBC, Al Jazeera, WEF, McKinsey, Deloitte, Nature, NBER, FAO, UNESCO, CB Insights, and more

## ⚙️ Setup
```bash
cp .env.example .env
# Fill in TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, and optionally WhatsApp keys
npm install
npm start
```

## 🚀 Deploy
- **Render**: use `render.yaml`
- **Railway**: use `railway.json`
- **Fly.io**: use `fly.toml`

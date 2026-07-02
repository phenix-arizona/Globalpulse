// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot v5.0 — Entry Point
//  Fix: Telegram 409 backoff | UA rotation for feeds
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const cron    = require('node-cron');

const { fetchAllFeeds }                  = require('./fetcher');
const { filterArticles }                 = require('./filter');
const { REGIONS }                        = require('./feeds');
const { pollCommands }                   = require('./telegram');
const { verifyWebhook, parseInbound,
        isEnabled: waEnabled }           = require('./whatsapp');
const { broadcastDigest, broadcastAlert,
        sendText }                       = require('./broadcaster');
const tracker                            = require('./tracker');

const app  = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/health', (_req, res) => res.json({
  status: 'ok', time: new Date().toISOString(),
  telegram: !!process.env.TELEGRAM_BOT_TOKEN ? 'enabled' : 'missing',
  whatsapp: waEnabled() ? 'enabled' : 'disabled',
}));

app.get('/webhook',  (req, res) => waEnabled() ? verifyWebhook(req, res) : res.sendStatus(404));
app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  if (!waEnabled()) return;
  const msg = parseInbound(req.body);
  if (msg) await handleCommand(msg.text, null, msg.from);
});

// ── Help text ─────────────────────────────────────────────
const HELP_TEXT =
`🇰🇪 <b>Kenya News Bot — Commands</b>

<b>📍 By Region</b>
/kenya   — 🇰🇪 Kenya
/usa     — 🇺🇸 USA
/china   — 🇨🇳 China
/russia  — 🇷🇺 Russia
/korea   — 🇰🇷 South Korea
/eu      — 🇪🇺 Europe
/world   — 🌍 All regions

<b>📂 By Topic</b>
/politics — 🏛️ Politics
/finance  — 💰 Finance
/tech     — 💻 Technology
/invest   — 📈 Investment
/jobs     — 💼 Jobs
/agri     — 🌾 Agriculture
/edu      — 🎓 Education & Science

/help — Show this menu`;

const REGION_CMDS = {
  '/kenya': 'kenya', '/usa': 'usa', '/china': 'china',
  '/russia': 'russia', '/korea': 'korea', '/eu': 'europe', '/europe': 'europe', '/africa': 'africa', '/japan': 'japan',
};
const TOPIC_CMDS = {
  '/politics': 'politics', '/finance': 'finance', '/tech': 'technology',
  '/invest': 'investment', '/jobs': 'jobs', '/agri': 'agri', '/startup': 'startup', '/tenders': 'tenders', '/edu': 'education',
};

// 10-min article cache
let _cache = null, _cacheTime = 0;
async function getArticles() {
  if (_cache && Date.now() - _cacheTime < 10 * 60 * 1000) return _cache;
  _cache = await fetchAllFeeds();
  _cacheTime = Date.now();
  return _cache;
}

async function handleCommand(text, tgChatId = null, waPhone = null) {
  const cmd = text.toLowerCase().split(/\s+/)[0];
  console.log(`📩 Command: ${cmd}`);

  if (REGION_CMDS[cmd]) {
    const region   = REGION_CMDS[cmd];
    const meta     = REGIONS[region];
    const filtered = filterArticles(await getArticles(), region);
    await broadcastDigest(filtered, tgChatId, waPhone, `${meta.emoji} ${meta.label}`);
    return;
  }

  if (TOPIC_CMDS[cmd]) {
    const cat      = TOPIC_CMDS[cmd];
    const filtered = filterArticles(await getArticles());
    await broadcastDigest({ [cat]: filtered[cat] || [] }, tgChatId, waPhone);
    return;
  }

  switch (cmd) {
    case '/news':
    case '/start':
    case '/world': {
      const filtered = filterArticles(await getArticles());
      await broadcastDigest(filtered, tgChatId, waPhone, '🌍 World');
      break;
    }
    default:
      if (tgChatId) await sendText(HELP_TEXT, tgChatId);
  }
}

// ── Telegram long-poll loop with backoff ──────────────────
let tgOffset = 0;
async function telegramLoop() {
  while (true) {
    const { offset, backoff } = await pollCommands(tgOffset, (chatId, text) =>
      handleCommand(text, chatId, null)
    );
    tgOffset = offset;
    if (backoff > 0) await new Promise(r => setTimeout(r, backoff));
  }
}
// Don't crash on 409 — just keep looping with backoff
telegramLoop().catch(err => console.error('❌ TG loop:', err.message));

// ── 30-min Kenya alerts ───────────────────────────────────
cron.schedule('*/30 * * * *', async () => {
  const ts = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  console.log(`\n⏱  [${ts}] 30-min poll...`);
  try {
    _cache = null;
    const filtered = filterArticles(await getArticles(), 'kenya');
    let count = 0;
    for (const [cat, items] of Object.entries(filtered)) {
      for (const article of tracker.filterNew(items)) {
        await broadcastAlert(article, cat);
        await new Promise(r => setTimeout(r, 600));
        count++;
      }
    }
    console.log(`   ✅ ${count} alerts | tracker: ${tracker.size}`);
  } catch (err) { console.error('❌ Poll failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

// ── 7:00 AM EAT — Kenya digest ────────────────────────────
cron.schedule('0 4 * * *', async () => {
  console.log('\n📰 Daily Kenya digest...');
  try {
    _cache = null;
    const filtered = filterArticles(await getArticles(), 'kenya');
    await broadcastDigest(filtered, null, null, '🇰🇪 Kenya');
    Object.values(filtered).flat().forEach(a => tracker.isNew(a));
  } catch (err) { console.error('❌ Kenya digest failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

// ── 8:00 AM EAT — Global Tech & Finance ──────────────────
cron.schedule('0 5 * * *', async () => {
  console.log('\n🌍 Daily global digest...');
  try {
    const filtered = filterArticles(await getArticles());
    await broadcastDigest(
      { technology: filtered.technology, finance: filtered.finance },
      null, null, '🌍 Global Tech & Finance'
    );
  } catch (err) { console.error('❌ Global digest failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

app.listen(PORT, () => {
  console.log(`\n🇰🇪 GlobalPulse Bot v5.0 on port ${PORT}`);
  console.log(`📱 Telegram: enabled | 💬 WhatsApp: ${waEnabled() ? 'enabled' : 'disabled'}`);
  console.log(`🌍 6 regions | 6 topics | Alerts every 30min | Digests 7AM+8AM EAT\n`);
});

if (process.env.RUN_ON_START === 'true') {
  (async () => {
    const filtered = filterArticles(await getArticles(), 'kenya');
    await broadcastDigest(filtered, null, null, '🇰🇪 Kenya');
  })().catch(console.error);
}

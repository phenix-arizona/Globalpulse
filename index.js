// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot v6.0 — Entry Point
//  Regions  : kenya, africa, usa, europe, china, japan, korea, world
//  Topics   : politics, tech, innovation, business, agri,
//             education, startup, research, finance, invest, jobs
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
`🌐 <b>GlobalPulse Bot v6 — Commands</b>

<b>📍 By Region</b>
/kenya   — 🇰🇪 Kenya
/africa  — 🌍 Africa
/usa     — 🇺🇸 USA
/europe  — 🇪🇺 Europe
/china   — 🇨🇳 China
/japan   — 🇯🇵 Japan
/korea   — 🇰🇷 South Korea
/world   — 🌐 All Regions

<b>📂 By Topic</b>
/politics   — 🏛️ Politics & Governance
/tech       — 💻 Technology
/innovation — 🚀 Innovation & R&D
/business   — 💼 Business & Companies
/agri       — 🌾 Agriculture & Food
/edu        — 🎓 Education
/startup    — 🌱 Startups & Funding
/research   — 🔬 Research & Science
/finance    — 💰 Finance & Economy
/invest     — 📈 Investment & Markets
/jobs       — 🗂️ Jobs & Careers

/help — Show this menu`;

// ── Region & Topic command maps ───────────────────────────
const REGION_CMDS = {
  '/kenya':  'kenya',
  '/africa': 'africa',
  '/usa':    'usa',
  '/europe': 'europe',
  '/china':  'china',
  '/japan':  'japan',
  '/korea':  'korea',
};

const TOPIC_CMDS = {
  '/politics':   'politics',
  '/tech':       'technology',
  '/innovation': 'innovation',
  '/business':   'business',
  '/agri':       'agriculture',
  '/edu':        'education',
  '/startup':    'startup',
  '/research':   'research',
  '/finance':    'finance',
  '/invest':     'investment',
  '/jobs':       'jobs',
};

// ── 10-min article cache ──────────────────────────────────
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
      await broadcastDigest(filtered, tgChatId, waPhone, '🌐 Global');
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

// ── 7:00 AM EAT — Kenya + Africa digest ──────────────────
cron.schedule('0 4 * * *', async () => {
  console.log('\n📰 Daily Kenya digest...');
  try {
    _cache = null;
    const filtered = filterArticles(await getArticles(), 'kenya');
    await broadcastDigest(filtered, null, null, '🇰🇪 Kenya');
    Object.values(filtered).flat().forEach(a => tracker.isNew(a));
  } catch (err) { console.error('❌ Kenya digest failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

// ── 7:30 AM EAT — Africa digest ──────────────────────────
cron.schedule('30 4 * * *', async () => {
  console.log('\n📰 Daily Africa digest...');
  try {
    const filtered = filterArticles(await getArticles(), 'africa');
    await broadcastDigest(filtered, null, null, '🌍 Africa');
  } catch (err) { console.error('❌ Africa digest failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

// ── 8:00 AM EAT — Global Tech, Innovation & Business ─────
cron.schedule('0 5 * * *', async () => {
  console.log('\n🌐 Daily global digest...');
  try {
    const filtered = filterArticles(await getArticles());
    await broadcastDigest(
      {
        technology:  filtered.technology,
        innovation:  filtered.innovation,
        business:    filtered.business,
        startup:     filtered.startup,
        research:    filtered.research,
      },
      null, null, '🌐 Global Tech & Business'
    );
  } catch (err) { console.error('❌ Global digest failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

// ── 9:00 AM EAT — Weekly deep reports (Mon only) ─────────
cron.schedule('0 6 * * 1', async () => {
  console.log('\n📊 Weekly reports digest (Monday)...');
  try {
    const filtered = filterArticles(await getArticles());
    await broadcastDigest(
      {
        research:    filtered.research,
        business:    filtered.business,
        agriculture: filtered.agriculture,
        education:   filtered.education,
      },
      null, null, '📊 Weekly Reports & Research'
    );
  } catch (err) { console.error('❌ Weekly reports failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

app.listen(PORT, () => {
  console.log(`\n🌐 GlobalPulse Bot v6.0 on port ${PORT}`);
  console.log(`📱 Telegram: enabled | 💬 WhatsApp: ${waEnabled() ? 'enabled' : 'disabled'}`);
  console.log(`🗺  8 regions | 11 topics | Alerts every 30min | Digests 7AM/7:30AM/8AM/9AM(Mon) EAT\n`);
});

if (process.env.RUN_ON_START === 'true') {
  (async () => {
    const filtered = filterArticles(await getArticles(), 'kenya');
    await broadcastDigest(filtered, null, null, '🇰🇪 Kenya');
  })().catch(console.error);
}

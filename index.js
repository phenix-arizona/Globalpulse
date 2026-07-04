// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot v5.0 — Entry Point
//  Fix: Telegram 409 backoff | UA rotation for feeds
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const cron    = require('node-cron');

const { fetchAllFeeds }                  = require('./fetcher');
const { filterArticles }                 = require('./filter');
const { REGIONS, KEYWORDS }              = require('./feeds');
const { pollCommands, isChannelEnabled }  = require('./telegram');
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
  telegramChannel: isChannelEnabled() ? 'enabled' : 'not configured',
  whatsapp: waEnabled() ? 'enabled' : 'disabled',
  storage:  tracker.isPersistent() ? 'persistent (Upstash)' : 'in-memory (resets on redeploy)',
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
`🌍 <b>GlobalPulse — Commands</b>

<b>📍 By Region</b>
/kenya   — 🇰🇪 Kenya
/nigeria — 🇳🇬 Nigeria
/ghana   — 🇬🇭 Ghana
/sa      — 🇿🇦 South Africa
/uganda  — 🇺🇬 Uganda
/africa  — 🌍 Africa (all of the above + more)
/usa     — 🇺🇸 USA
/europe  — 🇪🇺 Europe
/china   — 🇨🇳 China
/japan   — 🇯🇵 Japan
/korea   — 🇰🇷 South Korea
/world   — 🌐 All regions

<b>📂 By Topic</b>
/politics — 🏛️ Politics &amp; Governance <i>(Kenya only)</i>
/finance  — 💰 Finance &amp; Economy
/tech     — 💻 Technology
/invest   — 📈 Investment &amp; Markets
/startup  — 🚀 Startups &amp; Innovation
/jobs     — 💼 Jobs &amp; Careers
/agri     — 🌾 Agriculture
/edu      — 🎓 Education &amp; Science
/med      — 🏥 Health &amp; Medicine
/youth    — 🧑‍🎓 Youth Affairs &amp; Development <i>(Kenya only)</i>
/sports   — ⚽ Sports (Kenya, Europe, Asia, USA, World Cup)
/tenders  — 📋 IT Tenders (Kenya)

/invite — Share GlobalPulse with a friend
/help — Show this menu`;

// ── Shareable invite message ──────────────────────────────
// Set TELEGRAM_BOT_USERNAME in .env (without the @) so this
// generates a real, tappable link instead of a placeholder.
// Sanitized below so it still works even if someone pastes the
// full link (t.me/xxx, https://t.me/xxx, @xxx) instead of just the bare name.
function sanitizeBotUsername(raw) {
  if (!raw) return 'YourBotUsername';
  return raw
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^t\.me\//i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '');
}
const BOT_USERNAME = sanitizeBotUsername(process.env.TELEGRAM_BOT_USERNAME);
const TG_LINK = `https://t.me/${BOT_USERNAME}`;

const INVITE_TEXT =
`🌍 <b>Share GlobalPulse</b>

Forward this to anyone who wants global news, jobs, tenders, and more — delivered straight to Telegram or WhatsApp, free.

<b>GlobalPulse</b> — global news, local relevance, real-time.
🌍 7 regions · 📂 11 topics · ⏱️ alerts every 2h + daily digests

👉 <a href="${TG_LINK}">${TG_LINK}</a>
Type <code>/start</code> to begin — no signup required.`;

const REGION_CMDS = {
  '/kenya': 'kenya', '/africa': 'africa', '/usa': 'usa',
  '/europe': 'europe', '/eu': 'europe', '/china': 'china',
  '/japan': 'japan', '/korea': 'korea',
  '/nigeria': 'nigeria', '/ghana': 'ghana',
  '/southafrica': 'southafrica', '/sa': 'southafrica', '/uganda': 'uganda',
};
const TOPIC_CMDS = {
  '/politics': 'politics', '/finance': 'finance', '/tech': 'technology',
  '/invest': 'investment', '/jobs': 'jobs', '/agri': 'agri', '/startup': 'startup', '/tenders': 'tenders', '/edu': 'education', '/med': 'health', '/youth': 'youth', '/sports': 'sports',
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
    case '/invite': {
      if (tgChatId) await sendText(INVITE_TEXT, tgChatId);
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

// ── 2-hourly Kenya + Africa alerts ────────────────────────
cron.schedule('0 */2 * * *', async () => {
  const ts = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  console.log(`\n⏱  [${ts}] 2-hourly poll...`);
  try {
    _cache = null;
    const filtered = filterArticles(await getArticles(), ['kenya', 'africa']);
    let count = 0;
    for (const [cat, items] of Object.entries(filtered)) {
      const newOnes = await tracker.filterNew(items);
      for (const article of newOnes) {
        await broadcastAlert(article, cat);
        await new Promise(r => setTimeout(r, 600));
        count++;
      }
    }
    console.log(`   ✅ ${count} alerts sent`);
  } catch (err) { console.error('❌ Poll failed:', err.message); }
}, { timezone: 'Africa/Nairobi' });

// ── 7:00 AM EAT — Kenya + Africa digest ───────────────────
cron.schedule('0 4 * * *', async () => {
  console.log('\n📰 Daily Kenya + Africa digest...');
  try {
    _cache = null;
    const filtered = filterArticles(await getArticles(), ['kenya', 'africa']);
    await broadcastDigest(filtered, null, null, '🇰🇪🌍 Kenya & Africa');
    await Promise.all(Object.values(filtered).flat().map(a => tracker.isNew(a)));
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
  console.log(`📱 Telegram: enabled${isChannelEnabled() ? ' (+ channel)' : ''} | 💬 WhatsApp: ${waEnabled() ? 'enabled' : 'disabled'}`);
  console.log(`🌍 ${Object.keys(REGION_CMDS).length > 0 ? new Set(Object.values(REGION_CMDS)).size : 0} regions | ${Object.keys(KEYWORDS).length} topics | Alerts every 2h | Digests 7AM+8AM EAT`);
  if (tracker.isPersistent()) {
    console.log(`💾 Storage: Upstash Redis (persistent — survives redeploys)\n`);
  } else {
    console.log(`⚠️  Storage: in-memory only — dedup history and feed health`);
    console.log(`   will reset on every redeploy. Set UPSTASH_REDIS_REST_URL`);
    console.log(`   + UPSTASH_REDIS_REST_TOKEN in .env for persistence.\n`);
  }
});

if (process.env.RUN_ON_START === 'true') {
  (async () => {
    const filtered = filterArticles(await getArticles(), ['kenya', 'africa']);
    await broadcastDigest(filtered, null, null, '🇰🇪🌍 Kenya & Africa');
  })().catch(console.error);
}

// ─────────────────────────────────────────────────────────
//  Kenya News Bot — WhatsApp Notifier  v4
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const axios = require('axios');

const { WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN, WA_RECIPIENT_PHONE } = process.env;
const API_URL = () => `https://graph.facebook.com/v19.0/${WA_PHONE_NUMBER_ID}/messages`;

const SECTION_META = {
  politics:   { emoji: '🏛️', label: 'Politics & Governance' },
  finance:    { emoji: '💰', label: 'Finance & Economy'      },
  technology: { emoji: '💻', label: 'Technology'             },
  investment: { emoji: '📈', label: 'Investment & Markets'   },
  jobs:       { emoji: '💼', label: 'Jobs & Careers'         },
  agri:       { emoji: '🌾', label: 'Agriculture'            },
};

const MAX_PER_SECTION = 5;
const MSG_LIMIT       = 3800;
const EXCERPT_LEN     = 160;

function excerpt(article) {
  const raw = (article.summary || '').replace(/\s+/g, ' ').trim();
  if (!raw) return '';
  return raw.length > EXCERPT_LEN ? raw.slice(0, EXCERPT_LEN).replace(/\s\S*$/, '') + '…' : raw;
}

async function sendText(body, recipientPhone = WA_RECIPIENT_PHONE) {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN || !recipientPhone) {
    console.log('[WA]', body); return;
  }
  try {
    await axios.post(API_URL(),
      { messaging_product: 'whatsapp', to: recipientPhone.replace(/\s+/g, ''),
        type: 'text', text: { preview_url: false, body } },
      { headers: { Authorization: `Bearer ${WA_ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }
    );
    console.log(`✅ [WA] Sent to ${recipientPhone}`);
  } catch (err) {
    console.error(`❌ WA: ${err.response?.data?.error?.message || err.message}`);
  }
}

function formatArticle(i, a) {
  const time = new Date(a.pubDate).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', timeStyle: 'short' });
  const snip = excerpt(a);
  let e = `${i + 1}. *${a.title}*\n   _${a.source} • ${time}_\n`;
  if (snip) e += `   ${snip}\n`;
  e += `   ${a.link}\n\n`;
  return e;
}

async function sendDigest(categorised, recipientPhone = WA_RECIPIENT_PHONE, regionLabel = null) {
  const now   = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' });
  const total = Object.values(categorised).reduce((n, arr) => n + arr.length, 0);
  if (total === 0) { console.log('ℹ  [WA] No articles.'); return; }

  const title = regionLabel ? `🌐 *${regionLabel} News Digest*` : `🇰🇪 *Kenya News Digest*`;
  let current  = `${title}\n${now}\n${total} stories\n${'─'.repeat(30)}\n`;
  const chunks = [];

  for (const [key, meta] of Object.entries(SECTION_META)) {
    const articles = (categorised[key] || []).slice(0, MAX_PER_SECTION);
    if (!articles.length) continue;
    let section = `\n${meta.emoji} *${meta.label}*\n`;
    articles.forEach((a, i) => { section += formatArticle(i, a); });
    if ((current + section).length > MSG_LIMIT) { chunks.push(current); current = section; }
    else current += section;
  }

  if (current.trim()) chunks.push(current);
  for (const msg of chunks) {
    await sendText(msg.trim(), recipientPhone);
    await new Promise(r => setTimeout(r, 500));
  }
}

async function sendAlert(article, category, recipientPhone = WA_RECIPIENT_PHONE) {
  const meta = SECTION_META[category] || { emoji: '📰', label: category };
  const time = new Date(article.pubDate).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', timeStyle: 'short' });
  const snip = excerpt(article);
  await sendText(
    `${meta.emoji} *${meta.label} Alert*\n\n*${article.title}*\n_${article.source} • ${time}_\n` +
    (snip ? `\n${snip}\n` : '') + `\n${article.link}`,
    recipientPhone
  );
}

function verifyWebhook(req, res) {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    console.log('✅ WA webhook verified');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

function parseInbound(body) {
  try {
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || message.type !== 'text') return null;
    return { from: message.from, text: message.text.body.trim() };
  } catch { return null; }
}

function isEnabled() {
  return !!(WA_PHONE_NUMBER_ID && WA_ACCESS_TOKEN && WA_RECIPIENT_PHONE);
}

module.exports = { sendDigest, sendAlert, sendText, verifyWebhook, parseInbound, isEnabled };

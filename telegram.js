// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Telegram Notifier  v5.0
//  409 fix: exponential backoff + conflict detection
//  v5: expanded to 11 categories + 8 regions
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const BASE_URL  = () => `https://api.telegram.org/bot${BOT_TOKEN}`;

const SECTION_META = {
  politics:    { emoji: '🏛️',  label: 'Politics & Governance'   },
  technology:  { emoji: '💻',  label: 'Technology'               },
  innovation:  { emoji: '🚀',  label: 'Innovation & R&D'         },
  business:    { emoji: '💼',  label: 'Business & Companies'     },
  agriculture: { emoji: '🌾',  label: 'Agriculture & Food'       },
  education:   { emoji: '🎓',  label: 'Education'                },
  startup:     { emoji: '🌱',  label: 'Startups & Funding'       },
  research:    { emoji: '🔬',  label: 'Research & Science'       },
  finance:     { emoji: '💰',  label: 'Finance & Economy'        },
  investment:  { emoji: '📈',  label: 'Investment & Markets'     },
  jobs:        { emoji: '🗂️',  label: 'Jobs & Careers'           },
};

const MAX_PER_SECTION = 5;
const MSG_LIMIT       = 3800;
const EXCERPT_LEN     = 180;

function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function excerpt(article) {
  const raw = (article.summary || '').replace(/\s+/g, ' ').trim();
  if (!raw) return '';
  return raw.length > EXCERPT_LEN ? raw.slice(0, EXCERPT_LEN).replace(/\s\S*$/, '') + '…' : raw;
}

async function sendText(text, chatId = CHAT_ID) {
  if (!BOT_TOKEN || !chatId) { console.log('[TG]', text.slice(0, 80)); return; }
  try {
    await axios.post(`${BASE_URL()}/sendMessage`, {
      chat_id: chatId, text, parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error(`❌ TG send: ${err.response?.data?.description || err.message}`);
  }
}

function formatArticle(i, a) {
  const time = new Date(a.pubDate).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', timeStyle: 'short' });
  const snip = excerpt(a);
  let e = `${i + 1}. <a href="${a.link}">${escapeHtml(a.title)}</a>\n`;
  e    += `   <i>${escapeHtml(a.source)} • ${time}</i>\n`;
  if (snip) e += `   ${escapeHtml(snip)}\n`;
  return e + '\n';
}

async function sendDigest(categorised, chatId = CHAT_ID, regionLabel = null) {
  const now   = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' });
  const total = Object.values(categorised).reduce((n, arr) => n + (arr || []).length, 0);
  if (total === 0) { console.log('ℹ  [TG] No articles.'); return; }

  const title  = regionLabel ? `${regionLabel} News Digest` : '🌐 GlobalPulse Digest';
  let current  = `<b>${title}</b>\n${now}\n${total} stories\n${'─'.repeat(30)}\n`;
  const chunks = [];

  for (const [key, meta] of Object.entries(SECTION_META)) {
    const articles = (categorised[key] || []).slice(0, MAX_PER_SECTION);
    if (!articles.length) continue;
    let section = `\n${meta.emoji} <b>${meta.label}</b>\n`;
    articles.forEach((a, i) => { section += formatArticle(i, a); });
    if ((current + section).length > MSG_LIMIT) { chunks.push(current); current = section; }
    else current += section;
  }

  if (current.trim()) chunks.push(current);
  for (const msg of chunks) {
    await sendText(msg.trim(), chatId);
    await new Promise(r => setTimeout(r, 400));
  }
}

async function sendAlert(article, category, chatId = CHAT_ID) {
  if (!BOT_TOKEN || !chatId) return;
  const meta = SECTION_META[category] || { emoji: '📰', label: category };
  const time = new Date(article.pubDate).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', timeStyle: 'short' });
  const snip = excerpt(article);
  const body =
    `${meta.emoji} <b>${meta.label} Alert</b>\n\n` +
    `<a href="${article.link}">${escapeHtml(article.title)}</a>\n` +
    `<i>${escapeHtml(article.source)} • ${time}</i>` +
    (snip ? `\n\n${escapeHtml(snip)}` : '');
  try {
    await axios.post(`${BASE_URL()}/sendMessage`, {
      chat_id: chatId, text: body, parse_mode: 'HTML',
      disable_web_page_preview: false,
    });
  } catch (err) {
    console.error(`❌ TG alert: ${err.response?.data?.description || err.message}`);
  }
}

async function pollCommands(offset = 0, onCommand) {
  try {
    const res = await axios.get(`${BASE_URL()}/getUpdates`, {
      params:  { offset, timeout: 20, allowed_updates: ['message'] },
      timeout: 25000,
    });
    for (const update of res.data.result || []) {
      const msg = update.message;
      if (msg?.text) await onCommand(String(msg.chat.id), msg.text.trim());
      offset = update.update_id + 1;
    }
    return { offset, backoff: 0 };
  } catch (err) {
    const status = err.response?.status;
    const desc   = err.response?.data?.description || err.message;
    if (status === 409) {
      console.warn('⚠  TG 409: duplicate poller detected — backing off');
      return { offset, backoff: 30000 };
    }
    if (!desc.includes('timeout')) console.error(`❌ TG poll: ${desc}`);
    return { offset, backoff: 3000 };
  }
}

module.exports = { sendDigest, sendAlert, sendText, pollCommands };

// ─────────────────────────────────────────────────────────
//  Kenya News Bot — Telegram Notifier  v4.1
//  409 fix: exponential backoff + conflict detection
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const BASE_URL  = () => `https://api.telegram.org/bot${BOT_TOKEN}`;

const SECTION_META = {
  politics:   { emoji: '🏛️', label: 'Politics & Governance' },
  finance:    { emoji: '💰', label: 'Finance & Economy'      },
  technology: { emoji: '💻', label: 'Technology'             },
  investment: { emoji: '📈', label: 'Investment & Markets'   },
  jobs:       { emoji: '💼', label: 'Jobs & Careers'         },
  agri:       { emoji: '🌾', label: 'Agriculture'            },
  education:  { emoji: '🎓', label: 'Education & Science'   },
  health:     { emoji: '🏥', label: 'Health & Medicine'      },
  youth:      { emoji: '🧑‍🎓', label: 'Youth Affairs & Development' },
  sports:     { emoji: '⚽', label: 'Sports'                     },
  startup:    { emoji: '🚀', label: 'Startups & Innovation'  },
  tenders:    { emoji: '📋', label: 'IT Tenders (Kenya)'      },
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
  const time  = new Date(a.pubDate).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', timeStyle: 'short' });
  const snip  = excerpt(a);
  const title = escapeHtml(a.title);
  let e = a.link
    ? `${i + 1}. <a href="${a.link}">${title}</a>\n`
    : `${i + 1}. ${title}\n`;
  e += `   <i>${escapeHtml(a.source)} • ${time}</i>\n`;
  if (snip) e += `   ${escapeHtml(snip)}\n`;
  return e + '\n';
}

/**
 * Send the digest. For each category, the top (most recent) story
 * gets sent as its own message with link preview enabled — this is
 * what lets Telegram show a rich card and, when the source domain
 * supports it, an Instant View button. The remaining stories in
 * that category follow as one compact list message.
 *
 * This can't force Instant View on every link — that's decided by
 * Telegram per-domain (it needs an AMP page or registered IV
 * template on Telegram's side) — but it maximises the chance for
 * the story most likely to matter: the newest one per category.
 */
async function sendDigest(categorised, chatId = CHAT_ID, regionLabel = null) {
  const now   = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' });
  const total = Object.values(categorised).reduce((n, arr) => n + arr.length, 0);
  if (total === 0) { console.log('ℹ  [TG] No articles.'); return; }

  const title = regionLabel ? `${regionLabel} News Digest` : '🇰🇪 Kenya News Digest';
  await sendText(`<b>${title}</b>\n${now}\n${total} stories`, chatId);
  await new Promise(r => setTimeout(r, 400));

  for (const [key, meta] of Object.entries(SECTION_META)) {
    const articles = (categorised[key] || []).slice(0, MAX_PER_SECTION);
    if (!articles.length) continue;

    const [top, ...rest] = articles;

    // Top story — own message, preview enabled (rich card / Instant View if available)
    await sendAlert(top, key, chatId);
    await new Promise(r => setTimeout(r, 400));

    // Remaining stories in this category — one compact list, no preview clutter
    if (rest.length) {
      let list = `${meta.emoji} <b>${meta.label}</b> — more\n`;
      rest.forEach((a, i) => { list += formatArticle(i, a); });
      await sendText(list.trim(), chatId);
      await new Promise(r => setTimeout(r, 400));
    }
  }
}

async function sendAlert(article, category, chatId = CHAT_ID) {
  if (!BOT_TOKEN || !chatId) return;
  const meta  = SECTION_META[category] || { emoji: '📰', label: category };
  const time  = new Date(article.pubDate).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', timeStyle: 'short' });
  const snip  = excerpt(article);
  const title = escapeHtml(article.title);
  const titleLine = article.link ? `<a href="${article.link}">${title}</a>` : title;
  const body =
    `${meta.emoji} <b>${meta.label} Alert</b>\n\n` +
    `${titleLine}\n` +
    `<i>${escapeHtml(article.source)} • ${time}</i>` +
    (snip ? `\n\n${escapeHtml(snip)}` : '');
  try {
    await axios.post(`${BASE_URL()}/sendMessage`, {
      chat_id: chatId, text: body, parse_mode: 'HTML',
      disable_web_page_preview: !article.link,
    });
  } catch (err) {
    console.error(`❌ TG alert: ${err.response?.data?.description || err.message}`);
  }
}

/**
 * Long-poll with exponential backoff on errors.
 * 409 = another instance is polling → wait longer before retrying.
 */
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
    return { offset, backoff: 0 }; // success — reset backoff
  } catch (err) {
    const status = err.response?.status;
    const desc   = err.response?.data?.description || err.message;

    if (status === 409) {
      // Conflict: another poller is active — back off aggressively
      console.warn('⚠  TG 409: duplicate poller detected — backing off');
      return { offset, backoff: 30000 }; // wait 30s before next poll
    }

    if (!desc.includes('timeout')) {
      console.error(`❌ TG poll: ${desc}`);
    }
    return { offset, backoff: 3000 }; // generic error — wait 3s
  }
}

module.exports = { sendDigest, sendAlert, sendText, pollCommands };

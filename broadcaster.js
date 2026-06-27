// ─────────────────────────────────────────────────────────
//  Kenya News Bot — Unified Broadcaster  v4
// ─────────────────────────────────────────────────────────

const tg = require('./telegram');
const wa = require('./whatsapp');

async function broadcastDigest(categorised, tgChatId, waPhone, regionLabel = null) {
  const tasks = [tg.sendDigest(categorised, tgChatId, regionLabel)];
  if (wa.isEnabled()) tasks.push(wa.sendDigest(categorised, waPhone, regionLabel));
  await Promise.allSettled(tasks);
}

async function broadcastAlert(article, category) {
  const tasks = [tg.sendAlert(article, category)];
  if (wa.isEnabled()) tasks.push(wa.sendAlert(article, category));
  await Promise.allSettled(tasks);
}

async function sendText(text, tgChatId) {
  await tg.sendText(text, tgChatId);
}

module.exports = { broadcastDigest, broadcastAlert, sendText };

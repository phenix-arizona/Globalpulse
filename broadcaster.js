// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Unified Broadcaster
// ─────────────────────────────────────────────────────────

const tg = require('./telegram');
const wa = require('./whatsapp');

async function broadcastDigest(categorised, tgChatId, waPhone, regionLabel = null) {
  const tasks = [tg.sendDigest(categorised, tgChatId, regionLabel)];
  if (wa.isEnabled()) tasks.push(wa.sendDigest(categorised, waPhone, regionLabel));
  // Also push to the Telegram channel, if configured — but only when
  // sending the default personal digest (not a per-user command reply,
  // which would otherwise flood the channel every time someone types /tech).
  if (tg.isChannelEnabled() && !tgChatId) {
    tasks.push(tg.sendDigest(categorised, tg.CHANNEL_ID, regionLabel));
  }
  await Promise.allSettled(tasks);
}

async function broadcastAlert(article, category) {
  const tasks = [tg.sendAlert(article, category)];
  if (wa.isEnabled()) tasks.push(wa.sendAlert(article, category));
  if (tg.isChannelEnabled()) tasks.push(tg.sendAlert(article, category, tg.CHANNEL_ID));
  await Promise.allSettled(tasks);
}

async function sendText(text, tgChatId) {
  await tg.sendText(text, tgChatId);
}

module.exports = { broadcastDigest, broadcastAlert, sendText };

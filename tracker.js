// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Deduplication Tracker  v2
//  Persists seen-article fingerprints via storage.js.
//  Survives redeploys when Upstash Redis is configured;
//  otherwise degrades gracefully to in-memory (resets on restart).
// ─────────────────────────────────────────────────────────

const storage = require('./storage');

const SEEN_TTL_SECONDS = 7 * 24 * 60 * 60; // auto-expire after 7 days

/** Generate a stable fingerprint key for an article */
function keyFor(article) {
  const base = article.link || article.title || '';
  // Base64-encode + truncate to keep keys short and Redis-safe
  const hash = Buffer.from(base.trim().toLowerCase()).toString('base64').slice(0, 120);
  return `seen:${hash}`;
}

/**
 * Returns true if the article has NOT been seen before,
 * and records it as seen (7-day TTL).
 */
async function isNew(article) {
  const key = keyFor(article);
  const already = await storage.exists(key);
  if (already) return false;
  await storage.set(key, '1', SEEN_TTL_SECONDS);
  return true;
}

/** Filter an array of articles down to only the unseen ones. */
async function filterNew(articles) {
  const results = [];
  for (const article of articles) {
    if (await isNew(article)) results.push(article);
  }
  return results;
}

function isPersistent() {
  return storage.isPersistent();
}

module.exports = { isNew, filterNew, isPersistent };

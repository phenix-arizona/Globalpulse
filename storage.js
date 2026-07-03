// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Persistent Storage
//  Uses Upstash Redis (free tier, REST API — no native
//  binaries, works on Railway/Fly without a mounted volume).
//  Falls back to in-memory storage automatically if Upstash
//  isn't configured, so the bot still runs without setup —
//  it just won't survive redeploys.
//
//  Setup: create a free DB at https://upstash.com, then set
//  UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
// ─────────────────────────────────────────────────────────

const axios = require('axios');

const REST_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ENABLED    = !!(REST_URL && REST_TOKEN);

// In-memory fallback — only used when Upstash isn't configured
const memoryStore = new Map();

function memoryExpired(entry) {
  return entry.expires && Date.now() > entry.expires;
}

/** Execute a raw Redis command via Upstash's REST API */
async function redisCommand(args) {
  const res = await axios.post(REST_URL, args, {
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    timeout: 8000,
  });
  return res.data.result;
}

async function set(key, value, exSeconds = null) {
  if (!ENABLED) {
    memoryStore.set(key, { value: String(value), expires: exSeconds ? Date.now() + exSeconds * 1000 : null });
    return true;
  }
  const args = exSeconds ? ['SET', key, String(value), 'EX', String(exSeconds)] : ['SET', key, String(value)];
  await redisCommand(args);
  return true;
}

async function get(key) {
  if (!ENABLED) {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (memoryExpired(entry)) { memoryStore.delete(key); return null; }
    return entry.value;
  }
  const result = await redisCommand(['GET', key]);
  return result;
}

async function exists(key) {
  if (!ENABLED) {
    const entry = memoryStore.get(key);
    if (!entry) return false;
    if (memoryExpired(entry)) { memoryStore.delete(key); return false; }
    return true;
  }
  const result = await redisCommand(['EXISTS', key]);
  return result === 1;
}

/** Increment a counter key, creating it at 1 if missing. Returns the new value. */
async function incr(key) {
  if (!ENABLED) {
    const entry = memoryStore.get(key) || { value: '0', expires: null };
    const next  = (parseInt(entry.value, 10) || 0) + 1;
    memoryStore.set(key, { value: String(next), expires: entry.expires });
    return next;
  }
  return await redisCommand(['INCR', key]);
}

async function del(key) {
  if (!ENABLED) { memoryStore.delete(key); return true; }
  await redisCommand(['DEL', key]);
  return true;
}

function isPersistent() {
  return ENABLED;
}

module.exports = { set, get, exists, incr, del, isPersistent };

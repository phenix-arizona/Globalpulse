// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Feed Health Tracker
//  Auto-pauses a feed after repeated consecutive failures,
//  so dead sources stop wasting fetch time every cycle.
//  A paused feed retries automatically after 24 hours.
// ─────────────────────────────────────────────────────────

const storage = require('./storage');

const FAIL_THRESHOLD  = 8;             // consecutive failures before pausing
const PAUSE_SECONDS   = 24 * 60 * 60;  // pause duration before auto-retry
const FAIL_KEY_TTL    = 48 * 60 * 60;  // reset fail counter if it goes quiet

function failKey(feedName)  { return `feedfail:${feedName}`; }
function pauseKey(feedName) { return `feedpause:${feedName}`; }

/** Is this feed currently paused due to repeated failures? */
async function isPaused(feedName) {
  return await storage.exists(pauseKey(feedName));
}

/** Call after a successful fetch — clears the failure counter. */
async function recordSuccess(feedName) {
  await storage.del(failKey(feedName));
}

/**
 * Call after a failed fetch. Increments the counter and pauses
 * the feed once it hits FAIL_THRESHOLD consecutive failures.
 * Returns true if the feed just became paused.
 */
async function recordFailure(feedName) {
  const count = await storage.incr(failKey(feedName));

  if (count === 1) {
    // First failure in this streak — set a TTL so the counter
    // resets itself if the feed recovers without us noticing
    await storage.set(failKey(feedName), '1', FAIL_KEY_TTL);
  }

  if (count >= FAIL_THRESHOLD) {
    await storage.set(pauseKey(feedName), '1', PAUSE_SECONDS);
    await storage.del(failKey(feedName));
    return true;
  }
  return false;
}

module.exports = { isPaused, recordSuccess, recordFailure };

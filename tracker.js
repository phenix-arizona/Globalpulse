// ─────────────────────────────────────────────────────────
//  Kenya News Aggregator — Deduplication Tracker
//  Prevents re-sending articles already dispatched via WhatsApp.
//  In-memory only — resets on restart (acceptable for a bot).
//  For persistence across restarts, swap the Set for a flat file
//  or a small SQLite DB (see comment at bottom).
// ─────────────────────────────────────────────────────────

class Tracker {
  constructor({ maxSize = 2000 } = {}) {
    /** @type {Set<string>} */
    this._seen = new Set();
    this._maxSize = maxSize; // evict oldest when cap is hit
    this._queue  = [];       // insertion-order queue for eviction
  }

  /**
   * Generate a stable fingerprint for an article.
   * Uses the URL when available; falls back to a trimmed title slug.
   */
  _key(article) {
    if (article.link) return article.link.trim();
    return article.title.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 120);
  }

  /**
   * Returns true if the article has NOT been seen before
   * and marks it as seen.  Returns false if it is a duplicate.
   */
  isNew(article) {
    const key = this._key(article);
    if (this._seen.has(key)) return false;

    // Add to seen set + eviction queue
    this._seen.add(key);
    this._queue.push(key);

    // Evict oldest entry when cap is exceeded
    if (this._queue.length > this._maxSize) {
      const evicted = this._queue.shift();
      this._seen.delete(evicted);
    }

    return true;
  }

  /**
   * Filter an array of articles, returning only unseen ones.
   */
  filterNew(articles) {
    return articles.filter(a => this.isNew(a));
  }

  /** How many fingerprints are currently tracked. */
  get size() { return this._seen.size; }

  /** Reset — useful in tests. */
  clear() { this._seen.clear(); this._queue = []; }
}

// ── Singleton shared across the whole process ─────────────
const tracker = new Tracker();
module.exports = tracker;

/*
── Persistent alternative (uncomment + npm install better-sqlite3) ──────────

const Database = require('better-sqlite3');
const db = new Database('seen.db');
db.exec('CREATE TABLE IF NOT EXISTS seen (key TEXT PRIMARY KEY, ts INTEGER)');
const insert = db.prepare('INSERT OR IGNORE INTO seen (key, ts) VALUES (?, ?)');
const exists = db.prepare('SELECT 1 FROM seen WHERE key = ?');

tracker.isNew = function(article) {
  const key = tracker._key(article);
  if (exists.get(key)) return false;
  insert.run(key, Date.now());
  return true;
};

*/

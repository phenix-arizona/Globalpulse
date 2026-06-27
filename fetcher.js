// ─────────────────────────────────────────────────────────
//  Kenya News Bot — RSS Fetcher  v4.1
//  • Tries multiple User-Agent strings per feed
//  • Handles Atom + RSS 1/2 + non-standard XML
//  • Per-feed timeout so one slow source can't block others
// ─────────────────────────────────────────────────────────

const Parser = require('rss-parser');
const { FEEDS } = require('./feeds');

// Rotate through UA strings — some hosts block bots but allow browsers/Googlebot
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'feedparser/3.0 (+https://github.com/danmactough/node-feedparser)',
];

function makeParser(ua) {
  return new Parser({
    timeout: 12000,
    headers: {
      'User-Agent': ua,
      'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
    xml2js: {
      strict: false,
      normalize: true,
      normalizeTags: false, // keep original tag casing for Atom
      explicitArray: false,
    },
    customFields: {
      item: [
        ['media:content', 'media'],
        ['content:encoded', 'contentEncoded'],
        ['dc:date', 'dcDate'],
        ['summary', 'atomSummary'],
      ],
    },
  });
}

function extractSummary(item) {
  const raw =
    item.contentSnippet ||
    item.atomSummary ||
    item.summary ||
    (item.contentEncoded || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ||
    '';
  return raw.slice(0, 350).trim();
}

function extractDate(item) {
  const raw = item.pubDate || item.isoDate || item.dcDate || item.updated || item.published;
  if (!raw) return new Date();
  const d = new Date(raw);
  return isNaN(d) ? new Date() : d;
}

/**
 * Try fetching a feed with rotating User-Agents.
 * Returns [] on total failure (non-fatal).
 */
async function fetchFeed(feed) {
  let lastErr = null;

  for (const ua of USER_AGENTS) {
    try {
      const parser = makeParser(ua);
      const parsed = await parser.parseURL(feed.url);
      const items  = parsed.items || [];

      return items
        .filter(item => item.title)
        .map(item => ({
          title:    item.title.trim(),
          link:     item.link || item.guid || '',
          summary:  extractSummary(item),
          pubDate:  extractDate(item),
          source:   feed.name,
          category: feed.category,
          region:   feed.region,
        }));

    } catch (err) {
      lastErr = err;
      // Only retry on auth/block errors, not parse errors
      const code = err.message || '';
      if (!code.includes('403') && !code.includes('400') && !code.includes('Status code')) break;
    }
  }

  console.warn(`⚠  [${feed.name}]: ${(lastErr?.message || 'unknown').split('\n')[0]}`);
  return [];
}

async function fetchAllFeeds() {
  console.log(`📡 Fetching from ${FEEDS.length} sources...`);

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const allArticles = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => a.title);

  const cutoff  = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent  = allArticles.filter(a => a.pubDate >= cutoff);

  const working = results.filter(r => r.status === 'fulfilled' && r.value.length > 0).length;
  console.log(`📰 ${recent.length} articles (last 24h) | ${working}/${FEEDS.length} feeds OK`);
  return recent;
}

module.exports = { fetchAllFeeds };

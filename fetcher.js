// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — RSS/Atom Fetcher  v5
//  Uses node-fetch + manual XML parsing to handle:
//  - RSS 1.0, 2.0
//  - Atom 1.0
//  - Non-standard/malformed feeds
// ─────────────────────────────────────────────────────────

const Parser  = require('rss-parser');
const https   = require('https');
const http    = require('http');
const { FEEDS } = require('./feeds');

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const TIMEOUT_MS = 15000;

// rss-parser with maximum tolerance
const parser = new Parser({
  timeout: TIMEOUT_MS,
  headers: {
    'User-Agent': BROWSER_UA,
    'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Cache-Control': 'no-cache',
  },
  xml2js: {
    strict: false,
    normalize: true,
    normalizeTags: false,
    explicitArray: false,
    mergeAttrs: true,
  },
  customFields: {
    feed: [['entry', 'entries']],   // Atom feeds use <entry> not <item>
    item: [
      ['content:encoded', 'contentEncoded'],
      ['media:content',   'media'],
      ['dc:date',         'dcDate'],
      ['summary',         'atomSummary'],
      ['content',         'atomContent'],
    ],
  },
});

/** Fetch raw XML with a manual HTTP request (bypasses some TLS issues) */
function fetchRaw(url) {
  return new Promise((resolve, reject) => {
    const mod     = url.startsWith('https') ? https : http;
    const timeout = setTimeout(() => reject(new Error(`Timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);

    const req = mod.get(url, {
      headers: {
        'User-Agent': BROWSER_UA,
        'Accept': '*/*',
        'Connection': 'keep-alive',
      },
      rejectUnauthorized: false, // handle expired certs gracefully
    }, (res) => {
      clearTimeout(timeout);

      // Follow one redirect
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        return fetchRaw(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode >= 400) {
        return reject(new Error(`Status code ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    });

    req.on('error', (err) => { clearTimeout(timeout); reject(err); });
  });
}

function extractSummary(item) {
  const candidates = [
    item.contentSnippet,
    item.atomSummary,
    item.summary,
    item.atomContent,
    item.contentEncoded,
    item.description,
  ];
  for (const c of candidates) {
    if (c && typeof c === 'string') {
      const clean = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.length > 20) return clean.slice(0, 350);
    }
  }
  return '';
}

function extractDate(item) {
  const raw = item.pubDate || item.isoDate || item.dcDate || item.updated || item.published;
  if (!raw) return new Date();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

function extractLink(item) {
  if (typeof item.link === 'string') return item.link;
  if (typeof item.link === 'object' && item.link?.href) return item.link.href;
  if (Array.isArray(item.link)) {
    const alt = item.link.find(l => l?.rel === 'alternate' || !l?.rel);
    return alt?.href || '';
  }
  return item.guid || item.id || '';
}

async function fetchFeed(feed) {
  try {
    // First try: rss-parser directly (handles most well-formed feeds)
    const parsed = await parser.parseURL(feed.url);
    const items  = parsed.items || [];

    if (items.length > 0) {
      return items.filter(i => i.title).map(item => ({
        title:    String(item.title).trim(),
        link:     extractLink(item),
        summary:  extractSummary(item),
        pubDate:  extractDate(item),
        source:   feed.name,
        category: feed.category,
        region:   feed.region,
      }));
    }

    // Second try: fetch raw XML and re-parse (catches Atom feeds)
    const xml    = await fetchRaw(feed.url);
    const parsed2 = await parser.parseString(xml);
    const items2  = parsed2.items || [];

    return items2.filter(i => i.title).map(item => ({
      title:    String(item.title).trim(),
      link:     extractLink(item),
      summary:  extractSummary(item),
      pubDate:  extractDate(item),
      source:   feed.name,
      category: feed.category,
      region:   feed.region,
    }));

  } catch (err) {
    // Last resort: try raw fetch + parse
    try {
      const xml    = await fetchRaw(feed.url);
      const parsed = await parser.parseString(xml);
      const items  = parsed.items || [];

      if (items.length > 0) {
        return items.filter(i => i.title).map(item => ({
          title:    String(item.title).trim(),
          link:     extractLink(item),
          summary:  extractSummary(item),
          pubDate:  extractDate(item),
          source:   feed.name,
          category: feed.category,
          region:   feed.region,
        }));
      }
    } catch (_) {}

    console.warn(`⚠  [${feed.name}]: ${(err.message || '').split('\n')[0]}`);
    return [];
  }
}

async function fetchAllFeeds() {
  console.log(`📡 Fetching from ${FEEDS.length} sources...`);

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const allArticles = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => a.title && a.title.length > 3);

  const cutoff  = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent  = allArticles.filter(a => a.pubDate >= cutoff);
  const working = results.filter(r => r.status === 'fulfilled' && r.value.length > 0).length;

  console.log(`📰 ${recent.length} articles (last 24h) | ${working}/${FEEDS.length} feeds OK`);
  return recent;
}

module.exports = { fetchAllFeeds };

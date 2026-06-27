// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Fetcher v6
//  Uses axios (handles gzip/deflate automatically) + rss-parser
// ─────────────────────────────────────────────────────────

const Parser = require('rss-parser');
const axios  = require('axios');
const { FEEDS } = require('./feeds');

const TIMEOUT = 15000;
const UA      = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// One parser instance, shared — increase listener limit to suppress warning
const parser = new Parser({
  timeout: TIMEOUT,
  headers: { 'User-Agent': UA },
  xml2js: {
    strict: false,
    normalize: true,
    normalizeTags: false,
    explicitArray: false,
    mergeAttrs: true,
  },
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['media:content',   'media'],
      ['dc:date',         'dcDate'],
      ['summary',         'atomSummary'],
      ['content',         'atomContent'],
    ],
  },
});
// Prevent MaxListenersExceededWarning when 60 feeds parse concurrently
parser.setMaxListeners && parser.setMaxListeners(100);

/** Fetch URL with axios — auto-decompresses gzip/deflate/br */
async function fetchXml(url) {
  const res = await axios.get(url, {
    timeout: TIMEOUT,
    responseType: 'text',
    decompress: true,           // axios handles gzip/deflate automatically
    maxRedirects: 5,
    headers: {
      'User-Agent': UA,
      'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });
  return res.data;
}

function extractSummary(item) {
  for (const key of ['contentSnippet','atomSummary','summary','atomContent','contentEncoded','description']) {
    const v = item[key];
    if (v && typeof v === 'string' && v.length > 20) {
      return v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
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
  if (typeof item.link === 'string' && item.link.startsWith('http')) return item.link;
  if (item.link?.href) return item.link.href;
  if (Array.isArray(item.link)) {
    const l = item.link.find(x => x?.rel === 'alternate' || !x?.rel);
    if (l?.href) return l.href;
  }
  return item.guid || item.id || '';
}

function normalise(items, feed) {
  return items
    .filter(i => i.title && String(i.title).length > 3)
    .map(item => ({
      title:    String(item.title).replace(/<[^>]+>/g, '').trim(),
      link:     extractLink(item),
      summary:  extractSummary(item),
      pubDate:  extractDate(item),
      source:   feed.name,
      category: feed.category,
      region:   feed.region,
    }));
}

async function fetchFeed(feed) {
  try {
    // Primary: fetch XML with axios then parse string (most reliable)
    const xml    = await fetchXml(feed.url);
    const parsed = await parser.parseString(xml);
    const items  = normalise(parsed.items || [], feed);
    if (items.length > 0) return items;

    // Fallback: let rss-parser fetch directly
    const parsed2 = await parser.parseURL(feed.url);
    return normalise(parsed2.items || [], feed);

  } catch (err) {
    const msg = err.response?.status
      ? `Status code ${err.response.status}`
      : (err.message || 'unknown').split('\n')[0].slice(0, 80);
    console.warn(`⚠  [${feed.name}]: ${msg}`);
    return [];
  }
}

async function fetchAllFeeds() {
  console.log(`📡 Fetching from ${FEEDS.length} sources...`);

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const all     = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  const cutoff  = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent  = all.filter(a => a.pubDate >= cutoff);
  const working = results.filter(r => r.status === 'fulfilled' && r.value.length > 0).length;

  console.log(`📰 ${recent.length} articles (24h) | ${working}/${FEEDS.length} feeds OK`);
  return recent;
}

module.exports = { fetchAllFeeds };

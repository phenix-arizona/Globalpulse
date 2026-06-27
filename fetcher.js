// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Fetcher v7
//  Uses fast-xml-parser to handle RSS 1/2 + Atom natively.
//  No more "Feed not recognized" — we parse XML ourselves.
// ─────────────────────────────────────────────────────────

const axios  = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { FEEDS } = require('./feeds');

const TIMEOUT = 15000;
const UA      = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const xmlParser = new XMLParser({
  ignoreAttributes:        false,
  attributeNamePrefix:     '@_',
  allowBooleanAttributes:  true,
  parseAttributeValue:     false,
  trimValues:              true,
  parseTagValue:           true,
  cdataPropName:           '__cdata',
  isArray: (name) => ['item', 'entry', 'link'].includes(name),
});

/** Download raw XML/HTML from a URL */
async function fetchXml(url) {
  const res = await axios.get(url, {
    timeout: TIMEOUT,
    responseType: 'text',
    decompress: true,
    maxRedirects: 5,
    headers: {
      'User-Agent': UA,
      'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
    },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });
  return res.data;
}

/** Extract text from a value that might be a string, object with __cdata, or object with #text */
function text(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (val.__cdata) return val.__cdata;
  if (val['#text']) return val['#text'];
  if (typeof val === 'object') {
    // Some feeds wrap text in extra object
    const v = Object.values(val)[0];
    return v ? String(v) : '';
  }
  return '';
}

/** Extract href from an Atom <link> element */
function linkHref(linkVal) {
  if (!linkVal) return '';
  if (typeof linkVal === 'string') return linkVal;
  if (Array.isArray(linkVal)) {
    const alt = linkVal.find(l => !l['@_rel'] || l['@_rel'] === 'alternate');
    return alt?.['@_href'] || linkVal[0]?.['@_href'] || '';
  }
  return linkVal['@_href'] || text(linkVal) || '';
}

/** Strip HTML tags and clean whitespace */
function stripHtml(str = '') {
  return str.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract best summary from an item/entry */
function extractSummary(item) {
  const candidates = [
    item['content:encoded'],
    item.content,
    item.summary,
    item.description,
    item['media:description'],
  ];
  for (const c of candidates) {
    const s = stripHtml(text(c));
    if (s.length > 30) return s.slice(0, 300);
  }
  return '';
}

/** Parse a date string safely */
function parseDate(raw) {
  if (!raw) return new Date();
  const d = new Date(text(raw));
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Parse RSS 2.0 / RSS 1.0 <item> elements */
function parseRssItems(parsed, feed) {
  const channel = parsed?.rss?.channel || parsed?.['rdf:RDF'] || {};
  const items   = channel.item || [];
  return items.map(item => ({
    title:    stripHtml(text(item.title)).slice(0, 200),
    link:     text(item.link) || text(item.guid) || '',
    summary:  extractSummary(item),
    pubDate:  parseDate(item.pubDate || item['dc:date'] || item.updated),
    source:   feed.name,
    category: feed.category,
    region:   feed.region,
  })).filter(a => a.title.length > 3);
}

/** Parse Atom <entry> elements */
function parseAtomEntries(parsed, feed) {
  const feed2   = parsed?.feed || {};
  const entries = feed2.entry || [];
  return entries.map(entry => ({
    title:    stripHtml(text(entry.title)).slice(0, 200),
    link:     linkHref(entry.link) || text(entry.id) || '',
    summary:  extractSummary(entry),
    pubDate:  parseDate(entry.published || entry.updated),
    source:   feed.name,
    category: feed.category,
    region:   feed.region,
  })).filter(a => a.title.length > 3);
}

async function fetchFeed(feed) {
  try {
    const xml    = await fetchXml(feed.url);
    const parsed = xmlParser.parse(xml);

    // Detect feed type and parse accordingly
    let items = [];

    if (parsed?.feed?.entry) {
      items = parseAtomEntries(parsed, feed);       // Atom
    } else if (parsed?.rss?.channel?.item) {
      items = parseRssItems(parsed, feed);          // RSS 2.0
    } else if (parsed?.['rdf:RDF']) {
      items = parseRssItems(parsed, feed);          // RSS 1.0
    } else {
      // Try both anyway
      items = [...parseRssItems(parsed, feed), ...parseAtomEntries(parsed, feed)];
    }

    if (items.length === 0) {
      console.warn(`⚠  [${feed.name}]: 0 items parsed`);
    }
    return items;

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

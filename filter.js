// ─────────────────────────────────────────────────────────
//  Kenya News Bot — Keyword Filter
//  v4: supports region filtering (/usa /china /eu etc.)
// ─────────────────────────────────────────────────────────

const { KEYWORDS } = require('./feeds');

function matches(article, keywords) {
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  return keywords.some(kw => haystack.includes(kw.toLowerCase()));
}

/**
 * Filter articles into topic buckets.
 * Optionally restrict to a specific region.
 * @param {Array}  articles
 * @param {string} [region]  - 'kenya' | 'usa' | 'china' | 'russia' | 'korea' | 'eu' | 'global'
 */
function filterArticles(articles, region = null) {
  const source = region
    ? articles.filter(a => a.region === region || a.region === 'global')
    : articles;

  const categories = Object.keys(KEYWORDS);
  const buckets = Object.fromEntries(categories.map(c => [c, []]));

  for (const article of source) {
    for (const cat of categories) {
      if (matches(article, KEYWORDS[cat])) {
        buckets[cat].push(article);
        break;
      }
    }
  }

  // Deduplicate + sort newest-first per bucket
  for (const cat of categories) {
    const seen = new Set();
    buckets[cat] = buckets[cat]
      .filter(a => {
        if (seen.has(a.title)) return false;
        seen.add(a.title);
        return true;
      })
      .sort((a, b) => b.pubDate - a.pubDate);
  }

  return buckets;
}

module.exports = { filterArticles };

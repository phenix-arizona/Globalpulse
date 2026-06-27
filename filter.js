// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Keyword Filter  v6
// ─────────────────────────────────────────────────────────

const { KEYWORDS } = require('./feeds');

const TRUSTED_CATEGORY_FEEDS = new Set([
  'FarmBiz Africa','Smart Farmer Kenya','USDA News','FAO',
  'ReliefWeb Jobs KE','ReliefWeb Jobs','JobWebKenya','UN Jobs Nairobi',
  'Career Point Kenya','Nature News','Science Daily','The Conversation',
  'TED Ideas','Smithsonian Magazine','Big Think','Harvard Business Review',
  'World Economic Forum','EdSurge','Education Week','Chronicle of Higher Ed',
]);

const AGRI_TITLE_KEYWORDS = [
  'farm','farmer','farming','crop','harvest','livestock','poultry','dairy',
  'drought','irrigation','fertilizer','fertiliser','seed','food security',
  'agribusiness','agrotech','maize','wheat','rice','coffee','tea plantation',
  'horticulture','smallholder','agriculture','agricultural','agri','cereal',
  'grain','pesticide','herbicide','soil health','food production','famine',
  'hunger','crop yield','land reform','food prices',
];

const JOB_TITLE_KEYWORDS = [
  'job opening','job vacancy','vacancies','hiring','recruit','career',
  'internship','apply now','employment','position available','job fair',
  'remote job','freelance','contract role','layoff','retrenchment',
];

const EDU_TITLE_KEYWORDS = [
  'education','school','university','college','student','research',
  'science','study','academic','scholarship','curriculum','professor',
  'e-learning','online course','STEM','literacy','EdTech','skills',
  'training','vocational','exam','degree','PhD','discovery',
];

function countMatches(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
}

function titleMatches(title, keywords) {
  const lower = title.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

function categorise(article) {
  const title    = article.title   || '';
  const summary  = article.summary || '';
  const combined = `${title} ${summary}`;

  // Trust specialist sources directly
  if (TRUSTED_CATEGORY_FEEDS.has(article.source)) return article.category;

  // Strict title-anchored categories first
  if (titleMatches(title, AGRI_TITLE_KEYWORDS))  return 'agri';
  if (titleMatches(title, JOB_TITLE_KEYWORDS))   return 'jobs';
  if (titleMatches(title, EDU_TITLE_KEYWORDS))   return 'education';

  // Broader categories — title hit OR 2+ combined hits
  if (titleMatches(title, KEYWORDS.technology) || countMatches(combined, KEYWORDS.technology) >= 2) return 'technology';
  if (titleMatches(title, KEYWORDS.finance)    || countMatches(combined, KEYWORDS.finance)    >= 2) return 'finance';
  if (titleMatches(title, KEYWORDS.investment) || countMatches(combined, KEYWORDS.investment) >= 2) return 'investment';
  if (titleMatches(title, KEYWORDS.politics))   return 'politics';

  // Fall back to feed's own category tag
  return article.category || null;
}

function filterArticles(articles, region = null) {
  const source  = region
    ? articles.filter(a => a.region === region || a.region === 'global')
    : articles;

  const validCats = new Set(Object.keys(KEYWORDS));
  const buckets   = Object.fromEntries([...validCats].map(c => [c, []]));

  for (const article of source) {
    const cat = categorise(article);
    if (cat && validCats.has(cat)) buckets[cat].push(article);
  }

  for (const cat of [...validCats]) {
    const seen = new Set();
    buckets[cat] = buckets[cat]
      .filter(a => { if (seen.has(a.title)) return false; seen.add(a.title); return true; })
      .sort((a, b) => b.pubDate - a.pubDate);
  }

  return buckets;
}

module.exports = { filterArticles };

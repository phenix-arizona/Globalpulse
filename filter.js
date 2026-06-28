// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Keyword Filter  v8
//  • Max 2 articles per source per category (no source dominance)
//  • Strict title-anchored matching for agri/jobs/education/research
//  • Requires 2+ keyword hits for broad categories
// ─────────────────────────────────────────────────────────

const { KEYWORDS } = require('./feeds');

const MAX_PER_SOURCE = 2;

const TRUSTED_CATEGORY_FEEDS = new Set([
  // Agriculture
  'FarmBiz Africa','Smart Farmer Kenya','USDA News','FAO','CGIAR News',
  'AGRA Africa','AgWeb','China Agri News','Japan Agri News',
  // Jobs
  'ReliefWeb Jobs KE','ReliefWeb Jobs','JobWebKenya',
  // Education
  'Nature News','Science Daily','The Conversation','TED Ideas',
  'Harvard Business Review','World Economic Forum','EdSurge',
  'Education Week','Chronicle of Higher Ed','UNESCO Education',
  'RUFORUM','University World News','Times Higher Ed Japan',
  // Research
  'Nature Research','Science Magazine','NBER Research',
  'African Research Initiative','Research Europe','Korea Biotech',
  // Startup
  'CB Insights','Crunchbase News','Disrupt Africa','VC4A Blog',
  'Ventures Africa','Sifted','EU-Startups','Inc Magazine',
  'TechCrunch Startups',
  // Business
  'McKinsey Insights','Deloitte Insights','Finance & Development IMF',
]);

const TITLE_KEYWORDS = {
  agriculture: [
    'farm','farmer','farming','crop','harvest','livestock','poultry','dairy',
    'drought','irrigation','fertilizer','fertiliser','seed','food security',
    'agribusiness','agrotech','maize','wheat','rice','coffee','tea plantation',
    'horticulture','smallholder','agriculture','agricultural','agri','cereal',
    'grain','pesticide','herbicide','soil health','food production','famine',
    'hunger','crop yield','land reform','food prices','smart farming',
    'precision farming','aquaculture','fisheries','organic farming',
  ],
  jobs: [
    'job opening','job vacancy','vacancies','hiring','recruit','career',
    'internship','apply now','employment','position available','job fair',
    'remote job','freelance','contract role','layoff','retrenchment',
  ],
  education: [
    'education','school','university','college','student','research findings',
    'scientific study','academic','scholarship','curriculum','professor',
    'e-learning','online course','STEM','EdTech','vocational training',
    'exam results','degree','PhD','scientific discovery','science breakthrough',
    'TVET','CBC','KICD','school fees','literacy rate','dropout',
  ],
  research: [
    'research','study finds','new study','study shows','scientists discover',
    'peer-reviewed','published in','journal','trial results','white paper',
    'policy brief','clinical trial','meta-analysis','working paper',
    'report finds','survey reveals','data shows','researchers say',
  ],
  startup: [
    'startup','start-up','raises','seed round','Series A','Series B',
    'Series C','funding round','venture capital','accelerator','incubator',
    'launches','founder','unicorn','IPO filing','pitch','crowdfunding',
    'bootstrapped','MVP','early-stage','Y Combinator','Techstars',
  ],
  innovation: [
    'breakthrough','discovery','invention','patent','prototype','first-ever',
    'next-generation','cutting-edge','disruptive','new technology','launch',
    'lab-grown','gene editing','CRISPR','satellite','rocket launch','fusion',
    'autonomous','self-driving','augmented reality','virtual reality',
    'Internet of Things','IoT','deep tech','quantum computing',
  ],
};

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

  // Trusted feeds: trust their declared category
  if (TRUSTED_CATEGORY_FEEDS.has(article.source)) return article.category;

  // Strict title matching for niche categories first
  if (titleMatches(title, TITLE_KEYWORDS.agriculture)) return 'agriculture';
  if (titleMatches(title, TITLE_KEYWORDS.jobs))        return 'jobs';
  if (titleMatches(title, TITLE_KEYWORDS.research))    return 'research';
  if (titleMatches(title, TITLE_KEYWORDS.startup))     return 'startup';
  if (titleMatches(title, TITLE_KEYWORDS.innovation))  return 'innovation';
  if (titleMatches(title, TITLE_KEYWORDS.education))   return 'education';

  // Broader keyword matching (2+ hits required)
  if (titleMatches(title, KEYWORDS.technology)  || countMatches(combined, KEYWORDS.technology)  >= 2) return 'technology';
  if (titleMatches(title, KEYWORDS.business)    || countMatches(combined, KEYWORDS.business)    >= 2) return 'business';
  if (titleMatches(title, KEYWORDS.finance)     || countMatches(combined, KEYWORDS.finance)     >= 2) return 'finance';
  if (titleMatches(title, KEYWORDS.investment)  || countMatches(combined, KEYWORDS.investment)  >= 2) return 'investment';
  if (titleMatches(title, KEYWORDS.politics))    return 'politics';

  return null;
}

function filterArticles(articles, region = null) {
  const source = region
    ? articles.filter(a => a.region === region || a.region === 'global')
    : articles;

  const validCats = new Set(Object.keys(KEYWORDS).concat(
    ['agriculture','startup','research','innovation','business']
  ));

  const buckets = Object.fromEntries([...validCats].map(c => [c, []]));

  for (const article of source) {
    const cat = categorise(article);
    if (cat && validCats.has(cat)) buckets[cat].push(article);
  }

  // Deduplicate, cap per source, sort newest-first
  for (const cat of [...validCats]) {
    const seenTitles  = new Set();
    const sourceCount = {};
    buckets[cat] = (buckets[cat] || [])
      .sort((a, b) => b.pubDate - a.pubDate)
      .filter(a => {
        if (seenTitles.has(a.title)) return false;
        seenTitles.add(a.title);
        sourceCount[a.source] = (sourceCount[a.source] || 0) + 1;
        return sourceCount[a.source] <= MAX_PER_SOURCE;
      });
  }

  return buckets;
}

module.exports = { filterArticles };

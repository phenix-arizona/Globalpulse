// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Keyword Filter  v9
//  KEY FIX: global-tagged feeds are only included in a
//  region digest when the article actually mentions that
//  region. No more Iran/Venezuela showing up in Africa.
//
//  Rules:
//  • Region-specific feed  → always included for its region
//  • Global feed + /world  → always included
//  • Global feed + region  → only if article mentions region
//  • Max 2 articles per source per category
//  • Strict title-anchored matching for niche categories
// ─────────────────────────────────────────────────────────

const { KEYWORDS } = require('./feeds');

const MAX_PER_SOURCE = 2;

// ── Region geographic keyword maps ────────────────────────
// When a global-feed article is evaluated for a specific region,
// its title+summary must mention at least one of these terms.
const REGION_GEO_KEYWORDS = {
  kenya: [
    'kenya','kenyan','nairobi','mombasa','kisumu','nakuru','eldoret',
    'kisumo','east africa','east african','horn of africa',
    'kenyatta','ruto','odinga','nairobiassembly','KRA','CBK','NSE',
    'M-Pesa','safaricom','equity bank','co-op bank',
  ],
  africa: [
    'africa','african','sub-saharan','sahel','east africa','west africa',
    'south africa','north africa','central africa','horn of africa',
    'nigeria','ghana','ethiopia','kenya','tanzania','uganda','rwanda',
    'senegal','côte d\'ivoire','ivory coast','mozambique','zimbabwe',
    'zambia','botswana','namibia','angola','cameroon','mali','niger',
    'burkina faso','somalia','sudan','egypt','morocco','algeria','tunisia',
    'congo','drc','liberia','sierra leone','guinea','benin','togo',
    'AU','african union','ECOWAS','SADC','EAC','AfDB','AGOA',
  ],
  usa: [
    'united states','u.s.','u.s.a.','america','american','washington',
    'new york','los angeles','chicago','houston','texas','california',
    'congress','senate','white house','pentagon','federal reserve',
    'biden','trump','harris','democrat','republican','GOP',
    'wall street','nasdaq','s&p','dow jones','silicon valley',
    'FDA','CDC','NASA','CIA','FBI',
  ],
  europe: [
    'europe','european','eu','eurozone','brussels','strasbourg','frankfurt',
    'uk','britain','england','germany','france','italy','spain','poland',
    'netherlands','sweden','norway','denmark','finland','switzerland',
    'austria','belgium','portugal','czechia','hungary','romania',
    'ECB','european central bank','NATO','schengen','brexit',
    'macron','scholz','meloni','von der leyen',
  ],
  china: [
    'china','chinese','beijing','shanghai','shenzhen','guangzhou',
    'hong kong','taiwan','xi jinping','communist party','CCP',
    'yuan','renminbi','alibaba','tencent','huawei','byd','CATL',
    'PLA','PBOC','belt and road','BRI','made in china',
  ],
  japan: [
    'japan','japanese','tokyo','osaka','kyoto','yokohama','hiroshima',
    'yen','nikkei','toyota','sony','honda','panasonic','softbank',
    'nintendo','fujifilm','mitsubishi','sumitomo','bank of japan',
    'BOJ','LDP','prime minister japan','kishida','ishiba',
  ],
  korea: [
    'korea','korean','south korea','seoul','busan','incheon',
    'won','kospi','samsung','lg','hyundai','kia','sk group',
    'lotte','posco','kakao','naver','Bank of Korea','BOK',
    'K-pop','hallyu','KFTC','KOTRA',
  ],
};

// ── Trusted feeds whose category label is always correct ─
const TRUSTED_CATEGORY_FEEDS = new Set([
  'FarmBiz Africa','Smart Farmer Kenya','USDA News','FAO','CGIAR News',
  'AGRA Africa','AgWeb','China Agri News','Japan Agri News',
  'ReliefWeb Jobs KE','ReliefWeb Jobs','JobWebKenya',
  'Nature News','Science Daily','The Conversation','TED Ideas',
  'Harvard Business Review','World Economic Forum','EdSurge',
  'Education Week','Chronicle of Higher Ed','UNESCO Education',
  'RUFORUM','University World News','Times Higher Ed Japan',
  'Nature Research','Science Magazine','NBER Research',
  'African Research Initiative','Research Europe','Korea Biotech',
  'CB Insights','Crunchbase News','Disrupt Africa','VC4A Blog',
  'Ventures Africa','Sifted','EU-Startups','Inc Magazine',
  'TechCrunch Startups','McKinsey Insights','Deloitte Insights',
  'Finance & Development IMF',
]);

// ── Title keyword lists for niche categories ──────────────
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
    'next-generation','cutting-edge','disruptive','new technology',
    'lab-grown','gene editing','CRISPR','satellite','rocket launch','fusion',
    'autonomous','self-driving','augmented reality','virtual reality',
    'Internet of Things','IoT','deep tech','quantum computing',
  ],
};

// ── Helpers ───────────────────────────────────────────────

function countMatches(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
}

function titleMatches(title, keywords) {
  const lower = title.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

/**
 * Returns true if a global-feed article is relevant to the
 * requested region by checking title+summary for geo keywords.
 */
function isRelevantToRegion(article, region) {
  const geoKeys = REGION_GEO_KEYWORDS[region];
  if (!geoKeys) return true; // unknown region — don't filter
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  return geoKeys.some(kw => haystack.includes(kw.toLowerCase()));
}

function categorise(article) {
  const title    = article.title   || '';
  const summary  = article.summary || '';
  const combined = `${title} ${summary}`;

  if (TRUSTED_CATEGORY_FEEDS.has(article.source)) return article.category;

  if (titleMatches(title, TITLE_KEYWORDS.agriculture)) return 'agriculture';
  if (titleMatches(title, TITLE_KEYWORDS.jobs))        return 'jobs';
  if (titleMatches(title, TITLE_KEYWORDS.research))    return 'research';
  if (titleMatches(title, TITLE_KEYWORDS.startup))     return 'startup';
  if (titleMatches(title, TITLE_KEYWORDS.innovation))  return 'innovation';
  if (titleMatches(title, TITLE_KEYWORDS.education))   return 'education';

  if (titleMatches(title, KEYWORDS.technology)  || countMatches(combined, KEYWORDS.technology)  >= 2) return 'technology';
  if (titleMatches(title, KEYWORDS.business)    || countMatches(combined, KEYWORDS.business)    >= 2) return 'business';
  if (titleMatches(title, KEYWORDS.finance)     || countMatches(combined, KEYWORDS.finance)     >= 2) return 'finance';
  if (titleMatches(title, KEYWORDS.investment)  || countMatches(combined, KEYWORDS.investment)  >= 2) return 'investment';
  if (titleMatches(title, KEYWORDS.politics))    return 'politics';

  return null;
}

function filterArticles(articles, region = null) {
  let source;

  if (!region) {
    // /world or topic commands — include everything
    source = articles;
  } else {
    source = articles.filter(a => {
      if (a.region === region) return true;           // exact region feed → always in
      if (a.region === 'global') {
        return isRelevantToRegion(a, region);         // global feed → must mention region
      }
      return false;                                   // another region's feed → exclude
    });
  }

  const validCats = new Set([
    ...Object.keys(KEYWORDS),
    'agriculture','startup','research','innovation','business',
  ]);

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

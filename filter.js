// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Filter v7
//  Startup category added, strict title-anchoring
// ─────────────────────────────────────────────────────────

const { KEYWORDS, AFRICA_SUBREGIONS } = require('./feeds');

const TRUSTED_CATEGORY_FEEDS = new Set([
  'FarmBiz Africa','FarmBiz Africa (cont)','Smart Farmer Kenya',
  'USDA News','FAO','AGRA News','Africa Feeds Agri','EU Agriculture (DW)',
  'ReliefWeb Jobs KE','ReliefWeb Jobs','ReliefWeb Jobs Africa',
  'JobWebKenya','UN Jobs Nairobi','Career Point Kenya',
  'Corporate Staffing Kenya','Opportunity Desk',
  'Nature News','Science Daily','The Conversation','The Conversation EU',
  'TED Ideas','Smithsonian Magazine','Big Think','Harvard Business Review',
  'World Economic Forum','EdSurge','Education Week',
  'University World News Africa','University World News EU',
  'Research Africa','China Dialogue',
  'WHO News','Medical Xpress','STAT News','KFF Health News','Africa CDC',
  'Konza Technopolis',
  'Disrupt Africa','Ventures Africa','WeeTracker','Crunchbase News',
  'Product Hunt','Hacker News','TechNode','KrASIA','Sifted','EU Startups',
  'Nikkei Business','Inc Magazine','Fast Company',
  'Standard Sports Kenya','Capital Sports Kenya','BBC Sport',
  'Guardian Football','Motorsport.com','ESPN NBA','BBC Sport World Cup',
  'Pulse Live Kenya','Tuko Entertainment','OkayAfrica',
]);

const AGRI_TITLE  = [
  'farm','farmer','farming','crop','harvest','livestock','poultry','dairy',
  'drought','irrigation','fertilizer','fertiliser','seed','food security',
  'agribusiness','agrotech','horticulture','smallholder','agriculture',
  'agricultural','agri','cereal','grain','pesticide','soil health',
  'food production','famine','hunger','crop yield','land reform',
  'food prices','coffee auction','tea auction','flower export','cut flower',
  // Cash crops
  'coffee','tea','sugarcane','sugar cane','cotton','pyrethrum','macadamia',
  'cashew nut','sisal','tobacco','sunflower','avocado','miraa','khat',
  // Food/staple crops
  'maize','wheat','rice','beans','potato','potatoes','sorghum','millet',
  'cassava','banana','bananas','mango','mangoes','tomato','tomatoes',
  'onion','onions','groundnut','groundnuts',
];
const JOB_TITLE = [
  // General hiring
  'job opening','job vacancy','vacancies','hiring','recruitment','career',
  'apply now','employment opportunity','remote job','freelance',
  'contract role','job fair','layoff','retrenchment','job advert',
  'looking for','seeking applicants','now hiring','walk-in interview',

  // Casual & temporary work
  'casual job','casual jobs','casual labourer','casual labour','casual worker',
  'temporary job','temporary position','part-time job','day labourer',
  'gig work','odd jobs','manual labour','general worker',

  // Internships & attachments
  'internship','internships','industrial attachment','attachment opportunity',
  'graduate trainee','graduate program','trainee program','apprenticeship',
  'volunteer opportunity','national youth service',

  // Government & public sector
  'government job','government vacancy','civil service','public service job',
  'county government job','ministry vacancy','parastatal vacancy',
  'state department vacancy','county public service board','PSC recruitment',
  'teachers service commission','TSC recruitment','NHIF vacancy','NSSF vacancy',

  // Scholarships & funding
  'scholarship','scholarships','bursary','bursaries','fully funded',
  'fellowship','fellowships','grant opportunity','study abroad',
  'exchange program','funded masters','funded phd','tuition waiver',

  // Diaspora & foreign employment/migration
  'visa lottery','diversity visa','dv lottery','work visa','h-2b visa',
  'migrant worker','migrant workers','labour migration','domestic worker',
  'domestic workers','overseas employment','gulf labour','gulf labor',
  'kafala system','diaspora worker','kenyans abroad','workers abroad',
];
const EDU_TITLE   = ['education','school','university','college','research','scholarship','curriculum','professor','e-learning','online course','STEM','EdTech','vocational','PhD','discovery','academic'];
const HEALTH_TITLE = ['health','hospital','clinic','disease','outbreak','vaccine','vaccination','pandemic','epidemic','WHO ','medicine','medical','doctor','nurse','patient','surgery','pharma','clinical trial','mental health','maternal health','malaria','HIV','tuberculosis','cancer','diabetes','nutrition','public health','NHIF','SHA ','biotech','telemedicine','epidemiology'];
const YOUTH_TITLE  = ['youth','young people','youth affairs','youth empowerment','youth development','youth fund','youth employment','youth policy','youth entrepreneurship','youth program','youth initiative','National Youth Service','NYS ','Ajira Digital','young innovators','young Kenyans','youth-led','youth council','young entrepreneurs','graduate unemployment','youth internship','youth training'];
const SPORTS_TITLE = ['football','soccer','world cup','premier league','la liga','champions league','bundesliga','serie a','afcon','athletics','olympics','marathon','rugby','tennis','boxing','formula 1','f1 grand prix','nba','basketball','harambee stars','safari rally','wrc','world rally championship','rally raid','world athletics','diamond league','steeplechase','cross country','tournament','league title','transfer window','fifa','uefa','kenya sevens','shujaa','grand prix','pole position'];
const ENTERTAINMENT_TITLE = ['entertainment','celebrity','music','album','concert','awards show','red carpet','film','movie','premiere','tv drama','tv series','fashion week','fashion','runway','designer','gengetone','bongo flava','afrobeats','sauti sol','kenyan music','kisima awards','groove awards','riverwood','nollywood','bollywood','netflix','box office','soundtrack','artiste','musician','singer'];
const START_TITLE = ['startup','founder','launch','seed funding','pre-seed','incubator','accelerator','pitch','MVP','product launch','scale-up','raise','funding round','entrepreneur','Y Combinator','Techstars','demo day'];

// IT-specific tender keywords — narrows the broad "tender" feed to IT/tech tenders
const IT_TENDER_TITLE = ['ICT','IT ','software','hardware','network','server','cloud',
  'cybersecurity','data center','system supply','ERP','database','website',
  'application development','digital','computer','laptop','router','firewall',
  'CCTV','biometric','e-government','automation','SCADA','telecom'];

const TENDER_TITLE = ['tender','RFP','RFQ','request for proposal','request for quotation',
  'expression of interest','EOI','invitation to bid','ITB','procurement notice',
  'prequalification','pre-qualification'];

// Keywords 4 chars or shorter are prone to false substring matches
// (e.g. "AI" inside "Nairobi", "EV" inside "seven", "ICT" inside "strict")
// — these require a real word boundary; longer phrases are safe with .includes()
function keywordMatchesText(lowerText, keyword) {
  const kw = keyword.toLowerCase();
  if (kw.length <= 4) {
    const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return re.test(lowerText);
  }
  return lowerText.includes(kw);
}

function countMatches(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(kw => keywordMatchesText(lower, kw)).length;
}
function titleMatches(title, keywords) {
  const lower = title.toLowerCase();
  return keywords.some(kw => keywordMatchesText(lower, kw));
}

function categorise(article) {
  const title   = article.title   || '';
  const summary = article.summary || '';
  const combined = `${title} ${summary}`;

  if (TRUSTED_CATEGORY_FEEDS.has(article.source)) return article.category;

  if (titleMatches(title, AGRI_TITLE))   return 'agri';
  if (titleMatches(title, JOB_TITLE))    return 'jobs';
  if (titleMatches(title, EDU_TITLE))    return 'education';
  if (titleMatches(title, HEALTH_TITLE)) return 'health';
  if (titleMatches(title, YOUTH_TITLE))  return 'youth';
  if (titleMatches(title, SPORTS_TITLE)) return 'sports';
  if (titleMatches(title, ENTERTAINMENT_TITLE)) return 'entertainment';

  // Tenders: must mention tender/RFP AND be IT-related to qualify
  if (titleMatches(title, TENDER_TITLE) && titleMatches(combined, IT_TENDER_TITLE)) return 'tenders';
  if (article.category === 'tenders' && titleMatches(combined, IT_TENDER_TITLE)) return 'tenders';

  if (titleMatches(title, START_TITLE))  return 'startup';

  if (titleMatches(title, KEYWORDS.technology) || countMatches(combined, KEYWORDS.technology) >= 2) return 'technology';
  if (titleMatches(title, KEYWORDS.finance)    || countMatches(combined, KEYWORDS.finance)    >= 2) return 'finance';
  if (titleMatches(title, KEYWORDS.investment) || countMatches(combined, KEYWORDS.investment) >= 2) return 'investment';
  if (titleMatches(title, KEYWORDS.politics))   return 'politics';

  return article.category || null;
}

// Different content types have different useful "shelf lives".
// Breaking news is stale within a day; a job or tender listing is
// often still open a week later. Applying one blanket 24h cutoff
// to everything was silently discarding valid job/tender listings
// from feeds that don't republish daily (ReliefWeb, UN Jobs, etc.)
// even though the fetch itself succeeded.
const RECENCY_HOURS = {
  jobs:       24 * 7,   // 7 days — listings stay open
  tenders:    24 * 14,  // 14 days — tender deadlines are usually weeks out
  agri:       24 * 3,   // 3 days
  education:  24 * 5,   // 5 days — research/edu content ages slower
  health:     24 * 3,   // 3 days — outbreak alerts age fast, research slower
  youth:      24 * 5,   // 5 days — programs/policy announcements age slower than news
  startup:    24 * 3,   // 3 days
  investment: 24 * 3,   // 3 days
  // politics, technology, finance default to 24h (fast-moving news)
};
const DEFAULT_RECENCY_HOURS = 24;

function withinWindow(article, category) {
  const hours  = RECENCY_HOURS[category] ?? DEFAULT_RECENCY_HOURS;
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return article.pubDate >= cutoff;
}

// Global job/tender boards (ReliefWeb, etc.) list postings from every
// country. Letting them through unfiltered into a region-specific digest
// means Sudan or Ukraine listings show up under "Kenya jobs" — not useful.
// For these two categories only, a "global"-tagged article must actually
// mention the requested region by name to qualify.
const REGION_LOCALE_KEYWORDS = {
  kenya:       ['kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'],
  nigeria:     ['nigeria', 'nigerian', 'lagos', 'abuja', 'kano', 'naira'],
  ghana:       ['ghana', 'ghanaian', 'accra', 'kumasi', 'cedi'],
  southafrica: ['south africa', 'south african', 'johannesburg', 'cape town', 'pretoria', 'durban', 'rand'],
  uganda:      ['uganda', 'ugandan', 'kampala', 'shilling'],
  africa:      ['africa', 'african', 'nigeria', 'ghana', 'uganda', 'tanzania', 'rwanda', 'ethiopia', 'senegal', 'zambia', 'south africa'],
  usa:         ['united states', 'u.s.', 'usa', 'america', 'washington'],
  europe:      ['europe', 'european union', 'brussels', 'germany', 'france', 'uk ', 'britain', 'spain', 'italy'],
  china:       ['china', 'chinese', 'beijing', 'shanghai'],
  japan:       ['japan', 'japanese', 'tokyo'],
  korea:       ['korea', 'korean', 'seoul'],
};
const REGION_RESTRICTED_CATEGORIES = new Set(['jobs', 'tenders']);

// Some categories are deliberately narrow while the audience is small —
// Politics and Youth Affairs only make sense as Kenya-specific right now,
// regardless of which region someone actually asks for (/usa, /world, etc.).
// Widen this as the audience grows into other countries.
const CATEGORY_REGION_LOCK = {
  politics: 'kenya',
  youth:    'kenya',
};

/**
 * Expand a requested region list so that asking for 'africa' also
 * matches Nigeria/Ghana/South Africa/Uganda/Kenya-tagged articles —
 * without this, /africa would only catch pan-continental sources
 * and miss country-specific ones entirely.
 */
function expandRegions(regionList) {
  if (regionList.includes('africa')) {
    return [...new Set([...regionList, ...AFRICA_SUBREGIONS])];
  }
  return regionList;
}

/**
 * Stories that "serve a typical Kenyan" even when they're not about
 * Kenya at all — the article can be tagged usa/europe/china/etc. and
 * still belong in the Kenya feed if it matches one of these patterns.
 * Based on genuine, sustained Kenyan public interest: diaspora labour
 * conditions abroad, remittances, global fuel/commodity prices that
 * set local pump prices and farmgate income, and infrastructure
 * events (like undersea cable cuts) that have directly disrupted
 * Kenyan daily life before.
 */
const KENYA_RELEVANCE_KEYWORDS = [
  // Diaspora & migration
  'kenyan diaspora', 'diaspora remittance', 'remittance inflow',
  'dv lottery', 'diversity visa', 'us visa lottery', 'h-2b visa',
  'uk work visa', 'gulf labour', 'gulf labor', 'domestic workers abroad',
  'saudi arabia workers', 'qatar workers', 'uae workers', 'kafala system',
  'migrant workers abuse', 'diaspora bond',

  // Global commodities & fuel (directly sets Kenyan pump/farmgate prices)
  'crude oil price', 'brent crude', 'opec', 'fuel prices', 'pump price',
  'diesel price', 'petrol price', 'coffee auction', 'coffee prices',
  'tea auction', 'tea prices', 'horticulture export', 'flower export',

  // Infrastructure events with direct Kenyan impact
  'undersea cable', 'submarine cable', 'internet outage east africa',

  // Aviation (Kenya Airways exposure to global costs)
  'kenya airways', 'jet fuel price',
];

function isKenyaRelevant(article) {
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  return KENYA_RELEVANCE_KEYWORDS.some(kw => haystack.includes(kw.toLowerCase()));
}

function matchesRegion(article, regionList) {
  if (!regionList) return true;
  const expanded = expandRegions(regionList);
  if (expanded.includes(article.region) || article.region === 'global') return true;

  // Let a globally-relevant story into the Kenya feed even if it's
  // tagged to a different region entirely (e.g. a US visa policy
  // story, or a Brent crude price report) — see isKenyaRelevant().
  if (expanded.includes('kenya') && isKenyaRelevant(article)) return true;

  return false;
}

function mentionsRegionLocale(article, regionList) {
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  let hadAnyKeywordList = false;
  for (const region of regionList) {
    const keywords = REGION_LOCALE_KEYWORDS[region];
    if (!keywords) continue;
    hadAnyKeywordList = true;
    if (keywords.some(kw => haystack.includes(kw))) return true;
  }
  return !hadAnyKeywordList; // no keyword lists defined at all — don't over-restrict
}

/**
 * Filter + categorise articles.
 * @param {Array}  articles
 * @param {string|string[]} [region] - single region, or an array to
 *   combine several (e.g. ['kenya','africa'] for Kenya's automated feed).
 */
function filterArticles(articles, region = null) {
  const regionList = region ? (Array.isArray(region) ? region : [region]) : null;
  const validCats   = new Set(Object.keys(KEYWORDS));
  const buckets     = Object.fromEntries([...validCats].map(c => [c, []]));

  for (const article of articles) {
    if (!matchesRegion(article, regionList)) continue;

    const cat = categorise(article);
    if (!cat || !validCats.has(cat)) continue;
    if (!withinWindow(article, cat)) continue;

    // Category-level lock — Politics and Youth stay Kenya-only no matter
    // what region was requested (even /world or /usa won't surface them
    // for other countries yet).
    if (CATEGORY_REGION_LOCK[cat] && article.region !== CATEGORY_REGION_LOCK[cat]) continue;

    // Global job/tender boards only qualify for a region's digest if the
    // posting actually mentions one of the requested regions — otherwise skip it.
    if (regionList && article.region === 'global' && REGION_RESTRICTED_CATEGORIES.has(cat)) {
      if (!mentionsRegionLocale(article, expandRegions(regionList))) continue;
    }

    buckets[cat].push(article);
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

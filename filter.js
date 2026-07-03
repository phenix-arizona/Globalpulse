// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Filter v7
//  Startup category added, strict title-anchoring
// ─────────────────────────────────────────────────────────

const { KEYWORDS } = require('./feeds');

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
  'Disrupt Africa','Ventures Africa','WeeTracker','Crunchbase News',
  'Product Hunt','Hacker News','TechNode','KrASIA','Sifted','EU Startups',
  'Nikkei Business','Inc Magazine','Fast Company',
]);

const AGRI_TITLE  = ['farm','farmer','farming','crop','harvest','livestock','poultry','dairy','drought','irrigation','fertilizer','fertiliser','seed','food security','agribusiness','agrotech','maize','wheat','rice','coffee','horticulture','smallholder','agriculture','agricultural','agri','cereal','grain','pesticide','soil health','food production','famine','hunger','crop yield','land reform','food prices'];
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
];
const EDU_TITLE   = ['education','school','university','college','research','scholarship','curriculum','professor','e-learning','online course','STEM','EdTech','vocational','PhD','discovery','academic'];
const HEALTH_TITLE = ['health','hospital','clinic','disease','outbreak','vaccine','vaccination','pandemic','epidemic','WHO ','medicine','medical','doctor','nurse','patient','surgery','pharma','clinical trial','mental health','maternal health','malaria','HIV','tuberculosis','cancer','diabetes','nutrition','public health','NHIF','SHA ','biotech','telemedicine','epidemiology'];
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
  kenya:  ['kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'],
  africa: ['africa', 'african', 'nigeria', 'ghana', 'uganda', 'tanzania', 'rwanda', 'ethiopia', 'senegal', 'zambia', 'south africa'],
  usa:    ['united states', 'u.s.', 'usa', 'america', 'washington'],
  europe: ['europe', 'european union', 'brussels', 'germany', 'france', 'uk ', 'britain', 'spain', 'italy'],
  china:  ['china', 'chinese', 'beijing', 'shanghai'],
  japan:  ['japan', 'japanese', 'tokyo'],
  korea:  ['korea', 'korean', 'seoul'],
};
const REGION_RESTRICTED_CATEGORIES = new Set(['jobs', 'tenders']);

function matchesRegion(article, regionList) {
  if (!regionList) return true;
  return regionList.includes(article.region) || article.region === 'global';
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

    // Global job/tender boards only qualify for a region's digest if the
    // posting actually mentions one of the requested regions — otherwise skip it.
    if (regionList && article.region === 'global' && REGION_RESTRICTED_CATEGORIES.has(cat)) {
      if (!mentionsRegionLocale(article, regionList)) continue;
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

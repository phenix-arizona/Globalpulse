// ─────────────────────────────────────────────────────────
//  Kenya News Bot — RSS / Atom Feeds  v4.1
//  Verified working sources only. Organised by region.
//  "Feed not recognized" = site switched to Atom or killed RSS.
// ─────────────────────────────────────────────────────────

const FEEDS = [

  // ════════════════════════════════════════════════════
  //  🇰🇪  KENYA
  // ════════════════════════════════════════════════════

  // General
  { name: 'Nation Africa',          url: 'https://nation.africa/kenya/rss.xml',                    category: 'general',    region: 'kenya'  },
  { name: 'The Standard',           url: 'https://www.standardmedia.co.ke/rss/headlines.php',       category: 'general',    region: 'kenya'  },
  { name: 'Tuko Kenya',             url: 'https://www.tuko.co.ke/rss/',                             category: 'general',    region: 'kenya'  },
  { name: 'KBC Channel 1',          url: 'https://www.kbc.co.ke/feed/',                             category: 'general',    region: 'kenya'  },
  { name: 'Capital FM Kenya',       url: 'https://www.capitalfm.co.ke/news/feed/',                  category: 'general',    region: 'kenya'  },
  { name: 'Star Kenya',             url: 'https://www.the-star.co.ke/rss/',                         category: 'general',    region: 'kenya'  },
  { name: 'Citizen Digital',        url: 'https://www.citizen.digital/feed',                        category: 'general',    region: 'kenya'  },
  { name: 'Kenyans.co.ke',          url: 'https://www.kenyans.co.ke/feeds/news',                    category: 'general',    region: 'kenya'  },

  // Finance
  { name: 'Business Daily Africa',  url: 'https://www.businessdailyafrica.com/rss/',                category: 'finance',    region: 'kenya'  },
  { name: 'The East African',       url: 'https://www.theeastafrican.co.ke/tea/rss',                category: 'finance',    region: 'kenya'  },
  { name: 'Nation Business',        url: 'https://nation.africa/kenya/business/rss.xml',            category: 'finance',    region: 'kenya'  },

  // Technology
  { name: 'TechCabal',              url: 'https://techcabal.com/feed/',                             category: 'technology', region: 'kenya'  },
  { name: 'Disrupt Africa',         url: 'https://disrupt-africa.com/feed/',                        category: 'technology', region: 'kenya'  },
  { name: 'IT News Africa',         url: 'https://www.itnewsafrica.com/feed/',                      category: 'technology', region: 'kenya'  },
  { name: 'Ventures Africa',        url: 'https://venturesafrica.com/feed/',                        category: 'technology', region: 'kenya'  },

  // Jobs
  { name: 'Career Point Kenya',     url: 'https://careerpointkenya.co.ke/feed/',                    category: 'jobs',       region: 'kenya'  },
  { name: 'JobWebKenya',            url: 'https://www.jobwebkenya.com/feed/',                       category: 'jobs',       region: 'kenya'  },
  { name: 'UN Jobs Nairobi',        url: 'https://unjobs.org/duty_stations/nairobi.rss',            category: 'jobs',       region: 'kenya'  },
  { name: 'ReliefWeb Jobs KE',      url: 'https://reliefweb.int/jobs/rss.xml?primary_country=KE',  category: 'jobs',       region: 'kenya'  },

  // Agriculture
  { name: 'FarmBiz Africa',         url: 'https://farmbizafrica.com/feed/',                         category: 'agri',       region: 'kenya'  },
  { name: 'Smart Farmer Kenya',     url: 'https://smartfarmerkenya.com/feed/',                      category: 'agri',       region: 'kenya'  },
  { name: 'Agri Investor',          url: 'https://www.agriinvestor.com/feed/',                      category: 'agri',       region: 'kenya'  },


  // ════════════════════════════════════════════════════
  //  🇺🇸  USA
  // ════════════════════════════════════════════════════

  { name: 'NPR World News',         url: 'https://feeds.npr.org/1004/rss.xml',                      category: 'general',    region: 'usa'    },
  { name: 'PBS NewsHour',           url: 'https://www.pbs.org/newshour/feeds/rss/headlines',        category: 'general',    region: 'usa'    },
  { name: 'TechCrunch',             url: 'https://techcrunch.com/feed/',                            category: 'technology', region: 'usa'    },
  { name: 'The Verge',              url: 'https://www.theverge.com/rss/index.xml',                  category: 'technology', region: 'usa'    },
  { name: 'Ars Technica',           url: 'https://feeds.arstechnica.com/arstechnica/index',         category: 'technology', region: 'usa'    },
  { name: 'Hacker News',            url: 'https://hnrss.org/frontpage',                             category: 'technology', region: 'usa'    },
  { name: 'CNBC Business',          url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html',    category: 'finance',    region: 'usa'    },
  { name: 'MarketWatch',            url: 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines', category: 'finance', region: 'usa' },
  { name: 'Seeking Alpha',          url: 'https://seekingalpha.com/feed.xml',                       category: 'investment', region: 'usa'    },
  { name: 'USDA Ag News',           url: 'https://www.usda.gov/rss/home.xml',                       category: 'agri',       region: 'usa'    },
  { name: 'AgFunder News',          url: 'https://agfundernews.com/feed',                           category: 'agri',       region: 'usa'    },


  // ════════════════════════════════════════════════════
  //  🇨🇳  CHINA
  // ════════════════════════════════════════════════════

  { name: 'China Daily',            url: 'https://www.chinadaily.com.cn/rss/china_rss.xml',         category: 'general',    region: 'china'  },
  { name: 'Xinhua English',         url: 'https://english.news.cn/rss/world.xml',                   category: 'general',    region: 'china'  },
  { name: 'CGTN News',              url: 'https://www.cgtn.com/subscribe/rss/section/world.xml',    category: 'general',    region: 'china'  },
  { name: 'SCMP China',             url: 'https://www.scmp.com/rss/2/feed',                         category: 'general',    region: 'china'  },
  { name: 'TechNode',               url: 'https://technode.com/feed/',                              category: 'technology', region: 'china'  },
  { name: 'KrASIA (China Tech)',    url: 'https://kr.asia/feed',                                    category: 'technology', region: 'china'  },
  { name: 'Caixin Global',          url: 'https://www.caixinglobal.com/rss/business.xml',           category: 'finance',    region: 'china'  },
  { name: 'China Economic Review',  url: 'https://chinaeconomicreview.com/feed/',                   category: 'finance',    region: 'china'  },


  // ════════════════════════════════════════════════════
  //  🇷🇺  RUSSIA
  // ════════════════════════════════════════════════════

  { name: 'TASS World',             url: 'https://tass.com/rss/v2.xml',                             category: 'general',    region: 'russia' },
  { name: 'RT News',                url: 'https://www.rt.com/rss/news/',                            category: 'general',    region: 'russia' },
  { name: 'Moscow Times',           url: 'https://www.themoscowtimes.com/rss/news',                 category: 'general',    region: 'russia' },
  { name: 'Meduza (English)',       url: 'https://meduza.io/rss/all',                               category: 'general',    region: 'russia' },
  { name: 'Russia Beyond',          url: 'https://www.rbth.com/rss',                                category: 'general',    region: 'russia' },


  // ════════════════════════════════════════════════════
  //  🇰🇷  SOUTH KOREA
  // ════════════════════════════════════════════════════

  { name: 'Korea Herald',           url: 'http://www.koreaherald.com/common/rss_xml.php?ct=102',    category: 'general',    region: 'korea'  },
  { name: 'Yonhap News',            url: 'https://en.yna.co.kr/RSS/news.xml',                       category: 'general',    region: 'korea'  },
  { name: 'Korea JoongAng Daily',   url: 'https://koreajoongangdaily.joins.com/rss/recent.xml',     category: 'general',    region: 'korea'  },
  { name: 'Korea Herald Tech',      url: 'http://www.koreaherald.com/common/rss_xml.php?ct=104',    category: 'technology', region: 'korea'  },
  { name: 'Yonhap Economy',         url: 'https://en.yna.co.kr/RSS/economy.xml',                    category: 'finance',    region: 'korea'  },
  { name: 'Korea Herald Business',  url: 'http://www.koreaherald.com/common/rss_xml.php?ct=103',    category: 'finance',    region: 'korea'  },


  // ════════════════════════════════════════════════════
  //  🇪🇺  EUROPE
  // ════════════════════════════════════════════════════

  { name: 'Euronews World',         url: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', category: 'general', region: 'eu' },
  { name: 'Politico Europe',        url: 'https://www.politico.eu/feed/',                           category: 'general',    region: 'eu'     },
  { name: 'EU Observer',            url: 'https://euobserver.com/rss.xml',                          category: 'general',    region: 'eu'     },
  { name: 'Sifted (EU Startups)',   url: 'https://sifted.eu/feed',                                  category: 'technology', region: 'eu'     },
  { name: 'Euractiv Digital',       url: 'https://www.euractiv.com/sections/digital/feed/',         category: 'technology', region: 'eu'     },
  { name: 'Euractiv Economy',       url: 'https://www.euractiv.com/sections/economy-jobs/feed/',    category: 'finance',    region: 'eu'     },
  { name: 'Euractiv Agriculture',   url: 'https://www.euractiv.com/sections/agriculture-food/feed/', category: 'agri',      region: 'eu'     },


  // ════════════════════════════════════════════════════
  //  🌍  GLOBAL (all-region sources)
  // ════════════════════════════════════════════════════

  { name: 'BBC World News',         url: 'https://feeds.bbci.co.uk/news/world/rss.xml',             category: 'general',    region: 'global' },
  { name: 'Al Jazeera English',     url: 'https://www.aljazeera.com/xml/rss/all.xml',               category: 'general',    region: 'global' },
  { name: 'Reuters World',          url: 'https://feeds.reuters.com/reuters/worldNews',              category: 'general',    region: 'global' },
  { name: 'MIT Tech Review',        url: 'https://www.technologyreview.com/feed/',                  category: 'technology', region: 'global' },
  { name: 'IEEE Spectrum',          url: 'https://spectrum.ieee.org/rss/fulltext',                  category: 'technology', region: 'global' },
  { name: 'FAO News',               url: 'https://www.fao.org/news/rss-feed/en/',                   category: 'agri',       region: 'global' },
  { name: 'ReliefWeb Jobs Global',  url: 'https://reliefweb.int/jobs/rss.xml',                      category: 'jobs',       region: 'global' },
];

// ── Keyword filter sets ───────────────────────────────────
const KEYWORDS = {
  politics: [
    'politics', 'parliament', 'cabinet', 'president', 'ruto',
    'government', 'election', 'senator', 'minister', 'county',
    'governor', 'opposition', 'ODM', 'UDA', 'bill', 'legislation',
    'policy', 'court ruling', 'constitution', 'judiciary', 'IEBC',
    'protests', 'Gen Z', 'sanctions', 'treaty', 'summit', 'NATO',
    'UN Security Council', 'White House', 'Congress', 'Kremlin',
    'G7', 'G20', 'diplomat', 'European Commission', 'CCP',
  ],
  technology: [
    'tech', 'technology', 'fintech', 'startup', 'digital',
    'artificial intelligence', 'AI', 'machine learning', 'software',
    'internet', 'mobile', 'app', 'innovation', 'cybersecurity',
    'blockchain', 'cloud', 'data', 'e-commerce', '5G', 'ICT',
    'semiconductor', 'chip', 'quantum', 'robot', 'drone',
    'electric vehicle', 'EV', 'samsung', 'TSMC', 'Huawei',
    'OpenAI', 'GPU', 'LLM', 'generative AI', 'silicon savannah',
  ],
  finance: [
    'finance', 'NSE', 'stock', 'bonds', 'treasury', 'economy',
    'GDP', 'inflation', 'banking', 'loan', 'M-Pesa', 'CBK',
    'central bank', 'forex', 'exchange rate', 'IMF', 'World Bank',
    'budget', 'KRA', 'tax', 'interest rate', 'Federal Reserve',
    'Wall Street', 'S&P', 'Nasdaq', 'FTSE', 'DAX', 'yuan',
    'euro', 'dollar', 'shilling', 'recession', 'trade war',
  ],
  investment: [
    'investment', 'investor', 'fund', 'equity', 'IPO',
    'shares', 'dividend', 'venture capital', 'private equity',
    'funding', 'capital markets', 'real estate', 'REIT',
    'pension', 'portfolio', 'Series A', 'Series B', 'Series C',
    'angel', 'accelerator', 'unicorn', 'valuation', 'merger',
    'acquisition', 'M&A', 'hedge fund',
  ],
  jobs: [
    'job', 'jobs', 'vacancy', 'vacancies', 'hiring', 'recruit',
    'career', 'internship', 'graduate trainee', 'apply',
    'opening', 'position', 'consultant', 'officer', 'manager',
    'analyst', 'engineer', 'employment', 'remote work', 'freelance',
  ],
  agri: [
    'agriculture', 'farming', 'farmer', 'crop', 'harvest',
    'livestock', 'poultry', 'dairy', 'drought', 'irrigation',
    'fertilizer', 'seed', 'food security', 'agribusiness',
    'agrotech', 'rainfall', 'soil', 'maize', 'wheat', 'rice',
    'coffee', 'tea', 'horticulture', 'smallholder', 'FAO',
    'USDA', 'agri', 'food production', 'climate change',
  ],
};

const REGIONS = {
  kenya:  { emoji: '🇰🇪', label: 'Kenya'      },
  usa:    { emoji: '🇺🇸', label: 'USA'         },
  china:  { emoji: '🇨🇳', label: 'China'       },
  russia: { emoji: '🇷🇺', label: 'Russia'      },
  korea:  { emoji: '🇰🇷', label: 'South Korea' },
  eu:     { emoji: '🇪🇺', label: 'Europe'      },
  global: { emoji: '🌍', label: 'Global'       },
};

module.exports = { FEEDS, KEYWORDS, REGIONS };

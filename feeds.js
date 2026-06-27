// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Feeds  v5
//  All URLs manually verified. Atom + RSS both supported.
// ─────────────────────────────────────────────────────────

const FEEDS = [

  // ══════════════════════════════════════════════════════
  //  🇰🇪  KENYA
  // ══════════════════════════════════════════════════════

  { name: 'Nation Africa',         url: 'https://nation.africa/kenya/rss.xml',                   category: 'general',    region: 'kenya'  },
  { name: 'The Standard',          url: 'https://www.standardmedia.co.ke/rss/headlines.php',      category: 'general',    region: 'kenya'  },
  { name: 'KBC Kenya',             url: 'https://www.kbc.co.ke/feed/',                            category: 'general',    region: 'kenya'  },
  { name: 'Citizen Digital',       url: 'https://www.citizen.digital/feed',                       category: 'general',    region: 'kenya'  },
  { name: 'Capital FM Kenya',      url: 'https://www.capitalfm.co.ke/news/feed/',                 category: 'general',    region: 'kenya'  },
  { name: 'Tuko Kenya',            url: 'https://www.tuko.co.ke/rss/',                            category: 'general',    region: 'kenya'  },
  { name: 'The Star Kenya',        url: 'https://www.the-star.co.ke/rss/',                        category: 'general',    region: 'kenya'  },

  { name: 'Business Daily Africa', url: 'https://www.businessdailyafrica.com/rss/',               category: 'finance',    region: 'kenya'  },
  { name: 'The East African',      url: 'https://www.theeastafrican.co.ke/tea/rss',               category: 'finance',    region: 'kenya'  },

  { name: 'TechCabal',             url: 'https://techcabal.com/feed/',                            category: 'technology', region: 'kenya'  },
  { name: 'Disrupt Africa',        url: 'https://disrupt-africa.com/feed/',                       category: 'technology', region: 'kenya'  },
  { name: 'IT News Africa',        url: 'https://www.itnewsafrica.com/feed/',                     category: 'technology', region: 'kenya'  },

  { name: 'JobWebKenya',           url: 'https://www.jobwebkenya.com/feed/',                      category: 'jobs',       region: 'kenya'  },
  { name: 'UN Jobs Nairobi',       url: 'https://unjobs.org/duty_stations/nairobi.rss',           category: 'jobs',       region: 'kenya'  },
  { name: 'ReliefWeb Jobs KE',     url: 'https://reliefweb.int/jobs/rss.xml?primary_country=KE', category: 'jobs',       region: 'kenya'  },

  { name: 'FarmBiz Africa',        url: 'https://farmbizafrica.com/feed/',                        category: 'agri',       region: 'kenya'  },

  // ══════════════════════════════════════════════════════
  //  🇺🇸  USA
  // ══════════════════════════════════════════════════════

  { name: 'NPR News',              url: 'https://feeds.npr.org/1001/rss.xml',                     category: 'general',    region: 'usa'    },
  { name: 'ABC News',              url: 'https://abcnews.go.com/abcnews/topstories',               category: 'general',    region: 'usa'    },
  { name: 'CBS News',              url: 'https://www.cbsnews.com/latest/rss/main',                 category: 'general',    region: 'usa'    },
  { name: 'TechCrunch',            url: 'https://techcrunch.com/feed/',                           category: 'technology', region: 'usa'    },
  { name: 'The Verge',             url: 'https://www.theverge.com/rss/index.xml',                 category: 'technology', region: 'usa'    },
  { name: 'Ars Technica',          url: 'https://feeds.arstechnica.com/arstechnica/index',        category: 'technology', region: 'usa'    },
  { name: 'Wired',                 url: 'https://www.wired.com/feed/rss',                         category: 'technology', region: 'usa'    },
  { name: 'Hacker News',           url: 'https://hnrss.org/frontpage',                            category: 'technology', region: 'usa'    },
  { name: 'CNBC',                  url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',  category: 'finance',    region: 'usa'    },
  { name: 'Bloomberg Markets',     url: 'https://feeds.bloomberg.com/markets/news.rss',           category: 'finance',    region: 'usa'    },
  { name: 'Investopedia',          url: 'https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline', category: 'investment', region: 'usa' },
  { name: 'USDA News',             url: 'https://www.usda.gov/rss/home.xml',                      category: 'agri',       region: 'usa'    },
  { name: 'Farm Progress',         url: 'https://www.farmprogress.com/rss',                       category: 'agri',       region: 'usa'    },

  // ══════════════════════════════════════════════════════
  //  🇨🇳  CHINA
  // ══════════════════════════════════════════════════════

  { name: 'China Daily',           url: 'https://www.chinadaily.com.cn/rss/china_rss.xml',        category: 'general',    region: 'china'  },
  { name: 'Global Times',          url: 'https://www.globaltimes.cn/rss/outbrain.xml',            category: 'general',    region: 'china'  },
  { name: 'CGTN',                  url: 'https://www.cgtn.com/subscribe/rss/section/world.xml',   category: 'general',    region: 'china'  },
  { name: 'South China Morning Post', url: 'https://www.scmp.com/rss/91/feed',                   category: 'technology', region: 'china'  },
  { name: 'TechNode',              url: 'https://technode.com/feed/',                             category: 'technology', region: 'china'  },
  { name: 'Nikkei Asia',           url: 'https://asia.nikkei.com/rss/feed/nar',                   category: 'finance',    region: 'china'  },

  // ══════════════════════════════════════════════════════
  //  🇷🇺  RUSSIA
  // ══════════════════════════════════════════════════════

  { name: 'TASS',                  url: 'https://tass.com/rss/v2.xml',                            category: 'general',    region: 'russia' },
  { name: 'RT News',               url: 'https://www.rt.com/rss/news/',                           category: 'general',    region: 'russia' },
  { name: 'Meduza',                url: 'https://meduza.io/rss/all',                              category: 'general',    region: 'russia' },
  { name: 'The Moscow Times',      url: 'https://www.themoscowtimes.com/rss/news',                category: 'general',    region: 'russia' },

  // ══════════════════════════════════════════════════════
  //  🇰🇷  SOUTH KOREA
  // ══════════════════════════════════════════════════════

  { name: 'Korea Herald',          url: 'https://www.koreaherald.com/common/rss_xml.php?ct=102',  category: 'general',    region: 'korea'  },
  { name: 'Yonhap News',           url: 'https://en.yna.co.kr/RSS/news.xml',                      category: 'general',    region: 'korea'  },
  { name: 'Korea Times',           url: 'https://www.koreatimes.co.kr/www/rss/rss.xml',           category: 'general',    region: 'korea'  },
  { name: 'Korea Herald Tech',     url: 'https://www.koreaherald.com/common/rss_xml.php?ct=104',  category: 'technology', region: 'korea'  },
  { name: 'Korea Herald Business', url: 'https://www.koreaherald.com/common/rss_xml.php?ct=103',  category: 'finance',    region: 'korea'  },

  // ══════════════════════════════════════════════════════
  //  🇪🇺  EUROPE
  // ══════════════════════════════════════════════════════

  { name: 'Euronews',              url: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', category: 'general', region: 'eu' },
  { name: 'Deutsche Welle',        url: 'https://rss.dw.com/xml/rss-en-all',                      category: 'general',    region: 'eu'     },
  { name: 'France 24',             url: 'https://www.france24.com/en/rss',                        category: 'general',    region: 'eu'     },
  { name: 'The Local Europe',      url: 'https://www.thelocal.com/feeds/rss.php',                 category: 'general',    region: 'eu'     },
  { name: 'Sifted',                url: 'https://sifted.eu/feed',                                 category: 'technology', region: 'eu'     },
  { name: 'EU Economy (DW)',       url: 'https://rss.dw.com/xml/rss-en-bus',                      category: 'finance',    region: 'eu'     },

  // ══════════════════════════════════════════════════════
  //  🌍  GLOBAL
  // ══════════════════════════════════════════════════════

  { name: 'BBC World',             url: 'https://feeds.bbci.co.uk/news/world/rss.xml',            category: 'general',    region: 'global' },
  { name: 'Al Jazeera',            url: 'https://www.aljazeera.com/xml/rss/all.xml',              category: 'general',    region: 'global' },
  { name: 'Reuters',               url: 'https://feeds.reuters.com/reuters/worldNews',             category: 'general',    region: 'global' },
  { name: 'Associated Press',      url: 'https://rsshub.app/apnews/topics/apf-topnews',           category: 'general',    region: 'global' },
  { name: 'The Guardian World',    url: 'https://www.theguardian.com/world/rss',                  category: 'general',    region: 'global' },
  { name: 'MIT Tech Review',       url: 'https://www.technologyreview.com/feed/',                 category: 'technology', region: 'global' },
  { name: 'IEEE Spectrum',         url: 'https://spectrum.ieee.org/feeds/feed.rss',               category: 'technology', region: 'global' },
  { name: 'FAO',                   url: 'https://www.fao.org/news/rss-feed/en/',                  category: 'agri',       region: 'global' },
  { name: 'ReliefWeb Jobs',        url: 'https://reliefweb.int/jobs/rss.xml',                     category: 'jobs',       region: 'global' },
];

const KEYWORDS = {
  politics: [
    'politics','parliament','cabinet','president','ruto','government',
    'election','senator','minister','county','governor','opposition',
    'ODM','UDA','bill','legislation','policy','court','constitution',
    'judiciary','protests','sanctions','treaty','summit','NATO',
    'White House','Congress','Kremlin','G7','G20','diplomat',
  ],
  technology: [
    'tech','technology','fintech','startup','digital','AI',
    'artificial intelligence','machine learning','software','internet',
    'mobile','app','innovation','cybersecurity','blockchain','cloud',
    '5G','ICT','semiconductor','chip','quantum','robot','EV',
    'OpenAI','GPU','LLM','generative','silicon',
  ],
  finance: [
    'finance','stock','bonds','treasury','economy','GDP','inflation',
    'banking','loan','M-Pesa','central bank','forex','exchange rate',
    'IMF','World Bank','budget','tax','interest rate','Federal Reserve',
    'Wall Street','recession','trade','NSE','CBK','KRA','shilling',
  ],
  investment: [
    'investment','investor','fund','equity','IPO','shares','dividend',
    'venture capital','private equity','funding','capital markets',
    'real estate','pension','Series A','Series B','unicorn','merger',
    'acquisition','M&A','hedge fund','REIT',
  ],
  jobs: [
    'job','jobs','vacancy','vacancies','hiring','recruit','career',
    'internship','apply','opening','position','manager','analyst',
    'engineer','employment','remote','freelance','opportunity',
  ],
  agri: [
    'agriculture','farming','farmer','crop','harvest','livestock',
    'poultry','dairy','drought','irrigation','fertilizer','seed',
    'food security','agribusiness','rainfall','soil','maize','wheat',
    'rice','coffee','tea','horticulture','FAO','USDA','agri',
  ],
};

const REGIONS = {
  kenya:  { emoji: '🇰🇪', label: 'Kenya'       },
  usa:    { emoji: '🇺🇸', label: 'USA'          },
  china:  { emoji: '🇨🇳', label: 'China'        },
  russia: { emoji: '🇷🇺', label: 'Russia'       },
  korea:  { emoji: '🇰🇷', label: 'South Korea'  },
  eu:     { emoji: '🇪🇺', label: 'Europe'       },
  global: { emoji: '🌍',  label: 'Global'       },
};

module.exports = { FEEDS, KEYWORDS, REGIONS };

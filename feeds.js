// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Feeds v7
//  Categories: politics, finance, technology, investment,
//              jobs, agri, education
//  Regions: kenya, usa, china, russia, korea, eu, global
// ─────────────────────────────────────────────────────────

const FEEDS = [

  // ══════════════════════════════════════
  //  🇰🇪  KENYA
  // ══════════════════════════════════════
  { name: 'Nation Africa',          url: 'https://nation.africa/kenya/rss.xml',                    category: 'general',    region: 'kenya'  },
  { name: 'The Standard',           url: 'https://www.standardmedia.co.ke/rss/headlines.php',       category: 'general',    region: 'kenya'  },
  { name: 'KBC Kenya',              url: 'https://www.kbc.co.ke/feed/',                             category: 'general',    region: 'kenya'  },
  { name: 'Capital FM Kenya',       url: 'https://www.capitalfm.co.ke/news/feed/',                  category: 'general',    region: 'kenya'  },
  { name: 'Citizen Digital',        url: 'https://www.citizen.digital/feed',                        category: 'general',    region: 'kenya'  },
  { name: 'Business Daily Africa',  url: 'https://www.businessdailyafrica.com/rss/',                category: 'finance',    region: 'kenya'  },
  { name: 'The East African',       url: 'https://www.theeastafrican.co.ke/tea/rss',                category: 'finance',    region: 'kenya'  },
  { name: 'TechCabal',              url: 'https://techcabal.com/feed/',                             category: 'technology', region: 'kenya'  },
  { name: 'IT News Africa',         url: 'https://www.itnewsafrica.com/feed/',                      category: 'technology', region: 'kenya'  },
  { name: 'Disrupt Africa',         url: 'https://disrupt-africa.com/feed/',                        category: 'technology', region: 'kenya'  },
  { name: 'JobWebKenya',            url: 'https://www.jobwebkenya.com/feed/',                       category: 'jobs',       region: 'kenya'  },
  { name: 'ReliefWeb Jobs KE',      url: 'https://reliefweb.int/jobs/rss.xml?primary_country=KE',  category: 'jobs',       region: 'kenya'  },
  { name: 'FarmBiz Africa',         url: 'https://farmbizafrica.com/feed/',                         category: 'agri',       region: 'kenya'  },

  // ══════════════════════════════════════
  //  🇺🇸  USA
  // ══════════════════════════════════════
  { name: 'NPR News',               url: 'https://feeds.npr.org/1001/rss.xml',                      category: 'general',    region: 'usa'    },
  { name: 'ABC News',               url: 'https://abcnews.go.com/abcnews/topstories',                category: 'general',    region: 'usa'    },
  { name: 'CBS News',               url: 'https://www.cbsnews.com/latest/rss/main',                  category: 'general',    region: 'usa'    },
  { name: 'TechCrunch',             url: 'https://techcrunch.com/feed/',                            category: 'technology', region: 'usa'    },
  { name: 'The Verge',              url: 'https://www.theverge.com/rss/index.xml',                  category: 'technology', region: 'usa'    },
  { name: 'Ars Technica',           url: 'https://feeds.arstechnica.com/arstechnica/index',         category: 'technology', region: 'usa'    },
  { name: 'Wired',                  url: 'https://www.wired.com/feed/rss',                          category: 'technology', region: 'usa'    },
  { name: 'Hacker News',            url: 'https://hnrss.org/frontpage',                             category: 'technology', region: 'usa'    },
  { name: 'CNBC',                   url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',   category: 'finance',    region: 'usa'    },
  { name: 'MarketWatch',            url: 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines', category: 'finance', region: 'usa' },
  { name: 'USDA News',              url: 'https://www.usda.gov/rss/home.xml',                       category: 'agri',       region: 'usa'    },
  { name: 'EdSurge',                url: 'https://edsurge.com/news.rss',                            category: 'education',  region: 'usa'    },
  { name: 'Education Week',         url: 'https://www.edweek.org/feed/rss/news.rss',                category: 'education',  region: 'usa'    },
  { name: 'Chronicle of Higher Ed', url: 'https://www.chronicle.com/blogs/ticker/feed',             category: 'education',  region: 'usa'    },

  // ══════════════════════════════════════
  //  🇨🇳  CHINA
  // ══════════════════════════════════════
  { name: 'China Daily',            url: 'https://www.chinadaily.com.cn/rss/china_rss.xml',         category: 'general',    region: 'china'  },
  { name: 'Global Times',           url: 'https://www.globaltimes.cn/rss/outbrain.xml',             category: 'general',    region: 'china'  },
  { name: 'CGTN',                   url: 'https://www.cgtn.com/subscribe/rss/section/world.xml',    category: 'general',    region: 'china'  },
  { name: 'Nikkei Asia',            url: 'https://asia.nikkei.com/rss/feed/nar',                    category: 'finance',    region: 'china'  },
  { name: 'South China Morning Post', url: 'https://www.scmp.com/rss/91/feed',                    category: 'technology', region: 'china'  },

  // ══════════════════════════════════════
  //  🇷🇺  RUSSIA
  // ══════════════════════════════════════
  { name: 'TASS',                   url: 'https://tass.com/rss/v2.xml',                             category: 'general',    region: 'russia' },
  { name: 'RT News',                url: 'https://www.rt.com/rss/news/',                            category: 'general',    region: 'russia' },
  { name: 'Meduza',                 url: 'https://meduza.io/rss/all',                               category: 'general',    region: 'russia' },
  { name: 'The Moscow Times',       url: 'https://www.themoscowtimes.com/rss/news',                 category: 'general',    region: 'russia' },

  // ══════════════════════════════════════
  //  🇰🇷  SOUTH KOREA
  // ══════════════════════════════════════
  { name: 'Korea Herald',           url: 'https://www.koreaherald.com/common/rss_xml.php?ct=102',   category: 'general',    region: 'korea'  },
  { name: 'Yonhap News',            url: 'https://en.yna.co.kr/RSS/news.xml',                       category: 'general',    region: 'korea'  },
  { name: 'Korea Times',            url: 'https://www.koreatimes.co.kr/www/rss/rss.xml',            category: 'general',    region: 'korea'  },
  { name: 'Korea Herald Tech',      url: 'https://www.koreaherald.com/common/rss_xml.php?ct=104',   category: 'technology', region: 'korea'  },
  { name: 'Korea Herald Business',  url: 'https://www.koreaherald.com/common/rss_xml.php?ct=103',   category: 'finance',    region: 'korea'  },

  // ══════════════════════════════════════
  //  🇪🇺  EUROPE
  // ══════════════════════════════════════
  { name: 'Deutsche Welle',         url: 'https://rss.dw.com/xml/rss-en-all',                       category: 'general',    region: 'eu'     },
  { name: 'France 24',              url: 'https://www.france24.com/en/rss',                         category: 'general',    region: 'eu'     },
  { name: 'Euronews',               url: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', category: 'general', region: 'eu' },
  { name: 'Sifted',                 url: 'https://sifted.eu/feed',                                  category: 'technology', region: 'eu'     },
  { name: 'DW Business',            url: 'https://rss.dw.com/xml/rss-en-bus',                       category: 'finance',    region: 'eu'     },

  // ══════════════════════════════════════
  //  🌍  GLOBAL
  // ══════════════════════════════════════
  { name: 'BBC World',              url: 'https://feeds.bbci.co.uk/news/world/rss.xml',             category: 'general',    region: 'global' },
  { name: 'Al Jazeera',             url: 'https://www.aljazeera.com/xml/rss/all.xml',               category: 'general',    region: 'global' },
  { name: 'The Guardian World',     url: 'https://www.theguardian.com/world/rss',                   category: 'general',    region: 'global' },
  { name: 'The Guardian Tech',      url: 'https://www.theguardian.com/technology/rss',              category: 'technology', region: 'global' },
  { name: 'The Guardian Business',  url: 'https://www.theguardian.com/business/rss',                category: 'finance',    region: 'global' },
  { name: 'MIT Tech Review',        url: 'https://www.technologyreview.com/feed/',                  category: 'technology', region: 'global' },
  { name: 'IEEE Spectrum',          url: 'https://spectrum.ieee.org/feeds/feed.rss',                category: 'technology', region: 'global' },
  { name: 'ReliefWeb Jobs',         url: 'https://reliefweb.int/jobs/rss.xml',                      category: 'jobs',       region: 'global' },
  { name: 'FAO',                    url: 'https://www.fao.org/news/rss-feed/en/',                   category: 'agri',       region: 'global' },
  { name: 'Nature News',            url: 'https://www.nature.com/nature.rss',                       category: 'education',  region: 'global' },
  { name: 'Science Daily',          url: 'https://www.sciencedaily.com/rss/all.xml',                category: 'education',  region: 'global' },
  { name: 'The Conversation',       url: 'https://theconversation.com/global/articles.atom',        category: 'education',  region: 'global' },
  { name: 'TED Ideas',              url: 'https://feeds.feedburner.com/tedtalks_video',             category: 'education',  region: 'global' },
  { name: 'Smithsonian Magazine',   url: 'https://www.smithsonianmag.com/rss/latest_articles/',     category: 'education',  region: 'global' },
  { name: 'Big Think',              url: 'https://bigthink.com/feed/',                              category: 'education',  region: 'global' },
  { name: 'Harvard Business Review', url: 'https://hbr.org/stories.rss',                           category: 'education',  region: 'global' },
  { name: 'World Economic Forum',   url: 'https://www.weforum.org/agenda/feed/',                    category: 'education',  region: 'global' },
];

// ── Keywords ──────────────────────────────────────────────
const KEYWORDS = {
  politics: [
    'politics','parliament','cabinet','president','ruto','government',
    'election','senator','minister','county','governor','opposition',
    'ODM','UDA','bill','legislation','policy','court ruling','constitution',
    'judiciary','protests','sanctions','treaty','summit','NATO',
    'White House','Congress','Kremlin','G7','G20','diplomat','coup',
    'referendum','impeach','veto','geopolitics','ceasefire','war',
  ],
  technology: [
    'tech','technology','fintech','startup','digital','AI',
    'artificial intelligence','machine learning','software','internet',
    'mobile','app','innovation','cybersecurity','blockchain','cloud',
    '5G','ICT','semiconductor','chip','quantum','robot','drone','EV',
    'electric vehicle','OpenAI','GPU','LLM','generative AI','silicon',
    'data center','automation','deepfake','metaverse','space tech',
  ],
  finance: [
    'finance','stock market','bonds','treasury','economy','GDP','inflation',
    'banking','loan','M-Pesa','central bank','forex','exchange rate',
    'IMF','World Bank','budget','tax','interest rate','Federal Reserve',
    'Wall Street','recession','trade deficit','NSE','CBK','KRA','shilling',
    'cryptocurrency','bitcoin','dollar','euro','yuan','IPO market',
  ],
  investment: [
    'investment','investor','fund','equity','IPO','shares','dividend',
    'venture capital','private equity','funding round','capital markets',
    'real estate','pension fund','Series A','Series B','Series C',
    'unicorn','valuation','merger','acquisition','M&A','hedge fund',
    'REIT','portfolio','angel investor','accelerator','crowdfunding',
  ],
  jobs: [
    'job opening','job vacancy','vacancies','hiring','recruitment','career',
    'internship','graduate trainee','apply now','employment opportunity',
    'remote job','work from home','freelance','contract role',
    'job fair','talent','workforce','layoff','retrenchment',
  ],
  agri: [
    'agriculture','agricultural','farming','farmer','crop','harvest',
    'livestock','poultry','dairy','drought','irrigation','fertilizer',
    'fertiliser','seed','food security','agribusiness','agrotech',
    'maize','wheat','rice','coffee','tea plantation','horticulture',
    'smallholder','food production','famine','hunger','crop yield',
    'land reform','pesticide','soil health','food prices','grain',
  ],
  education: [
    'education','school','university','college','student','learning',
    'research','science','study','academic','scholarship','curriculum',
    'professor','teacher','classroom','e-learning','online course',
    'STEM','literacy','knowledge','discovery','innovation in education',
    'higher education','EdTech','skills','training','vocational',
    'exam','degree','PhD','graduate','undergraduate','tuition',
  ],
};

const REGIONS = {
  kenya:  { emoji: '🇰🇪', label: 'Kenya'      },
  usa:    { emoji: '🇺🇸', label: 'USA'         },
  china:  { emoji: '🇨🇳', label: 'China'       },
  russia: { emoji: '🇷🇺', label: 'Russia'      },
  korea:  { emoji: '🇰🇷', label: 'South Korea' },
  eu:     { emoji: '🇪🇺', label: 'Europe'      },
  global: { emoji: '🌍',  label: 'Global'      },
};

module.exports = { FEEDS, KEYWORDS, REGIONS };

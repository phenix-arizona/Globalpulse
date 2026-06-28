// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Feeds v8
//  Categories : politics, technology, innovation, business,
//               agriculture, education, finance, investment,
//               startup, research, jobs
//  Regions    : kenya, africa, usa, europe, china, japan,
//               korea, global
// ─────────────────────────────────────────────────────────

const FEEDS = [

  // ══════════════════════════════════════
  //  🇰🇪  KENYA
  // ══════════════════════════════════════
  { name: 'Nation Africa',           url: 'https://nation.africa/kenya/rss.xml',                    category: 'politics',    region: 'kenya'  },
  { name: 'The Standard',            url: 'https://www.standardmedia.co.ke/rss/headlines.php',       category: 'politics',    region: 'kenya'  },
  { name: 'KBC Kenya',               url: 'https://www.kbc.co.ke/feed/',                             category: 'politics',    region: 'kenya'  },
  { name: 'Citizen Digital',         url: 'https://www.citizen.digital/feed',                        category: 'politics',    region: 'kenya'  },
  { name: 'Capital FM Kenya',        url: 'https://www.capitalfm.co.ke/news/feed/',                  category: 'politics',    region: 'kenya'  },
  { name: 'Business Daily Africa',   url: 'https://www.businessdailyafrica.com/rss/',                category: 'business',    region: 'kenya'  },
  { name: 'The East African',        url: 'https://www.theeastafrican.co.ke/tea/rss',                category: 'business',    region: 'kenya'  },
  { name: 'TechCabal',               url: 'https://techcabal.com/feed/',                             category: 'technology',  region: 'kenya'  },
  { name: 'IT News Africa',          url: 'https://www.itnewsafrica.com/feed/',                      category: 'technology',  region: 'kenya'  },
  { name: 'Disrupt Africa',          url: 'https://disrupt-africa.com/feed/',                        category: 'startup',     region: 'kenya'  },
  { name: 'VC4A Blog',               url: 'https://vc4a.com/blog/feed/',                             category: 'startup',     region: 'kenya'  },
  { name: 'FarmBiz Africa',          url: 'https://farmbizafrica.com/feed/',                         category: 'agriculture', region: 'kenya'  },
  { name: 'Smart Farmer Kenya',      url: 'https://www.smartfarmerke.com/feed/',                     category: 'agriculture', region: 'kenya'  },
  { name: 'JobWebKenya',             url: 'https://www.jobwebkenya.com/feed/',                       category: 'jobs',        region: 'kenya'  },
  { name: 'ReliefWeb Jobs KE',       url: 'https://reliefweb.int/jobs/rss.xml?primary_country=KE',  category: 'jobs',        region: 'kenya'  },

  // ══════════════════════════════════════
  //  🌍  AFRICA
  // ══════════════════════════════════════
  { name: 'AllAfrica',               url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', category: 'politics',    region: 'africa' },
  { name: 'African Arguments',       url: 'https://africanarguments.org/feed/',                      category: 'politics',    region: 'africa' },
  { name: 'The Africa Report',       url: 'https://www.theafricareport.com/feed/',                   category: 'politics',    region: 'africa' },
  { name: 'Quartz Africa',           url: 'https://qz.com/africa/rss',                               category: 'business',    region: 'africa' },
  { name: 'African Business',        url: 'https://african.business/feed/',                           category: 'business',    region: 'africa' },
  { name: 'How We Made It Africa',   url: 'https://howwemadeitinafrica.com/feed/',                   category: 'business',    region: 'africa' },
  { name: 'TechCabal (Africa)',      url: 'https://techcabal.com/feed/',                             category: 'technology',  region: 'africa' },
  { name: 'Ventures Africa',         url: 'https://venturesafrica.com/feed/',                        category: 'startup',     region: 'africa' },
  { name: 'Disrupt Africa (wide)',   url: 'https://disrupt-africa.com/feed/',                        category: 'startup',     region: 'africa' },
  { name: 'AGRA Africa',             url: 'https://agra.org/feed/',                                  category: 'agriculture', region: 'africa' },
  { name: 'RUFORUM',                 url: 'https://www.ruforum.org/feed/',                           category: 'education',   region: 'africa' },
  { name: 'University World News',   url: 'https://www.universityworldnews.com/rss.php',             category: 'education',   region: 'africa' },
  { name: 'African Research Initiative', url: 'https://www.nature.com/natafrica.rss',               category: 'research',    region: 'africa' },

  // ══════════════════════════════════════
  //  🇺🇸  USA
  // ══════════════════════════════════════
  { name: 'NPR Politics',            url: 'https://feeds.npr.org/1014/rss.xml',                      category: 'politics',    region: 'usa'    },
  { name: 'Politico',                url: 'https://www.politico.com/rss/politicopicks.xml',           category: 'politics',    region: 'usa'    },
  { name: 'The Hill',                url: 'https://thehill.com/rss/syndicator/19110',                 category: 'politics',    region: 'usa'    },
  { name: 'TechCrunch',              url: 'https://techcrunch.com/feed/',                            category: 'technology',  region: 'usa'    },
  { name: 'The Verge',               url: 'https://www.theverge.com/rss/index.xml',                  category: 'technology',  region: 'usa'    },
  { name: 'Wired',                   url: 'https://www.wired.com/feed/rss',                          category: 'innovation',  region: 'usa'    },
  { name: 'MIT Tech Review',         url: 'https://www.technologyreview.com/feed/',                  category: 'innovation',  region: 'usa'    },
  { name: 'Ars Technica',            url: 'https://feeds.arstechnica.com/arstechnica/index',         category: 'technology',  region: 'usa'    },
  { name: 'Hacker News',             url: 'https://hnrss.org/frontpage',                             category: 'technology',  region: 'usa'    },
  { name: 'Forbes Tech',             url: 'https://www.forbes.com/innovation/feed2',                 category: 'innovation',  region: 'usa'    },
  { name: 'Bloomberg Technology',    url: 'https://feeds.bloomberg.com/technology/news.rss',         category: 'technology',  region: 'usa'    },
  { name: 'CNBC',                    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',   category: 'business',    region: 'usa'    },
  { name: 'Harvard Business Review', url: 'https://hbr.org/stories.rss',                            category: 'business',    region: 'usa'    },
  { name: 'Fortune',                 url: 'https://fortune.com/feed/',                               category: 'business',    region: 'usa'    },
  { name: 'Inc Magazine',            url: 'https://www.inc.com/rss',                                 category: 'startup',     region: 'usa'    },
  { name: 'TechCrunch Startups',     url: 'https://techcrunch.com/category/startups/feed/',          category: 'startup',     region: 'usa'    },
  { name: 'USDA News',               url: 'https://www.usda.gov/rss/home.xml',                       category: 'agriculture', region: 'usa'    },
  { name: 'AgWeb',                   url: 'https://www.agweb.com/rss.xml',                           category: 'agriculture', region: 'usa'    },
  { name: 'EdSurge',                 url: 'https://edsurge.com/news.rss',                            category: 'education',   region: 'usa'    },
  { name: 'Education Week',          url: 'https://www.edweek.org/feed/rss/news.rss',                category: 'education',   region: 'usa'    },
  { name: 'Chronicle of Higher Ed',  url: 'https://www.chronicle.com/blogs/ticker/feed',             category: 'education',   region: 'usa'    },
  { name: 'Science Daily',           url: 'https://www.sciencedaily.com/rss/all.xml',                category: 'research',    region: 'usa'    },
  { name: 'Nature News',             url: 'https://www.nature.com/nature.rss',                       category: 'research',    region: 'usa'    },
  { name: 'MarketWatch',             url: 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines', category: 'finance', region: 'usa' },

  // ══════════════════════════════════════
  //  🇪🇺  EUROPE
  // ══════════════════════════════════════
  { name: 'Deutsche Welle',          url: 'https://rss.dw.com/xml/rss-en-all',                       category: 'politics',    region: 'europe' },
  { name: 'France 24',               url: 'https://www.france24.com/en/rss',                         category: 'politics',    region: 'europe' },
  { name: 'Euronews',                url: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', category: 'politics', region: 'europe' },
  { name: 'Politico Europe',         url: 'https://www.politico.eu/feed/',                           category: 'politics',    region: 'europe' },
  { name: 'Sifted',                  url: 'https://sifted.eu/feed',                                  category: 'startup',     region: 'europe' },
  { name: 'EU-Startups',             url: 'https://www.eu-startups.com/feed/',                       category: 'startup',     region: 'europe' },
  { name: 'DW Business',             url: 'https://rss.dw.com/xml/rss-en-bus',                       category: 'business',    region: 'europe' },
  { name: 'Financial Times',         url: 'https://www.ft.com/rss/home/us',                          category: 'finance',     region: 'europe' },
  { name: 'The Economist',           url: 'https://www.economist.com/sections/economics/rss.xml',    category: 'business',    region: 'europe' },
  { name: 'European Innovation',     url: 'https://ec.europa.eu/newsroom/horizon2020/rss-feeds.cfm', category: 'innovation',  region: 'europe' },
  { name: 'Research Europe',         url: 'https://www.researchprofessionalnews.com/rss/',           category: 'research',    region: 'europe' },

  // ══════════════════════════════════════
  //  🇨🇳  CHINA
  // ══════════════════════════════════════
  { name: 'China Daily',             url: 'https://www.chinadaily.com.cn/rss/china_rss.xml',         category: 'politics',    region: 'china'  },
  { name: 'Global Times',            url: 'https://www.globaltimes.cn/rss/outbrain.xml',             category: 'politics',    region: 'china'  },
  { name: 'CGTN',                    url: 'https://www.cgtn.com/subscribe/rss/section/world.xml',    category: 'politics',    region: 'china'  },
  { name: 'South China Morning Post',url: 'https://www.scmp.com/rss/91/feed',                        category: 'technology',  region: 'china'  },
  { name: 'SCMP Business',           url: 'https://www.scmp.com/rss/92/feed',                        category: 'business',    region: 'china'  },
  { name: 'China Daily Tech',        url: 'https://www.chinadaily.com.cn/rss/business_rss.xml',      category: 'business',    region: 'china'  },
  { name: 'China Xinhua Sci-Tech',   url: 'https://english.news.cn/science/index.htm.rss',           category: 'innovation',  region: 'china'  },
  { name: 'Caixin Global',           url: 'https://www.caixinglobal.com/rss/feed.xml',               category: 'finance',     region: 'china'  },
  { name: 'China Agri News',         url: 'https://www.chinadaily.com.cn/rss/china_rss.xml',         category: 'agriculture', region: 'china'  },

  // ══════════════════════════════════════
  //  🇯🇵  JAPAN
  // ══════════════════════════════════════
  { name: 'Japan Times',             url: 'https://www.japantimes.co.jp/feed/topstories/',            category: 'politics',    region: 'japan'  },
  { name: 'NHK World',               url: 'https://www3.nhk.or.jp/nhkworld/en/news/feeds/',           category: 'politics',    region: 'japan'  },
  { name: 'Nikkei Asia',             url: 'https://asia.nikkei.com/rss/feed/nar',                    category: 'business',    region: 'japan'  },
  { name: 'Japan Times Business',    url: 'https://www.japantimes.co.jp/feed/business/',              category: 'business',    region: 'japan'  },
  { name: 'Japan Times Tech',        url: 'https://www.japantimes.co.jp/feed/tech/',                  category: 'technology',  region: 'japan'  },
  { name: 'IEEE Spectrum Japan',     url: 'https://spectrum.ieee.org/feeds/feed.rss',                 category: 'innovation',  region: 'japan'  },
  { name: 'Asia Nikkei Tech',        url: 'https://asia.nikkei.com/rss/feed/technology',             category: 'innovation',  region: 'japan'  },
  { name: 'Japan Agri News',         url: 'https://www.japantimes.co.jp/feed/',                       category: 'agriculture', region: 'japan'  },
  { name: 'Times Higher Ed Japan',   url: 'https://www.timeshighereducation.com/hub/shimizu-corporation/p/rss.xml', category: 'education', region: 'japan' },

  // ══════════════════════════════════════
  //  🇰🇷  SOUTH KOREA
  // ══════════════════════════════════════
  { name: 'Korea Herald',            url: 'https://www.koreaherald.com/common/rss_xml.php?ct=102',   category: 'politics',    region: 'korea'  },
  { name: 'Yonhap News',             url: 'https://en.yna.co.kr/RSS/news.xml',                       category: 'politics',    region: 'korea'  },
  { name: 'Korea Times',             url: 'https://www.koreatimes.co.kr/www/rss/rss.xml',            category: 'politics',    region: 'korea'  },
  { name: 'Korea Herald Tech',       url: 'https://www.koreaherald.com/common/rss_xml.php?ct=104',   category: 'technology',  region: 'korea'  },
  { name: 'Korea Herald Business',   url: 'https://www.koreaherald.com/common/rss_xml.php?ct=103',   category: 'business',    region: 'korea'  },
  { name: 'Korea Joongang Daily',    url: 'https://koreajoongangdaily.joins.com/rss/RssFeeds.aspx',  category: 'innovation',  region: 'korea'  },
  { name: 'ETNews Korea',            url: 'https://english.etnews.com/rss',                           category: 'innovation',  region: 'korea'  },
  { name: 'Korea Biotech',           url: 'https://www.koreabiomed.com/news/articleList.html?sc_section_code=S1N1&view_type=sm&rss=rss', category: 'research', region: 'korea' },

  // ══════════════════════════════════════
  //  🌍  GLOBAL
  // ══════════════════════════════════════
  { name: 'BBC World',               url: 'https://feeds.bbci.co.uk/news/world/rss.xml',             category: 'politics',    region: 'global' },
  { name: 'Al Jazeera',              url: 'https://www.aljazeera.com/xml/rss/all.xml',               category: 'politics',    region: 'global' },
  { name: 'The Guardian World',      url: 'https://www.theguardian.com/world/rss',                   category: 'politics',    region: 'global' },
  { name: 'The Guardian Tech',       url: 'https://www.theguardian.com/technology/rss',              category: 'technology',  region: 'global' },
  { name: 'The Guardian Business',   url: 'https://www.theguardian.com/business/rss',                category: 'business',    region: 'global' },
  { name: 'IEEE Spectrum',           url: 'https://spectrum.ieee.org/feeds/feed.rss',                category: 'innovation',  region: 'global' },
  { name: 'World Economic Forum',    url: 'https://www.weforum.org/agenda/feed/',                    category: 'innovation',  region: 'global' },
  { name: 'McKinsey Insights',       url: 'https://www.mckinsey.com/feeds/rss/mgi',                  category: 'business',    region: 'global' },
  { name: 'Deloitte Insights',       url: 'https://www2.deloitte.com/global/en/insights.rss',        category: 'business',    region: 'global' },
  { name: 'FAO',                     url: 'https://www.fao.org/news/rss-feed/en/',                   category: 'agriculture', region: 'global' },
  { name: 'CGIAR News',              url: 'https://www.cgiar.org/feed/',                             category: 'agriculture', region: 'global' },
  { name: 'The Conversation',        url: 'https://theconversation.com/global/articles.atom',        category: 'education',   region: 'global' },
  { name: 'TED Ideas',               url: 'https://feeds.feedburner.com/tedtalks_video',             category: 'education',   region: 'global' },
  { name: 'UNESCO Education',        url: 'https://www.unesco.org/en/rss/education',                 category: 'education',   region: 'global' },
  { name: 'Nature Research',         url: 'https://www.nature.com/nature.rss',                       category: 'research',    region: 'global' },
  { name: 'Science Magazine',        url: 'https://www.science.org/rss/news_current.xml',            category: 'research',    region: 'global' },
  { name: 'NBER Research',           url: 'https://www.nber.org/rss/new_working_papers.rss',         category: 'research',    region: 'global' },
  { name: 'CB Insights',             url: 'https://www.cbinsights.com/research/rss/feed.xml',        category: 'startup',     region: 'global' },
  { name: 'Crunchbase News',         url: 'https://news.crunchbase.com/feed/',                       category: 'startup',     region: 'global' },
  { name: 'ReliefWeb Jobs',          url: 'https://reliefweb.int/jobs/rss.xml',                      category: 'jobs',        region: 'global' },
  { name: 'Finance & Development IMF', url: 'https://www.imf.org/en/News/rss?language=eng',         category: 'finance',     region: 'global' },
];

// ── Keywords ──────────────────────────────────────────────
const KEYWORDS = {
  politics: [
    'politics','parliament','cabinet','president','ruto','government',
    'election','senator','minister','county','governor','opposition',
    'ODM','UDA','bill','legislation','policy','court ruling','constitution',
    'judiciary','protests','sanctions','treaty','summit','NATO',
    'White House','Congress','G7','G20','diplomat','coup',
    'referendum','impeach','veto','geopolitics','ceasefire','war',
    'political','regime','democracy','autocracy','vote','ballot',
    'prime minister','head of state','foreign affairs','ministry',
  ],
  technology: [
    'tech','technology','fintech','digital','AI','artificial intelligence',
    'machine learning','software','internet','mobile','app','cybersecurity',
    'blockchain','cloud','5G','ICT','semiconductor','chip','quantum',
    'robot','drone','EV','electric vehicle','GPU','LLM','generative AI',
    'silicon','data center','automation','deepfake','metaverse','space tech',
    'OpenAI','Google','Microsoft','Apple','Samsung','TSMC','Nvidia',
    'smartphone','operating system','algorithm','programming','developer',
  ],
  innovation: [
    'innovation','innovate','breakthrough','discovery','invention',
    'patent','prototype','R&D','research and development','disruptive',
    'next-generation','cutting-edge','emerging technology','frontier',
    'lab-grown','synthetic biology','nanotechnology','gene editing',
    'CRISPR','space exploration','satellite','rocket','renewable energy',
    'solar','wind energy','battery technology','hydrogen','fusion',
    'autonomous','self-driving','wearable','smart device','Internet of Things',
    'IoT','augmented reality','AR','VR','virtual reality','deep tech',
  ],
  business: [
    'business','company','corporate','CEO','executive','revenue','profit',
    'market share','quarterly results','earnings','annual report',
    'merger','acquisition','expansion','supply chain','logistics',
    'manufacturing','retail','e-commerce','trade','export','import',
    'partnership','joint venture','franchise','brand','marketing',
    'consumer','customer','demand','industry','sector','enterprise',
    'SME','SMB','conglomerate','holding company','subsidiary',
    'Toyota','Sony','Hyundai','Samsung','Alibaba','Tencent',
  ],
  agriculture: [
    'agriculture','agricultural','farming','farmer','crop','harvest',
    'livestock','poultry','dairy','drought','irrigation','fertilizer',
    'fertiliser','seed','food security','agribusiness','agrotech',
    'maize','wheat','rice','coffee','tea plantation','horticulture',
    'smallholder','food production','famine','hunger','crop yield',
    'land reform','pesticide','soil health','food prices','grain',
    'agri-tech','precision farming','smart farming','greenhouse',
    'aquaculture','fisheries','organic farming','regenerative',
    'supply chain agriculture','food system','commodity prices',
  ],
  education: [
    'education','school','university','college','student','learning',
    'scholarship','curriculum','professor','teacher','classroom',
    'e-learning','online course','STEM','literacy','EdTech',
    'skills','training','vocational','exam','degree','PhD',
    'graduate','undergraduate','tuition','academic','higher education',
    'MOOCs','open courseware','student loan','TVET','CBC','KICD',
    'school fees','learning outcomes','dropout','literacy rate',
  ],
  startup: [
    'startup','start-up','venture capital','seed funding','Series A',
    'Series B','Series C','IPO','unicorn','founder','accelerator',
    'incubator','pitch','angel investor','funding round','valuation',
    'scale-up','MVP','product launch','early-stage','growth stage',
    'Y Combinator','Techstars','fundraising','crowdfunding','exit',
    'acqui-hire','pivot','lean startup','bootstrapped','pre-seed',
  ],
  research: [
    'research','study','findings','paper published','peer-reviewed',
    'scientific','journal','laboratory','experiment','trial',
    'data analysis','report','survey','white paper','policy brief',
    'clinical trial','meta-analysis','systematic review','STEM research',
    'academic paper','preprint','Nature','Science','The Lancet',
    'World Bank report','IMF report','McKinsey report','WHO report',
    'Brookings','RAND','think tank','Working paper','NBER',
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
    'venture capital','private equity','capital markets','real estate',
    'pension fund','Series A','Series B','hedge fund','REIT','portfolio',
    'angel investor','crowdfunding','M&A','merger','acquisition',
  ],
  jobs: [
    'job opening','job vacancy','vacancies','hiring','recruitment','career',
    'internship','graduate trainee','apply now','employment opportunity',
    'remote job','work from home','freelance','contract role',
    'job fair','talent','workforce','layoff','retrenchment',
  ],
};

const REGIONS = {
  kenya:  { emoji: '🇰🇪', label: 'Kenya'       },
  africa: { emoji: '🌍', label: 'Africa'        },
  usa:    { emoji: '🇺🇸', label: 'USA'          },
  europe: { emoji: '🇪🇺', label: 'Europe'       },
  china:  { emoji: '🇨🇳', label: 'China'        },
  japan:  { emoji: '🇯🇵', label: 'Japan'        },
  korea:  { emoji: '🇰🇷', label: 'South Korea'  },
  global: { emoji: '🌐', label: 'Global'        },
};

module.exports = { FEEDS, KEYWORDS, REGIONS };

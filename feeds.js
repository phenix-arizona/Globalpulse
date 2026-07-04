// ─────────────────────────────────────────────────────────
//  GlobalPulse Bot — Feeds v8
//  Regions: kenya, africa, usa, europe, china, japan, korea
//  Categories: politics, technology, finance, investment,
//              jobs, agri, education, startup
// ─────────────────────────────────────────────────────────

const FEEDS = [

  // ══════════════════════════════════════════════════════
  //  🇰🇪  KENYA
  // ══════════════════════════════════════════════════════
  { name: 'Nation Africa',          url: 'https://nation.africa/kenya/rss.xml',                    category: 'general',    region: 'kenya'   },
  { name: 'The Standard',           url: 'https://www.standardmedia.co.ke/rss/headlines.php',       category: 'general',    region: 'kenya'   },
  { name: 'KBC Kenya',              url: 'https://www.kbc.co.ke/feed/',                             category: 'general',    region: 'kenya'   },
  { name: 'Capital FM Kenya',       url: 'https://www.capitalfm.co.ke/news/feed/',                  category: 'general',    region: 'kenya'   },
  { name: 'Citizen Digital',        url: 'https://www.citizen.digital/feed',                        category: 'general',    region: 'kenya'   },
  { name: 'Business Daily Africa',  url: 'https://www.businessdailyafrica.com/rss/',                category: 'finance',    region: 'kenya'   },
  { name: 'The East African',       url: 'https://www.theeastafrican.co.ke/tea/rss',                category: 'finance',    region: 'kenya'   },
  { name: 'TechCabal',              url: 'https://techcabal.com/feed/',                             category: 'technology', region: 'kenya'   },
  { name: 'Techweez',               url: 'https://techweez.com/feed/',                           category: 'technology', region: 'kenya'   },
  { name: 'Techpoint Africa',        url: 'https://techpoint.africa/feed/',                       category: 'technology', region: 'kenya'   },
  { name: 'Konza Technopolis',       url: 'https://www.konza.go.ke/feed/',                        category: 'technology', region: 'kenya'   },
  { name: 'ICT Authority Kenya',     url: 'https://icta.go.ke/feed/',                             category: 'technology', region: 'kenya'   },
  { name: 'Ajira Digital',           url: 'https://ajiradigital.go.ke/feed/',                     category: 'youth',      region: 'kenya'   },
  { name: 'Disrupt Africa',         url: 'https://disrupt-africa.com/feed/',                        category: 'technology', region: 'kenya'   },
  { name: 'IT News Africa',         url: 'https://www.itnewsafrica.com/feed/',                      category: 'technology', region: 'kenya'   },
  { name: 'JobWebKenya',            url: 'https://www.jobwebkenya.com/feed/',                       category: 'jobs',       region: 'kenya'   },
  { name: 'Corporate Staffing Kenya', url: 'https://www.corporatestaffing.co.ke/feed/',              category: 'jobs',       region: 'kenya'   },
  { name: 'Opportunity Desk',       url: 'https://opportunitydesk.org/feed/',                        category: 'jobs',       region: 'kenya'   },
  { name: 'ReliefWeb Jobs KE',      url: 'https://reliefweb.int/jobs/rss.xml?primary_country=KE',  category: 'jobs',       region: 'kenya'   },
  { name: 'FarmBiz Africa',         url: 'https://farmbizafrica.com/feed/',                         category: 'agri',       region: 'kenya'   },

  // Tenders (IT-focused)

  // ══════════════════════════════════════════════════════
  //  🌍  AFRICA (continental)
  // ══════════════════════════════════════════════════════

  // Politics & General
  { name: 'AllAfrica',               url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', category: 'general', region: 'africa' },
  { name: 'Africa News',            url: 'https://www.africanews.com/feed/',                        category: 'general',    region: 'africa'  },
  { name: 'The Africa Report',      url: 'https://www.theafricareport.com/feed/',                   category: 'general',    region: 'africa'  },
  { name: 'Mail & Guardian Africa', url: 'https://mg.co.za/feed/',                                  category: 'general',    region: 'africa'  },
  { name: 'Daily Maverick',         url: 'https://www.dailymaverick.co.za/feed/',                   category: 'general',    region: 'southafrica'  },

  // Technology & Startups
  { name: 'TechCabal (Africa)',     url: 'https://techcabal.com/feed/',                             category: 'technology', region: 'africa'  },
  { name: 'Disrupt Africa',         url: 'https://disrupt-africa.com/feed/',                        category: 'startup',    region: 'africa'  },
  { name: 'Ventures Africa',        url: 'https://venturesafrica.com/feed/',                        category: 'startup',    region: 'africa'  },
  { name: 'WeeTracker',             url: 'https://weetracker.com/feed/',                            category: 'startup',    region: 'africa'  },
  { name: 'Africa Tech Summit',     url: 'https://www.africatechsummit.com/feed/',                  category: 'technology', region: 'africa'  },

  // Finance & Business
  { name: 'African Business Mag',   url: 'https://african.business/feed/',                          category: 'finance',    region: 'africa'  },
  { name: 'This Is Africa',         url: 'https://thisisafrica.me/feed/',                           category: 'finance',    region: 'africa'  },

  // Agriculture
  { name: 'FarmBiz Africa (cont)',  url: 'https://farmbizafrica.com/feed/',                         category: 'agri',       region: 'africa'  },
  { name: 'AGRA News',              url: 'https://agra.org/feed/',                                  category: 'agri',       region: 'africa'  },
  { name: 'Africa Feeds Agri',      url: 'https://africafeeds.com/category/agriculture/feed/',      category: 'agri',       region: 'africa'  },

  // Education & Research
  { name: 'University World News Africa', url: 'https://www.universityworldnews.com/fulltext-rss/rss.php?region=Africa', category: 'education', region: 'africa' },
  { name: 'Research Africa',        url: 'https://www.researchafrica.net/feed/',                    category: 'education',  region: 'africa'  },

  // Jobs
  { name: 'ReliefWeb Jobs Africa',  url: 'https://reliefweb.int/jobs/rss.xml?region=africa',        category: 'jobs',       region: 'africa'  },

  // ── 🇳🇬 Nigeria ────────────────────────────────────────
  { name: 'Premium Times Nigeria',  url: 'https://www.premiumtimesng.com/feed',                     category: 'general',    region: 'nigeria' },
  { name: 'Punch Nigeria',          url: 'https://punchng.com/feed/',                               category: 'general',    region: 'nigeria' },
  { name: 'Nairametrics',           url: 'https://nairametrics.com/feed/',                          category: 'finance',    region: 'nigeria' },

  // ── 🇬🇭 Ghana ──────────────────────────────────────────
  { name: 'MyJoyOnline',            url: 'https://www.myjoyonline.com/feed/',                       category: 'general',    region: 'ghana'   },
  { name: 'Citi Newsroom',          url: 'https://citinewsroom.com/feed/',                          category: 'general',    region: 'ghana'   },

  // ── 🇿🇦 South Africa ───────────────────────────────────
  { name: 'BusinessTech SA',        url: 'https://businesstech.co.za/news/feed/',                   category: 'finance',    region: 'southafrica' },
  { name: 'MyBroadband SA',         url: 'https://mybroadband.co.za/news/feed/',                    category: 'technology', region: 'southafrica' },

  // ── 🇺🇬 Uganda ─────────────────────────────────────────
  { name: 'Daily Monitor Uganda',   url: 'https://www.monitor.co.ug/uganda/rss.xml',                category: 'general',    region: 'uganda'  },
  { name: 'The Independent Uganda', url: 'https://www.independent.co.ug/feed/',                     category: 'general',    region: 'uganda'  },

  // ── ⚽ Sports (Kenya, Europe, Asia, USA, World Cup) ─────
  { name: 'Standard Sports Kenya',  url: 'https://www.standardmedia.co.ke/rss/sports.php',          category: 'sports',     region: 'kenya'   },
  { name: 'Capital Sports Kenya',   url: 'https://www.capitalfm.co.ke/sports/feed/',                category: 'sports',     region: 'kenya'   },
  { name: 'BBC Sport',              url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',         category: 'sports',     region: 'europe'  },
  { name: 'Guardian Football',      url: 'https://www.theguardian.com/football/rss',                category: 'sports',     region: 'europe'  },
  { name: 'ESPN Cricinfo',          url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', category: 'sports', region: 'global'  },
  { name: 'ESPN',                   url: 'https://www.espn.com/espn/rss/news',                      category: 'sports',     region: 'usa'     },
  { name: 'BBC Sport World Cup',    url: 'https://feeds.bbci.co.uk/sport/football/world-cup/rss.xml', category: 'sports',   region: 'global'  },


  // ══════════════════════════════════════════════════════
  //  🇺🇸  USA
  // ══════════════════════════════════════════════════════

  // General
  { name: 'NPR News',               url: 'https://feeds.npr.org/1001/rss.xml',                      category: 'general',    region: 'usa'     },
  { name: 'ABC News',               url: 'https://abcnews.go.com/abcnews/topstories',                category: 'general',    region: 'usa'     },
  { name: 'CBS News',               url: 'https://www.cbsnews.com/latest/rss/main',                  category: 'general',    region: 'usa'     },

  // Technology
  { name: 'TechCrunch',             url: 'https://techcrunch.com/feed/',                            category: 'technology', region: 'usa'     },
  { name: 'The Verge',              url: 'https://www.theverge.com/rss/index.xml',                  category: 'technology', region: 'usa'     },
  { name: 'Ars Technica',           url: 'https://feeds.arstechnica.com/arstechnica/index',         category: 'technology', region: 'usa'     },
  { name: 'Wired',                  url: 'https://www.wired.com/feed/rss',                          category: 'technology', region: 'usa'     },
  { name: 'MIT Tech Review',        url: 'https://www.technologyreview.com/feed/',                  category: 'technology', region: 'usa'     },

  // Startups & Business
  { name: 'Hacker News',            url: 'https://hnrss.org/frontpage',                             category: 'startup',    region: 'usa'     },
  { name: 'Inc Magazine',           url: 'https://www.inc.com/rss/',                                category: 'startup',    region: 'usa'     },
  { name: 'Fast Company',           url: 'https://www.fastcompany.com/latest/rss',                  category: 'startup',    region: 'usa'     },
  { name: 'Harvard Business Review', url: 'https://hbr.org/stories.rss',                           category: 'education',  region: 'usa'     },

  // Finance
  { name: 'CNBC',                   url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',   category: 'finance',    region: 'usa'     },
  { name: 'MarketWatch',            url: 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines', category: 'finance', region: 'usa' },

  // Agriculture
  { name: 'USDA News',              url: 'https://www.usda.gov/rss/home.xml',                       category: 'agri',       region: 'usa'     },

  // Education & Research
  { name: 'Science Daily',          url: 'https://www.sciencedaily.com/rss/all.xml',                category: 'education',  region: 'usa'     },
  { name: 'EdSurge',                url: 'https://edsurge.com/news.rss',                            category: 'education',  region: 'usa'     },
  { name: 'Nature News',            url: 'https://www.nature.com/nature.rss',                       category: 'education',  region: 'usa'     },


  // ══════════════════════════════════════════════════════
  //  🇪🇺  EUROPE
  // ══════════════════════════════════════════════════════

  // General
  { name: 'Deutsche Welle',         url: 'https://rss.dw.com/xml/rss-en-all',                       category: 'general',    region: 'europe'  },
  { name: 'France 24',              url: 'https://www.france24.com/en/rss',                         category: 'general',    region: 'europe'  },
  { name: 'Euronews',               url: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', category: 'general', region: 'europe' },
  { name: 'The Guardian World',     url: 'https://www.theguardian.com/world/rss',                   category: 'general',    region: 'europe'  },

  // Technology & Startups
  { name: 'Sifted',                 url: 'https://sifted.eu/feed',                                  category: 'startup',    region: 'europe'  },
  { name: 'EU Startups',            url: 'https://eu-startups.com/feed/',                           category: 'startup',    region: 'europe'  },
  { name: 'The Guardian Tech',      url: 'https://www.theguardian.com/technology/rss',              category: 'technology', region: 'europe'  },

  // Finance & Business
  { name: 'DW Business',            url: 'https://rss.dw.com/xml/rss-en-bus',                       category: 'finance',    region: 'europe'  },
  { name: 'The Guardian Business',  url: 'https://www.theguardian.com/business/rss',                category: 'finance',    region: 'europe'  },

  // Agriculture
  { name: 'EU Agriculture (DW)',    url: 'https://rss.dw.com/xml/rss-en-agr',                       category: 'agri',       region: 'europe'  },

  // Education & Research
  { name: 'University World News EU', url: 'https://www.universityworldnews.com/fulltext-rss/rss.php?region=Europe', category: 'education', region: 'europe' },
  { name: 'The Conversation EU',    url: 'https://theconversation.com/europe/articles.atom',        category: 'education',  region: 'europe'  },


  // ══════════════════════════════════════════════════════
  //  🇨🇳  CHINA
  // ══════════════════════════════════════════════════════

  { name: 'China Daily',            url: 'https://www.chinadaily.com.cn/rss/china_rss.xml',         category: 'general',    region: 'china'   },
  { name: 'Global Times',           url: 'https://www.globaltimes.cn/rss/outbrain.xml',             category: 'general',    region: 'china'   },
  { name: 'CGTN',                   url: 'https://www.cgtn.com/subscribe/rss/section/world.xml',    category: 'general',    region: 'china'   },
  { name: 'SCMP Business',          url: 'https://www.scmp.com/rss/92/feed',                        category: 'finance',    region: 'china'   },
  { name: 'SCMP Tech',              url: 'https://www.scmp.com/rss/36/feed',                        category: 'technology', region: 'china'   },
  { name: 'TechNode',               url: 'https://technode.com/feed/',                              category: 'startup',    region: 'china'   },
  { name: 'KrASIA',                 url: 'https://kr.asia/feed',                                    category: 'startup',    region: 'china'   },
  { name: 'China Dialogue',         url: 'https://chinadialogue.net/en/feed/',                      category: 'education',  region: 'china'   },


  // ══════════════════════════════════════════════════════
  //  🇯🇵  JAPAN
  // ══════════════════════════════════════════════════════

  { name: 'Nikkei Asia',            url: 'https://asia.nikkei.com/rss/feed/nar',                    category: 'finance',    region: 'japan'   },
  { name: 'The Japan Times',        url: 'https://www.japantimes.co.jp/feed/',                      category: 'general',    region: 'japan'   },
  { name: 'NHK World',              url: 'https://www3.nhk.or.jp/rss/news/cat0.xml',                category: 'general',    region: 'japan'   },
  { name: 'Japan Today',            url: 'https://japantoday.com/feed',                             category: 'general',    region: 'japan'   },
  { name: 'Nikkei Tech',            url: 'https://asia.nikkei.com/rss/feed/tech',                   category: 'technology', region: 'japan'   },
  { name: 'Nikkei Business',        url: 'https://asia.nikkei.com/rss/feed/business',               category: 'startup',    region: 'japan'   },


  // ══════════════════════════════════════════════════════
  //  🇰🇷  SOUTH KOREA
  // ══════════════════════════════════════════════════════

  { name: 'Korea Herald',           url: 'https://www.koreaherald.com/common/rss_xml.php?ct=102',   category: 'general',    region: 'korea'   },
  { name: 'Yonhap News',            url: 'https://en.yna.co.kr/RSS/news.xml',                       category: 'general',    region: 'korea'   },
  { name: 'Korea Times',            url: 'https://www.koreatimes.co.kr/www/rss/rss.xml',            category: 'general',    region: 'korea'   },
  { name: 'Korea Herald Tech',      url: 'https://www.koreaherald.com/common/rss_xml.php?ct=104',   category: 'technology', region: 'korea'   },
  { name: 'Korea Herald Business',  url: 'https://www.koreaherald.com/common/rss_xml.php?ct=103',   category: 'finance',    region: 'korea'   },
  { name: 'Korea Joongang Daily',   url: 'https://koreajoongangdaily.joins.com/rss/recent.xml',     category: 'general',    region: 'korea'   },


  // ══════════════════════════════════════════════════════
  //  🌍  GLOBAL (all regions)
  // ══════════════════════════════════════════════════════

  { name: 'BBC World',              url: 'https://feeds.bbci.co.uk/news/world/rss.xml',             category: 'general',    region: 'global'  },
  { name: 'Al Jazeera',             url: 'https://www.aljazeera.com/xml/rss/all.xml',               category: 'general',    region: 'global'  },
  { name: 'IEEE Spectrum',          url: 'https://spectrum.ieee.org/feeds/feed.rss',                category: 'technology', region: 'global'  },
  { name: 'World Economic Forum',   url: 'https://www.weforum.org/agenda/feed/',                    category: 'education',  region: 'global'  },
  { name: 'The Conversation',       url: 'https://theconversation.com/global/articles.atom',        category: 'education',  region: 'global'  },
  { name: 'Big Think',              url: 'https://bigthink.com/feed/',                              category: 'education',  region: 'global'  },
  { name: 'TED Ideas',              url: 'https://feeds.feedburner.com/tedtalks_video',             category: 'education',  region: 'global'  },
  { name: 'WHO News',               url: 'https://www.who.int/rss-feeds/news-english.xml',          category: 'health',     region: 'global'  },
  { name: 'Medical Xpress',         url: 'https://medicalxpress.com/rss-feed/',                     category: 'health',     region: 'global'  },
  { name: 'STAT News',              url: 'https://www.statnews.com/feed/',                          category: 'health',     region: 'usa'     },
  { name: 'KFF Health News',        url: 'https://kffhealthnews.org/feed/',                         category: 'health',     region: 'usa'     },
  { name: 'Africa CDC',             url: 'https://africacdc.org/feed/',                             category: 'health',     region: 'africa'  },
  { name: 'FAO',                    url: 'https://www.fao.org/news/rss-feed/en/',                   category: 'agri',       region: 'global'  },
  { name: 'ReliefWeb Jobs',         url: 'https://reliefweb.int/jobs/rss.xml',                      category: 'jobs',       region: 'global'  },
  { name: 'Crunchbase News',        url: 'https://news.crunchbase.com/feed/',                       category: 'startup',    region: 'global'  },
  { name: 'Product Hunt',           url: 'https://www.producthunt.com/feed',                        category: 'startup',    region: 'global'  },
  { name: 'Smithsonian Magazine',   url: 'https://www.smithsonianmag.com/rss/latest_articles/',     category: 'education',  region: 'global'  },
];

// ── Keywords ──────────────────────────────────────────────
const KEYWORDS = {
  politics: [
    'politics','parliament','cabinet','president','government','election',
    'senator','minister','governor','opposition','bill','legislation',
    'policy','court ruling','constitution','judiciary','protests',
    'sanctions','treaty','summit','NATO','White House','Congress',
    'Kremlin','G7','G20','diplomat','coup','referendum','impeach',
    'geopolitics','ceasefire','war','ruto','ODM','UDA',
  ],
  technology: [
    'technology','artificial intelligence','AI','machine learning',
    'software','cybersecurity','blockchain','cloud computing','5G',
    'semiconductor','chip','quantum computing','robot','drone',
    'electric vehicle','EV','OpenAI','GPU','LLM','generative AI',
    'data center','automation','deepfake','space tech','ICT',
  ],
  finance: [
    'stock market','bonds','treasury','GDP','inflation','banking',
    'central bank','forex','exchange rate','IMF','World Bank','budget',
    'tax','interest rate','Federal Reserve','Wall Street','recession',
    'trade deficit','NSE','CBK','KRA','shilling','cryptocurrency',
    'bitcoin','IPO market','M-Pesa','economic growth',
  ],
  investment: [
    'investment','investor','fund','equity','IPO','shares','dividend',
    'venture capital','private equity','funding round','capital markets',
    'real estate','pension fund','Series A','Series B','Series C',
    'unicorn','valuation','merger','acquisition','M&A','hedge fund',
    'REIT','angel investor','accelerator','crowdfunding',
  ],
  startup: [
    'startup','founder','launch','seed funding','pre-seed','incubator',
    'accelerator','pitch','bootstrapped','MVP','product launch',
    'scale-up','scaleup','venture','disrupt','new company','raise',
    'funding round','entrepreneur','Series A','Series B','Y Combinator',
    'Techstars','demo day','exit','acquisition',
  ],
  jobs: [
    'job opening','job vacancy','vacancies','hiring','recruitment',
    'career','internship','graduate trainee','apply now',
    'employment opportunity','remote job','work from home',
    'freelance','contract role','job fair','layoff','retrenchment',
  ],
  tenders: [
    'tender','tenders','request for proposal','RFP','request for quotation',
    'RFQ','procurement','bid','bidding','EOI','expression of interest',
    'ICT tender','IT tender','supply and installation','system supply',
    'software supply','hardware supply','network installation',
    'e-procurement','contract award','pre-qualification','prequalification',
    'invitation to bid','ITB','framework agreement','SGR tender',
    'county tender','ministry tender','parastatal tender','PPOA',
    'PPRA','public procurement',
  ],
  agri: [
    'agriculture','agricultural','farming','farmer','crop','harvest',
    'livestock','poultry','dairy','drought','irrigation','fertilizer',
    'fertiliser','seed','food security','agribusiness','agrotech',
    'maize','wheat','rice','coffee','horticulture','smallholder',
    'food production','famine','hunger','crop yield','land reform',
    'food prices','grain','soil health','pesticide',
  ],
  education: [
    'education','school','university','college','student','research',
    'science','academic','scholarship','curriculum','professor',
    'e-learning','online course','STEM','literacy','EdTech',
    'vocational','exam','degree','PhD','discovery','innovation',
    'higher education','training','knowledge','learning',
  ],
  health: [
    'health','healthcare','hospital','clinic','disease','outbreak',
    'vaccine','vaccination','pandemic','epidemic','WHO','medicine',
    'medical','doctor','nurse','patient','treatment','diagnosis',
    'surgery','pharma','pharmaceutical','drug approval','clinical trial',
    'mental health','maternal health','malaria','HIV','tuberculosis',
    'cancer','diabetes','nutrition','public health','NHIF','SHA',
    'insurance cover','biotech','telemedicine','health tech','epidemiology',
  ],
  youth: [
    'youth','young people','youth affairs','youth empowerment',
    'youth development','youth fund','youth employment','youth policy',
    'youth entrepreneurship','youth program','youth initiative',
    'National Youth Service','NYS','Ajira Digital','young innovators',
    'young Kenyans','youth-led','Generation Z','Gen Z','youth council',
    'young entrepreneurs','graduate unemployment','skills for youth',
    'youth internship','youth training','young professionals',
  ],
  sports: [
    'sports','football','soccer','world cup','premier league','la liga',
    'champions league','bundesliga','serie a','afcon','athletics',
    'olympics','marathon','rugby','cricket','tennis','boxing',
    'formula 1','f1','nba','nfl','harambee stars','safari rally',
    'world athletics','goal','tournament','match','league title',
    'transfer window','fifa','uefa','world cup qualifier','medal',
  ],
};

// ── Source cap — max articles per feed per fetch ──────────
const MAX_PER_SOURCE = 10;

const REGIONS = {
  kenya:      { emoji: '🇰🇪', label: 'Kenya'        },
  nigeria:    { emoji: '🇳🇬', label: 'Nigeria'      },
  ghana:      { emoji: '🇬🇭', label: 'Ghana'        },
  southafrica:{ emoji: '🇿🇦', label: 'South Africa' },
  uganda:     { emoji: '🇺🇬', label: 'Uganda'       },
  africa:     { emoji: '🌍', label: 'Africa'         },
  usa:        { emoji: '🇺🇸', label: 'USA'          },
  europe:     { emoji: '🇪🇺', label: 'Europe'       },
  china:      { emoji: '🇨🇳', label: 'China'        },
  japan:      { emoji: '🇯🇵', label: 'Japan'        },
  korea:      { emoji: '🇰🇷', label: 'South Korea'  },
  global:     { emoji: '🌐', label: 'Global'         },
};

// African country regions that should automatically be included
// whenever someone asks for the broader 'africa' region — so
// /africa and the automated Kenya+Africa feed naturally pick up
// Nigeria/Ghana/South Africa/Uganda content too.
const AFRICA_SUBREGIONS = ['kenya', 'nigeria', 'ghana', 'southafrica', 'uganda'];

module.exports = { FEEDS, KEYWORDS, REGIONS, MAX_PER_SOURCE, AFRICA_SUBREGIONS };

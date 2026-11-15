export const PORTRAIT_URL = '';

export const CONTACT = {
  github: 'https://github.com/sathvikvarma-16',
  linkedin: 'https://www.linkedin.com/in/sathvikvarma16/',
  email: 'sathvikvarma16@gmail.com',
  resume: '/Sathvik%20Varma.pdf',
};

export const GROUPS = {
  PROGRAMMING: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'HTML', 'CSS'],
  'COMPUTER SCIENCE': ['OOP', 'DSA', 'SQL', 'Problem Solving', 'Algorithms', 'File Handling', 'Data Analysis'],
  'DATA SCIENCE': ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'EDA', 'Data Preprocessing', 'ML Fundamentals', 'Scikit-learn'],
  'MACHINE LEARNING': ['Regression', 'Classification', 'Clustering', 'Model Evaluation'],
};
export const SKILLS = Object.entries(GROUPS).flatMap(([g, ws]) => ws.map((w) => ({ w, g })));

export const PROJECTS = [
  {
    tag: 'AI Data Engineering',
    title: 'FrontierAtlas Ingestion Pipeline',
    em: 'LLM-Powered Data Pipeline',
    desc: 'An asynchronous, source-traceable data ingestion system that collects, validates, enriches, and organizes intelligence from AI startups, products, research papers, jobs, and news. Features resilient multi-provider LLM extraction, entity resolution, deduplication, schema validation, and structured data exports.',
    stack: [
        'Python',
        'AsyncIO',
        'aiohttp',
        'Gemini API',
        'Groq',
        'DeepSeek',
        'Pydantic',
        'SQLite',
        'JSONL',
        'Pandas',
        'REST APIs',
        'RapidFuzz',
        'RSS/Atom'
    ],
    link: 'https://github.com/sathvikvarma-16/frontieratlas-ingestion-pipeline'
},
{
    tag: 'AI Data Engineering',
    title: 'AI Orbit Data Ingestion Pipeline',
    em: 'LLM-Powered Data Pipeline',
    desc: 'A modular Python-based data engineering pipeline that collects and transforms AI ecosystem data from official APIs and RSS feeds. Implements data cleaning, normalization, deduplication, entity classification, relationship mapping, and Gemini-powered description generation to produce structured, validated datasets ready for analysis.',
    stack: [
        'Python',
        'REST APIs',
        'GitHub API',
        'Hugging Face API',
        'YouTube Data API',
        'Gemini API',
        'RSS Feeds',
        'Data Processing',
        'JSON',
        'CSV',
        'Unit Testing'
    ],
    link: 'https://github.com/sathvikvarma-16/ai-orbit-data-ingestion-pipeline'
},
  {
    tag: 'Hackathon project',
    title: 'DengueEye',
    em: 'Dengue',
    desc: 'DengueEye is a full-stack web application designed to support early dengue risk assessment using machine learning.',
    stack: ["React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "React Router",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "JWT",
    "Docker",
    "Git",
    "GitHub",
    "REST API"
],
    github: 'https://github.com/sathvikvarma-16/dengueye',
  },
  {
    tag: 'Python application',
    title: 'Bank Management System',
    em: 'Python',
    desc: 'A professional Python banking application featuring account management, deposits, withdrawals, transaction history, and persistent data storage.',
    stack: ['Python', 'OOP', 'JSON', 'File Handling', 'Exception Handling', 'Logging'],
    github: 'https://github.com/sathvikvarma-16/bank-account-system'
},
  {
    tag: 'Python application',
    title: 'Contact Management System',
    em: 'CRUD Operations',
    desc: 'A Python-based contact management application featuring efficient contact creation, retrieval, updating, deletion, and search functionality.',
    stack: ['Python', 'CRUD Operations', 'Search', 'Data Management'],
    github: 'https://github.com/sathvikvarma-16/contact-management-system'
},
  {
    tag: 'Python mini projects',
    title: 'Python Utility Applications',
    em: 'Python',
    desc: 'A collection of Python applications, including a Username Generator, Password Generator, and Coffee Machine Simulator, demonstrating programming fundamentals, logical problem-solving, and practical application development.',
    stack: ['Python', 'OOP', 'Functions', 'Conditional Logic', 'Loops', 'Random Module', 'String Manipulation', 'User Input Handling'],
},
];

export const STATS = [
  { label: 'Coding Problems Solved', detail: 'LeetCode', value: 400, suffix: '+', decimals: 0, h: 3.2 },
  { label: 'Technical Projects', detail: 'Practical projects across Python, Data Science and AI', value: 5, suffix: '+', decimals: 0, h: 4.5 },
  { label: 'Core Technologies', detail: 'Python, SQL, Machine Learning, CN, OS', value: 5, suffix: '+', decimals: 0, h: 4.0 },
];

export const JOURNEY = [
  { year: '01', role: 'School education', place: '10th Grade · 97.33%', note: 'Academic foundations' },
  { year: '02', role: 'Intermediate education', place: 'Intermediate · 99%', note: 'Preparation for engineering studies' },
  {
    year: '03',
    role: 'B.Tech Computer Science and Engineering',
    place: 'ANITS · Anil Neerukonda Institute of Technology and Sciences, India',
    note: 'CGPA 9.06',
  },
  {
    year: '04',
    role: 'Learning and building',
    place: 'Programming foundations · Python · Object-Oriented Programming · DSA',
    note: 'SQL · Data Analysis · Current focus: Machine Learning and Artificial Intelligence',
  },
];

export const CERTS = [];

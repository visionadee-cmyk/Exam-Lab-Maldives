export const EXAM_BOARDS = {
  CAMBRIDGE_IGCSE: 'Cambridge IGCSE',
  PEARSON_EDEXCEL_IAL: 'Pearson Edexcel IAL',
  CAMBRIDGE_IAL: 'Cambridge IAL'
};

// O Level - Cambridge IGCSE Subjects
export const O_LEVEL_SUBJECTS = [
  {
    id: 'biology_igcse',
    code: '0610',
    name: 'Biology',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Microscope',
    description: 'Cambridge IGCSE Biology (0610)',
    topics: ['Characteristics of Living Organisms', 'Cell Structure', 'Biological Molecules', 'Enzymes', 'Plant Nutrition', 'Human Nutrition', 'Transport', 'Gas Exchange', 'Coordination', 'Reproduction', 'Inheritance', 'Organisms & Environment', 'Human Influences'],
    color: 'bg-emerald-500',
    papers: [
      {
        id: 'biology-0610-2021-unit1-june-ms',
        title: 'Paper 1 - Mark Scheme',
        session: 'May/June 2021',
        code: '0610/11',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit1-november-ms',
        title: 'Paper 1 - Mark Scheme',
        session: 'October/November 2021',
        code: '0610/11',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit2-june-ms',
        title: 'Paper 2 - Mark Scheme',
        session: 'May/June 2021',
        code: '0610/21',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit2-november-ms',
        title: 'Paper 2 - Mark Scheme',
        session: 'October/November 2021',
        code: '0610/21',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit3-june-ms',
        title: 'Paper 3 - Mark Scheme',
        session: 'May/June 2021',
        code: '0610/31',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit3-november-ms',
        title: 'Paper 3 - Mark Scheme',
        session: 'October/November 2021',
        code: '0610/31',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit6-june-ms',
        title: 'Paper 6 - Mark Scheme',
        session: 'May/June 2021',
        code: '0610/61',
        type: 'MS'
      },
      {
        id: 'biology-0610-2021-unit6-november-ms',
        title: 'Paper 6 - Mark Scheme',
        session: 'October/November 2021',
        code: '0610/61',
        type: 'MS'
      }
    ]
  },
  {
    id: 'chemistry_igcse',
    code: '0620',
    name: 'Chemistry',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'FlaskConical',
    description: 'Cambridge IGCSE Chemistry (0620)',
    topics: ['States of Matter', 'Atoms & Elements', 'Stoichiometry', 'Electrochemistry', 'Chemical Energetics', 'Chemical Reactions', 'Acids & Bases', 'Periodic Table', 'Metals', 'Chemistry of Environment', 'Organic Chemistry'],
    color: 'bg-green-500'
  },
  {
    id: 'physics_igcse',
    code: '0625',
    name: 'Physics',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Atom',
    description: 'Cambridge IGCSE Physics (0625)',
    topics: ['Motion', 'Forces & Pressure', 'Turning Effects', 'Forces & Matter', 'Energy', 'Thermal Physics', 'Waves', 'Light', 'Electromagnetic Spectrum', 'Sound', 'Magnetism', 'Electricity', 'Electrical Circuits', 'Digital Electronics', 'Radioactivity'],
    color: 'bg-purple-500'
  },
  {
    id: 'mathematics_igcse',
    code: '0580',
    name: 'Mathematics',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Calculator',
    description: 'Cambridge IGCSE Mathematics (0580)',
    topics: ['Numbers', 'Algebra & Graphs', 'Geometry', 'Mensuration', 'Coordinate Geometry', 'Trigonometry', 'Vectors & Transformations', 'Probability', 'Statistics'],
    color: 'bg-blue-500'
  },
  {
    id: 'accounting_igcse',
    code: '0452',
    name: 'Accounting',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'BookOpen',
    description: 'Cambridge IGCSE Accounting (0452)',
    topics: ['Introduction to Accounting', 'Sources & Recording of Data', 'Verification of Accounting Records', 'Accounting Procedures', 'Preparation of Financial Statements', 'Analysis & Interpretation', 'Principles of Accounts'],
    color: 'bg-amber-500'
  },
  {
    id: 'economics_igcse',
    code: '0455',
    name: 'Economics',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'TrendingUp',
    description: 'Cambridge IGCSE Economics (0455)',
    topics: ['Basic Economic Problem', 'Allocation of Resources', 'Microeconomic Decision Makers', 'Government & Economy', 'Economic Indicators', 'International Trade'],
    color: 'bg-orange-500'
  },
  {
    id: 'business_igcse',
    code: '0450',
    name: 'Business Studies',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Briefcase',
    description: 'Cambridge IGCSE Business Studies (0450)',
    topics: ['Business Activity', 'Classification of Businesses', 'Enterprise', 'Business Objectives', 'Stakeholders', 'Business Structure', 'Size of Business', 'Business Location', 'Business & Technology', 'Competitive Markets', 'Firms & Markets'],
    color: 'bg-indigo-500'
  },
  {
    id: 'computer_science_igcse',
    code: '0478',
    name: 'Computer Science',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Monitor',
    description: 'Cambridge IGCSE Computer Science (0478)',
    topics: ['Data Representation', 'Data Transmission', 'Hardware', 'Software', 'Internet & its Uses', 'Automated & Emerging Technologies', 'Algorithm Design', 'Programming', 'Databases', 'Boolean Logic'],
    color: 'bg-cyan-500'
  },
  {
    id: 'english_first_igcse',
    code: '0500',
    name: 'English First Language',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'BookMarked',
    description: 'Cambridge IGCSE English First Language (0500)',
    topics: ['Reading', 'Directed Writing', 'Composition', 'Speaking & Listening'],
    color: 'bg-pink-500'
  },
  {
    id: 'english_second_igcse',
    code: '0510',
    name: 'English Second Language',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Languages',
    description: 'Cambridge IGCSE English Second Language (0510)',
    topics: ['Reading', 'Writing', 'Listening', 'Speaking'],
    color: 'bg-rose-500'
  },
  {
    id: 'travel_tourism_igcse',
    code: '0471',
    name: 'Travel & Tourism',
    board: EXAM_BOARDS.CAMBRIDGE_IGCSE,
    icon: 'Plane',
    description: 'Cambridge IGCSE Travel & Tourism (0471)',
    topics: ['The Travel & Tourism Industry', 'Features of Worldwide Destinations', 'Customer Care', 'Working Together', 'Marketing & Promotion', 'Marketing Plans', 'Sustainable Tourism', 'Responsible Tourism'],
    color: 'bg-teal-500'
  }
];

// A Level - Pearson Edexcel IAL Subjects
export const A_LEVEL_PEARSON_SUBJECTS = [
  {
    id: 'biology_ial_pearson',
    code: 'WBI11',
    name: 'Biology',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'Microscope',
    description: 'Pearson Edexcel IAL Biology (WBI11)',
    topics: ['Molecules', 'Cells', 'Organisms', 'Exchange & Transport', 'Energy Transfers', 'Microbiology', 'Immunity', 'Respiration', 'Photosynthesis'],
    color: 'bg-emerald-600',
    papers: [
      {
        id: 'wbi11-jan-2019-unit1-qp',
        title: 'Unit 1 Question Paper',
        session: 'January 2019',
        code: 'WBI11/01',
        type: 'QP',
        file: '2019-unit1-2019-01-WBI11-01-qp.pdf'
      },
      {
        id: 'wbi11-may-2019-unit1-qp',
        title: 'Unit 1 Question Paper',
        session: 'May 2019',
        code: 'WBI11/01',
        type: 'QP',
        file: '2019-unit1-2019-06-WBI11-01-qp.pdf'
      },
      {
        id: 'wbi11-oct-2019-unit1-qp',
        title: 'Unit 1 Question Paper',
        session: 'October 2019',
        code: 'WBI11/01',
        type: 'QP',
        file: '2019-unit1-2019-10-WBI11-01-qp.pdf'
      },
      {
        id: 'wbi11-jan-2020-unit1-qp',
        title: 'Unit 1 Question Paper',
        session: 'January 2020',
        code: 'WBI11/01',
        type: 'QP',
        file: '2020-unit1-2020-01-WBI11-01-qp.pdf'
      },
      {
        id: 'wbi11-oct-2020-unit1-qp',
        title: 'Unit 1 Question Paper',
        session: 'October 2020',
        code: 'WBI11/01',
        type: 'QP',
        file: '2020-unit1-2020-10-WBI11-01-qp.pdf'
      },
      {
        id: 'wbi12-jun-2019-unit2-qp',
        title: 'Unit 2 Question Paper',
        session: 'June 2019',
        code: 'WBI12/01',
        type: 'QP',
        file: '2019-unit2-2019-06-WBI12-01-qp.pdf'
      },
      {
        id: 'wbi12-oct-2019-unit2-qp',
        title: 'Unit 2 Question Paper',
        session: 'October 2019',
        code: 'WBI12/01',
        type: 'QP',
        file: '2019-unit2-2019-10-WBI12-01-qp.pdf'
      },
      {
        id: 'wbi12-jan-2020-unit2-qp',
        title: 'Unit 2 Question Paper',
        session: 'January 2020',
        code: 'WBI12/01',
        type: 'QP',
        file: '2020-unit2-2020-01-WBI12-01-qp.pdf'
      },
      {
        id: 'wbi12-may-2020-unit2-qp',
        title: 'Unit 2 Question Paper',
        session: 'May 2020',
        code: 'WBI12/01',
        type: 'QP',
        file: '2020-unit2-2020-10-WBI12-01-qp.pdf'
      },
      {
        id: 'wbi13-jun-2019-unit3-qp',
        title: 'Unit 3 Question Paper',
        session: 'June 2019',
        code: 'WBI13/01',
        type: 'QP',
        file: '2019-unit3-2019-06-WBI13-01-qp.pdf'
      },
      {
        id: 'wbi13-oct-2019-unit3-qp',
        title: 'Unit 3 Question Paper',
        session: 'October 2019',
        code: 'WBI13/01',
        type: 'QP',
        file: '2019-unit3-2019-10-WBI13-01-qp.pdf'
      }
    ]
  },
  {
    id: 'chemistry_ial_pearson',
    code: 'WCH11',
    name: 'Chemistry',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'FlaskConical',
    description: 'Pearson Edexcel IAL Chemistry (WCH11)',
    topics: ['Atomic Structure', 'Bonding & Structure', 'Redox', 'Inorganic Chemistry', 'Formulae & Equations', 'Energetics', 'Equilibrium', 'Acid-base Equilibria', 'Periodicity', 'Organic Chemistry'],
    color: 'bg-green-600'
  },
  {
    id: 'physics_ial_pearson',
    code: 'WPH11',
    name: 'Physics',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'Atom',
    description: 'Pearson Edexcel IAL Physics (WPH11)',
    topics: ['Mechanics', 'Electric Circuits', 'Materials', 'Waves', 'DC Electricity', 'Further Mechanics', 'Electric & Magnetic Fields', 'Nuclear & Particle Physics', 'Thermodynamics'],
    color: 'bg-purple-600'
  },
  {
    id: 'mathematics_ial_pearson',
    code: 'WMA11',
    name: 'Mathematics',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'Calculator',
    description: 'Pearson Edexcel IAL Mathematics (WMA11)',
    topics: ['Proof', 'Algebra & Functions', 'Coordinate Geometry', 'Sequences & Series', 'Trigonometry', 'Exponentials & Logarithms', 'Differentiation', 'Integration', 'Numerical Methods', 'Vectors', 'Mechanics', 'Statistics'],
    color: 'bg-blue-600'
  },
  {
    id: 'accounting_ial_pearson',
    code: 'WAC11',
    name: 'Accounting',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'BookOpen',
    description: 'Pearson Edexcel IAL Accounting (WAC11)',
    topics: ['Recording Financial Data', 'Accounting Principles', 'Control Accounts', 'Bank Reconciliation', 'Correction of Errors', 'Incomplete Records', 'Financial Statements', 'Partnership Accounts', 'Manufacturing Accounts'],
    color: 'bg-amber-600'
  },
  {
    id: 'economics_ial_pearson',
    code: 'WEC11',
    name: 'Economics',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'TrendingUp',
    description: 'Pearson Edexcel IAL Economics (WEC11)',
    topics: ['Markets', 'Market Failure', 'Production', 'Costs & Revenue', 'Perfect Competition', 'Monopoly', 'Contestable Markets', 'Labour Markets', 'Distribution of Income', 'Wealth & Poverty'],
    color: 'bg-orange-600'
  },
  {
    id: 'business_ial_pearson',
    code: 'WBS11',
    name: 'Business',
    board: EXAM_BOARDS.PEARSON_EDEXCEL_IAL,
    icon: 'Briefcase',
    description: 'Pearson Edexcel IAL Business (WBS11)',
    topics: ['Marketing', 'People', 'Operations', 'Finance', 'Global Business', 'Business Strategy', 'Entrepreneurship', 'International Markets'],
    color: 'bg-indigo-600'
  }
];

// A Level - Cambridge IAL Subjects
export const A_LEVEL_CAMBRIDGE_SUBJECTS = [
  {
    id: 'travel_tourism_ial_cambridge',
    code: '9395',
    name: 'Travel & Tourism',
    board: EXAM_BOARDS.CAMBRIDGE_IAL,
    icon: 'Plane',
    description: 'Cambridge IAL Travel & Tourism (9395)',
    topics: ['The Industry', 'Destination Management', 'Customer Service', 'Marketing', 'Sustainability', 'Operations', 'Planning', 'Development'],
    color: 'bg-teal-600'
  },
  {
    id: 'computer_science_ial_cambridge',
    code: '9618',
    name: 'Computer Science',
    board: EXAM_BOARDS.CAMBRIDGE_IAL,
    icon: 'Monitor',
    description: 'Cambridge IAL Computer Science (9618)',
    topics: ['Information Representation', 'Communication', 'Hardware', 'Processor Fundamentals', 'System Software', 'Security', 'Privacy & Integrity', 'Ethics & Ownership', 'Databases', 'Algorithm Design', 'Data Types & Structures', 'Programming', 'Software Development', 'Artificial Intelligence', 'Computability', 'System Design', 'Monitoring & Control Systems'],
    color: 'bg-cyan-600'
  }
];

// Combined subjects list for UI display
export const SUBJECTS = [
  ...O_LEVEL_SUBJECTS,
  ...A_LEVEL_PEARSON_SUBJECTS,
  ...A_LEVEL_CAMBRIDGE_SUBJECTS
];

export const QUESTION_TYPES = [
  { id: 'mcq', name: 'Multiple Choice', icon: 'CircleDot' },
  { id: 'short_answer', name: 'Short Answer', icon: 'AlignLeft' },
  { id: 'structured', name: 'Structured', icon: 'List' },
  { id: 'calculation', name: 'Calculation', icon: 'Calculator' },
  { id: 'graph', name: 'Graph Based', icon: 'TrendingUp' },
  { id: 'image', name: 'Image Based', icon: 'Image' }
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'hard', name: 'Hard', color: 'bg-red-100 text-red-800' }
];

// Types for roadmap data structure
export interface RoadmapModule {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  completed: boolean;
}

export interface Roadmap {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  students: number;
  rating: number;
  category: string;
  prerequisites: string[];
  outcomes: string[];
  modules: RoadmapModule[];
}

// Mock roadmap data with proper typing
export const roadmapData: Record<string, Roadmap> = {
  'frontend-development': {
    title: 'Frontend Development',
    description: 'Master modern frontend development with HTML, CSS, JavaScript, React, and more. This comprehensive roadmap will take you from beginner to advanced frontend developer.',
    difficulty: 'Beginner to Advanced',
    duration: '6-8 months',
    students: 12534,
    rating: 4.8,
    category: 'Web Development',
    prerequisites: ['Basic computer skills', 'Problem-solving mindset'],
    outcomes: [
      'Build responsive websites with HTML/CSS',
      'Create interactive web applications with JavaScript',
      'Develop modern React applications',
      'Understand state management and routing',
      'Deploy applications to production'
    ],
    modules: [
      {
        id: 1,
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development',
        duration: '3-4 weeks',
        topics: ['HTML5 Semantics', 'CSS Grid & Flexbox', 'Responsive Design', 'CSS Animations'],
        completed: false
      },
      {
        id: 2,
        title: 'JavaScript Essentials',
        description: 'Master JavaScript fundamentals and ES6+ features',
        duration: '4-5 weeks',
        topics: ['Variables & Functions', 'DOM Manipulation', 'Async/Await', 'ES6+ Features'],
        completed: false
      },
      {
        id: 3,
        title: 'React Fundamentals',
        description: 'Build your first React applications',
        duration: '5-6 weeks',
        topics: ['Components & JSX', 'Props & State', 'Event Handling', 'Lifecycle Methods'],
        completed: false
      },
      {
        id: 4,
        title: 'Advanced React',
        description: 'Learn hooks, context, and advanced patterns',
        duration: '4-5 weeks',
        topics: ['React Hooks', 'Context API', 'Custom Hooks', 'Performance Optimization'],
        completed: false
      },
      {
        id: 5,
        title: 'State Management',
        description: 'Master Redux and modern state management',
        duration: '3-4 weeks',
        topics: ['Redux Toolkit', 'Zustand', 'React Query', 'State Patterns'],
        completed: false
      },
      {
        id: 6,
        title: 'Next.js & Deployment',
        description: 'Build full-stack applications and deploy them',
        duration: '4-5 weeks',
        topics: ['Next.js Framework', 'API Routes', 'Deployment', 'Performance'],
        completed: false
      }
    ]
  },
  'data-science-fundamentals': {
    title: 'Data Science Fundamentals',
    description: 'Learn the essential skills for data science including Python programming, statistics, machine learning, and data visualization. Perfect for beginners looking to enter the field of data science.',
    difficulty: 'Beginner to Intermediate',
    duration: '4-6 months',
    students: 8932,
    rating: 4.7,
    category: 'Data Science',
    prerequisites: ['High school mathematics', 'Basic programming concepts'],
    outcomes: [
      'Analyze data using Python and pandas',
      'Create compelling data visualizations',
      'Build and evaluate machine learning models',
      'Understand statistical concepts and methods',
      'Work with real-world datasets'
    ],
    modules: [
      {
        id: 1,
        title: 'Python for Data Analysis',
        description: 'Master Python fundamentals and data manipulation libraries',
        duration: '4-5 weeks',
        topics: ['Python Basics', 'NumPy', 'Pandas', 'Data Cleaning'],
        completed: false
      },
      {
        id: 2,
        title: 'Statistics & Probability',
        description: 'Learn essential statistical concepts for data science',
        duration: '3-4 weeks',
        topics: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'Correlation'],
        completed: false
      },
      {
        id: 3,
        title: 'Data Visualization',
        description: 'Create compelling charts and graphs to tell data stories',
        duration: '3-4 weeks',
        topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard Creation'],
        completed: false
      },
      {
        id: 4,
        title: 'Machine Learning Basics',
        description: 'Introduction to supervised and unsupervised learning',
        duration: '5-6 weeks',
        topics: ['Linear Regression', 'Classification', 'Clustering', 'Model Evaluation'],
        completed: false
      },
      {
        id: 5,
        title: 'Advanced ML & Deep Learning',
        description: 'Explore advanced machine learning techniques',
        duration: '4-5 weeks',
        topics: ['Neural Networks', 'Deep Learning', 'NLP Basics', 'Computer Vision'],
        completed: false
      }
    ]
  },
  'cybersecurity-essentials': {
    title: 'Cybersecurity Essentials',
    description: 'Build a strong foundation in cybersecurity concepts, tools, and practices. Learn to protect systems, networks, and data from cyber threats in this comprehensive security-focused roadmap.',
    difficulty: 'Intermediate',
    duration: '5-7 months',
    students: 6487,
    rating: 4.9,
    category: 'Cybersecurity',
    prerequisites: ['Basic networking knowledge', 'Understanding of operating systems', 'Basic programming skills'],
    outcomes: [
      'Understand common cyber threats and attack vectors',
      'Implement security controls and best practices',
      'Perform vulnerability assessments',
      'Analyze security incidents and respond appropriately',
      'Design secure network architectures'
    ],
    modules: [
      {
        id: 1,
        title: 'Security Fundamentals',
        description: 'Core concepts of information security and risk management',
        duration: '3-4 weeks',
        topics: ['CIA Triad', 'Risk Assessment', 'Security Policies', 'Compliance Frameworks'],
        completed: false
      },
      {
        id: 2,
        title: 'Network Security',
        description: 'Protect networks from threats and unauthorized access',
        duration: '4-5 weeks',
        topics: ['Firewalls', 'VPNs', 'IDS/IPS', 'Network Monitoring'],
        completed: false
      },
      {
        id: 3,
        title: 'Ethical Hacking',
        description: 'Learn penetration testing and vulnerability assessment',
        duration: '5-6 weeks',
        topics: ['Reconnaissance', 'Scanning', 'Exploitation', 'Reporting'],
        completed: false
      },
      {
        id: 4,
        title: 'Incident Response',
        description: 'Handle and investigate security incidents effectively',
        duration: '3-4 weeks',
        topics: ['Incident Handling', 'Digital Forensics', 'Malware Analysis', 'Recovery'],
        completed: false
      }
    ]
  }
};

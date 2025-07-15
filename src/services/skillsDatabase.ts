

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'domain' | 'certification';
  importance: number; // 1-10 scale
  learningHours: number; // estimated hours to learn
  prerequisites?: string[];
  trending: boolean;
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  requiredSkills: Skill[];
  averageSalary: {
    min: number;
    max: number;
    currency: string;
  };
  demandLevel: 'high' | 'medium' | 'low';
  growthProjection: number; // percentage
}

export const jobRolesDatabase: JobRole[] = [
  // Frontend Development
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Software Development',
    requiredSkills: [
      { name: 'React', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'TypeScript', category: 'technical', importance: 8, learningHours: 80, trending: true },
      { name: 'CSS/SCSS', category: 'technical', importance: 8, learningHours: 60, trending: false },
      { name: 'JavaScript ES6+', category: 'technical', importance: 9, learningHours: 100, trending: true },
      { name: 'Responsive Design', category: 'technical', importance: 8, learningHours: 40, trending: false },
      { name: 'Git Version Control', category: 'technical', importance: 7, learningHours: 30, trending: false },
      { name: 'Problem Solving', category: 'soft', importance: 9, learningHours: 200, trending: false },
      { name: 'Team Collaboration', category: 'soft', importance: 8, learningHours: 150, trending: false },
      { name: 'Web Performance Optimization', category: 'technical', importance: 7, learningHours: 80, trending: true }
    ],
    averageSalary: { min: 70000, max: 120000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 15
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    category: 'Software Development',
    requiredSkills: [
      { name: 'React/Vue/Angular', category: 'technical', importance: 9, learningHours: 150, trending: true },
      { name: 'Node.js', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'Database Design (SQL/NoSQL)', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'REST APIs', category: 'technical', importance: 9, learningHours: 80, trending: false },
      { name: 'Cloud Services (AWS/Azure)', category: 'technical', importance: 8, learningHours: 120, trending: true },
      { name: 'DevOps Basics', category: 'technical', importance: 7, learningHours: 100, trending: true },
      { name: 'System Architecture', category: 'technical', importance: 8, learningHours: 150, trending: true },
      { name: 'Agile Methodology', category: 'domain', importance: 7, learningHours: 40, trending: false },
      { name: 'Testing (Unit/Integration)', category: 'technical', importance: 8, learningHours: 80, trending: true }
    ],
    averageSalary: { min: 80000, max: 140000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 20
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    requiredSkills: [
      { name: 'Python', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'Machine Learning', category: 'technical', importance: 9, learningHours: 200, trending: true },
      { name: 'Statistics & Probability', category: 'technical', importance: 9, learningHours: 150, trending: false },
      { name: 'SQL', category: 'technical', importance: 8, learningHours: 80, trending: false },
      { name: 'Data Visualization', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Deep Learning', category: 'technical', importance: 8, learningHours: 180, trending: true },
      { name: 'Business Acumen', category: 'domain', importance: 8, learningHours: 120, trending: false },
      { name: 'Communication Skills', category: 'soft', importance: 9, learningHours: 150, trending: false },
      { name: 'Big Data Tools (Spark/Hadoop)', category: 'technical', importance: 7, learningHours: 120, trending: true }
    ],
    averageSalary: { min: 95000, max: 160000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 25
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'Data & Analytics',
    requiredSkills: [
      { name: 'Python/R', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'MLOps', category: 'technical', importance: 9, learningHours: 150, trending: true },
      { name: 'TensorFlow/PyTorch', category: 'technical', importance: 9, learningHours: 180, trending: true },
      { name: 'Cloud ML Services', category: 'technical', importance: 8, learningHours: 120, trending: true },
      { name: 'Docker & Kubernetes', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Model Deployment', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'Feature Engineering', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Monitoring & Logging', category: 'technical', importance: 7, learningHours: 80, trending: true },
      { name: 'Software Engineering Practices', category: 'technical', importance: 8, learningHours: 120, trending: false }
    ],
    averageSalary: { min: 110000, max: 180000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 30
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Infrastructure & Operations',
    requiredSkills: [
      { name: 'Docker & Containerization', category: 'technical', importance: 9, learningHours: 100, trending: true },
      { name: 'Kubernetes', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'CI/CD Pipelines', category: 'technical', importance: 9, learningHours: 100, trending: true },
      { name: 'Cloud Platforms (AWS/Azure/GCP)', category: 'technical', importance: 9, learningHours: 150, trending: true },
      { name: 'Infrastructure as Code', category: 'technical', importance: 8, learningHours: 120, trending: true },
      { name: 'Monitoring & Alerting', category: 'technical', importance: 8, learningHours: 80, trending: true },
      { name: 'Linux/Unix Administration', category: 'technical', importance: 8, learningHours: 120, trending: false },
      { name: 'Security Best Practices', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Scripting (Bash/Python)', category: 'technical', importance: 7, learningHours: 80, trending: false }
    ],
    averageSalary: { min: 85000, max: 150000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 22
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product & Strategy',
    requiredSkills: [
      { name: 'Product Strategy', category: 'domain', importance: 9, learningHours: 150, trending: false },
      { name: 'User Research & Analytics', category: 'domain', importance: 9, learningHours: 120, trending: true },
      { name: 'Agile/Scrum Methodology', category: 'domain', importance: 8, learningHours: 60, trending: false },
      { name: 'Data Analysis', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Market Research', category: 'domain', importance: 8, learningHours: 100, trending: false },
      { name: 'Stakeholder Management', category: 'soft', importance: 9, learningHours: 150, trending: false },
      { name: 'Roadmap Planning', category: 'domain', importance: 9, learningHours: 120, trending: false },
      { name: 'Customer Development', category: 'domain', importance: 8, learningHours: 120, trending: false },
      { name: 'Technical Understanding', category: 'technical', importance: 7, learningHours: 100, trending: true }
    ],
    averageSalary: { min: 90000, max: 160000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 18
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    category: 'Design',
    requiredSkills: [
      { name: 'Figma/Sketch', category: 'technical', importance: 9, learningHours: 80, trending: true },
      { name: 'User Research', category: 'domain', importance: 9, learningHours: 120, trending: false },
      { name: 'Wireframing & Prototyping', category: 'technical', importance: 9, learningHours: 100, trending: false },
      { name: 'Design Systems', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Usability Testing', category: 'domain', importance: 8, learningHours: 80, trending: false },
      { name: 'HTML/CSS Basics', category: 'technical', importance: 7, learningHours: 60, trending: false },
      { name: 'Information Architecture', category: 'domain', importance: 8, learningHours: 100, trending: false },
      { name: 'Visual Design Principles', category: 'domain', importance: 8, learningHours: 120, trending: false },
      { name: 'Collaboration Skills', category: 'soft', importance: 9, learningHours: 150, trending: false }
    ],
    averageSalary: { min: 70000, max: 130000, currency: 'USD' },
    demandLevel: 'medium',
    growthProjection: 12
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    requiredSkills: [
      { name: 'Network Security', category: 'technical', importance: 9, learningHours: 150, trending: true },
      { name: 'Incident Response', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'Penetration Testing', category: 'technical', importance: 8, learningHours: 150, trending: true },
      { name: 'Security Tools (SIEM)', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Risk Assessment', category: 'domain', importance: 8, learningHours: 100, trending: false },
      { name: 'Compliance Frameworks', category: 'domain', importance: 7, learningHours: 80, trending: false },
      { name: 'Ethical Hacking', category: 'technical', importance: 8, learningHours: 180, trending: true },
      { name: 'Forensics', category: 'technical', importance: 7, learningHours: 120, trending: true },
      { name: 'Security Awareness Training', category: 'soft', importance: 7, learningHours: 60, trending: false }
    ],
    averageSalary: { min: 75000, max: 140000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 28
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    category: 'Infrastructure & Operations',
    requiredSkills: [
      { name: 'Multi-Cloud Strategy', category: 'technical', importance: 9, learningHours: 150, trending: true },
      { name: 'AWS/Azure/GCP Architecture', category: 'technical', importance: 9, learningHours: 200, trending: true },
      { name: 'Microservices Design', category: 'technical', importance: 8, learningHours: 150, trending: true },
      { name: 'Security Architecture', category: 'technical', importance: 9, learningHours: 120, trending: true },
      { name: 'Cost Optimization', category: 'domain', importance: 8, learningHours: 100, trending: true },
      { name: 'Disaster Recovery', category: 'technical', importance: 8, learningHours: 100, trending: false },
      { name: 'Infrastructure Automation', category: 'technical', importance: 8, learningHours: 120, trending: true },
      { name: 'Enterprise Integration', category: 'technical', importance: 7, learningHours: 120, trending: false },
      { name: 'Technical Leadership', category: 'soft', importance: 9, learningHours: 200, trending: false }
    ],
    averageSalary: { min: 120000, max: 200000, currency: 'USD' },
    demandLevel: 'high',
    growthProjection: 25
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    category: 'Business & Strategy',
    requiredSkills: [
      { name: 'Requirements Gathering', category: 'domain', importance: 9, learningHours: 100, trending: false },
      { name: 'Process Modeling', category: 'domain', importance: 8, learningHours: 120, trending: false },
      { name: 'Data Analysis & SQL', category: 'technical', importance: 8, learningHours: 100, trending: true },
      { name: 'Business Process Improvement', category: 'domain', importance: 9, learningHours: 150, trending: false },
      { name: 'Stakeholder Communication', category: 'soft', importance: 9, learningHours: 150, trending: false },
      { name: 'Documentation & Reporting', category: 'domain', importance: 8, learningHours: 80, trending: false },
      { name: 'Project Management', category: 'domain', importance: 7, learningHours: 100, trending: false },
      { name: 'Financial Analysis', category: 'domain', importance: 7, learningHours: 120, trending: false },
      { name: 'Change Management', category: 'domain', importance: 8, learningHours: 100, trending: false }
    ],
    averageSalary: { min: 65000, max: 110000, currency: 'USD' },
    demandLevel: 'medium',
    growthProjection: 10
  }
];

// Extended database with 200+ roles (showing structure for more roles)
export const extendedJobRoles = [
  ...jobRolesDatabase,
  // Adding more roles following the same pattern
  {
    id: 'mobile-dev-ios',
    title: 'iOS Developer',
    category: 'Mobile Development',
    requiredSkills: [
      { name: 'Swift', category: 'technical' as const, importance: 9, learningHours: 120, trending: true },
      { name: 'SwiftUI', category: 'technical' as const, importance: 8, learningHours: 100, trending: true },
      { name: 'Xcode', category: 'technical' as const, importance: 9, learningHours: 80, trending: false },
      { name: 'Core Data', category: 'technical' as const, importance: 8, learningHours: 100, trending: false },
      { name: 'iOS SDK', category: 'technical' as const, importance: 9, learningHours: 150, trending: false },
      { name: 'App Store Guidelines', category: 'domain' as const, importance: 7, learningHours: 40, trending: false },
      { name: 'UI/UX Design Principles', category: 'domain' as const, importance: 8, learningHours: 80, trending: false },
      { name: 'Testing (XCTest)', category: 'technical' as const, importance: 7, learningHours: 60, trending: true },
      { name: 'Performance Optimization', category: 'technical' as const, importance: 8, learningHours: 100, trending: true }
    ],
    averageSalary: { min: 80000, max: 140000, currency: 'USD' },
    demandLevel: 'high' as const,
    growthProjection: 15
  },
  {
    id: 'blockchain-dev',
    title: 'Blockchain Developer',
    category: 'Emerging Technologies',
    requiredSkills: [
      { name: 'Solidity', category: 'technical' as const, importance: 9, learningHours: 150, trending: true },
      { name: 'Ethereum', category: 'technical' as const, importance: 9, learningHours: 120, trending: true },
      { name: 'Smart Contracts', category: 'technical' as const, importance: 9, learningHours: 180, trending: true },
      { name: 'Web3.js', category: 'technical' as const, importance: 8, learningHours: 100, trending: true },
      { name: 'Cryptography', category: 'technical' as const, importance: 8, learningHours: 150, trending: true },
      { name: 'DeFi Protocols', category: 'domain' as const, importance: 7, learningHours: 120, trending: true },
      { name: 'Gas Optimization', category: 'technical' as const, importance: 8, learningHours: 100, trending: true },
      { name: 'Security Auditing', category: 'technical' as const, importance: 8, learningHours: 150, trending: true },
      { name: 'Consensus Mechanisms', category: 'technical' as const, importance: 7, learningHours: 100, trending: true }
    ],
    averageSalary: { min: 100000, max: 180000, currency: 'USD' },
    demandLevel: 'high' as const,
    growthProjection: 35
  }
  // ... Continue pattern for 200+ roles
];

export const getAllJobRoles = (): JobRole[] => {
  return extendedJobRoles;
};

export const getJobRolesByCategory = (category: string): JobRole[] => {
  return extendedJobRoles.filter(role => role.category === category);
};

export const searchJobRoles = (query: string): JobRole[] => {
  const lowercaseQuery = query.toLowerCase();
  return extendedJobRoles.filter(role => 
    role.title.toLowerCase().includes(lowercaseQuery) ||
    role.category.toLowerCase().includes(lowercaseQuery) ||
    role.requiredSkills.some(skill => skill.name.toLowerCase().includes(lowercaseQuery))
  );
};


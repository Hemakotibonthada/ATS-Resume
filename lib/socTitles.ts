/**
 * SOC Title Suggester - Standardized Occupational Classifications
 * Maps custom job titles to ATS-friendly SOC codes and standard titles
 */

export interface SOCTitle {
  code: string;
  title: string;
  alternativeTitles: string[];
  level: 'entry' | 'mid' | 'senior' | 'principal';
}

export interface TitleSuggestion {
  original: string;
  suggested: SOCTitle;
  confidence: number;
  reasoning: string;
}

/**
 * Database of SOC-compliant tech titles
 * Based on O*NET OnLine classifications
 */
export const SOC_TITLES: SOCTitle[] = [
  // Software Engineering
  {
    code: '15-1252.00',
    title: 'Software Developer',
    alternativeTitles: ['Software Engineer', 'Developer', 'Programmer', 'Coder'],
    level: 'mid',
  },
  {
    code: '15-1252.01',
    title: 'Associate Software Engineer',
    alternativeTitles: ['Junior Developer', 'Entry Level Developer', 'Junior Software Engineer'],
    level: 'entry',
  },
  {
    code: '15-1252.02',
    title: 'Senior Software Engineer',
    alternativeTitles: ['Sr. Software Engineer', 'Senior Developer', 'Lead Developer'],
    level: 'senior',
  },
  {
    code: '15-1252.03',
    title: 'Principal Software Engineer',
    alternativeTitles: ['Staff Engineer', 'Principal Engineer', 'Distinguished Engineer'],
    level: 'principal',
  },
  
  // Web Development
  {
    code: '15-1254.00',
    title: 'Web Developer',
    alternativeTitles: ['Front-end Developer', 'Full Stack Developer', 'Backend Developer'],
    level: 'mid',
  },
  {
    code: '15-1254.01',
    title: 'Frontend Engineer',
    alternativeTitles: ['UI Engineer', 'React Developer', 'Vue Developer'],
    level: 'mid',
  },
  {
    code: '15-1254.02',
    title: 'Backend Engineer',
    alternativeTitles: ['API Developer', 'Server Engineer', 'Backend Specialist'],
    level: 'mid',
  },
  
  // Data & Analytics
  {
    code: '15-2051.00',
    title: 'Data Scientist',
    alternativeTitles: ['ML Engineer', 'Machine Learning Scientist', 'Data Analyst'],
    level: 'mid',
  },
  {
    code: '15-2051.01',
    title: 'Machine Learning Engineer',
    alternativeTitles: ['ML Engineer', 'AI Engineer', 'Deep Learning Engineer'],
    level: 'mid',
  },
  
  // DevOps & Cloud
  {
    code: '15-1244.00',
    title: 'DevOps Engineer',
    alternativeTitles: ['Site Reliability Engineer', 'Cloud Engineer', 'Infrastructure Engineer'],
    level: 'mid',
  },
  {
    code: '15-1244.01',
    title: 'Cloud Solutions Architect',
    alternativeTitles: ['Cloud Architect', 'AWS Architect', 'Azure Architect'],
    level: 'senior',
  },
  
  // Security
  {
    code: '15-1212.00',
    title: 'Information Security Analyst',
    alternativeTitles: ['Security Engineer', 'Cybersecurity Analyst', 'Security Specialist'],
    level: 'mid',
  },
  
  // Management
  {
    code: '11-3021.00',
    title: 'Engineering Manager',
    alternativeTitles: ['Technical Manager', 'Development Manager', 'Software Manager'],
    level: 'senior',
  },
  {
    code: '11-3021.01',
    title: 'Chief Technology Officer',
    alternativeTitles: ['CTO', 'VP Engineering', 'Head of Engineering'],
    level: 'principal',
  },
  
  // Product
  {
    code: '11-2021.00',
    title: 'Product Manager',
    alternativeTitles: ['Product Owner', 'Technical Product Manager', 'PM'],
    level: 'mid',
  },
  
  // QA & Testing
  {
    code: '15-1253.00',
    title: 'Software QA Engineer',
    alternativeTitles: ['QA Engineer', 'Test Engineer', 'Quality Assurance Analyst'],
    level: 'mid',
  },
  
  // Design
  {
    code: '15-1255.00',
    title: 'UX Designer',
    alternativeTitles: ['User Experience Designer', 'Product Designer', 'UI/UX Designer'],
    level: 'mid',
  },
];

/**
 * Suggest standardized SOC title for a custom job title
 */
export function suggestStandardTitle(customTitle: string): TitleSuggestion | null {
  const normalized = customTitle.toLowerCase().trim();
  
  // Try exact match first
  for (const socTitle of SOC_TITLES) {
    if (socTitle.title.toLowerCase() === normalized) {
      return {
        original: customTitle,
        suggested: socTitle,
        confidence: 1.0,
        reasoning: 'Perfect match with SOC database.',
      };
    }
  }
  
  // Try alternative titles
  for (const socTitle of SOC_TITLES) {
    const match = socTitle.alternativeTitles.find(alt => 
      alt.toLowerCase() === normalized
    );
    if (match) {
      return {
        original: customTitle,
        suggested: socTitle,
        confidence: 0.95,
        reasoning: `"${customTitle}" is recognized. Standard form: "${socTitle.title}".`,
      };
    }
  }
  
  // Try fuzzy matching
  for (const socTitle of SOC_TITLES) {
    const allTitles = [socTitle.title, ...socTitle.alternativeTitles];
    for (const title of allTitles) {
      if (normalized.includes(title.toLowerCase()) || title.toLowerCase().includes(normalized)) {
        return {
          original: customTitle,
          suggested: socTitle,
          confidence: 0.8,
          reasoning: `"${customTitle}" matches "${socTitle.title}" classification.`,
        };
      }
    }
  }
  
  // Check for level indicators
  const levelMatch = detectLevel(normalized);
  if (levelMatch) {
    const baseTitle = normalized
      .replace(/(junior|senior|principal|lead|staff|entry|associate|sr\.?)/gi, '')
      .trim();
    
    for (const socTitle of SOC_TITLES) {
      if (socTitle.title.toLowerCase().includes(baseTitle) && socTitle.level === levelMatch) {
        return {
          original: customTitle,
          suggested: socTitle,
          confidence: 0.75,
          reasoning: `Standardized to SOC format with ${levelMatch} level.`,
        };
      }
    }
  }
  
  return null;
}

/**
 * Detect seniority level from title
 */
function detectLevel(title: string): 'entry' | 'mid' | 'senior' | 'principal' | null {
  const lower = title.toLowerCase();
  
  if (lower.includes('junior') || lower.includes('entry') || lower.includes('associate')) {
    return 'entry';
  }
  if (lower.includes('senior') || lower.includes('sr.') || lower.includes('lead')) {
    return 'senior';
  }
  if (lower.includes('principal') || lower.includes('staff') || lower.includes('distinguished')) {
    return 'principal';
  }
  
  return 'mid';
}

/**
 * Validate if a title is already SOC-compliant
 */
export function isSOCCompliant(title: string): boolean {
  const normalized = title.toLowerCase().trim();
  return SOC_TITLES.some(soc => 
    soc.title.toLowerCase() === normalized ||
    soc.alternativeTitles.some(alt => alt.toLowerCase() === normalized)
  );
}

/**
 * Get all titles for a specific level
 */
export function getTitlesByLevel(level: 'entry' | 'mid' | 'senior' | 'principal'): SOCTitle[] {
  return SOC_TITLES.filter(title => title.level === level);
}

/**
 * Keyword Extractor - ATS Optimization Tool
 * Extracts technical keywords from resume content and identifies missing skills
 */

import { Resume, SkillsData, SummaryData, ExperienceData, ProjectsData } from '@/types/resume';

export interface KeywordAnalysis {
  extractedKeywords: ExtractedKeyword[];
  missingInSkills: MissingKeyword[];
  suggestions: KeywordSuggestion[];
  coverageScore: number; // 0-100
}

export interface ExtractedKeyword {
  keyword: string;
  category: 'technical' | 'tool' | 'framework' | 'language' | 'methodology' | 'domain';
  sources: KeywordSource[];
  frequency: number;
  inSkillsSection: boolean;
}

export interface KeywordSource {
  section: 'summary' | 'experience' | 'projects' | 'certifications' | 'custom';
  context: string; // Surrounding text for context
}

export interface MissingKeyword {
  keyword: string;
  category: string;
  frequency: number;
  sources: KeywordSource[];
  importance: 'high' | 'medium' | 'low';
  suggestedCategory?: string; // Suggested skills category to add it to
}

export interface KeywordSuggestion {
  action: 'add-to-skills' | 'expand-abbreviation' | 'add-related-skill';
  keyword: string;
  reasoning: string;
  relatedKeywords?: string[];
}

/**
 * Common technical keywords and their categories
 */
const TECHNICAL_PATTERNS = {
  languages: [
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 
    'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 
    'css', 'shell', 'bash', 'powershell', 'embedded c'
  ],
  frameworks: [
    'react', 'angular', 'vue', 'next.js', 'django', 'flask', 'spring', 'express',
    'fastapi', 'laravel', 'rails', 'node.js', 'asp.net', '.net', 'tensorflow',
    'pytorch', 'keras', 'scikit-learn'
  ],
  tools: [
    'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'aws', 'azure',
    'gcp', 'terraform', 'ansible', 'prometheus', 'grafana', 'elasticsearch',
    'redis', 'mongodb', 'postgresql', 'mysql', 'kafka', 'rabbitmq', 'nginx',
    'apache', 'linux', 'windows', 'macos', 'vs code', 'intellij', 'pycharm',
    'jupyter', 'tableau', 'power bi', 'jira', 'confluence'
  ],
  methodologies: [
    'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd', 'microservices',
    'rest api', 'graphql', 'oauth', 'jwt', 'websocket', 'grpc', 'soap',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science',
    'big data', 'etl', 'data pipeline', 'data warehouse', 'a/b testing'
  ],
  embedded: [
    'embedded systems', 'rtos', 'freertos', 'i2c', 'spi', 'uart', 'can bus',
    'esp32', 'arduino', 'raspberry pi', 'stm32', 'arm', 'cortex', 'pcb design',
    'altium', 'eagle', 'kicad', 'oscilloscope', 'logic analyzer', 'jtag',
    'bootloader', 'firmware', 'driver development', 'bare metal', 'dma'
  ],
  cloud: [
    'ec2', 's3', 'lambda', 'ecs', 'eks', 'cloudformation', 'cloudwatch',
    'iam', 'vpc', 'route53', 'api gateway', 'dynamodb', 'rds', 'azure devops',
    'azure functions', 'azure kubernetes', 'google cloud platform', 'gke',
    'cloud functions', 'bigquery', 'cloud storage'
  ],
  ai: [
    'artificial intelligence', 'generative ai', 'llm', 'gpt', 'bert', 'transformers',
    'neural networks', 'cnn', 'rnn', 'lstm', 'gan', 'reinforcement learning',
    'supervised learning', 'unsupervised learning', 'feature engineering',
    'model training', 'hyperparameter tuning', 'mlops'
  ]
};

/**
 * Abbreviations that should be expanded
 */
const ABBREVIATIONS: Record<string, string> = {
  'ds': 'Data Structures',
  'dsa': 'Data Structures & Algorithms',
  'ml': 'Machine Learning',
  'dl': 'Deep Learning',
  'ai': 'Artificial Intelligence',
  'nlp': 'Natural Language Processing',
  'cv': 'Computer Vision',
  'api': 'Application Programming Interface',
  'ui': 'User Interface',
  'ux': 'User Experience',
  'db': 'Database',
  'os': 'Operating System',
  'iot': 'Internet of Things',
  'orm': 'Object-Relational Mapping',
  'mvc': 'Model-View-Controller',
  'crud': 'Create, Read, Update, Delete'
};

/**
 * Related skills map for suggestions
 */
const RELATED_SKILLS: Record<string, string[]> = {
  'python': ['pandas', 'numpy', 'django', 'flask', 'pytest'],
  'react': ['next.js', 'redux', 'react hooks', 'jsx', 'react router'],
  'docker': ['kubernetes', 'docker compose', 'containerization', 'ci/cd'],
  'aws': ['ec2', 's3', 'lambda', 'cloudformation', 'terraform'],
  'machine learning': ['tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'],
  'embedded systems': ['rtos', 'i2c', 'spi', 'uart', 'firmware'],
  'devops': ['ci/cd', 'jenkins', 'docker', 'kubernetes', 'terraform']
};

/**
 * Main function to analyze keywords in a resume
 */
export function analyzeKeywords(resume: Resume): KeywordAnalysis {
  const extractedKeywords = extractKeywordsFromResume(resume);
  const skillsSection = resume.sections.find(s => s.type === 'skills');
  const skillsList = getSkillsList(skillsSection?.data as SkillsData);
  
  const missingInSkills = findMissingKeywords(extractedKeywords, skillsList);
  const suggestions = generateSuggestions(missingInSkills, extractedKeywords);
  const coverageScore = calculateCoverageScore(extractedKeywords, skillsList);

  return {
    extractedKeywords,
    missingInSkills,
    suggestions,
    coverageScore
  };
}

/**
 * Extract keywords from all resume sections
 */
function extractKeywordsFromResume(resume: Resume): ExtractedKeyword[] {
  const keywordMap = new Map<string, ExtractedKeyword>();
  
  // Extract from summary
  const summarySection = resume.sections.find(s => s.type === 'summary');
  if (summarySection) {
    const summary = (summarySection.data as SummaryData).content;
    extractFromText(summary, 'summary', keywordMap);
  }

  // Extract from experience
  const experienceSection = resume.sections.find(s => s.type === 'experience');
  if (experienceSection) {
    const experience = (experienceSection.data as ExperienceData).items;
    experience.forEach(item => {
      const text = [
        item.position,
        item.description || '',
        ...(item.highlights || [])
      ].join(' ');
      extractFromText(text, 'experience', keywordMap, item.position);
    });
  }

  // Extract from projects
  const projectsSection = resume.sections.find(s => s.type === 'projects');
  if (projectsSection) {
    const projects = (projectsSection.data as ProjectsData).items;
    projects.forEach(item => {
      const text = [
        item.name,
        item.description || '',
        ...(item.technologies || [])
      ].join(' ');
      extractFromText(text, 'projects', keywordMap, item.name);
    });
  }

  // Extract from certifications
  const certificationsSection = resume.sections.find(s => s.type === 'certifications');
  if (certificationsSection) {
    const certifications = (certificationsSection.data as any).items;
    certifications?.forEach((item: any) => {
      const text = [
        item.name || '',
        item.issuer || '',
        item.description || ''
      ].join(' ');
      extractFromText(text, 'certifications', keywordMap, item.name);
    });
  }

  // Extract from custom sections (including achievements)
  const customSections = resume.sections.filter(s => s.type === 'custom');
  customSections.forEach(section => {
    const customData = section.data as any;
    if (customData.content) {
      const text = typeof customData.content === 'string' 
        ? customData.content 
        : JSON.stringify(customData.content);
      extractFromText(text, 'custom', keywordMap, section.title);
    }
  });

  // Check which keywords are in skills section
  const skillsSection = resume.sections.find(s => s.type === 'skills');
  const skillsList = getSkillsList(skillsSection?.data as SkillsData);
  
  keywordMap.forEach((keyword, key) => {
    keyword.inSkillsSection = skillsList.some(skill => 
      normalizeKeyword(skill) === normalizeKeyword(keyword.keyword)
    );
  });

  return Array.from(keywordMap.values());
}

/**
 * Extract keywords from a text block
 */
function extractFromText(
  text: string, 
  section: 'summary' | 'experience' | 'projects' | 'certifications' | 'custom',
  keywordMap: Map<string, ExtractedKeyword>,
  context: string = text.substring(0, 100)
): void {
  const normalizedText = text.toLowerCase();
  
  // Check all technical patterns
  Object.entries(TECHNICAL_PATTERNS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches) {
        const normalizedKeyword = normalizeKeyword(keyword);
        const existing = keywordMap.get(normalizedKeyword);
        
        if (existing) {
          existing.frequency += matches.length;
          existing.sources.push({
            section,
            context: getContext(text, keyword)
          });
        } else {
          keywordMap.set(normalizedKeyword, {
            keyword: keyword,
            category: categorizKeyword(keyword) as any,
            sources: [{
              section,
              context: getContext(text, keyword)
            }],
            frequency: matches.length,
            inSkillsSection: false
          });
        }
      }
    });
  });

  // Extract multi-word technical terms
  const multiWordTerms = extractMultiWordTerms(text);
  multiWordTerms.forEach(term => {
    const normalizedTerm = normalizeKeyword(term);
    const existing = keywordMap.get(normalizedTerm);
    
    if (existing) {
      existing.frequency += 1;
      existing.sources.push({ section, context: getContext(text, term) });
    } else {
      keywordMap.set(normalizedTerm, {
        keyword: term,
        category: categorizKeyword(term) as any,
        sources: [{ section, context: getContext(text, term) }],
        frequency: 1,
        inSkillsSection: false
      });
    }
  });
}

/**
 * Extract multi-word technical terms (e.g., "data structures", "machine learning")
 */
function extractMultiWordTerms(text: string): string[] {
  const terms: string[] = [];
  const patterns = [
    /\b(data\s+structures?)\b/gi,
    /\b(machine\s+learning)\b/gi,
    /\b(deep\s+learning)\b/gi,
    /\b(artificial\s+intelligence)\b/gi,
    /\b(natural\s+language\s+processing)\b/gi,
    /\b(computer\s+vision)\b/gi,
    /\b(embedded\s+systems?)\b/gi,
    /\b(cloud\s+computing)\b/gi,
    /\b(software\s+engineering)\b/gi,
    /\b(web\s+development)\b/gi,
    /\b(mobile\s+development)\b/gi,
    /\b(full\s+stack)\b/gi,
    /\b(front\s+end)\b/gi,
    /\b(back\s+end)\b/gi,
    /\b(rest\s+api)\b/gi,
    /\b(version\s+control)\b/gi,
    /\b(unit\s+testing)\b/gi,
    /\b(integration\s+testing)\b/gi,
    /\b(test\s+driven\s+development)\b/gi,
    /\b(object\s+oriented)\b/gi,
    /\b(functional\s+programming)\b/gi
  ];

  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      terms.push(...matches.map(m => m.trim()));
    }
  });

  return terms;
}

/**
 * Get context around a keyword
 */
function getContext(text: string, keyword: string, contextLength: number = 80): string {
  const index = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (index === -1) return text.substring(0, contextLength);
  
  const start = Math.max(0, index - contextLength / 2);
  const end = Math.min(text.length, index + keyword.length + contextLength / 2);
  
  return '...' + text.substring(start, end) + '...';
}

/**
 * Normalize keyword for comparison
 */
function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

/**
 * Categorize a keyword
 */
function categorizKeyword(keyword: string): string {
  const normalized = normalizeKeyword(keyword);
  
  for (const [category, keywords] of Object.entries(TECHNICAL_PATTERNS)) {
    if (keywords.some(k => normalizeKeyword(k) === normalized)) {
      return category === 'languages' ? 'language' : 
             category === 'frameworks' ? 'framework' :
             category === 'tools' ? 'tool' :
             category === 'methodologies' ? 'methodology' :
             category === 'embedded' ? 'technical' :
             category === 'cloud' ? 'tool' :
             category === 'ai' ? 'domain' : 'technical';
    }
  }
  
  return 'technical';
}

/**
 * Get list of all skills from skills section
 */
function getSkillsList(skillsData?: SkillsData): string[] {
  if (!skillsData?.categories) return [];
  
  return skillsData.categories.flatMap(category => 
    category.skills.map(skill => skill.name)
  );
}

/**
 * Find keywords that are mentioned in content but not in skills section
 */
function findMissingKeywords(
  extractedKeywords: ExtractedKeyword[],
  skillsList: string[]
): MissingKeyword[] {
  const normalizedSkills = skillsList.map(normalizeKeyword);
  
  return extractedKeywords
    .filter(keyword => !keyword.inSkillsSection)
    .filter(keyword => keyword.frequency >= 1) // At least mentioned once
    .map(keyword => ({
      keyword: keyword.keyword,
      category: keyword.category,
      frequency: keyword.frequency,
      sources: keyword.sources,
      importance: determineImportance(keyword),
      suggestedCategory: suggestCategory(keyword.keyword, keyword.category)
    }))
    .sort((a, b) => {
      // Sort by importance, then frequency
      const importanceOrder = { high: 3, medium: 2, low: 1 };
      const importanceDiff = importanceOrder[b.importance] - importanceOrder[a.importance];
      return importanceDiff !== 0 ? importanceDiff : b.frequency - a.frequency;
    });
}

/**
 * Determine importance of a missing keyword
 */
function determineImportance(keyword: ExtractedKeyword): 'high' | 'medium' | 'low' {
  // High importance: mentioned 3+ times or in multiple sections
  if (keyword.frequency >= 3 || keyword.sources.length >= 2) {
    return 'high';
  }
  
  // Medium importance: mentioned 2 times
  if (keyword.frequency >= 2) {
    return 'medium';
  }
  
  // Low importance: mentioned once
  return 'low';
}

/**
 * Suggest which skills category to add keyword to
 */
function suggestCategory(keyword: string, category: string): string {
  const normalized = normalizeKeyword(keyword);
  
  // Check if it's a language
  if (TECHNICAL_PATTERNS.languages.some(k => normalizeKeyword(k) === normalized)) {
    return 'Languages & Technologies';
  }
  
  // Check if it's a framework
  if (TECHNICAL_PATTERNS.frameworks.some(k => normalizeKeyword(k) === normalized)) {
    return 'Frameworks & Libraries';
  }
  
  // Check if it's a cloud tool
  if (TECHNICAL_PATTERNS.cloud.some(k => normalizeKeyword(k) === normalized)) {
    return 'Cloud & DevOps';
  }
  
  // Check if it's embedded
  if (TECHNICAL_PATTERNS.embedded.some(k => normalizeKeyword(k) === normalized)) {
    return 'Embedded Systems';
  }
  
  // Default to Technical Skills
  return 'Technical Skills';
}

/**
 * Generate suggestions for improving keyword coverage
 */
function generateSuggestions(
  missingKeywords: MissingKeyword[],
  allKeywords: ExtractedKeyword[]
): KeywordSuggestion[] {
  const suggestions: KeywordSuggestion[] = [];
  
  // Suggest adding high-importance missing keywords
  missingKeywords
    .filter(k => k.importance === 'high')
    .slice(0, 5) // Top 5 only
    .forEach(keyword => {
      suggestions.push({
        action: 'add-to-skills',
        keyword: keyword.keyword,
        reasoning: `"${keyword.keyword}" appears ${keyword.frequency} time(s) in your ${keyword.sources.map(s => s.section).join(' and ')} but is missing from your Skills section.`,
        relatedKeywords: RELATED_SKILLS[normalizeKeyword(keyword.keyword)]
      });
    });
  
  // Check for abbreviations that should be expanded
  allKeywords.forEach(keyword => {
    const normalized = normalizeKeyword(keyword.keyword);
    if (ABBREVIATIONS[normalized]) {
      suggestions.push({
        action: 'expand-abbreviation',
        keyword: keyword.keyword,
        reasoning: `Consider expanding "${keyword.keyword}" to "${ABBREVIATIONS[normalized]}" for better ATS parsing.`
      });
    }
  });
  
  // Suggest related skills
  allKeywords
    .filter(k => k.inSkillsSection && RELATED_SKILLS[normalizeKeyword(k.keyword)])
    .slice(0, 3)
    .forEach(keyword => {
      const related = RELATED_SKILLS[normalizeKeyword(keyword.keyword)];
      const missing = related?.filter(r => 
        !allKeywords.some(k => normalizeKeyword(k.keyword) === normalizeKeyword(r))
      );
      
      if (missing && missing.length > 0) {
        suggestions.push({
          action: 'add-related-skill',
          keyword: keyword.keyword,
          reasoning: `You have "${keyword.keyword}" in your skills. Consider adding related technologies like ${missing.slice(0, 3).join(', ')}.`,
          relatedKeywords: missing
        });
      }
    });
  
  return suggestions;
}

/**
 * Calculate coverage score (0-100)
 */
function calculateCoverageScore(
  extractedKeywords: ExtractedKeyword[],
  skillsList: string[]
): number {
  if (extractedKeywords.length === 0) return 100;
  
  const importantKeywords = extractedKeywords.filter(k => k.frequency >= 2);
  const coveredKeywords = importantKeywords.filter(k => k.inSkillsSection);
  
  return Math.round((coveredKeywords.length / Math.max(importantKeywords.length, 1)) * 100);
}

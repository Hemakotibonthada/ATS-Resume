/**
 * "So What?" Test - Impact Calculator
 * Aggressively validates bullet points and blocks incomplete achievements
 */

export interface SoWhatAnalysis {
  passesTest: boolean;
  blockedReason: string | null;
  questions: string[];
  suggestions: SoWhatSuggestion[];
  autoCompleteTemplate: string;
}

export interface SoWhatSuggestion {
  category: 'money' | 'time' | 'performance' | 'scale' | 'quality';
  question: string;
  examples: string[];
  template: string;
}

/**
 * Run the "So What?" test on a bullet point
 * Returns analysis with blocking reasons if incomplete
 */
export function runSoWhatTest(bulletPoint: string): SoWhatAnalysis {
  const trimmed = bulletPoint.trim();
  
  // Empty bullet points are blocked
  if (!trimmed) {
    return {
      passesTest: false,
      blockedReason: 'Empty bullet point',
      questions: ['What did you actually do?'],
      suggestions: [],
      autoCompleteTemplate: '[Action Verb] + [Task] + [Result with Numbers]',
    };
  }
  
  // Check for action verb
  const hasActionVerb = startsWithActionVerb(trimmed);
  if (!hasActionVerb) {
    return {
      passesTest: false,
      blockedReason: 'Missing action verb',
      questions: ['How did you contribute? (Built? Optimized? Led? Designed?)'],
      suggestions: getActionVerbSuggestions(trimmed),
      autoCompleteTemplate: `[Choose: Built/Optimized/Led/Designed] ${trimmed}`,
    };
  }
  
  // Check for task description
  const hasTask = trimmed.split(' ').length >= 3;
  if (!hasTask) {
    return {
      passesTest: false,
      blockedReason: 'Incomplete task description',
      questions: ['What exactly did you work on?'],
      suggestions: [],
      autoCompleteTemplate: `${trimmed} [describe the specific task/project]`,
    };
  }
  
  // Check for metrics
  const hasMetrics = detectMetrics(trimmed);
  
  // Check for result/impact
  const hasResult = detectResult(trimmed);
  
  // THE "SO WHAT?" TEST: Block if no metrics OR no result
  if (!hasMetrics || !hasResult) {
    const questions: string[] = [];
    const suggestions: SoWhatSuggestion[] = [];
    
    if (!hasMetrics && !hasResult) {
      questions.push('SO WHAT? What was the impact of this work?');
    }
    if (!hasMetrics) {
      questions.push('Did it save money? By how much?');
      questions.push('Did it save time? By how much?');
      questions.push('How many users were affected?');
      questions.push('What was the performance improvement?');
      
      suggestions.push(...getAllImpactSuggestions(trimmed));
    }
    if (!hasResult) {
      questions.push('What happened as a result?');
      questions.push('What was the business impact?');
    }
    
    return {
      passesTest: false,
      blockedReason: 'Missing quantifiable impact - Answer: "So what?"',
      questions,
      suggestions,
      autoCompleteTemplate: generateAutoCompleteTemplate(trimmed, hasMetrics, hasResult),
    };
  }
  
  // Passed all tests!
  return {
    passesTest: true,
    blockedReason: null,
    questions: [],
    suggestions: [],
    autoCompleteTemplate: trimmed,
  };
}

/**
 * Check if text starts with action verb
 */
function startsWithActionVerb(text: string): boolean {
  const actionVerbs = [
    'built', 'developed', 'designed', 'implemented', 'created', 'engineered',
    'optimized', 'improved', 'reduced', 'increased', 'achieved', 'delivered',
    'led', 'managed', 'architected', 'migrated', 'automated', 'integrated',
    'scaled', 'deployed', 'launched', 'streamlined', 'refactored', 'established',
    'spearheaded', 'pioneered', 'drove', 'orchestrated', 'executed', 'accelerated',
  ];
  
  const firstWord = text.trim().split(/\s+/)[0].toLowerCase();
  return actionVerbs.includes(firstWord);
}

/**
 * Detect metrics in text
 */
function detectMetrics(text: string): boolean {
  const metricPatterns = [
    /\d+%/,                          // Percentages: 50%
    /\d+x/,                          // Multipliers: 3x
    /\$[\d,]+/,                      // Money: $50,000
    /\d+[\s-]*(users|customers|clients)/i,
    /\d+[\s-]*(hours|days|weeks|months)/i,
    /\d+[\s-]*(MB|GB|TB|ms|seconds)/i,
    /\d+[\s-]*(requests|queries|transactions)/i,
    /from\s+\d+.*to\s+\d+/i,
    /\d+\+/,
    /\d+k/i,
    /\d+m/i,
  ];
  
  return metricPatterns.some(pattern => pattern.test(text));
}

/**
 * Detect result/impact indicators
 */
function detectResult(text: string): boolean {
  const resultIndicators = [
    'resulting in', 'leading to', 'achieving', 'improving', 'reducing',
    'increasing', 'saving', 'generating', 'boosting', 'enhancing',
    'which', 'thereby', 'thus', 'enabling', 'allowing',
  ];
  
  return resultIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  );
}

/**
 * Get action verb suggestions
 */
function getActionVerbSuggestions(text: string): SoWhatSuggestion[] {
  return [
    {
      category: 'performance',
      question: 'Did you improve something?',
      examples: [
        'Optimized database queries',
        'Improved API response time',
        'Enhanced system reliability',
      ],
      template: `Optimized ${text}`,
    },
    {
      category: 'scale',
      question: 'Did you build something?',
      examples: [
        'Built microservices architecture',
        'Developed automated testing framework',
        'Created CI/CD pipeline',
      ],
      template: `Built ${text}`,
    },
  ];
}

/**
 * Get all impact suggestions
 */
function getAllImpactSuggestions(baseText: string): SoWhatSuggestion[] {
  return [
    {
      category: 'money',
      question: 'Did it save money? By how much?',
      examples: [
        'saving $100K annually in infrastructure costs',
        'generating $50K in additional revenue',
        'reducing operational costs by 30%',
      ],
      template: `${baseText}, saving $[AMOUNT] annually`,
    },
    {
      category: 'time',
      question: 'Did it save time? By how much?',
      examples: [
        'reducing deployment time from 2 hours to 15 minutes',
        'cutting build time by 60%',
        'saving 10 hours per week in manual work',
      ],
      template: `${baseText}, reducing [PROCESS] time by [X]%`,
    },
    {
      category: 'performance',
      question: 'Did it improve performance? By how much?',
      examples: [
        'improving response time by 45%',
        'increasing throughput by 3x',
        'achieving 99.9% uptime',
      ],
      template: `${baseText}, improving [METRIC] by [X]%`,
    },
    {
      category: 'scale',
      question: 'How many users/systems were affected?',
      examples: [
        'impacting 100K+ daily active users',
        'serving 1M requests per day',
        'supporting 50+ microservices',
      ],
      template: `${baseText} serving [X] users/requests`,
    },
    {
      category: 'quality',
      question: 'Did it improve quality? By how much?',
      examples: [
        'reducing bug count by 40%',
        'increasing test coverage from 60% to 95%',
        'decreasing customer complaints by 50%',
      ],
      template: `${baseText}, reducing [ISSUE] by [X]%`,
    },
  ];
}

/**
 * Generate auto-complete template
 */
function generateAutoCompleteTemplate(text: string, hasMetrics: boolean, hasResult: boolean): string {
  const parts: string[] = [text];
  
  if (!hasMetrics) {
    parts.push('[ADD METRIC: by X% / saving $X / for X users]');
  }
  
  if (!hasResult) {
    parts.push('resulting in [ADD IMPACT: improved performance / increased revenue / enhanced UX]');
  }
  
  return parts.join(' ');
}

/**
 * Quick validation - returns true if bullet point is "blocked"
 */
export function isBlockedBySoWhat(bulletPoint: string): boolean {
  const analysis = runSoWhatTest(bulletPoint);
  return !analysis.passesTest;
}

/**
 * Get blocking message for UI
 */
export function getBlockingMessage(bulletPoint: string): string {
  const analysis = runSoWhatTest(bulletPoint);
  return analysis.blockedReason || '';
}

/**
 * Format suggestion for display
 */
export function formatSuggestion(suggestion: SoWhatSuggestion): string {
  return `${suggestion.question}\n\nExample: ${suggestion.examples[0]}\n\nTemplate: ${suggestion.template}`;
}

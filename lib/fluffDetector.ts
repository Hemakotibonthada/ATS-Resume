/**
 * Fluff Detector - Identifies generic phrases and suggests hard skills
 */

export interface FluffDetection {
  phrase: string;
  category: 'soft-skill-fluff' | 'responsibility-fluff' | 'cliche' | 'buzzword';
  severity: 'high' | 'medium' | 'low';
  replacement: string;
  reasoning: string;
}

export interface FluffAnalysis {
  totalFluff: number;
  detections: FluffDetection[];
  fluffPercentage: number;
  score: number; // 0-100, higher is better
}

/**
 * Database of generic phrases that ATS systems flag as fluff
 */
const FLUFF_DATABASE: { [key: string]: FluffDetection } = {
  // Soft skill fluff
  'hard worker': {
    phrase: 'hard worker',
    category: 'soft-skill-fluff',
    severity: 'high',
    replacement: 'Delivered X projects with Y% on-time completion rate',
    reasoning: 'Replace with quantifiable output metrics',
  },
  'team player': {
    phrase: 'team player',
    category: 'soft-skill-fluff',
    severity: 'high',
    replacement: 'Collaborated with 5-person cross-functional team',
    reasoning: 'Specify team size and cross-functional nature',
  },
  'detail-oriented': {
    phrase: 'detail-oriented',
    category: 'soft-skill-fluff',
    severity: 'high',
    replacement: 'Reduced bug count by 30% through systematic code reviews',
    reasoning: 'Show detail orientation through measurable outcomes',
  },
  'fast learner': {
    phrase: 'fast learner',
    category: 'soft-skill-fluff',
    severity: 'high',
    replacement: 'Mastered React and TypeScript in 3 months, shipped production app',
    reasoning: 'Quantify learning timeline with tangible output',
  },
  'excellent communication': {
    phrase: 'excellent communication',
    category: 'soft-skill-fluff',
    severity: 'medium',
    replacement: 'Presented technical architecture to C-suite stakeholders',
    reasoning: 'Show communication through audience and context',
  },
  'problem solver': {
    phrase: 'problem solver',
    category: 'soft-skill-fluff',
    severity: 'high',
    replacement: 'Debugged critical P0 production issue affecting 10K users',
    reasoning: 'Specify the problem scale and impact',
  },
  'self-motivated': {
    phrase: 'self-motivated',
    category: 'soft-skill-fluff',
    severity: 'medium',
    replacement: 'Initiated and led side project that became core product feature',
    reasoning: 'Show initiative through concrete actions',
  },
  
  // Responsibility fluff
  'responsible for': {
    phrase: 'responsible for',
    category: 'responsibility-fluff',
    severity: 'high',
    replacement: 'Built/Designed/Implemented/Led',
    reasoning: 'Use action verbs instead of passive responsibility',
  },
  'duties included': {
    phrase: 'duties included',
    category: 'responsibility-fluff',
    severity: 'high',
    replacement: 'Delivered/Created/Optimized',
    reasoning: 'Focus on achievements, not duties',
  },
  'worked on': {
    phrase: 'worked on',
    category: 'responsibility-fluff',
    severity: 'medium',
    replacement: 'Developed/Engineered/Built',
    reasoning: 'Specify the type of work performed',
  },
  'helped with': {
    phrase: 'helped with',
    category: 'responsibility-fluff',
    severity: 'high',
    replacement: 'Contributed X to/Collaborated on',
    reasoning: 'Quantify your specific contribution',
  },
  'assisted in': {
    phrase: 'assisted in',
    category: 'responsibility-fluff',
    severity: 'high',
    replacement: 'Supported by doing X',
    reasoning: 'Describe your actual actions',
  },
  
  // Clichés
  'seeking growth': {
    phrase: 'seeking growth',
    category: 'cliche',
    severity: 'medium',
    replacement: '(Remove from summary - show growth through experience)',
    reasoning: 'Self-evident and adds no value',
  },
  'passionate about': {
    phrase: 'passionate about',
    category: 'cliche',
    severity: 'medium',
    replacement: '(Show passion through projects and achievements)',
    reasoning: 'Demonstrate passion through actions, not claims',
  },
  'think outside the box': {
    phrase: 'think outside the box',
    category: 'cliche',
    severity: 'high',
    replacement: 'Implemented novel solution using X that achieved Y',
    reasoning: 'Describe the innovative approach specifically',
  },
  'go-getter': {
    phrase: 'go-getter',
    category: 'cliche',
    severity: 'high',
    replacement: '(Show initiative through actions, not adjectives)',
    reasoning: 'Empty descriptor without evidence',
  },
  
  // Buzzwords
  'synergy': {
    phrase: 'synergy',
    category: 'buzzword',
    severity: 'medium',
    replacement: 'Integrated systems X and Y to reduce latency by Z%',
    reasoning: 'Replace with specific technical integration',
  },
  'leverage': {
    phrase: 'leverage',
    category: 'buzzword',
    severity: 'low',
    replacement: 'Used/Applied/Utilized',
    reasoning: 'Use simpler, clearer verbs',
  },
  'paradigm shift': {
    phrase: 'paradigm shift',
    category: 'buzzword',
    severity: 'high',
    replacement: 'Redesigned architecture from X to Y',
    reasoning: 'Describe the actual change made',
  },
  'cutting-edge': {
    phrase: 'cutting-edge',
    category: 'buzzword',
    severity: 'medium',
    replacement: '(Name the specific modern technology used)',
    reasoning: 'Be specific about the technology',
  },
  'best-in-class': {
    phrase: 'best-in-class',
    category: 'buzzword',
    severity: 'high',
    replacement: 'Achieved 99.9% uptime, exceeding industry standard',
    reasoning: 'Quantify the excellence with metrics',
  },
};

/**
 * Detect fluff in text
 */
export function detectFluff(text: string): FluffAnalysis {
  const detections: FluffDetection[] = [];
  const lowerText = text.toLowerCase();
  
  // Check for each fluff phrase
  Object.keys(FLUFF_DATABASE).forEach(fluffPhrase => {
    if (lowerText.includes(fluffPhrase)) {
      detections.push(FLUFF_DATABASE[fluffPhrase]);
    }
  });
  
  // Calculate fluff percentage
  const wordCount = text.split(/\s+/).length;
  const fluffWordCount = detections.reduce((sum, detection) => 
    sum + detection.phrase.split(/\s+/).length, 0
  );
  const fluffPercentage = (fluffWordCount / wordCount) * 100;
  
  // Calculate score (100 = no fluff, 0 = all fluff)
  const score = Math.max(0, Math.round(100 - (fluffPercentage * 2)));
  
  return {
    totalFluff: detections.length,
    detections,
    fluffPercentage: Math.round(fluffPercentage * 10) / 10,
    score,
  };
}

/**
 * Highlight fluff in text with markers
 */
export function highlightFluff(text: string): string {
  let highlighted = text;
  
  Object.keys(FLUFF_DATABASE).forEach(fluffPhrase => {
    const regex = new RegExp(`\\b${fluffPhrase}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `[FLUFF: ${fluffPhrase}]`);
  });
  
  return highlighted;
}

/**
 * Get fluff by category
 */
export function getFluffByCategory(
  category: 'soft-skill-fluff' | 'responsibility-fluff' | 'cliche' | 'buzzword'
): FluffDetection[] {
  return Object.values(FLUFF_DATABASE).filter(fluff => fluff.category === category);
}

/**
 * Check if a specific phrase is fluff
 */
export function isFluff(phrase: string): boolean {
  return phrase.toLowerCase() in FLUFF_DATABASE;
}

/**
 * Get replacement suggestion for fluff
 */
export function getFluffReplacement(fluffPhrase: string): string | null {
  const detection = FLUFF_DATABASE[fluffPhrase.toLowerCase()];
  return detection ? detection.replacement : null;
}

/**
 * Remove all fluff from text (aggressive mode)
 */
export function stripFluff(text: string): string {
  let clean = text;
  
  Object.keys(FLUFF_DATABASE).forEach(fluffPhrase => {
    const regex = new RegExp(`\\b${fluffPhrase}\\b`, 'gi');
    clean = clean.replace(regex, '');
  });
  
  // Clean up extra spaces
  return clean.replace(/\s+/g, ' ').trim();
}

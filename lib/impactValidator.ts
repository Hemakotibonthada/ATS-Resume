/**
 * Impact Validator - Ensures bullet points have quantifiable metrics
 */

export interface ImpactAnalysis {
  hasMetric: boolean;
  hasActionVerb: boolean;
  hasResult: boolean;
  score: number; // 0-100
  suggestions: string[];
  detectedMetrics: string[];
}

export interface MetricSuggestion {
  context: string;
  suggestions: string[];
}

/**
 * Analyze bullet point for quantifiable impact
 */
export function analyzeImpact(bulletPoint: string): ImpactAnalysis {
  const hasMetric = detectMetrics(bulletPoint);
  const hasActionVerb = detectActionVerb(bulletPoint);
  const hasResult = detectResult(bulletPoint);
  const detectedMetrics = extractMetrics(bulletPoint);
  
  // Calculate score
  let score = 0;
  if (hasActionVerb) score += 30;
  if (hasMetric) score += 40;
  if (hasResult) score += 30;
  
  // Generate suggestions
  const suggestions = generateImpactSuggestions(bulletPoint, hasMetric, hasActionVerb, hasResult);
  
  return {
    hasMetric,
    hasActionVerb,
    hasResult,
    score,
    suggestions,
    detectedMetrics,
  };
}

/**
 * Detect if bullet point has metrics
 */
function detectMetrics(text: string): boolean {
  const metricPatterns = [
    /\d+%/,                          // Percentages: 50%
    /\d+x/,                          // Multipliers: 3x
    /\$[\d,]+/,                      // Money: $50,000
    /\d+[\s-]*(users|customers|clients)/i,  // User counts
    /\d+[\s-]*(hours|days|weeks|months)/i,  // Time
    /\d+[\s-]*(MB|GB|TB|ms|seconds)/i,      // Technical units
    /\d+[\s-]*(requests|queries|transactions)/i, // Volume
    /from\s+\d+.*to\s+\d+/i,         // Ranges: from 5 to 10
    /\d+\+/,                         // Plus notation: 100+
    /\d+k/i,                         // K notation: 10k
  ];
  
  return metricPatterns.some(pattern => pattern.test(text));
}

/**
 * Detect action verb
 */
function detectActionVerb(text: string): boolean {
  const actionVerbs = [
    'built', 'developed', 'designed', 'implemented', 'created', 'engineered',
    'optimized', 'improved', 'reduced', 'increased', 'achieved', 'delivered',
    'led', 'managed', 'architected', 'migrated', 'automated', 'integrated',
    'scaled', 'deployed', 'launched', 'streamlined', 'refactored', 'established',
  ];
  
  const firstWord = text.trim().split(/\s+/)[0].toLowerCase();
  return actionVerbs.includes(firstWord);
}

/**
 * Detect result/impact
 */
function detectResult(text: string): boolean {
  const resultIndicators = [
    'resulting in', 'leading to', 'achieving', 'improving', 'reducing',
    'increasing', 'saving', 'generating', 'boosting', 'enhancing',
  ];
  
  return resultIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  );
}

/**
 * Extract metrics from text
 */
function extractMetrics(text: string): string[] {
  const metrics: string[] = [];
  
  // Percentages
  const percentages = text.match(/\d+%/g);
  if (percentages) metrics.push(...percentages);
  
  // Multipliers
  const multipliers = text.match(/\d+x/g);
  if (multipliers) metrics.push(...multipliers);
  
  // Money
  const money = text.match(/\$[\d,]+/g);
  if (money) metrics.push(...money);
  
  // Numbers
  const numbers = text.match(/\b\d+\b/g);
  if (numbers) metrics.push(...numbers);
  
  return metrics;
}

/**
 * Generate suggestions to improve impact
 */
function generateImpactSuggestions(
  text: string,
  hasMetric: boolean,
  hasActionVerb: boolean,
  hasResult: boolean
): string[] {
  const suggestions: string[] = [];
  
  if (!hasActionVerb) {
    suggestions.push('Start with a strong action verb (e.g., Built, Optimized, Reduced)');
  }
  
  if (!hasMetric) {
    suggestions.push('Add a quantifiable metric:');
    suggestions.push('  • Time saved: "reducing build time by 45%"');
    suggestions.push('  • Scale: "handling 1M+ requests per day"');
    suggestions.push('  • Users: "improving experience for 50K users"');
    suggestions.push('  • Performance: "achieving 99.9% uptime"');
    suggestions.push('  • Cost: "saving $100K annually"');
  }
  
  if (!hasResult) {
    suggestions.push('Add the business impact or result:');
    suggestions.push('  • "resulting in 30% faster deployment"');
    suggestions.push('  • "leading to 2x user engagement"');
    suggestions.push('  • "improving team velocity by 40%"');
  }
  
  if (hasActionVerb && hasMetric && hasResult) {
    suggestions.push('✅ Great! This bullet point has strong impact.');
  }
  
  return suggestions;
}

/**
 * Get metric suggestions for specific contexts
 */
export function getMetricSuggestions(context: string): MetricSuggestion {
  const contextLower = context.toLowerCase();
  
  if (contextLower.includes('performance') || contextLower.includes('optimization')) {
    return {
      context: 'Performance/Optimization',
      suggestions: [
        'Reduced latency by X%',
        'Improved response time from X to Y ms',
        'Increased throughput by X requests/second',
        'Decreased memory usage by X%',
        'Achieved X% faster load times',
      ],
    };
  }
  
  if (contextLower.includes('user') || contextLower.includes('customer')) {
    return {
      context: 'User/Customer Impact',
      suggestions: [
        'Improved experience for X users',
        'Increased user retention by X%',
        'Served X million users',
        'Reduced user-reported bugs by X%',
        'Achieved X% user satisfaction rating',
      ],
    };
  }
  
  if (contextLower.includes('team') || contextLower.includes('collaboration')) {
    return {
      context: 'Team/Collaboration',
      suggestions: [
        'Led team of X engineers',
        'Improved team velocity by X%',
        'Reduced onboarding time from X to Y days',
        'Coordinated across X teams',
        'Mentored X junior developers',
      ],
    };
  }
  
  if (contextLower.includes('cost') || contextLower.includes('revenue')) {
    return {
      context: 'Cost/Revenue',
      suggestions: [
        'Saved $X annually in infrastructure costs',
        'Reduced operational costs by X%',
        'Generated $X in revenue',
        'Decreased cloud spend by X%',
        'ROI of X% within Y months',
      ],
    };
  }
  
  // Default technical metrics
  return {
    context: 'Technical Achievement',
    suggestions: [
      'Built system handling X requests/day',
      'Deployed X microservices',
      'Processed X TB of data',
      'Achieved X% test coverage',
      'Reduced build time from X to Y minutes',
    ],
  };
}

/**
 * Validate if a bullet point meets impact standards
 */
export function meetsImpactStandards(bulletPoint: string): boolean {
  const analysis = analyzeImpact(bulletPoint);
  return analysis.score >= 70;
}

/**
 * Generate improved version with metrics
 */
export function improveWithMetrics(bulletPoint: string): string {
  const analysis = analyzeImpact(bulletPoint);
  
  if (analysis.score >= 70) {
    return bulletPoint; // Already good
  }
  
  let improved = bulletPoint;
  
  // Add action verb if missing
  if (!analysis.hasActionVerb) {
    improved = `Built ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
  }
  
  // Add metric placeholder if missing
  if (!analysis.hasMetric) {
    improved += ' [ADD METRIC: e.g., by 30% or for 1M users]';
  }
  
  // Add result if missing
  if (!analysis.hasResult) {
    improved += ' resulting in [ADD IMPACT: e.g., improved team velocity]';
  }
  
  return improved;
}

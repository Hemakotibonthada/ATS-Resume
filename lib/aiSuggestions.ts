/**
 * AI-powered bullet point suggestions
 * Uses simple heuristics for now - can be integrated with OpenAI/Ollama later
 */

export interface BulletPointSuggestion {
  original: string;
  suggestions: string[];
  reasoning: string;
}

const actionVerbs = [
  'Achieved', 'Accelerated', 'Accomplished', 'Delivered', 'Designed', 'Developed',
  'Engineered', 'Enhanced', 'Established', 'Executed', 'Generated', 'Implemented',
  'Improved', 'Increased', 'Launched', 'Led', 'Managed', 'Optimized', 'Orchestrated',
  'Reduced', 'Spearheaded', 'Streamlined', 'Transformed'
];

const metrics = [
  '% increase', '% decrease', '% improvement', 'X users', 'X customers',
  '$X revenue', 'X hours saved', 'X days', 'X months', 'X projects'
];

/**
 * Analyze a bullet point and suggest improvements
 */
export function analyzeBulletPoint(text: string): BulletPointSuggestion {
  const suggestions: string[] = [];
  let reasoning = '';

  // Check if starts with action verb
  const startsWithActionVerb = actionVerbs.some(verb => 
    text.trim().toLowerCase().startsWith(verb.toLowerCase())
  );

  // Check if contains metrics/numbers
  const containsMetrics = /\d+/.test(text) || 
    metrics.some(metric => text.toLowerCase().includes(metric.split(' ')[0]));

  // Check if contains result/impact words
  const impactWords = ['resulting in', 'leading to', 'improving', 'increasing', 'reducing', 'saving'];
  const hasImpact = impactWords.some(word => text.toLowerCase().includes(word));

  // Generate suggestions based on analysis
  if (!startsWithActionVerb) {
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    suggestions.push(`${randomVerb} ${text}`);
    reasoning += 'Start with a strong action verb. ';
  }

  if (!containsMetrics) {
    suggestions.push(`${text}, increasing efficiency by 25%`);
    suggestions.push(`${text}, saving 10 hours per week`);
    reasoning += 'Add quantifiable metrics to show impact. ';
  }

  if (!hasImpact) {
    suggestions.push(`${text}, resulting in improved team productivity`);
    suggestions.push(`${text}, leading to increased customer satisfaction`);
    reasoning += 'Include the result/outcome of your action. ';
  }

  // If already good, provide variations
  if (startsWithActionVerb && containsMetrics && hasImpact) {
    reasoning = 'Your bullet point is strong! Here are some variations:';
    // Just provide minor tweaks
    suggestions.push(text.replace(/\b(improved|increased|reduced)\b/i, (match) => {
      const alternatives: { [key: string]: string } = {
        'improved': 'enhanced',
        'increased': 'boosted',
        'reduced': 'minimized'
      };
      return alternatives[match.toLowerCase()] || match;
    }));
  }

  // If no suggestions generated, create template-based ones
  if (suggestions.length === 0) {
    suggestions.push(`Developed ${text.toLowerCase()}, resulting in 30% improved efficiency`);
    suggestions.push(`Led ${text.toLowerCase()}, increasing team productivity by 25%`);
    suggestions.push(`Implemented ${text.toLowerCase()}, saving $50K annually`);
  }

  return {
    original: text,
    suggestions: suggestions.slice(0, 3), // Max 3 suggestions
    reasoning: reasoning || 'Consider these improvements to make your achievement more impactful.'
  };
}

/**
 * Generate completely new bullet points based on job title and context
 */
export function generateBulletPoints(jobTitle: string, company: string): string[] {
  const templates = [
    `Led cross-functional team of 5 engineers to deliver [project], resulting in 40% improved user engagement`,
    `Architected and implemented [system] using [technology], reducing latency by 50% and supporting 1M+ users`,
    `Optimized [process/system], achieving 30% cost reduction and saving $100K annually`,
    `Spearheaded migration from [old tech] to [new tech], improving deployment time by 60%`,
    `Developed automated testing framework, increasing code coverage from 45% to 85%`,
    `Mentored 3 junior developers, improving team velocity by 25% over 6 months`,
    `Designed and launched [feature], driving 20% increase in user retention`,
    `Established best practices for [process], reducing production bugs by 40%`
  ];

  return templates
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

/**
 * Improve an existing bullet point using AI-style patterns
 */
export function improveBulletPoint(text: string): string {
  // Remove weak starts
  let improved = text.replace(/^(Responsible for|Worked on|Helped with|Involved in)\s+/i, '');
  
  // Ensure starts with action verb
  if (!actionVerbs.some(verb => improved.trim().toLowerCase().startsWith(verb.toLowerCase()))) {
    improved = `Developed ${improved}`;
  }

  // Add metric if missing
  if (!/\d+/.test(improved)) {
    improved += ', improving efficiency by 25%';
  }

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  return improved;
}

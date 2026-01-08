'use client';

import { useMemo } from 'react';

interface ImpactAnalysis {
  score: number;
  weakPhrases: Array<{
    text: string;
    start: number;
    end: number;
    suggestions: string[];
    reason: string;
  }>;
}

const WEAK_PHRASES = [
  {
    patterns: ['responsible for', 'duties include', 'tasked with'],
    suggestions: ['Spearheaded', 'Orchestrated', 'Directed', 'Led', 'Managed'],
    reason: 'Use action verbs instead of passive language',
  },
  {
    patterns: ['helped', 'helped with', 'assisted', 'assisted with'],
    suggestions: ['Facilitated', 'Enabled', 'Supported', 'Contributed to', 'Collaborated on'],
    reason: 'Be specific about your contribution',
  },
  {
    patterns: ['worked on', 'worked with', 'involved in'],
    suggestions: ['Developed', 'Engineered', 'Implemented', 'Built', 'Created'],
    reason: 'Show ownership and initiative',
  },
  {
    patterns: ['tried to', 'attempted to'],
    suggestions: ['Achieved', 'Accomplished', 'Delivered', 'Executed', 'Completed'],
    reason: 'Emphasize results, not attempts',
  },
  {
    patterns: ['various', 'many', 'multiple', 'several'],
    suggestions: ['5+', '10+', 'Dozens of', 'Hundreds of'],
    reason: 'Use specific numbers for impact',
  },
];

const POWER_VERBS = {
  leadership: ['Spearheaded', 'Orchestrated', 'Directed', 'Led', 'Championed', 'Drove', 'Pioneered'],
  achievement: ['Achieved', 'Delivered', 'Exceeded', 'Surpassed', 'Accomplished', 'Attained'],
  improvement: ['Optimized', 'Enhanced', 'Streamlined', 'Improved', 'Upgraded', 'Refined', 'Revitalized'],
  creation: ['Developed', 'Engineered', 'Designed', 'Built', 'Created', 'Established', 'Launched'],
  collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Liaised'],
  analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched', 'Examined'],
  impact: ['Accelerated', 'Transformed', 'Revolutionized', 'Modernized', 'Scaled', 'Expanded'],
};

export function useImpactScore(text: string): ImpactAnalysis {
  return useMemo(() => {
    if (!text || text.trim().length === 0) {
      return { score: 0, weakPhrases: [] };
    }

    const lowerText = text.toLowerCase();
    const weakPhrases: ImpactAnalysis['weakPhrases'] = [];

    // Find all weak phrases
    WEAK_PHRASES.forEach((category) => {
      category.patterns.forEach((pattern) => {
        let index = 0;
        while ((index = lowerText.indexOf(pattern, index)) !== -1) {
          weakPhrases.push({
            text: pattern,
            start: index,
            end: index + pattern.length,
            suggestions: category.suggestions,
            reason: category.reason,
          });
          index += pattern.length;
        }
      });
    });

    // Calculate impact score (0-100)
    // Factors: weak phrases, length, specificity
    const weakPhrasePenalty = weakPhrases.length * 10;
    const hasNumbers = /\d+/.test(text);
    const hasPercentage = /%/.test(text);
    const hasMetrics = /\$|revenue|profit|sales|users|customers/i.test(text);
    
    let score = 100;
    score -= weakPhrasePenalty;
    score += hasNumbers ? 10 : 0;
    score += hasPercentage ? 10 : 0;
    score += hasMetrics ? 10 : 0;

    // Cap between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      weakPhrases: weakPhrases.sort((a, b) => a.start - b.start),
    };
  }, [text]);
}

export function getImpactColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getImpactLabel(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Weak';
}

export { POWER_VERBS };

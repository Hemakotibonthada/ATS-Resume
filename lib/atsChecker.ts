import { Resume, ATSAnalysis, ATSWarning } from '@/types';

/**
 * Analyze resume for ATS compatibility
 */
export function analyzeATS(resume: Resume): ATSAnalysis {
  const warnings: ATSWarning[] = [];
  let score = 100;

  // Check if contact section exists and has required info
  const contactSection = resume.sections.find((s) => s.type === 'contact');
  if (!contactSection) {
    warnings.push({
      severity: 'error',
      message: 'Missing contact information section',
    });
    score -= 20;
  } else {
    const contactData = contactSection.data as any;
    if (!contactData.email) {
      warnings.push({
        severity: 'error',
        message: 'Email address is missing',
        section: 'contact',
      });
      score -= 10;
    }
    if (!contactData.phone) {
      warnings.push({
        severity: 'warning',
        message: 'Phone number is missing',
        section: 'contact',
      });
      score -= 5;
    }
  }

  // Check for standard sections
  const hasExperience = resume.sections.some((s) => s.type === 'experience');
  const hasEducation = resume.sections.some((s) => s.type === 'education');

  if (!hasExperience) {
    warnings.push({
      severity: 'warning',
      message: 'No work experience section found',
    });
    score -= 10;
  }

  if (!hasEducation) {
    warnings.push({
      severity: 'warning',
      message: 'No education section found',
    });
    score -= 5;
  }

  // Check for complex layouts (ATS may struggle)
  if (resume.sections.length > 10) {
    warnings.push({
      severity: 'info',
      message: 'Resume has many sections. Consider consolidating for better ATS readability.',
    });
    score -= 5;
  }

  // Suggestions
  const suggestions: string[] = [];
  
  if (score < 80) {
    suggestions.push('Add missing contact information');
    suggestions.push('Include standard sections (Experience, Education, Skills)');
  }
  
  suggestions.push('Use standard section headings (e.g., "Work Experience" instead of "My Journey")');
  suggestions.push('Avoid using images, charts, or complex graphics in ATS mode');
  suggestions.push('Use standard fonts (Arial, Calibri, Times New Roman)');

  return {
    score: Math.max(0, score),
    warnings,
    suggestions,
  };
}

/**
 * Extract keywords from job description
 */
export function extractKeywords(text: string): string[] {
  // Simple keyword extraction (can be enhanced with NLP)
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));

  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

/**
 * Calculate match score between resume and job description
 */
export function calculateMatchScore(resume: Resume, jobDescription: string): number {
  const jdKeywords = new Set(extractKeywords(jobDescription));
  
  // Extract text from resume
  const resumeText = JSON.stringify(resume.sections).toLowerCase();
  
  let matchedKeywords = 0;
  jdKeywords.forEach((keyword) => {
    if (resumeText.includes(keyword)) {
      matchedKeywords++;
    }
  });

  return Math.round((matchedKeywords / jdKeywords.size) * 100);
}

/**
 * Find missing keywords in resume
 */
export function findMissingKeywords(resume: Resume, jobDescription: string): string[] {
  const jdKeywords = new Set(extractKeywords(jobDescription));
  const resumeText = JSON.stringify(resume.sections).toLowerCase();
  
  const missing: string[] = [];
  jdKeywords.forEach((keyword) => {
    if (!resumeText.includes(keyword)) {
      missing.push(keyword);
    }
  });

  return missing.slice(0, 15); // Return top 15 missing keywords
}

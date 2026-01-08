import { Resume, ATSAnalysis, ATSWarning } from '@/types';
import { analyzeKeywords } from './keywordExtractor';

/**
 * Analyze resume for ATS compatibility
 */
export function analyzeATS(resume: Resume): ATSAnalysis {
  const warnings: ATSWarning[] = [];
  let score = 100;

  // Get keyword analysis for comprehensive checking
  const keywordAnalysis = analyzeKeywords(resume);
  const keywordCoverageScore = keywordAnalysis.coverageScore;

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
    if (!contactData.fullName) {
      warnings.push({
        severity: 'error',
        message: 'Full name is missing',
        section: 'contact',
      });
      score -= 10;
    }
  }

  // Check for standard sections
  const hasExperience = resume.sections.some((s) => s.type === 'experience');
  const hasEducation = resume.sections.some((s) => s.type === 'education');
  const hasSkills = resume.sections.some((s) => s.type === 'skills');

  if (!hasExperience) {
    warnings.push({
      severity: 'warning',
      message: 'No work experience section found',
    });
    score -= 15;
  } else {
    // Check experience content
    const experienceSection = resume.sections.find((s) => s.type === 'experience');
    const experienceData = experienceSection?.data as any;
    if (experienceData?.items?.length === 0) {
      warnings.push({
        severity: 'warning',
        message: 'Experience section is empty',
        section: 'experience',
      });
      score -= 10;
    }
  }

  if (!hasEducation) {
    warnings.push({
      severity: 'warning',
      message: 'No education section found',
    });
    score -= 10;
  } else {
    // Check education content
    const educationSection = resume.sections.find((s) => s.type === 'education');
    const educationData = educationSection?.data as any;
    if (educationData?.items?.length === 0) {
      warnings.push({
        severity: 'warning',
        message: 'Education section is empty',
        section: 'education',
      });
      score -= 5;
    }
  }

  if (!hasSkills) {
    warnings.push({
      severity: 'error',
      message: 'No skills section found - critical for ATS parsing',
    });
    score -= 20;
  } else {
    // Check skills content
    const skillsSection = resume.sections.find((s) => s.type === 'skills');
    const skillsData = skillsSection?.data as any;
    const totalSkills = skillsData?.categories?.reduce((sum: number, cat: any) => sum + (cat.skills?.length || 0), 0) || 0;
    
    if (totalSkills === 0) {
      warnings.push({
        severity: 'error',
        message: 'Skills section is empty',
        section: 'skills',
      });
      score -= 15;
    } else if (totalSkills < 5) {
      warnings.push({
        severity: 'warning',
        message: 'Skills section has very few skills. Add more relevant technical skills.',
        section: 'skills',
      });
      score -= 5;
    }
  }

  // Keyword coverage analysis
  if (keywordCoverageScore < 60) {
    warnings.push({
      severity: 'error',
      message: `Keyword coverage is low (${keywordCoverageScore}%). Many important keywords from your resume content are missing from the Skills section.`,
      section: 'skills',
    });
    score -= 15;
  } else if (keywordCoverageScore < 80) {
    warnings.push({
      severity: 'warning',
      message: `Keyword coverage is moderate (${keywordCoverageScore}%). Consider adding more keywords from your experience to the Skills section.`,
      section: 'skills',
    });
    score -= 10;
  }

  // Check for summary/professional summary
  const hasSummary = resume.sections.some((s) => s.type === 'summary');
  if (!hasSummary) {
    warnings.push({
      severity: 'info',
      message: 'Consider adding a professional summary to highlight your key qualifications',
    });
    score -= 5;
  }

  // Check for complex layouts (ATS may struggle)
  if (resume.sections.length > 10) {
    warnings.push({
      severity: 'info',
      message: 'Resume has many sections. Consider consolidating for better ATS readability.',
    });
    score -= 3;
  }

  // Suggestions
  const suggestions: string[] = [];
  
  if (score < 80) {
    if (!contactSection || !(contactSection.data as any).email) {
      suggestions.push('✓ Add complete contact information (email, phone, location)');
    }
    if (!hasSkills || (hasSkills && score < 70)) {
      suggestions.push('✓ Add comprehensive Skills section with technical keywords');
    }
    if (!hasExperience) {
      suggestions.push('✓ Include Work Experience section with bullet points');
    }
  }
  
  if (keywordCoverageScore < 80) {
    suggestions.push(`✓ Improve keyword coverage (currently ${keywordCoverageScore}%). Check the Keyword Highlighter for missing keywords.`);
  }
  
  if (keywordAnalysis.missingInSkills.length > 0) {
    const topMissing = keywordAnalysis.missingInSkills
      .filter(k => k.importance === 'high')
      .slice(0, 3)
      .map(k => k.keyword);
    if (topMissing.length > 0) {
      suggestions.push(`✓ Add high-priority keywords to Skills: ${topMissing.join(', ')}`);
    }
  }
  
  suggestions.push('✓ Use standard section headings (e.g., "Work Experience" instead of creative names)');
  suggestions.push('✓ Include quantifiable achievements with metrics (%, $, numbers)');
  suggestions.push('✓ Use standard fonts (Arial, Calibri, Times New Roman) for better parsing');

  return {
    score: Math.max(0, Math.min(100, score)),
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

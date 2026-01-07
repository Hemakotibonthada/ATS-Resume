import { Resume, SectionData, ExperienceItem, EducationItem, ProjectItem, CertificationItem } from '@/types';

/**
 * Ghost Text Layer Generator
 * 
 * Extracts resume data in a purely linear, hierarchical order for ATS parsing.
 * Ensures that even with visual columns/layouts, the underlying text stream is:
 * Header → Contact → Summary → Work History → Job 1 → Job 2 → Education → Skills → etc.
 * 
 * This is critical for Eightfold.ai and other ATS systems that parse the raw text layer.
 */

export interface GhostTextOptions {
  includeMetadata?: boolean;
  sectionSeparator?: string;
  itemSeparator?: string;
  bulletPrefix?: string;
}

const DEFAULT_OPTIONS: GhostTextOptions = {
  includeMetadata: true,
  sectionSeparator: '\n\n---\n\n',
  itemSeparator: '\n\n',
  bulletPrefix: '• ',
};

/**
 * Generate a linear, hierarchical text representation of the resume
 * This text layer is invisible but crucial for ATS parsing
 */
export function generateGhostTextLayer(resume: Resume, options: GhostTextOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const sections: string[] = [];

  // Sort sections by order
  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    if (!section.visible) continue;

    const sectionText = extractSectionText(section.type, section.data, section.title, opts);
    if (sectionText) {
      sections.push(sectionText);
    }
  }

  let fullText = sections.join(opts.sectionSeparator);

  // Add metadata header if requested
  if (opts.includeMetadata) {
    const metadata = `Document Type: Resume/CV\nTitle: ${resume.metadata.title}\nGenerated: ${new Date().toISOString()}\n`;
    fullText = metadata + opts.sectionSeparator + fullText;
  }

  return fullText;
}

/**
 * Extract text from a specific section in strict hierarchical order
 */
function extractSectionText(
  type: string,
  data: SectionData,
  title: string,
  opts: GhostTextOptions
): string {
  switch (type) {
    case 'contact':
      return extractContactText(data as any, opts);
    case 'summary':
      return extractSummaryText(data as any, title, opts);
    case 'experience':
      return extractExperienceText(data as any, title, opts);
    case 'education':
      return extractEducationText(data as any, title, opts);
    case 'skills':
      return extractSkillsText(data as any, title, opts);
    case 'languages':
      return extractLanguagesText(data as any, title, opts);
    case 'projects':
      return extractProjectsText(data as any, title, opts);
    case 'certifications':
      return extractCertificationsText(data as any, title, opts);
    case 'custom':
      return extractCustomText(data as any, title, opts);
    default:
      return '';
  }
}

/**
 * CONTACT SECTION
 * Format: Name → Title → Email → Phone → Location → Links
 */
function extractContactText(data: any, opts: GhostTextOptions): string {
  const lines: string[] = [];

  if (data.fullName) lines.push(data.fullName);
  if (data.title) lines.push(data.title);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.location) lines.push(`Location: ${data.location}`);

  // Links in strict order
  if (data.links && data.links.length > 0) {
    const linkLines = data.links
      .filter((link: any) => link.url)
      .map((link: any) => `${link.label}: ${link.url}`);
    lines.push(...linkLines);
  }

  return lines.join('\n');
}

/**
 * SUMMARY SECTION
 * Format: Section Title → Summary Text
 */
function extractSummaryText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());
  if (data.text) {
    // Strip markdown formatting for pure text
    const cleanText = stripMarkdown(data.text);
    lines.push(cleanText);
  }

  return lines.join('\n');
}

/**
 * EXPERIENCE SECTION
 * Format: Section Title → Job 1 → Job 2 → Job 3 (chronological order)
 * Each Job: Position → Company → Dates → Location → Bullet 1 → Bullet 2 → ...
 */
function extractExperienceText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.items && data.items.length > 0) {
    const items = data.items as ExperienceItem[];
    
    items.forEach((item, index) => {
      const itemLines: string[] = [];
      
      // Position (most important)
      if (item.position) itemLines.push(item.position);
      
      // Company
      if (item.company) itemLines.push(item.company);
      
      // Dates
      const dateRange = formatDateRange(item.startDate, item.endDate || undefined, item.current);
      if (dateRange) itemLines.push(dateRange);
      
      // Location
      if (item.location) itemLines.push(item.location);
      
      // Highlights (bullet points)
      if (item.highlights && item.highlights.length > 0) {
        const bulletLines = item.highlights
          .filter(h => h.trim())
          .map(h => `${opts.bulletPrefix}${stripMarkdown(h)}`);
        itemLines.push(...bulletLines);
      }
      
      lines.push(itemLines.join('\n'));
    });
  }

  return lines.join(opts.itemSeparator);
}

/**
 * EDUCATION SECTION
 * Format: Section Title → Degree 1 → Degree 2 (chronological order)
 * Each Degree: Degree → Institution → Dates → Location → GPA → Details
 */
function extractEducationText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.items && data.items.length > 0) {
    const items = data.items as EducationItem[];
    
    items.forEach((item, index) => {
      const itemLines: string[] = [];
      
      // Degree
      if (item.degree) itemLines.push(item.degree);
      
      // Institution
      if (item.institution) itemLines.push(item.institution);
      
      // Dates
      const dateRange = formatDateRange(item.startDate, item.endDate || undefined);
      if (dateRange) itemLines.push(dateRange);
      
      // Location
      if (item.location) itemLines.push(item.location);
      
      // GPA
      if (item.gpa) itemLines.push(`GPA: ${item.gpa}`);
      
      // Additional details
      if (item.description) itemLines.push(stripMarkdown(item.description));
      
      lines.push(itemLines.join('\n'));
    });
  }

  return lines.join(opts.itemSeparator);
}

/**
 * SKILLS SECTION
 * Format: Section Title → Category 1 → Skills → Category 2 → Skills
 */
function extractSkillsText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.categories && data.categories.length > 0) {
    data.categories.forEach((category: any) => {
      if (category.name) lines.push(category.name);
      
      if (category.skills && category.skills.length > 0) {
        const skillsList = category.skills
          .map((skill: any) => {
            if (typeof skill === 'string') return skill;
            return skill.level ? `${skill.name} (${skill.level})` : skill.name;
          })
          .join(', ');
        lines.push(skillsList);
      }
    });
  }

  return lines.join('\n');
}

/**
 * LANGUAGES SECTION
 * Format: Section Title → Language 1 (Proficiency) → Language 2 (Proficiency)
 */
function extractLanguagesText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.languages && data.languages.length > 0) {
    const langLines = data.languages
      .map((lang: any) => {
        if (lang.proficiency) {
          return `${lang.name} (${lang.proficiency})`;
        }
        return lang.name;
      });
    lines.push(...langLines);
  }

  return lines.join('\n');
}

/**
 * PROJECTS SECTION
 * Format: Section Title → Project 1 → Project 2 (chronological order)
 * Each Project: Name → Description → Technologies → Links
 */
function extractProjectsText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.items && data.items.length > 0) {
    const items = data.items as ProjectItem[];
    
    items.forEach((item, index) => {
      const itemLines: string[] = [];
      
      // Project name
      if (item.name) itemLines.push(item.name);
      
      // Description
      if (item.description) itemLines.push(stripMarkdown(item.description));
      
      // Technologies
      if (item.technologies && item.technologies.length > 0) {
        itemLines.push(`Technologies: ${item.technologies.join(', ')}`);
      }
      
      // Links
      if (item.url) itemLines.push(`Link: ${item.url}`);
      
      lines.push(itemLines.join('\n'));
    });
  }

  return lines.join(opts.itemSeparator);
}

/**
 * CERTIFICATIONS SECTION
 * Format: Section Title → Cert 1 → Cert 2 (chronological order)
 * Each Cert: Name → Issuer → Date → ID → Link
 */
function extractCertificationsText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.items && data.items.length > 0) {
    const items = data.items as CertificationItem[];
    
    items.forEach((item, index) => {
      const itemLines: string[] = [];
      
      // Certification name
      if (item.name) itemLines.push(item.name);
      
      // Issuer
      if (item.issuer) itemLines.push(`Issued by: ${item.issuer}`);
      
      // Date
      if (item.date) itemLines.push(`Date: ${item.date}`);
      
      // Credential ID
      if (item.credentialId) itemLines.push(`Credential ID: ${item.credentialId}`);
      
      // Link
      if (item.url) itemLines.push(`Link: ${item.url}`);
      
      lines.push(itemLines.join('\n'));
    });
  }

  return lines.join(opts.itemSeparator);
}

/**
 * CUSTOM SECTION
 * Format: Section Title → Content
 */
function extractCustomText(data: any, title: string, opts: GhostTextOptions): string {
  const lines: string[] = [];
  
  lines.push(title.toUpperCase());

  if (data.type === 'hobbies' && data.hobbies) {
    lines.push(data.hobbies.join(', '));
  } else if (data.type === 'books' && data.books) {
    lines.push(data.books.map((book: any) => book.title).join(', '));
  } else if (data.type === 'philosophy' && data.quote) {
    lines.push(data.quote);
    if (data.author) lines.push(`- ${data.author}`);
  } else if (data.type === 'timeline' && data.milestones) {
    data.milestones.forEach((milestone: any) => {
      lines.push(`${milestone.label}: ${milestone.percentage}%`);
    });
  } else if (data.type === 'freeform' && data.content) {
    lines.push(stripMarkdown(data.content));
  }

  return lines.join('\n');
}

/**
 * Format date range consistently
 */
function formatDateRange(startDate?: string, endDate?: string, isCurrent?: boolean): string {
  if (!startDate) return '';
  
  const start = startDate;
  const end = isCurrent ? 'Present' : endDate || 'Present';
  
  return `${start} - ${end}`;
}

/**
 * Strip markdown formatting to produce clean text
 */
function stripMarkdown(text: string): string {
  return text
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headers
    .replace(/^#+\s+/gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Export ghost text layer as plain text file
 */
export function exportGhostTextLayer(resume: Resume, filename?: string): void {
  const ghostText = generateGhostTextLayer(resume);
  
  const blob = new Blob([ghostText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || `${resume.metadata.title.replace(/\s+/g, '_')}_ghost_text.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get ghost text layer as data URL for embedding in PDF
 */
export function getGhostTextLayerDataURL(resume: Resume): string {
  const ghostText = generateGhostTextLayer(resume);
  const encoded = encodeURIComponent(ghostText);
  return `data:text/plain;charset=utf-8,${encoded}`;
}

/**
 * Validate ghost text layer structure
 * Ensures proper hierarchical order and no floating text
 */
export function validateGhostTextLayer(resume: Resume): {
  isValid: boolean;
  issues: string[];
  hierarchy: string[];
} {
  const issues: string[] = [];
  const hierarchy: string[] = [];
  
  const ghostText = generateGhostTextLayer(resume);
  const lines = ghostText.split('\n').filter(l => l.trim());
  
  // Check for section headers in uppercase
  const sectionHeaders = lines.filter(l => l === l.toUpperCase() && l.length > 2);
  hierarchy.push(...sectionHeaders);
  
  if (sectionHeaders.length === 0) {
    issues.push('No section headers found in ghost text layer');
  }
  
  // Check for proper contact info at start
  const firstSection = ghostText.split('\n\n---\n\n')[1]; // Skip metadata
  if (firstSection && !firstSection.includes('@')) {
    issues.push('Contact information may be missing or improperly formatted');
  }
  
  // Check for floating bullet points (bullets not under a section)
  let inSection = false;
  for (const line of lines) {
    if (line === line.toUpperCase() && line.length > 2) {
      inSection = true;
    }
    if (line.startsWith('•') && !inSection) {
      issues.push('Found floating bullet point not under a section');
      break;
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    hierarchy,
  };
}

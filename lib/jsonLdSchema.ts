/**
 * JSON-LD Schema Generator for Resume
 * Creates Schema.org/Person structured data for ATS systems
 */

import { Resume, ContactData, ExperienceData, EducationData, SkillsData, SummaryData } from '@/types/resume';

/**
 * Generate JSON-LD Schema from resume
 */
export function generateResumeSchema(resume: Resume): object {
  const contactSection = resume.sections.find(s => s.type === 'contact');
  const experienceSection = resume.sections.find(s => s.type === 'experience');
  const educationSection = resume.sections.find(s => s.type === 'education');
  const skillsSection = resume.sections.find(s => s.type === 'skills');
  const summarySection = resume.sections.find(s => s.type === 'summary');
  
  const contact = contactSection?.data as ContactData;
  const experience = (experienceSection?.data as ExperienceData)?.items || [];
  const education = (educationSection?.data as EducationData)?.items || [];
  const skillsData = skillsSection?.data as SkillsData;
  const skills = skillsData?.categories?.flatMap(cat => cat.skills) || [];
  const summary = (summarySection?.data as SummaryData)?.content || '';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: contact?.fullName || '',
    jobTitle: experience[0]?.position || 'Software Engineer',
    email: contact?.email || '',
    telephone: contact?.phone || '',
    url: contact?.links?.[0]?.url || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: contact?.location || '',
      addressCountry: '',
    },
    description: summary,
    knowsAbout: skills.map((skill: any) => skill.name),
    alumniOf: education.map((edu: any) => ({
      '@type': 'Organization',
      name: edu.institution,
    })),
    worksFor: experience.length > 0 ? {
      '@type': 'Organization',
      name: experience[0].company,
    } : undefined,
    hasOccupation: experience.map((exp: any) => ({
      '@type': 'Occupation',
      name: exp.position,
      occupationLocation: {
        '@type': 'Place',
        address: exp.location,
      },
      estimatedSalary: undefined, // Privacy-first
      experienceRequirements: exp.highlights.join(', '),
    })),
  };
  
  return schema;
}

/**
 * Generate enhanced JSON-LD with work history
 */
export function generateEnhancedSchema(resume: Resume): object {
  const baseSchema = generateResumeSchema(resume);
  
  const experienceSection = resume.sections.find(s => s.type === 'experience');
  const educationSection = resume.sections.find(s => s.type === 'education');
  
  const experience = (experienceSection?.data as ExperienceData)?.items || [];
  const education = (educationSection?.data as EducationData)?.items || [];
  
  const enhanced = {
    ...baseSchema,
    hasCredential: education.map((edu: any) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: edu.degree,
      educationalLevel: getDegreeLevel(edu.degree),
      recognizedBy: {
        '@type': 'Organization',
        name: edu.institution,
      },
      dateCreated: edu.graduationDate,
    })),
    performerIn: experience.map((exp: any) => ({
      '@type': 'Action',
      name: exp.position,
      startTime: exp.startDate,
      endTime: exp.endDate || new Date().toISOString(),
      location: {
        '@type': 'Place',
        name: exp.location,
      },
      object: {
        '@type': 'Organization',
        name: exp.company,
      },
      result: exp.highlights.map((highlight: any) => ({
        '@type': 'Thing',
        description: highlight,
      })),
    })),
    award: [], // Can be populated with certifications
    seeks: {
      '@type': 'Occupation',
      name: 'Software Engineering Position',
    },
  };
  
  return enhanced;
}

/**
 * Map degree to education level
 */
function getDegreeLevel(degree: string): string {
  const lower = degree.toLowerCase();
  
  if (lower.includes('phd') || lower.includes('doctorate')) {
    return 'Doctorate';
  }
  if (lower.includes('master')) {
    return 'Master';
  }
  if (lower.includes('bachelor')) {
    return 'Bachelor';
  }
  if (lower.includes('associate')) {
    return 'Associate';
  }
  
  return 'Bachelor'; // Default
}

/**
 * Export schema as JSON string
 */
export function exportSchemaAsJSON(resume: Resume, enhanced: boolean = false): string {
  const schema = enhanced ? generateEnhancedSchema(resume) : generateResumeSchema(resume);
  return JSON.stringify(schema, null, 2);
}

/**
 * Export schema as HTML script tag
 */
export function exportSchemaAsHTML(resume: Resume, enhanced: boolean = false): string {
  const json = exportSchemaAsJSON(resume, enhanced);
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

/**
 * Validate schema structure
 */
export function validateSchema(schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  const required = ['@context', '@type', 'name', 'email'];
  required.forEach(field => {
    if (!(field in schema)) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Check @context
  if (schema['@context'] !== 'https://schema.org') {
    errors.push('Invalid @context. Must be "https://schema.org"');
  }
  
  // Check @type
  if (schema['@type'] !== 'Person') {
    errors.push('Invalid @type. Must be "Person" for resume schema');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate schema optimized for Eightfold.ai
 */
export function generateEightfoldSchema(resume: Resume): object {
  const contactSection = resume.sections.find(s => s.type === 'contact');
  const experienceSection = resume.sections.find(s => s.type === 'experience');
  const educationSection = resume.sections.find(s => s.type === 'education');
  const skillsSection = resume.sections.find(s => s.type === 'skills');
  
  const contact = contactSection?.data as ContactData;
  const experience = (experienceSection?.data as ExperienceData)?.items || [];
  const education = (educationSection?.data as EducationData)?.items || [];
  const skillsData = skillsSection?.data as SkillsData;
  const skills = skillsData?.categories?.flatMap(cat => cat.skills) || [];
  
  // Eightfold prefers detailed skill ontology
  const skillCategories = categorizeSkills(skills.map((s: any) => s.name));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: contact?.fullName || '',
    email: contact?.email || '',
    
    // Skills with proficiency
    knowsAbout: skills.map((skill: any) => ({
      '@type': 'Thing',
      name: skill.name,
      proficiencyLevel: skill.level || 'intermediate',
    })),
    
    // Work history with detailed actions
    worksFor: experience.map((exp: any) => ({
      '@type': 'Organization',
      name: exp.company,
      employee: {
        '@type': 'OrganizationRole',
        roleName: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate || 'Present',
        location: exp.location,
        responsibilities: exp.highlights,
      },
    })),
    
    // Skill categories for knowledge graph
    hasSkill: Object.entries(skillCategories).map(([category, skills]) => ({
      '@type': 'DefinedTerm',
      name: category,
      termCode: skills,
    })),
    
    // Education
    hasCredential: education.map((edu: any) => ({
      '@type': 'EducationalOccupationalCredential',
      name: edu.degree,
      credentialCategory: edu.fieldOfStudy,
      educationalLevel: getDegreeLevel(edu.degree),
      recognizedBy: {
        '@type': 'EducationalOrganization',
        name: edu.institution,
      },
    })),
  };
}

/**
 * Categorize skills by type (for knowledge graph)
 */
function categorizeSkills(skills: string[]): { [category: string]: string[] } {
  const categories: { [category: string]: string[] } = {
    'Programming Languages': [],
    'Frameworks': [],
    'Cloud & DevOps': [],
    'Databases': [],
    'Tools': [],
  };
  
  const patterns = {
    'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++', 'Rust'],
    'Frameworks': ['React', 'Node.js', 'Express', 'Django', 'Flask', 'Spring'],
    'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'],
    'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB'],
    'Tools': ['Git', 'Jest', 'Webpack', 'Linux'],
  };
  
  skills.forEach(skill => {
    let categorized = false;
    
    Object.entries(patterns).forEach(([category, keywords]) => {
      if (keywords.some(keyword => skill.includes(keyword))) {
        categories[category].push(skill);
        categorized = true;
      }
    });
    
    if (!categorized) {
      categories['Tools'].push(skill);
    }
  });
  
  return categories;
}

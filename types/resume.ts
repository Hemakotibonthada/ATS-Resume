import { TemplateId } from '@/lib/templates';

/**
 * Core Resume Data Schema
 * This is the single source of truth for resume data structure
 */

export interface Resume {
  id: string;
  version: number; // For version control
  createdAt: string;
  updatedAt: string;
  metadata: ResumeMetadata;
  settings: ResumeSettings;
  sections: ResumeSection[];
  templateId?: TemplateId; // Selected template
}

export interface ResumeMetadata {
  title: string; // e.g., "Software Engineer - Google Application"
  description?: string;
  tags?: string[];
}

export interface ResumeSettings {
  theme: ThemeSettings;
  layout: LayoutSettings;
  atsMode: boolean; // Toggle ATS-friendly mode
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  accentColor: string;
  fontPair: FontPair;
  showQRCodes?: boolean; // Show QR codes for contact links
}

export interface FontPair {
  heading: string; // e.g., "Inter"
  body: string; // e.g., "Merriweather"
}

export interface LayoutSettings {
  pageSize: 'A4' | 'Letter';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  lineHeight: number;
  sectionSpacing: number;
}

/**
 * Section Types
 * Each section has a type, order, and data
 */
export type SectionType = 
  | 'contact' 
  | 'summary' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'languages'
  | 'projects'
  | 'certifications'
  | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  title: string; // Customizable section title
  data: SectionData;
}

export type SectionData = 
  | ContactData
  | SummaryData
  | ExperienceData
  | EducationData
  | SkillsData
  | LanguagesData
  | ProjectsData
  | CertificationsData
  | CustomData;

/**
 * Contact Information
 */
export interface ContactData {
  fullName: string;
  title: string; // Job title/profession
  email: string;
  phone: string;
  location: string; // City, State/Country
  links: ContactLink[];
  photo?: string; // Base64 or URL
}

export interface ContactLink {
  id: string;
  type: 'linkedin' | 'github' | 'website' | 'portfolio' | 'custom';
  label: string;
  url: string;
  showQR?: boolean; // Enable QR code generation
}

/**
 * Professional Summary
 */
export interface SummaryData {
  content: string; // Supports markdown
}

/**
 * Work Experience
 */
export interface ExperienceData {
  items: ExperienceItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string | null; // null = "Present"
  current: boolean;
  description: string; // Supports markdown
  highlights: string[]; // Bullet points
  skills: string[]; // Related skills/technologies
}

/**
 * Education
 */
export interface EducationData {
  items: EducationItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string | null;
  gpa?: string;
  honors?: string;
  description?: string;
}

/**
 * Skills
 */
export interface SkillsData {
  categories: SkillCategory[];
}

export interface SkillCategory {
  id: string;
  name: string; // e.g., "Programming Languages"
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

/**
 * Languages
 */
export interface LanguagesData {
  items: LanguageItem[];
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
}

/**
 * Projects
 */
export interface ProjectsData {
  items: ProjectItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string | null;
  technologies: string[];
  highlights: string[];
}

/**
 * Certifications
 */
export interface CertificationsData {
  items: CertificationItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

/**
 * Custom Sections (Enhancv-style creativity)
 */
export interface CustomData {
  customType: 'timeline' | 'philosophy' | 'books' | 'achievements' | 'hobbies' | 'freeform';
  content: any; // Flexible structure
}

/**
 * Version Control (Resume Time Travel)
 */
export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  createdAt: string;
  message: string; // Commit message
  snapshot: Resume; // Full resume snapshot
}

/**
 * Custom Section (flexible content)
 */
export interface CustomData {
  type: 'hobbies' | 'books' | 'timeline' | 'philosophy' | 'freeform';
  items: CustomItem[];
}

export interface CustomItem {
  id: string;
  text: string;
  icon?: string;
  value?: number;
  color?: string;
}

/**
 * Job Description Matching
 */
export interface JobMatch {
  id: string;
  resumeId: string;
  jobDescription: string;
  matchScore: number; // 0-100
  missingKeywords: string[];
  suggestions: string[];
  analyzedAt: string;
}

/**
 * ATS Analysis Result
 */
export interface ATSAnalysis {
  score: number; // 0-100
  warnings: ATSWarning[];
  suggestions: string[];
}

export interface ATSWarning {
  severity: 'error' | 'warning' | 'info';
  message: string;
  section?: string;
}

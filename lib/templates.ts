/**
 * Resume Templates
 * Different visual styles and layouts for the resume
 */

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'technical' | 'devops' | 'single-page';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  style: TemplateStyle;
}

export interface TemplateStyle {
  layout: 'single-column' | 'two-column' | 'sidebar';
  headerAlignment: 'left' | 'center' | 'right';
  sectionStyle: 'bordered' | 'minimal' | 'card' | 'timeline';
  accentPosition: 'left' | 'top' | 'none';
  spacing: 'compact' | 'normal' | 'relaxed';
  bulletStyle: 'disc' | 'square' | 'arrow' | 'checkmark';
}

export const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean two-column layout with accent sidebar',
    preview: '📊',
    style: {
      layout: 'two-column',
      headerAlignment: 'left',
      sectionStyle: 'minimal',
      accentPosition: 'left',
      spacing: 'normal',
      bulletStyle: 'disc',
    },
  },
  {
    id: 'classic',
    name: 'Classic Resume',
    description: 'Traditional single-column layout, ATS-friendly',
    preview: '📄',
    style: {
      layout: 'single-column',
      headerAlignment: 'center',
      sectionStyle: 'bordered',
      accentPosition: 'top',
      spacing: 'normal',
      bulletStyle: 'disc',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum white space',
    preview: '⚪',
    style: {
      layout: 'single-column',
      headerAlignment: 'left',
      sectionStyle: 'minimal',
      accentPosition: 'none',
      spacing: 'relaxed',
      bulletStyle: 'arrow',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with card-style sections',
    preview: '🎨',
    style: {
      layout: 'sidebar',
      headerAlignment: 'center',
      sectionStyle: 'card',
      accentPosition: 'left',
      spacing: 'normal',
      bulletStyle: 'checkmark',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior positions',
    preview: '💼',
    style: {
      layout: 'single-column',
      headerAlignment: 'center',
      sectionStyle: 'minimal',
      accentPosition: 'top',
      spacing: 'relaxed',
      bulletStyle: 'square',
    },
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Two-column layout optimized for technical roles',
    preview: '⚙️',
    style: {
      layout: 'two-column',
      headerAlignment: 'left',
      sectionStyle: 'timeline',
      accentPosition: 'left',
      spacing: 'compact',
      bulletStyle: 'arrow',
    },
  },
  {
    id: 'devops',
    name: 'DevOps Professional',
    description: 'Modern two-column with circular photo, blue accents, and skill tags',
    preview: '🚀',
    style: {
      layout: 'two-column',
      headerAlignment: 'left',
      sectionStyle: 'minimal',
      accentPosition: 'top',
      spacing: 'normal',
      bulletStyle: 'disc',
    },
  },
  {
    id: 'single-page',
    name: 'Single Page Pro',
    description: 'Perfectly aligned single-page layout with optimal spacing',
    preview: '📄',
    style: {
      layout: 'single-column',
      headerAlignment: 'center',
      sectionStyle: 'minimal',
      accentPosition: 'top',
      spacing: 'compact',
      bulletStyle: 'disc',
    },
  },
];

export function getTemplate(id: TemplateId): Template {
  return templates.find(t => t.id === id) || templates[0];
}

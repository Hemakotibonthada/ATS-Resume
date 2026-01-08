'use client';

import { useResumeStore } from '@/stores';
import { InlineEdit } from './InlineEdit';
import { Calendar, GraduationCap, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { EducationData, EducationItem } from '@/types/resume';

interface EducationBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function EducationBlock({ sectionId, isInteractive }: EducationBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);

  const section = currentResume?.sections.find((s) => s.id === sectionId);
  if (!section) return null;

  const data = section.data as EducationData;
  const theme = currentResume!.settings.theme;

  const handleUpdateEducation = (eduId: string, field: string, value: string) => {
    const updatedEducation = data.items.map((edu) =>
      edu.id === eduId ? { ...edu, [field]: value } : edu
    );
    updateSectionData(sectionId, { items: updatedEducation });
  };

  const handleAddEducation = () => {
    const newEducation: EducationItem = {
      id: uuidv4(),
      institution: 'University Name',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      gpa: '',
      honors: '',
      description: '',
    };
    updateSectionData(sectionId, {
      items: [...data.items, newEducation],
    });
  };

  const handleRemoveEducation = (eduId: string) => {
    const updatedEducation = data.items.filter((edu) => edu.id !== eduId);
    updateSectionData(sectionId, { items: updatedEducation });
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: theme.primaryColor }}>
        <GraduationCap size={24} style={{ color: theme.primaryColor }} />
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
          {section.title}
        </h2>
      </div>

      {/* Education Items */}
      <div className="space-y-6">
        {data.items.map((edu, index) => (
          <div
            key={edu.id}
            className="group relative pl-4 border-l-2"
            style={{ borderColor: theme.primaryColor }}
          >
            {/* Delete Education Button */}
            {isInteractive && data.items.length > 1 && (
              <button
                onClick={() => handleRemoveEducation(edu.id)}
                className="absolute -left-2 top-0 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove education"
              >
                <Trash2 size={14} />
              </button>
            )}

            {/* Degree and Field of Study */}
            <div className="mb-2">
              <InlineEdit
                value={edu.degree}
                onChange={(value) => handleUpdateEducation(edu.id, 'degree', value)}
                as="h3"
                className="text-lg font-bold"
                disabled={!isInteractive}
              />
              {edu.field && (
                <span className="text-gray-600">
                  {' in '}
                  <InlineEdit
                    value={edu.field}
                    onChange={(value) => handleUpdateEducation(edu.id, 'field', value)}
                    as="span"
                    disabled={!isInteractive}
                  />
                </span>
              )}
            </div>

            {/* Institution */}
            <div className="mb-1">
              <InlineEdit
                value={edu.institution}
                onChange={(value) => handleUpdateEducation(edu.id, 'institution', value)}
                as="p"
                className="font-semibold"
                disabled={!isInteractive}
              />
            </div>

            {/* Dates and GPA */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <InlineEdit
                  value={edu.startDate}
                  onChange={(value) => handleUpdateEducation(edu.id, 'startDate', value)}
                  as="span"
                  placeholder="Start Date"
                  disabled={!isInteractive}
                />
                <span> - </span>
                <InlineEdit
                  value={edu.endDate || 'Present'}
                  onChange={(value) => handleUpdateEducation(edu.id, 'endDate', value || null as any)}
                  as="span"
                  placeholder="End Date"
                  disabled={!isInteractive}
                />
              </div>
              {edu.gpa && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">GPA:</span>
                  <InlineEdit
                    value={edu.gpa}
                    onChange={(value) => handleUpdateEducation(edu.id, 'gpa', value)}
                    as="span"
                    disabled={!isInteractive}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            {edu.description && (
              <div className="text-sm text-gray-700 mt-2">
                <InlineEdit
                  value={edu.description}
                  onChange={(value) => handleUpdateEducation(edu.id, 'description', value)}
                  as="p"
                  multiline
                  disabled={!isInteractive}
                />
              </div>
            )}
            
            {/* Honors */}
            {edu.honors && (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Honors: </span>
                <InlineEdit
                  value={edu.honors}
                  onChange={(value) => handleUpdateEducation(edu.id, 'honors', value)}
                  as="span"
                  disabled={!isInteractive}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Education Button */}
      {isInteractive && (
        <button
          onClick={handleAddEducation}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
        >
          <GraduationCap size={18} />
          Add Education
        </button>
      )}
    </div>
  );
}

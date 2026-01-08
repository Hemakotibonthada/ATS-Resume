'use client';

import { InlineEdit } from './InlineEdit';
import { useResumeStore } from '@/stores';
import { ExperienceData, ExperienceItem } from '@/types';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function ExperienceBlock({
  sectionId,
  isInteractive,
}: ExperienceBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);

  if (!currentResume) return null;

  const section = currentResume.sections.find((s) => s.id === sectionId);
  if (!section || section.type !== 'experience') return null;

  const data = section.data as ExperienceData;
  const theme = currentResume.settings.theme;

  const handleUpdateExperience = (
    expId: string,
    field: keyof ExperienceItem,
    value: any
  ) => {
    const updatedExperiences = data.items.map((exp) =>
      exp.id === expId ? { ...exp, [field]: value } : exp
    );
    updateSectionData(sectionId, { items: updatedExperiences });
  };

  const handleAddBullet = (expId: string) => {
    const updatedExperiences = data.items.map((exp) =>
      exp.id === expId
        ? { ...exp, highlights: [...(exp.highlights || []), ''] }
        : exp
    );
    updateSectionData(sectionId, { items: updatedExperiences });
  };

  const handleUpdateBullet = (
    expId: string,
    bulletIndex: number,
    value: string
  ) => {
    const updatedExperiences = data.items.map((exp) =>
      exp.id === expId
        ? {
            ...exp,
            highlights: exp.highlights.map((r, i) =>
              i === bulletIndex ? value : r
            ),
          }
        : exp
    );
    updateSectionData(sectionId, { items: updatedExperiences });
  };

  const handleRemoveBullet = (expId: string, bulletIndex: number) => {
    const updatedExperiences = data.items.map((exp) =>
      exp.id === expId
        ? {
            ...exp,
            highlights: exp.highlights?.filter(
              (_, i) => i !== bulletIndex
            ),
          }
        : exp
    );
    updateSectionData(sectionId, { items: updatedExperiences });
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: uuidv4(),
      company: 'New Company',
      position: 'Job Title',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      location: '',
      highlights: [''],
      current: false,
      description: '',
      skills: [],
    };
    updateSectionData(sectionId, {
      items: [...data.items, newExp],
    });
  };

  const handleRemoveExperience = (expId: string) => {
    const updatedExperiences = data.items.filter(
      (exp) => exp.id !== expId
    );
    updateSectionData(sectionId, { items: updatedExperiences });
  };

  return (
    <div className="mb-6">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-4 pb-2 border-b-2"
        style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
      >
        {section.title}
      </h2>

      {/* Experience Items */}
      <div className="space-y-6">
        {data.items.map((exp, expIndex) => (
          <div
            key={exp.id}
            className="relative group pl-4 border-l-2 border-gray-200 hover:border-purple-400 transition-colors"
          >
            {/* Delete Experience Button */}
            {isInteractive && (
              <button
                onClick={() => handleRemoveExperience(exp.id)}
                className="absolute -left-3 top-0 bg-red-100 hover:bg-red-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove experience"
              >
                <Trash2 className="w-3 h-3 text-red-600" />
              </button>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <InlineEdit
                  value={exp.position || ''}
                  onChange={(val) =>
                    handleUpdateExperience(exp.id, 'position', val)
                  }
                  as="h3"
                  className="text-lg font-bold text-gray-900"
                  placeholder="Job Title"
                  disabled={!isInteractive}
                />
                <InlineEdit
                  value={exp.company || ''}
                  onChange={(val) =>
                    handleUpdateExperience(exp.id, 'company', val)
                  }
                  as="p"
                  className="text-base text-purple-700 font-medium"
                  placeholder="Company Name"
                  disabled={!isInteractive}
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <InlineEdit
                  value={exp.startDate || ''}
                  onChange={(val) =>
                    handleUpdateExperience(exp.id, 'startDate', val)
                  }
                  className="text-sm"
                  placeholder="Start Date"
                  disabled={!isInteractive}
                />
                <span>-</span>
                <InlineEdit
                  value={exp.current ? 'Present' : exp.endDate || ''}
                  onChange={(val) =>
                    handleUpdateExperience(exp.id, 'endDate', val)
                  }
                  className="text-sm"
                  placeholder="End Date"
                  disabled={!isInteractive}
                />
              </div>
            </div>

            {/* Location */}
            {exp.location && (
              <InlineEdit
                value={exp.location}
                onChange={(val) =>
                  handleUpdateExperience(exp.id, 'location', val)
                }
                as="p"
                className="text-sm text-gray-600 mb-2"
                placeholder="Location"
                disabled={!isInteractive}
              />
            )}

            {/* Responsibilities */}
            <ul className="space-y-1 mt-3">
              {exp.highlights.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="flex items-start gap-2 group/bullet">
                  <span className="text-purple-600 mt-1.5">•</span>
                  <div className="flex-1">
                    <InlineEdit
                      value={bullet}
                      onChange={(val) =>
                        handleUpdateBullet(exp.id, bulletIndex, val)
                      }
                      className="text-sm text-gray-700"
                      placeholder="Describe your achievement or responsibility..."
                      disabled={!isInteractive}
                      multiline
                    />
                  </div>
                  {isInteractive && (
                    <button
                      onClick={() => handleRemoveBullet(exp.id, bulletIndex)}
                      className="opacity-0 group-hover/bullet:opacity-100 hover:bg-red-100 rounded p-0.5 transition-all mt-1"
                      title="Remove bullet"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Add Bullet Button */}
            {isInteractive && (
              <button
                onClick={() => handleAddBullet(exp.id)}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 mt-2 ml-5"
              >
                <Plus className="w-3 h-3" />
                Add bullet point
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Experience Button */}
      {isInteractive && (
        <button
          onClick={handleAddExperience}
          className="flex items-center gap-2 mt-4 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border-2 border-dashed border-purple-300"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      )}

      {data.items.length === 0 && !isInteractive && (
        <p className="text-gray-400 italic">No experience added yet</p>
      )}
    </div>
  );
}

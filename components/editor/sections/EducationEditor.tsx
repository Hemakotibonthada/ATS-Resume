'use client';

import { ResumeSection, EducationData, EducationItem } from '@/types';
import { useResumeStore } from '@/stores';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationEditorProps {
  section: ResumeSection;
}

export function EducationEditor({ section }: EducationEditorProps) {
  const updateSection = useResumeStore((state) => state.updateSection);
  const data = section.data as EducationData;

  const addEducation = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: null,
      gpa: '',
      honors: '',
      description: '',
    };
    updateSection(section.id, {
      data: { items: [...data.items, newItem] },
    });
  };

  const removeEducation = (id: string) => {
    updateSection(section.id, {
      data: { items: data.items.filter((item) => item.id !== id) },
    });
  };

  const updateEducation = (id: string, updates: Partial<EducationItem>) => {
    updateSection(section.id, {
      data: {
        items: data.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    });
  };

  return (
    <div className="space-y-6">
      {data.items.map((item, idx) => (
        <div key={item.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">
                Education {idx + 1}
              </h3>
            </div>
            <button
              onClick={() => removeEducation(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={item.institution}
              onChange={(e) => updateEducation(item.id, { institution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Institution Name"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={item.degree}
                onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Degree (e.g., Bachelor's)"
              />
              <input
                type="text"
                value={item.field}
                onChange={(e) => updateEducation(item.id, { field: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Field of Study"
              />
            </div>

            <input
              type="text"
              value={item.location}
              onChange={(e) => updateEducation(item.id, { location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Location"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => updateEducation(item.id, { startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <input
                  type="month"
                  value={item.endDate || ''}
                  onChange={(e) => updateEducation(item.id, { endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={item.gpa || ''}
                onChange={(e) => updateEducation(item.id, { gpa: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="GPA (optional)"
              />
              <input
                type="text"
                value={item.honors || ''}
                onChange={(e) => updateEducation(item.id, { honors: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Honors (optional)"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Education
      </button>
    </div>
  );
}

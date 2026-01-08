'use client';

import { InlineEdit } from './InlineEdit';
import { useResumeStore } from '@/stores';
import { SkillsData } from '@/types';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';

interface SkillsBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function SkillsBlock({ sectionId, isInteractive }: SkillsBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);
  const [newSkill, setNewSkill] = useState('');

  if (!currentResume) return null;

  const section = currentResume.sections.find((s) => s.id === sectionId);
  if (!section || section.type !== 'skills') return null;

  const data = section.data as SkillsData;
  const theme = currentResume.settings.theme;

  // Extract skills from categories structure
  const skills = data.categories && data.categories.length > 0 
    ? data.categories[0].skills.map(s => s.name)
    : [];

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      updateSectionData(sectionId, { 
        categories: [{ 
          id: 'default', 
          name: 'Skills', 
          skills: updatedSkills.map((name, idx) => ({ 
            id: `skill-${idx}`, 
            name 
          })) 
        }] 
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    updateSectionData(sectionId, { 
      categories: [{ 
        id: 'default', 
        name: 'Skills', 
        skills: updatedSkills.map((name, idx) => ({ 
          id: `skill-${idx}`, 
          name 
        })) 
      }] 
    });
  };

  const handleUpdateSkill = (index: number, value: string) => {
    const updatedSkills = skills.map((skill, i) =>
      i === index ? value : skill
    );
    updateSectionData(sectionId, { 
      categories: [{ 
        id: 'default', 
        name: 'Skills', 
        skills: updatedSkills.map((name, idx) => ({ 
          id: `skill-${idx}`, 
          name 
        })) 
      }] 
    });
  };

  return (
    <div className="mb-6">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-3 pb-2 border-b-2"
        style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
      >
        {section.title}
      </h2>

      {/* Skills List */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="group relative inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-200 hover:border-purple-400 transition-all"
          >
            <InlineEdit
              value={skill}
              onChange={(val) => handleUpdateSkill(index, val)}
              className="text-sm text-purple-900 font-medium"
              placeholder="Skill name"
              disabled={!isInteractive}
            />
            {isInteractive && (
              <button
                onClick={() => handleRemoveSkill(index)}
                className="opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-full p-0.5 transition-all"
                title="Remove skill"
              >
                <X className="w-3 h-3 text-red-600" />
              </button>
            )}
          </div>
        ))}

        {/* Add New Skill */}
        {isInteractive && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-full">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSkill();
              }}
              placeholder="Add skill..."
              className="bg-transparent text-sm outline-none w-24"
            />
            <button
              onClick={handleAddSkill}
              className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
              title="Add skill"
            >
              <Plus className="w-3 h-3 text-purple-600" />
            </button>
          </div>
        )}
      </div>

      {skills.length === 0 && !isInteractive && (
        <p className="text-gray-400 italic">No skills added yet</p>
      )}
    </div>
  );
}

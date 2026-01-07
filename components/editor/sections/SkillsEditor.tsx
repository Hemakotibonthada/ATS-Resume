'use client';

import { ResumeSection, SkillsData, SkillCategory, Skill } from '@/types';
import { useResumeStore } from '@/stores';
import { Plus, Trash2, Code } from 'lucide-react';

interface SkillsEditorProps {
  section: ResumeSection;
}

export function SkillsEditor({ section }: SkillsEditorProps) {
  const updateSection = useResumeStore((state) => state.updateSection);
  const data = section.data as SkillsData;

  const addCategory = () => {
    const newCategory: SkillCategory = {
      id: Date.now().toString(),
      name: '',
      skills: [],
    };
    updateSection(section.id, {
      data: { categories: [...data.categories, newCategory] },
    });
  };

  const removeCategory = (id: string) => {
    updateSection(section.id, {
      data: { categories: data.categories.filter((cat) => cat.id !== id) },
    });
  };

  const updateCategory = (id: string, updates: Partial<SkillCategory>) => {
    updateSection(section.id, {
      data: {
        categories: data.categories.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat
        ),
      },
    });
  };

  const addSkill = (categoryId: string) => {
    const category = data.categories.find((c) => c.id === categoryId);
    if (category) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: '',
        level: 'intermediate',
      };
      updateCategory(categoryId, { skills: [...category.skills, newSkill] });
    }
  };

  const updateSkill = (categoryId: string, skillId: string, updates: Partial<Skill>) => {
    const category = data.categories.find((c) => c.id === categoryId);
    if (category) {
      updateCategory(categoryId, {
        skills: category.skills.map((s) =>
          s.id === skillId ? { ...s, ...updates } : s
        ),
      });
    }
  };

  const removeSkill = (categoryId: string, skillId: string) => {
    const category = data.categories.find((c) => c.id === categoryId);
    if (category) {
      updateCategory(categoryId, {
        skills: category.skills.filter((s) => s.id !== skillId),
      });
    }
  };

  return (
    <div className="space-y-6">
      {data.categories.map((category, idx) => (
        <div key={category.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              <Code className="w-5 h-5 text-primary-600" />
              <input
                type="text"
                value={category.name}
                onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold"
                placeholder="Category Name (e.g., Programming Languages)"
              />
            </div>
            <button
              onClick={() => removeCategory(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {category.skills.map((skill) => (
              <div key={skill.id} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(category.id, skill.id, { name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Skill name"
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
                        updateSkill(category.id, skill.id, { level: levels[level - 1] as any });
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={['Beginner', 'Intermediate', 'Advanced', 'Expert'][level - 1]}
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 transition-all"
                        style={{
                          borderColor: (() => {
                            const currentLevel = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level || 'intermediate') + 1;
                            return level <= currentLevel ? '#0ea5e9' : '#d1d5db';
                          })(),
                          backgroundColor: (() => {
                            const currentLevel = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level || 'intermediate') + 1;
                            return level <= currentLevel ? '#0ea5e9' : 'transparent';
                          })(),
                        }}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removeSkill(category.id, skill.id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => addSkill(category.id)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add skill
          </button>
        </div>
      ))}

      <button
        onClick={addCategory}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Skill Category
      </button>
    </div>
  );
}

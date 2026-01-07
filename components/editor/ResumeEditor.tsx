'use client';

import { useResumeStore } from '@/stores';
import { ContactEditor } from './sections/ContactEditor';
import { SummaryEditor } from './sections/SummaryEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { EducationEditor } from './sections/EducationEditor';
import { SkillsEditor } from './sections/SkillsEditor';
import { CustomSectionEditor } from './sections/CustomSectionEditor';

export function ResumeEditor() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const activeSection = useResumeStore((state) => state.activeSection);

  if (!currentResume) {
    return <div className="p-8">No resume loaded</div>;
  }

  const section = currentResume.sections.find((s) => s.id === activeSection);

  if (!section) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Welcome to ProResume Architect</h2>
          <p className="text-gray-600 mb-6">
            Select a section from the sidebar to start editing your resume.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Tips:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Use the sidebar to navigate between sections</li>
              <li>• Drag and drop to reorder sections</li>
              <li>• All changes are saved automatically</li>
              <li>• Use "Save Version" to create checkpoints</li>
              <li>• Export to PDF when you're ready to apply</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
          <p className="text-gray-600">
            Edit your {section.type} information below
          </p>
        </div>

        {section.type === 'contact' && <ContactEditor section={section} />}
        {section.type === 'summary' && <SummaryEditor section={section} />}
        {section.type === 'experience' && <ExperienceEditor section={section} />}
        {section.type === 'education' && <EducationEditor section={section} />}
        {section.type === 'skills' && <SkillsEditor section={section} />}
        {section.type === 'custom' && <CustomSectionEditor section={section} />}
      </div>
    </div>
  );
}

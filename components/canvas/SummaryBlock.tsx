'use client';

import { InlineEdit } from './InlineEdit';
import { useResumeStore } from '@/stores';
import { SummaryData } from '@/types';

interface SummaryBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function SummaryBlock({ sectionId, isInteractive }: SummaryBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);

  if (!currentResume) return null;

  const section = currentResume.sections.find((s) => s.id === sectionId);
  if (!section || section.type !== 'summary') return null;

  const data = section.data as SummaryData;
  const theme = currentResume.settings.theme;

  const handleUpdate = (value: string) => {
    updateSectionData(sectionId, { summary: value });
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

      {/* Summary Text */}
      <InlineEdit
        value={data.content || ''}
        onChange={handleUpdate}
        as="p"
        multiline
        className="text-gray-700 leading-relaxed"
        placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
        disabled={!isInteractive}
      />
    </div>
  );
}

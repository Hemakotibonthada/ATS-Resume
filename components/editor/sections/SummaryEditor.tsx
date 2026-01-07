'use client';

import { ResumeSection, SummaryData } from '@/types';
import { useResumeStore } from '@/stores';
import { Sparkles, Eye, Edit3 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface SummaryEditorProps {
  section: ResumeSection;
}

export function SummaryEditor({ section }: SummaryEditorProps) {
  const updateSection = useResumeStore((state) => state.updateSection);
  const data = section.data as SummaryData;
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (value: string) => {
    updateSection(section.id, {
      data: { content: value },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                !showPreview 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Edit3 className="w-3 h-3 inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                showPreview 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              Preview
            </button>
          </div>
        </div>
        
        {showPreview ? (
          <div className="min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 prose prose-sm max-w-none">
            <ReactMarkdown>{data.content || '*No content yet*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={data.content || ''}
            onChange={(e) => handleChange(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            placeholder="Write a compelling summary... Supports **bold**, *italic*, and [links](url)"
          />
        )}
        <p className="mt-2 text-sm text-gray-500">
          {showPreview 
            ? 'Preview mode - switch to Edit to make changes' 
            : 'Markdown supported: **bold**, *italic*, [link](url), - bullet points'
          }
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-purple-900">AI Assistant</p>
          <p className="text-xs text-purple-700">
            Let AI help you write a compelling summary (Coming soon)
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50">
          Generate
        </button>
      </div>
    </div>
  );
}

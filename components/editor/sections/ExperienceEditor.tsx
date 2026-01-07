'use client';

import { ResumeSection, ExperienceData, ExperienceItem } from '@/types';
import { useResumeStore } from '@/stores';
import { Plus, Trash2, Briefcase, Sparkles, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { AISuggestionsModal } from '@/components/features/AISuggestionsModal';
import { FormattingToolbar, applyFormatting } from '@/components/editor/FormattingToolbar';
import { analyzeImpact } from '@/lib/impactValidator';
import { suggestStandardTitle } from '@/lib/socTitles';
import { runSoWhatTest } from '@/lib/soWhatTest';
import SoWhatModal from '@/components/features/SoWhatModal';
import { useState, useRef } from 'react';

interface ExperienceEditorProps {
  section: ResumeSection;
}

export function ExperienceEditor({ section }: ExperienceEditorProps) {
  const updateSection = useResumeStore((state) => state.updateSection);
  const data = section.data as ExperienceData;
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [soWhatModalOpen, setSoWhatModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<{ itemId: string; index: number; text: string } | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: null,
      current: false,
      description: '',
      highlights: [''],
      skills: [],
    };
    updateSection(section.id, {
      data: { items: [...data.items, newItem] },
    });
  };

  const removeExperience = (id: string) => {
    updateSection(section.id, {
      data: { items: data.items.filter((item) => item.id !== id) },
    });
  };

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    updateSection(section.id, {
      data: {
        items: data.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    });
  };

  const addHighlight = (id: string) => {
    const item = data.items.find((i) => i.id === id);
    if (item) {
      updateExperience(id, { highlights: [...item.highlights, ''] });
    }
  };

  const updateHighlight = (id: string, index: number, value: string) => {
    const item = data.items.find((i) => i.id === id);
    if (item) {
      const newHighlights = [...item.highlights];
      newHighlights[index] = value;
      updateExperience(id, { highlights: newHighlights });
    }
  };

  const removeHighlight = (id: string, index: number) => {
    const item = data.items.find((i) => i.id === id);
    if (item) {
      updateExperience(id, {
        highlights: item.highlights.filter((_, i) => i !== index),
      });
    }
  };

  const openAISuggestions = (itemId: string, index: number, text: string) => {
    setSelectedHighlight({ itemId, index, text });
    setAiModalOpen(true);
  };

  const applyAISuggestion = (newText: string) => {
    if (selectedHighlight) {
      updateHighlight(selectedHighlight.itemId, selectedHighlight.index, newText);
    }
  };

  const openSoWhatModal = (itemId: string, index: number, text: string) => {
    setSelectedHighlight({ itemId, index, text });
    setSoWhatModalOpen(true);
  };

  const applySoWhatFix = (newText: string) => {
    if (selectedHighlight) {
      updateHighlight(selectedHighlight.itemId, selectedHighlight.index, newText);
    }
  };

  const handleFormat = (itemId: string, index: number, format: string) => {
    const refKey = `${itemId}-${index}`;
    const input = inputRefs.current[refKey];
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentText = input.value;

    const { newText, newCursor } = applyFormatting(currentText, start, end, format);
    updateHighlight(itemId, index, newText);

    // Set cursor position after state updates
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {data.items.map((item, idx) => (
        <div key={item.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">
                Experience {idx + 1}
              </h3>
            </div>
            <button
              onClick={() => removeExperience(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={item.position}
                  onChange={(e) => {
                    updateExperience(item.id, { position: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Job Title"
                />
                {/* SOC Title Suggester */}
                {item.position && (() => {
                  const suggestion = suggestStandardTitle(item.position);
                  if (suggestion && suggestion.confidence < 1.0) {
                    return (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-yellow-800">
                              Recommendation: "{suggestion.suggested.title}"
                            </div>
                            <div className="text-yellow-700 text-xs mt-1">
                              {suggestion.reasoning}
                            </div>
                            <button
                              onClick={() => updateExperience(item.id, { position: suggestion.suggested.title })}
                              className="mt-1 text-yellow-800 underline hover:text-yellow-900"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <input
                type="text"
                value={item.company}
                onChange={(e) => updateExperience(item.id, { company: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Company Name"
              />
            </div>

            <input
              type="text"
              value={item.location}
              onChange={(e) => updateExperience(item.id, { location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Location"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => updateExperience(item.id, { startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <input
                  type="month"
                  value={item.endDate || ''}
                  onChange={(e) => updateExperience(item.id, { endDate: e.target.value })}
                  disabled={item.current}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) => updateExperience(item.id, { 
                      current: e.target.checked,
                      endDate: e.target.checked ? null : item.endDate 
                    })}
                    className="rounded"
                  />
                  Currently working here
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Key Achievements
                </label>
                <FormattingToolbar onFormat={(format) => {
                  // Apply to the most recently focused input
                  const lastHighlight = item.highlights.length - 1;
                  handleFormat(item.id, lastHighlight, format);
                }} />
              </div>
              {item.highlights.map((highlight, hIdx) => {
                const impactAnalysis = highlight.trim() ? analyzeImpact(highlight) : null;
                const soWhatAnalysis = highlight.trim() ? runSoWhatTest(highlight) : null;
                const isBlocked = soWhatAnalysis && !soWhatAnalysis.passesTest;
                
                return (
                  <div key={hIdx} className="space-y-2 mb-3">
                    <div className="flex gap-2">
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current[`${item.id}-${hIdx}`] = el;
                        }}
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(item.id, hIdx, e.target.value)}
                        className={`flex-1 px-4 py-2 border rounded-lg font-mono text-sm ${
                          isBlocked 
                            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="• Describe your achievement... (markdown supported)"
                      />
                      <button
                        onClick={() => openAISuggestions(item.id, hIdx, highlight)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="AI Suggestions"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeHighlight(item.id, hIdx)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* SO WHAT? TEST - BLOCKING WARNING */}
                    {isBlocked && soWhatAnalysis && (
                      <div className="ml-1 p-3 bg-red-50 border-2 border-red-500 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-bold text-red-900 mb-1">
                              🚫 BLOCKED: {soWhatAnalysis.blockedReason}
                            </div>
                            <p className="text-sm text-red-800 mb-3">
                              This bullet point doesn't answer "So what?" - Add quantifiable impact.
                            </p>
                            <button
                              onClick={() => openSoWhatModal(item.id, hIdx, highlight)}
                              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              Fix Now - Answer "So What?"
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Impact Validator - Only show if not blocked */}
                    {!isBlocked && impactAnalysis && impactAnalysis.score < 70 && (
                      <div className="ml-1 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-orange-800 mb-1">
                              Impact Score: {impactAnalysis.score}/100
                            </div>
                            <ul className="text-orange-700 space-y-0.5">
                              {impactAnalysis.suggestions.slice(0, 2).map((suggestion, idx) => (
                                <li key={idx}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!isBlocked && impactAnalysis && impactAnalysis.score >= 70 && (
                      <div className="ml-1 flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Strong impact - Passes "So What?" test
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => addHighlight(item.id)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add achievement
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Experience
      </button>

      {selectedHighlight && (
        <>
          <AISuggestionsModal
            isOpen={aiModalOpen}
            onClose={() => setAiModalOpen(false)}
            currentText={selectedHighlight.text}
            jobTitle={data.items.find(i => i.id === selectedHighlight.itemId)?.position}
            company={data.items.find(i => i.id === selectedHighlight.itemId)?.company}
            onApply={applyAISuggestion}
          />
          
          <SoWhatModal
            isOpen={soWhatModalOpen}
            onClose={() => setSoWhatModalOpen(false)}
            currentText={selectedHighlight.text}
            analysis={runSoWhatTest(selectedHighlight.text)}
            onApply={applySoWhatFix}
          />
        </>
      )}
    </div>
  );
}

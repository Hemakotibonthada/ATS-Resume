'use client';

import { useState } from 'react';
import { analyzeBulletPoint, generateBulletPoints } from '@/lib/aiSuggestions';
import { Sparkles, X, Copy, Check, Lightbulb } from 'lucide-react';

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  jobTitle?: string;
  company?: string;
  onApply: (newText: string) => void;
}

export function AISuggestionsModal({
  isOpen,
  onClose,
  currentText,
  jobTitle,
  company,
  onApply,
}: AISuggestionsModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const analysis = analyzeBulletPoint(currentText);
  const generatedPoints = jobTitle && company ? generateBulletPoints(jobTitle, company) : [];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (text: string) => {
    onApply(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold">AI Bullet Point Coach</h2>
              <p className="text-sm text-gray-600">Action Verb + Task + Result = Impact</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Original Text */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Original</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{currentText || 'No text provided'}</p>
            </div>
          </div>

          {/* Analysis & Reasoning */}
          {analysis.reasoning && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Analysis</h3>
                  <p className="text-sm text-blue-800">{analysis.reasoning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggested Improvements</h3>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <p className="text-gray-900 mb-3">{suggestion}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApply(suggestion)}
                        className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Apply This
                      </button>
                      <button
                        onClick={() => handleCopy(suggestion, idx)}
                        className="px-4 py-1.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Examples (if job context available) */}
          {generatedPoints.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Example Achievements for {jobTitle}
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Customize these templates with your actual accomplishments
              </p>
              <div className="space-y-2">
                {generatedPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700"
                  >
                    • {point}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Start with a strong action verb (Achieved, Developed, Led, etc.)</li>
              <li>• Include specific metrics (percentages, dollar amounts, time saved)</li>
              <li>• Show the result or impact of your work</li>
              <li>• Use numbers to quantify achievements (managed team of 5, saved $50K)</li>
              <li>• Keep it concise - aim for 1-2 lines maximum</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { X, AlertTriangle, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { SoWhatAnalysis, SoWhatSuggestion } from '@/lib/soWhatTest';

interface SoWhatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  analysis: SoWhatAnalysis;
  onApply: (newText: string) => void;
}

export default function SoWhatModal({ 
  isOpen, 
  onClose, 
  currentText, 
  analysis, 
  onApply 
}: SoWhatModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<SoWhatSuggestion | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  if (!isOpen) return null;

  const handleApplySuggestion = (suggestion: SoWhatSuggestion) => {
    // Apply the template
    onApply(suggestion.template);
    onClose();
  };

  const handleApplyAutoComplete = () => {
    onApply(analysis.autoCompleteTemplate);
    onClose();
  };

  const handleCustomApply = () => {
    if (customAnswer.trim()) {
      const enhanced = `${currentText} ${customAnswer}`;
      onApply(enhanced);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-red-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-red-900">🚫 BLOCKED: Answer "So What?"</h2>
              <p className="text-sm text-red-700">This bullet point is incomplete</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Current Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Current Bullet Point:
            </label>
            <div className="p-4 bg-gray-50 border-2 border-red-300 rounded-lg">
              <p className="text-gray-900">{currentText || '(empty)'}</p>
            </div>
            <div className="mt-2 flex items-start gap-2 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Blocked Reason:</strong> {analysis.blockedReason}
              </div>
            </div>
          </div>

          {/* Questions */}
          {analysis.questions.length > 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Answer These Questions:
              </h3>
              <ul className="space-y-2">
                {analysis.questions.map((question, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-yellow-800">
                    <span className="font-bold text-yellow-600">{idx + 1}.</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Auto-Complete Template */}
          <div className="mb-6">
            <button
              onClick={() => setShowAutoComplete(!showAutoComplete)}
              className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Quick Fix: Use Auto-Complete Template</span>
              </div>
              <span className="text-xs text-blue-600">{showAutoComplete ? 'Hide' : 'Show'}</span>
            </button>
            
            {showAutoComplete && (
              <div className="mt-3 p-4 bg-white border-2 border-blue-300 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Format: [Action Verb] + [Task] + [Result with Numbers]</div>
                <div className="p-3 bg-blue-50 rounded font-mono text-sm mb-3">
                  {analysis.autoCompleteTemplate}
                </div>
                <button
                  onClick={handleApplyAutoComplete}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply This Template
                </button>
              </div>
            )}
          </div>

          {/* Suggestions by Category */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Or Choose an Impact Category:
              </h3>
              
              {analysis.suggestions.map((suggestion, idx) => (
                <div 
                  key={idx}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSuggestion === suggestion
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(suggestion.category)}`}>
                        {suggestion.category.toUpperCase()}
                      </div>
                      {selectedSuggestion === suggestion && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-semibold text-gray-900 mb-1">{suggestion.question}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Examples:</div>
                    {suggestion.examples.map((example, eIdx) => (
                      <div key={eIdx} className="text-sm text-gray-700 pl-4 border-l-2 border-gray-300">
                        • {example}
                      </div>
                    ))}
                  </div>
                  
                  {selectedSuggestion === suggestion && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-2">Preview:</div>
                      <div className="p-3 bg-white border border-green-300 rounded font-mono text-sm mb-3">
                        {suggestion.template}
                      </div>
                      <button
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Apply This Suggestion
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Answer */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Or Write Your Own Impact:
            </h3>
            <textarea
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder="Type the quantifiable result here (e.g., 'reducing latency by 40% and improving user experience for 10K users')..."
              className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleCustomApply}
              disabled={!customAnswer.trim()}
              className="mt-3 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Custom Impact
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <strong>Pro Tip:</strong> All great achievements have numbers and results
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'money': 'bg-green-100 text-green-800',
    'time': 'bg-blue-100 text-blue-800',
    'performance': 'bg-purple-100 text-purple-800',
    'scale': 'bg-orange-100 text-orange-800',
    'quality': 'bg-pink-100 text-pink-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

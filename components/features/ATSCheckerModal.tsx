'use client';

import { useResumeStore } from '@/stores';
import { analyzeATS } from '@/lib/atsChecker';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ATSCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ATSCheckerModal({ isOpen, onClose }: ATSCheckerModalProps) {
  const currentResume = useResumeStore((state) => state.currentResume);

  if (!isOpen || !currentResume) return null;

  const analysis = analyzeATS(currentResume);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold">ATS Compatibility Check</h2>
              <p className="text-sm text-gray-600">Applicant Tracking System Analysis</p>
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
          {/* Score */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Overall Score</h3>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </div>
            </div>
            
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full ${getScoreBgColor(analysis.score)} transition-all duration-500`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
            
            <p className="mt-2 text-sm text-gray-600">
              {analysis.score >= 80 && 'Excellent! Your resume is highly ATS-friendly.'}
              {analysis.score >= 60 && analysis.score < 80 && 'Good! A few improvements will make it better.'}
              {analysis.score < 60 && 'Needs improvement. Follow the suggestions below.'}
            </p>
          </div>

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Issues Found</h3>
              <div className="space-y-3">
                {analysis.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    {getSeverityIcon(warning.severity)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{warning.message}</p>
                      {warning.section && (
                        <p className="text-sm text-gray-600 mt-1">
                          Section: {warning.section}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perfect Score */}
          {analysis.score === 100 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Perfect ATS Score!
              </h3>
              <p className="text-gray-600">
                Your resume is fully optimized for Applicant Tracking Systems
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

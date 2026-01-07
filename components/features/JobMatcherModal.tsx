'use client';

import { useResumeStore } from '@/stores';
import { calculateMatchScore, findMissingKeywords, extractKeywords } from '@/lib/atsChecker';
import { X, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface JobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobMatcherModal({ isOpen, onClose }: JobMatcherModalProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen || !currentResume) return null;

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description first');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const score = calculateMatchScore(currentResume, jobDescription);
      const missing = findMissingKeywords(currentResume, jobDescription);
      
      setMatchScore(score);
      setMissingKeywords(missing);
      setIsAnalyzing(false);
    }, 500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold">Job Description Matcher</h2>
              <p className="text-sm text-gray-600">AI-Powered Keyword Analysis</p>
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
          {/* Job Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Copy and paste the full job description from LinkedIn, Indeed, or company website..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {jobDescription.length} characters
              </p>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
              </button>
            </div>
          </div>

          {/* Results */}
          {matchScore !== null && (
            <div className="space-y-6">
              {/* Match Score */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Match Score</h3>
                  <div className={`text-5xl font-bold ${getScoreColor(matchScore)}`}>
                    {matchScore}%
                  </div>
                </div>
                
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${getScoreBgColor(matchScore)} transition-all duration-700`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                
                <p className="mt-3 text-sm text-gray-700">
                  {matchScore >= 70 && "Excellent match! Your resume aligns well with this job."}
                  {matchScore >= 50 && matchScore < 70 && "Good match! Consider adding some of the missing keywords below."}
                  {matchScore < 50 && "Low match. Your resume may need significant updates for this role."}
                </p>
              </div>

              {/* Missing Keywords */}
              {missingKeywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Missing Keywords
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    These keywords appear in the job description but not in your resume:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.slice(0, 20).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {missingKeywords.length > 20 && (
                    <p className="text-sm text-gray-500 mt-3">
                      + {missingKeywords.length - 20} more keywords
                    </p>
                  )}
                </div>
              )}

              {/* Suggestions */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-900">
                  <Lightbulb className="w-5 h-5" />
                  Actionable Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Incorporate the missing keywords naturally into your experience descriptions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Match your job titles and skill names to those used in the job description</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Add quantifiable achievements that demonstrate these skills</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Update your professional summary to highlight relevant experience</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Empty State */}
          {matchScore === null && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyze Your Match
              </h3>
              <p className="text-gray-600">
                Paste a job description above and click "Analyze Match" to see how well your resume aligns with the position
              </p>
            </div>
          )}
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

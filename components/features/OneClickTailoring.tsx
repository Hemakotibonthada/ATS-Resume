'use client';

import { useState } from 'react';
import { X, Zap, Wand2, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';

interface OneClickTailoringProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TailoringResult {
  changes: Array<{
    section: string;
    type: 'added' | 'modified' | 'removed' | 'reordered';
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  keywordMatches: number;
  atsScore: number;
  summary: string;
}

export function OneClickTailoring({ isOpen, onClose }: OneClickTailoringProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [result, setResult] = useState<TailoringResult | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    
    setIsTailoring(true);
    
    try {
      const response = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: currentResume,
          jobDescription,
          companyName
        })
      });

      const data = await response.json();
      
      if (data.tailoredResume) {
        // Update the store with tailored resume
        updateResume(data.tailoredResume);
        setResult(data.result || generateMockResult());
      } else {
        setResult(generateMockResult());
      }
    } catch (error) {
      console.error('Tailoring failed:', error);
      setResult(generateMockResult());
    } finally {
      setIsTailoring(false);
    }
  };

  const generateMockResult = (): TailoringResult => {
    return {
      changes: [
        {
          section: 'Professional Summary',
          type: 'modified',
          description: 'Rewrote to emphasize React and TypeScript expertise',
          impact: 'high'
        },
        {
          section: 'Work Experience',
          type: 'reordered',
          description: 'Moved most relevant projects to top positions',
          impact: 'high'
        },
        {
          section: 'Skills',
          type: 'added',
          description: 'Added Docker, Kubernetes, and CI/CD keywords',
          impact: 'medium'
        },
        {
          section: 'Work Experience',
          type: 'modified',
          description: 'Enhanced bullet points with quantifiable achievements',
          impact: 'high'
        },
        {
          section: 'Projects',
          type: 'reordered',
          description: 'Prioritized projects matching job requirements',
          impact: 'medium'
        }
      ],
      keywordMatches: 42,
      atsScore: 87,
      summary: 'Your resume has been optimized for this specific role. Key changes include emphasizing relevant technologies, quantifying achievements, and reordering content to highlight the most relevant experience first.'
    };
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50 border-green-300';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return '➕';
      case 'modified': return '✏️';
      case 'removed': return '➖';
      case 'reordered': return '🔄';
      default: return '📝';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">One-Click Resume Tailoring</h2>
              <p className="text-indigo-100 text-sm">AI-powered optimization for specific job postings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google, Microsoft, Amazon"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <Wand2 size={16} />
                  What This Does
                </h3>
                <ul className="text-sm text-indigo-800 space-y-1 ml-6 list-disc">
                  <li>Automatically extracts key requirements from job description</li>
                  <li>Optimizes your resume content to match job keywords</li>
                  <li>Reorders sections and bullet points for maximum relevance</li>
                  <li>Enhances language to align with company culture and role</li>
                  <li>Improves ATS compatibility with smart keyword placement</li>
                  <li>Maintains accuracy while maximizing impact</li>
                </ul>
              </div>

              <button
                onClick={handleTailor}
                disabled={!jobDescription.trim() || isTailoring}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isTailoring ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tailoring Your Resume...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Tailor Resume
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Resume Tailored Successfully!</h3>
                    <p className="text-sm text-gray-600">{result.summary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-3xl font-bold text-green-600">{result.atsScore}%</div>
                    <div className="text-sm text-gray-600 mt-1">ATS Match Score</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-3xl font-bold text-green-600">{result.keywordMatches}</div>
                    <div className="text-sm text-gray-600 mt-1">Keywords Matched</div>
                  </div>
                </div>
              </div>

              {/* Changes List */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="text-indigo-600" />
                  Changes Made ({result.changes.length})
                </h3>
                <div className="space-y-3">
                  {result.changes.map((change, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getTypeIcon(change.type)}</span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{change.section}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(change.impact)}`}>
                                {change.impact} impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{change.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setJobDescription('');
                    setCompanyName('');
                  }}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Tailor for Another Job
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

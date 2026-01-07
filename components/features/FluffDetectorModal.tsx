'use client';

import { useState } from 'react';
import { X, AlertCircle, TrendingUp, Download } from 'lucide-react';
import { detectFluff, FluffAnalysis } from '@/lib/fluffDetector';
import { Resume } from '@/types/resume';

interface FluffDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
}

export default function FluffDetectorModal({ isOpen, onClose, resume }: FluffDetectorModalProps) {
  const [analysis, setAnalysis] = useState<FluffAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Build resume text from all sections
    const resumeText = buildResumeText(resume);
    
    // Detect fluff
    const result = detectFluff(resumeText);
    setAnalysis(result);
    
    setIsAnalyzing(false);
  };

  const buildResumeText = (resume: Resume): string => {
    const parts: string[] = [];
    
    // Summary
    const summarySection = resume.sections.find(s => s.type === 'summary');
    if (summarySection) {
      const summary = (summarySection.data as { content?: string })?.content;
      if (summary) parts.push(summary);
    }
    
    // Experience highlights
    const experienceSection = resume.sections.find(s => s.type === 'experience');
    if (experienceSection) {
      const experience = (experienceSection.data as any)?.items || [];
      experience.forEach((exp: any) => {
        parts.push(...exp.highlights);
      });
    }
    
    return parts.join(' ');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'soft-skill-fluff': return 'text-red-600 bg-red-50';
      case 'responsibility-fluff': return 'text-orange-600 bg-orange-50';
      case 'cliche': return 'text-yellow-600 bg-yellow-50';
      case 'buzzword': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[severity] || colors['low'];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold">Fluff Detector</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              This tool identifies generic phrases, soft skill fluff, and buzzwords that ATS systems flag as low-value content. 
              Replace these with quantifiable achievements and hard skills.
            </p>
          </div>

          {/* Analyze Button */}
          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isAnalyzing ? 'Scanning Resume...' : 'Scan for Fluff'}
            </button>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Score Overview */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Clarity Score</h3>
                    <p className="text-sm text-gray-600">Higher is better (less fluff)</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${
                      analysis.score >= 80 ? 'text-green-600' :
                      analysis.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {analysis.score}
                    </div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Fluff Found</div>
                    <div className="text-2xl font-bold">{analysis.totalFluff}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fluff Percentage</div>
                    <div className="text-2xl font-bold">{analysis.fluffPercentage}%</div>
                  </div>
                </div>
              </div>

              {/* Detections */}
              {analysis.detections.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Found {analysis.detections.length} Fluff Phrase{analysis.detections.length !== 1 ? 's' : ''}
                  </h3>
                  
                  <div className="space-y-4">
                    {analysis.detections.map((detection, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(detection.category)}`}>
                              {detection.category.replace(/-/g, ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadge(detection.severity)}`}>
                              {detection.severity} priority
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">❌ Fluff Phrase:</div>
                            <div className="text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                              "{detection.phrase}"
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-600 mb-1">✅ Replace with:</div>
                            <div className="text-sm font-medium bg-green-50 p-2 rounded border border-green-200">
                              {detection.replacement}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-600 mb-1">💡 Why:</div>
                            <p className="text-sm text-gray-700">{detection.reasoning}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    No Fluff Detected!
                  </h3>
                  <p className="text-sm text-green-700">
                    Your resume is free of generic phrases and focuses on concrete achievements.
                  </p>
                </div>
              )}

              {/* Breakdown by Category */}
              {analysis.detections.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Breakdown by Category</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['soft-skill-fluff', 'responsibility-fluff', 'cliche', 'buzzword'].map(category => {
                      const count = analysis.detections.filter(d => d.category === category).length;
                      if (count === 0) return null;
                      
                      return (
                        <div key={category} className={`p-4 rounded-lg ${getCategoryColor(category)}`}>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm capitalize">{category.replace(/-/g, ' ')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setAnalysis(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Scan Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

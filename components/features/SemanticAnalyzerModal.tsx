'use client';

import { useState } from 'react';
import { X, Lightbulb, Link2, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyzeSemanticContext, SemanticAnalysis } from '@/lib/semanticAnalyzer';
import { Resume } from '@/types/resume';

interface SemanticAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
}

export default function SemanticAnalyzerModal({ isOpen, onClose, resume }: SemanticAnalyzerModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<SemanticAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Build resume text from all sections
    const resumeText = buildResumeText(resume);
    
    // Perform semantic analysis
    const result = analyzeSemanticContext(resumeText, jobDescription);
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
    
    // Experience
    const experienceSection = resume.sections.find(s => s.type === 'experience');
    if (experienceSection) {
      const experience = (experienceSection.data as any)?.items || [];
      experience.forEach((exp: any) => {
        parts.push(exp.position);
        parts.push(exp.company);
        parts.push(...exp.highlights);
      });
    }
    
    // Skills
    const skillsSection = resume.sections.find(s => s.type === 'skills');
    if (skillsSection) {
      const skills = (skillsSection.data as any)?.items || [];
      parts.push(skills.map((s: any) => s.name).join(', '));
    }
    
    return parts.join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Semantic Job Mapper</h2>
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
          {/* Job Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-40 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Semantic Context'}
          </button>

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-8 space-y-6">
              {/* Context Score */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Context Score</h3>
                  <span className={`text-3xl font-bold ${
                    analysis.contextScore >= 70 ? 'text-green-600' :
                    analysis.contextScore >= 40 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysis.contextScore}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {analysis.contextScore >= 70 && 'Strong semantic alignment with job requirements'}
                  {analysis.contextScore >= 40 && analysis.contextScore < 70 && 'Moderate alignment - room for improvement'}
                  {analysis.contextScore < 40 && 'Weak alignment - significant rewording needed'}
                </p>
              </div>

              {/* Implied Skills */}
              {analysis.impliedSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Hidden Requirements Found
                  </h3>
                  <div className="space-y-4">
                    {analysis.impliedSkills.map((skill, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              You wrote: <span className="text-blue-600">{skill.explicit}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              JD actually needs: <span className="text-purple-600">{skill.implied}</span>
                            </div>
                            <p className="text-sm text-gray-600">{skill.reasoning}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              Confidence: {Math.round(skill.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Semantic Matches */}
              {analysis.semanticMatches.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-blue-600" />
                    Semantic Matches
                  </h3>
                  <div className="space-y-3">
                    {analysis.semanticMatches.map((match, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 ${
                          match.strength === 'strong' ? 'bg-green-50 border-green-200' :
                          match.strength === 'moderate' ? 'bg-blue-50 border-blue-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {match.strength === 'strong' && (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">
                              {match.strength === 'strong' ? 'Strong Match' : 
                               match.strength === 'moderate' ? 'Moderate Match' : 'Weak Match'}
                            </div>
                            <p className="text-sm text-gray-600">{match.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Semantic Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    Rewrite Suggestions
                  </h3>
                  <div className="space-y-4">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-xs font-medium text-purple-600 uppercase mb-2">
                          {suggestion.type.replace(/-/g, ' ')}
                        </div>
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">Before:</div>
                          <div className="text-sm bg-white p-2 rounded border">{suggestion.original}</div>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">After:</div>
                          <div className="text-sm bg-white p-2 rounded border font-medium">{suggestion.improved}</div>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Issues */}
              {analysis.impliedSkills.length === 0 && 
               analysis.suggestions.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Excellent Semantic Alignment!
                  </h3>
                  <p className="text-sm text-green-700">
                    Your resume strongly matches the job description's semantic context.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

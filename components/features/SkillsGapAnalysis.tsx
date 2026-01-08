'use client';

import { useState } from 'react';
import { X, Target, TrendingUp, AlertCircle, CheckCircle, Sparkles, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';

interface SkillsGapAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SkillAnalysis {
  present: string[];
  missing: string[];
  emerging: string[];
  suggestions: string[];
  matchScore: number;
  industryTrends: string[];
}

export function SkillsGapAnalysis({ isOpen, onClose }: SkillsGapAnalysisProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim() && !targetRole.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/ai/skills-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: currentResume,
          jobDescription,
          targetRole
        })
      });

      const data = await response.json();
      setAnalysis(data.analysis || generateMockAnalysis());
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysis(generateMockAnalysis());
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (): SkillAnalysis => {
    const skillsSection = currentResume?.sections?.find(s => s.type === 'skills');
    const currentSkills = (skillsSection?.data as any)?.categories?.flatMap((cat: any) => cat.skills.map((s: any) => s.name)) || [];
    
    return {
      present: currentSkills.slice(0, Math.min(8, currentSkills.length)),
      missing: ['Docker', 'Kubernetes', 'GraphQL', 'Redis', 'MongoDB', 'CI/CD'],
      emerging: ['AI/ML Integration', 'Edge Computing', 'WebAssembly', 'Micro-frontends'],
      suggestions: [
        'Add Docker and Kubernetes certifications to boost DevOps skills',
        'Build a project showcasing GraphQL and microservices architecture',
        'Complete AWS Solutions Architect certification',
        'Contribute to open-source projects using emerging technologies'
      ],
      matchScore: 72,
      industryTrends: [
        'AI/ML skills are increasingly important across all roles',
        'Cloud-native development is becoming standard',
        'Security-first mindset is essential',
        'Full-stack capabilities are highly valued'
      ]
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Skills Gap Analysis</h2>
              <p className="text-blue-100 text-sm">Compare your skills vs market requirements</p>
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
          {/* Input Section */}
          {!analysis && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Role (Optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Full Stack Developer, DevOps Engineer"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here, or leave blank to analyze against your target role..."
                  className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={(!jobDescription.trim() && !targetRole.trim()) || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Analyze Skills Gap
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results Section */}
          {analysis && (
            <div className="space-y-6">
              {/* Match Score */}
              <div className={`rounded-xl border-2 p-6 ${getScoreBg(analysis.matchScore)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Skills Match Score</h3>
                    <p className="text-sm text-gray-600 mt-1">Based on your current profile</p>
                  </div>
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                    {analysis.matchScore}%
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      analysis.matchScore >= 80 ? 'bg-green-500' :
                      analysis.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${analysis.matchScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills You Have */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-gray-900">Skills You Have</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.present.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Gap */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-gray-900">Skills to Acquire</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emerging Skills */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Emerging Trends</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emerging.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Industry Trends */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Industry Insights</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.industryTrends.map((trend, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900">Action Plan</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-900">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setAnalysis(null)}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Analyze Another Job
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

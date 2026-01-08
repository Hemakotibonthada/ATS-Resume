'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  Lightbulb
} from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { analyzeKeywords, KeywordAnalysis, MissingKeyword } from '@/lib/keywordExtractor';
import { SkillsData } from '@/types/resume';

type TabType = 'high-priority' | 'medium-priority' | 'suggestions';

export function KeywordHighlighter() {
  const { currentResume, updateSection } = useResumeStore();
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('high-priority');
  
  useEffect(() => {
    if (currentResume) {
      const result = analyzeKeywords(currentResume);
      setAnalysis(result);
    }
  }, [currentResume]);

  if (!analysis || !currentResume) return null;

  const { missingInSkills, suggestions, coverageScore } = analysis;
  const highPriorityMissing = missingInSkills.filter(k => k.importance === 'high');
  const mediumPriorityMissing = missingInSkills.filter(k => k.importance === 'medium');

  const handleAddSkill = (keyword: MissingKeyword) => {
    const skillsSection = currentResume.sections.find(s => s.type === 'skills');
    if (!skillsSection) return;

    const skillsData = skillsSection.data as SkillsData;
    const suggestedCat = keyword.suggestedCategory || 'Technical Skills';
    
    // Find or create category
    let category = skillsData.categories.find(c => c.name === suggestedCat);
    
    if (!category) {
      // Create new category
      category = {
        id: `cat-${Date.now()}`,
        name: suggestedCat,
        skills: []
      };
      skillsData.categories.push(category);
    }
    
    // Add skill if not already present
    if (!category.skills.some(s => s.name.toLowerCase() === keyword.keyword.toLowerCase())) {
      category.skills.push({
        id: `skill-${Date.now()}`,
        name: keyword.keyword,
        level: 'intermediate' // Default level
      });
      
      updateSection(skillsSection.id, { ...skillsSection, data: skillsData });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className={`p-3 rounded-full shadow-lg border-2 ${getScoreBgColor(coverageScore)} hover:scale-110 transition-all`}
        >
          <div className="flex items-center gap-2">
            <Target className={`w-5 h-5 ${getScoreColor(coverageScore)}`} />
            <span className={`font-bold ${getScoreColor(coverageScore)}`}>
              {coverageScore}%
            </span>
            {highPriorityMissing.length > 0 && (
              <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                {highPriorityMissing.length}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className={`p-4 rounded-t-lg border-b-2 ${getScoreBgColor(coverageScore)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className={`w-5 h-5 ${getScoreColor(coverageScore)}`} />
            <h3 className="font-bold text-gray-900">Keyword Coverage</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Score Display */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${getScoreColor(coverageScore)}`}>
              {coverageScore}%
            </div>
            <div className="text-xs text-gray-600">
              {coverageScore >= 80 ? 'Excellent coverage!' : 
               coverageScore >= 60 ? 'Good, but can improve' : 
               'Needs improvement'}
            </div>
          </div>
          {highPriorityMissing.length > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle size={16} />
                <span className="font-bold text-xl">{highPriorityMissing.length}</span>
              </div>
              <div className="text-xs text-gray-600">missing keywords</div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('high-priority')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'high-priority'
                  ? 'text-red-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                <span>High Priority</span>
                {highPriorityMissing.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {highPriorityMissing.length}
                  </span>
                )}
              </div>
              {activeTab === 'high-priority' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('medium-priority')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'medium-priority'
                  ? 'text-yellow-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp size={16} />
                <span>Medium</span>
                {mediumPriorityMissing.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                    {mediumPriorityMissing.length}
                  </span>
                )}
              </div>
              {activeTab === 'medium-priority' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'suggestions'
                  ? 'text-purple-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lightbulb size={16} />
                <span>Suggestions</span>
                {suggestions.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                    {suggestions.length}
                  </span>
                )}
              </div>
              {activeTab === 'suggestions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {/* High Priority Tab */}
          {activeTab === 'high-priority' && highPriorityMissing.length > 0 && (
            <div className="p-4">
              <div className="space-y-2">
                {highPriorityMissing.map((keyword, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">
                          {keyword.keyword}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Found {keyword.frequency}x in {keyword.sources.map(s => s.section).join(', ')}
                        </div>
                        {keyword.suggestedCategory && (
                          <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                            <Zap size={12} />
                            Add to: {keyword.suggestedCategory}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddSkill(keyword)}
                        className="ml-2 p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                        title="Add to Skills"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'high-priority' && highPriorityMissing.length === 0 && (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">No High Priority Issues!</p>
              <p className="text-xs text-gray-600 mt-1">
                All critical keywords are in your Skills section.
              </p>
            </div>
          )}

          {/* Medium Priority Tab */}
          {activeTab === 'medium-priority' && mediumPriorityMissing.length > 0 && (
            <div className="p-4">
              <div className="space-y-2">
                {mediumPriorityMissing.map((keyword, idx) => (
                  <div 
                    key={idx}
                    className="p-2 bg-yellow-50 rounded border border-yellow-200 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {keyword.keyword}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Found {keyword.frequency}x in {keyword.sources.map(s => s.section).join(', ')}
                      </div>
                      {keyword.suggestedCategory && (
                        <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                          <Zap size={12} />
                          Add to: {keyword.suggestedCategory}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddSkill(keyword)}
                      className="ml-2 p-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'medium-priority' && mediumPriorityMissing.length === 0 && (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">All Clear!</p>
              <p className="text-xs text-gray-600 mt-1">
                No medium priority keywords missing.
              </p>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && suggestions.length > 0 && (
            <div className="p-4">
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-purple-50 rounded border border-purple-200"
                  >
                    <div className="text-sm text-gray-700 font-medium mb-1">
                      💡 Smart Suggestion
                    </div>
                    <div className="text-xs text-gray-600">
                      {suggestion.reasoning}
                    </div>
                    {suggestion.relatedKeywords && suggestion.relatedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.relatedKeywords.map((related, ridx) => (
                          <span 
                            key={ridx}
                            className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && suggestions.length === 0 && (
            <div className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">No Suggestions</p>
              <p className="text-xs text-gray-600 mt-1">
                Your resume looks well-optimized!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

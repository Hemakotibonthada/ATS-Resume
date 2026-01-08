'use client';

import { useState } from 'react';
import { X, Sparkles, TrendingUp, Target, Zap, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIImpactEnhancerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIImpactEnhancer({ isOpen, onClose }: AIImpactEnhancerProps) {
  const [originalText, setOriginalText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<'quantified' | 'action' | 'leadership' | 'technical'>('quantified');
  const [copied, setCopied] = useState(false);

  const enhancementStyles = {
    quantified: {
      icon: TrendingUp,
      name: 'Quantified Impact',
      description: 'Add metrics and measurable results',
      prompt: 'Add specific numbers, percentages, and measurable outcomes'
    },
    action: {
      icon: Zap,
      name: 'Strong Action Verbs',
      description: 'Replace weak verbs with powerful ones',
      prompt: 'Use strong action verbs like led, architected, spearheaded'
    },
    leadership: {
      icon: Target,
      name: 'Leadership Focus',
      description: 'Emphasize leadership and initiative',
      prompt: 'Highlight leadership, mentoring, and strategic impact'
    },
    technical: {
      icon: Sparkles,
      name: 'Technical Excellence',
      description: 'Showcase technical depth and innovation',
      prompt: 'Emphasize technical skills, tools, and innovations'
    }
  };

  const handleEnhance = async () => {
    if (!originalText.trim()) return;
    
    setIsEnhancing(true);
    
    try {
      const response = await fetch('/api/ai/enhance-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          style: selectedStyle,
          context: enhancementStyles[selectedStyle].prompt
        })
      });

      const data = await response.json();
      setEnhancedText(data.enhanced || generateMockEnhancement(originalText, selectedStyle));
    } catch (error) {
      console.error('Enhancement failed:', error);
      setEnhancedText(generateMockEnhancement(originalText, selectedStyle));
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateMockEnhancement = (text: string, style: string): string => {
    // Fallback enhancement logic when API is not available
    const enhancements: Record<string, string[]> = {
      quantified: [
        'Increased team productivity by 35%',
        'Reduced processing time by 50%',
        'Managed $2M budget',
        'Led team of 8 developers'
      ],
      action: [
        'Spearheaded',
        'Architected',
        'Orchestrated',
        'Pioneered',
        'Championed'
      ],
      leadership: [
        'Led cross-functional team',
        'Mentored 5 junior developers',
        'Drove strategic initiatives',
        'Established best practices'
      ],
      technical: [
        'using React, TypeScript, and Node.js',
        'implementing CI/CD pipelines',
        'leveraging AWS and Docker',
        'applying microservices architecture'
      ]
    };

    const additions = enhancements[style] || enhancements.quantified;
    return `${text} ${additions[Math.floor(Math.random() * additions.length)]}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    {
      before: 'Worked on improving application performance',
      after: 'Optimized application performance by 45% through code refactoring and implementing Redis caching, reducing page load time from 3.2s to 1.8s'
    },
    {
      before: 'Helped team with code reviews',
      after: 'Led code review process for 12-person engineering team, establishing best practices that reduced bug reports by 60% and improved code quality scores from 6.5 to 8.9'
    },
    {
      before: 'Created documentation for the project',
      after: 'Architected comprehensive technical documentation system using Docusaurus, reducing onboarding time for new developers from 2 weeks to 3 days'
    }
  ];

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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">AI Impact Statement Enhancer</h2>
              <p className="text-purple-100 text-sm">Transform weak bullet points into powerful impact statements</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Original Statement
              </label>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste your bullet point here... e.g., 'Worked on improving application performance'"
                className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
              />

              {/* Enhancement Styles */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enhancement Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(enhancementStyles) as [keyof typeof enhancementStyles, typeof enhancementStyles[keyof typeof enhancementStyles]][]).map(([key, style]) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedStyle(key)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedStyle === key
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${selectedStyle === key ? 'text-purple-600' : 'text-gray-500'}`} />
                        <div className="font-semibold text-sm text-gray-900">{style.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleEnhance}
                disabled={!originalText.trim() || isEnhancing}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEnhancing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Enhance with AI
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Enhanced Statement
                </label>
                {enhancedText && (
                  <button
                    onClick={handleCopy}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full min-h-40 px-4 py-3 border-2 border-purple-300 bg-purple-50 rounded-lg">
                {enhancedText ? (
                  <p className="text-gray-900 whitespace-pre-wrap">{enhancedText}</p>
                ) : (
                  <p className="text-gray-400 italic">Enhanced version will appear here...</p>
                )}
              </div>

              {/* Examples */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Examples</h3>
                <div className="space-y-4">
                  {examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-xs font-semibold text-gray-500 mb-2">BEFORE</div>
                      <p className="text-sm text-gray-700 mb-3">{example.before}</p>
                      <div className="text-xs font-semibold text-purple-600 mb-2">AFTER</div>
                      <p className="text-sm text-gray-900 font-medium">{example.after}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              Pro Tips for Maximum Impact
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
              <li>Start with action verbs (Led, Architected, Optimized, Spearheaded)</li>
              <li>Include specific metrics (percentages, numbers, timeframes)</li>
              <li>Mention technologies and tools used</li>
              <li>Show both what you did and the impact it had</li>
              <li>Use the STAR method: Situation, Task, Action, Result</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

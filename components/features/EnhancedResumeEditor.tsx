'use client';

import { useState } from 'react';
import { ImpactLinedTextArea } from './ImpactLinedTextArea';
import { useImpactScore, getImpactColor, getImpactLabel } from '@/hooks/useImpactScore';
import { DraggableSection, SectionVariant } from '@/components/preview/DraggableSection';
import { Activity } from 'lucide-react';

export function EnhancedResumeEditor() {
  const [bulletPoint, setBulletPoint] = useState(
    'Responsible for helping with various projects and worked on multiple tasks.'
  );
  const [sectionVariant, setSectionVariant] = useState<SectionVariant>('default');
  
  const { score, weakPhrases } = useImpactScore(bulletPoint);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Phase 4: Intelligence & UX Enhancements
        </h1>
        <p className="text-gray-600">
          Real-time impact analysis, AI-powered editing, and dynamic layouts
        </p>
      </div>

      {/* Feature 1: Floating AI Toolbar + Impact Linter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            1. AI Toolbar + Impact Linter
          </h2>
          <div className="flex items-center gap-2">
            <Activity size={20} className={getImpactColor(score)} />
            <span className="text-sm font-medium text-gray-600">
              Impact Score:
            </span>
            <span className={`text-lg font-bold ${getImpactColor(score)}`}>
              {score}/100
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(score)} bg-opacity-10`}>
              {getImpactLabel(score)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Bullet Point
              <span className="text-gray-500 ml-2">
                (Select text to see AI toolbar, hover yellow underlines for suggestions)
              </span>
            </label>
            <ImpactLinedTextArea
              value={bulletPoint}
              onChange={setBulletPoint}
              placeholder="Type your resume bullet point here..."
              rows={4}
            />
          </div>

          {weakPhrases.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                ⚠️ {weakPhrases.length} Weak {weakPhrases.length === 1 ? 'Phrase' : 'Phrases'} Detected
              </h3>
              <ul className="text-xs space-y-1 text-yellow-800">
                {weakPhrases.slice(0, 3).map((phrase, idx) => (
                  <li key={idx}>
                    • "{phrase.text}" → {phrase.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Real-time impact scoring (0-100)</li>
            <li>✓ Yellow squiggly underlines for weak phrases</li>
            <li>✓ Hover tooltips with power verb suggestions</li>
            <li>✓ Select text → AI toolbar appears (Rewrite, Shorten, Fix Grammar)</li>
            <li>✓ OpenAI integration for intelligent text enhancement</li>
          </ul>
        </div>
      </div>

      {/* Feature 2: Block Layout Variants */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          2. Block Layout Variants
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enable edit mode on resume sections to see a "Layout" button that allows switching between different visual styles.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <DraggableSection
              sectionId="demo-section"
              isEditMode={true}
              variant={sectionVariant}
              onVariantChange={setSectionVariant}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Skills Section</h3>
                
                {/* Render based on variant */}
                {sectionVariant === 'default' && (
                  <div className="space-y-2">
                    <div className="text-sm">• JavaScript, TypeScript, Python</div>
                    <div className="text-sm">• React, Next.js, Node.js</div>
                    <div className="text-sm">• AWS, Docker, Kubernetes</div>
                  </div>
                )}

                {sectionVariant === 'two-column' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium text-sm mb-1">Languages</div>
                      <div className="text-sm text-gray-600">JavaScript, TypeScript, Python</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">Frameworks</div>
                      <div className="text-sm text-gray-600">React, Next.js, Node.js</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">Cloud & DevOps</div>
                      <div className="text-sm text-gray-600">AWS, Docker, Kubernetes</div>
                    </div>
                  </div>
                )}

                {sectionVariant === 'pills' && (
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'AWS', 'Docker', 'Kubernetes'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {sectionVariant === 'compact' && (
                  <div className="space-y-1">
                    <div className="text-xs">JavaScript, TypeScript, Python</div>
                    <div className="text-xs">React, Next.js, Node.js</div>
                    <div className="text-xs">AWS, Docker, Kubernetes</div>
                  </div>
                )}
              </div>
            </DraggableSection>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Current Layout: {sectionVariant}
            </h3>
            <p className="text-xs text-blue-800">
              Hover over the section above to see the layout button (grid icon) in the toolbar.
              Click it to switch between different layout styles.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Layouts:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Default</strong>: Standard vertical list layout</li>
            <li>• <strong>Two Column</strong>: Grid with 2 columns for better space usage</li>
            <li>• <strong>Pills</strong>: Compact badge/pill style for tags</li>
            <li>• <strong>Compact</strong>: Condensed spacing for fitting more content</li>
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          🎉 Phase 4 Complete
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✅ <strong>Floating AI Toolbar</strong>: Select text → AI-powered rewrite, shorten, or grammar fix</p>
          <p>✅ <strong>Real-Time Impact Linter</strong>: Yellow underlines on weak phrases with power verb suggestions</p>
          <p>✅ <strong>Block Layout Variants</strong>: Dynamic layout switching (default, two-column, pills, compact)</p>
          <p>✅ <strong>OpenAI Integration</strong>: API route at /api/ai/enhance-text for intelligent text enhancement</p>
        </div>
      </div>
    </div>
  );
}

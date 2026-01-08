'use client';

import { useState, useMemo } from 'react';
import { X, GitCompare, Calendar, User, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';

interface VersionDiffViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DiffBlock {
  section: string;
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    old?: string;
    new?: string;
  }>;
}

export function VersionDiffViewer({ isOpen, onClose }: VersionDiffViewerProps) {
  const versions = useResumeStore((state) => state.versions);
  const [selectedVersions, setSelectedVersions] = useState<{ v1: number; v2: number }>({ v1: 0, v2: 1 });

  const diff = useMemo(() => {
    if (versions.length < 2) return null;

    const v1 = versions[Math.min(selectedVersions.v1, versions.length - 1)];
    const v2 = versions[Math.min(selectedVersions.v2, versions.length - 1)];

    const diffs: DiffBlock[] = [];

    // Get summary from sections
    const summary1 = v1.snapshot.sections.find((s: any) => s.type === 'summary')?.data as any;
    const summary2 = v2.snapshot.sections.find((s: any) => s.type === 'summary')?.data as any;

    // Compare summary
    if (summary1?.content !== summary2?.content) {
      diffs.push({
        section: 'Professional Summary',
        changes: [{
          type: 'modified',
          old: summary1?.content || '',
          new: summary2?.content || ''
        }]
      });
    }

    // Compare experience
    const exp1Data = v1.snapshot.sections.find((s: any) => s.type === 'experience')?.data as any;
    const exp2Data = v2.snapshot.sections.find((s: any) => s.type === 'experience')?.data as any;
    const exp1 = exp1Data?.items || [];
    const exp2 = exp2Data?.items || [];
    
    if (JSON.stringify(exp1) !== JSON.stringify(exp2)) {
      const changes: any[] = [];
      
      exp2.forEach((item: any, idx: number) => {
        if (!exp1[idx]) {
          changes.push({
            type: 'added',
            new: `${item.position} at ${item.company}`
          });
        } else if (JSON.stringify(item) !== JSON.stringify(exp1[idx])) {
          changes.push({
            type: 'modified',
            old: `${exp1[idx].position} at ${exp1[idx].company}`,
            new: `${item.position} at ${item.company}`
          });
        }
      });

      if (changes.length > 0) {
        diffs.push({
          section: 'Work Experience',
          changes
        });
      }
    }

    // Compare skills
    const skills1Data = v1.snapshot.sections.find((s: any) => s.type === 'skills')?.data as any;
    const skills2Data = v2.snapshot.sections.find((s: any) => s.type === 'skills')?.data as any;
    const skills1 = skills1Data?.categories?.flatMap((c: any) => c.skills.map((s: any) => s.name)) || [];
    const skills2 = skills2Data?.categories?.flatMap((c: any) => c.skills.map((s: any) => s.name)) || [];
    
    const added = skills2.filter((s: any) => !skills1.includes(s));
    const removed = skills1.filter((s: any) => !skills2.includes(s));

    if (added.length > 0 || removed.length > 0) {
      const changes: any[] = [];
      added.forEach((skill: any) => changes.push({ type: 'added', new: skill }));
      removed.forEach((skill: any) => changes.push({ type: 'removed', old: skill }));
      
      diffs.push({
        section: 'Skills',
        changes
      });
    }

    return diffs;
  }, [versions, selectedVersions]);

  if (!isOpen || versions.length < 2) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Version Comparison</h2>
              <p className="text-cyan-100 text-sm">See exactly what changed between versions</p>
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
          {/* Version Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Version A (Older)
              </label>
              <select
                value={selectedVersions.v1}
                onChange={(e) => setSelectedVersions(prev => ({ ...prev, v1: Number(e.target.value) }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
              >
                {versions.map((version, idx) => (
                  <option key={idx} value={idx}>
                    {version.message} - {new Date(version.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Version B (Newer)
              </label>
              <select
                value={selectedVersions.v2}
                onChange={(e) => setSelectedVersions(prev => ({ ...prev, v2: Number(e.target.value) }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
              >
                {versions.map((version, idx) => (
                  <option key={idx} value={idx}>
                    {version.message} - {new Date(version.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Version Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-red-600" />
                <span className="font-semibold text-gray-900">Version A</span>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(versions[selectedVersions.v1]?.createdAt || 0).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} />
                  {versions[selectedVersions.v1]?.message}
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-green-600" />
                <span className="font-semibold text-gray-900">Version B</span>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(versions[selectedVersions.v2]?.createdAt || 0).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} />
                  {versions[selectedVersions.v2]?.message}
                </div>
              </div>
            </div>
          </div>

          {/* Diff Display */}
          {diff && diff.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Changes Detected</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded" />
                    <span className="text-gray-600">Added</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded" />
                    <span className="text-gray-600">Removed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded" />
                    <span className="text-gray-600">Modified</span>
                  </div>
                </div>
              </div>

              {diff.map((block, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-600" />
                    {block.section}
                  </h4>

                  <div className="space-y-2">
                    {block.changes.map((change, changeIdx) => (
                      <div key={changeIdx} className="text-sm">
                        {change.type === 'added' && (
                          <div className="bg-green-50 border border-green-200 rounded p-3">
                            <div className="font-semibold text-green-800 mb-1">+ Added</div>
                            <div className="text-gray-900">{change.new}</div>
                          </div>
                        )}
                        
                        {change.type === 'removed' && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <div className="font-semibold text-red-800 mb-1">- Removed</div>
                            <div className="text-gray-900 line-through">{change.old}</div>
                          </div>
                        )}
                        
                        {change.type === 'modified' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <div className="font-semibold text-yellow-800 mb-2">~ Modified</div>
                            <div className="space-y-2">
                              <div className="bg-red-100/50 rounded p-2">
                                <div className="text-xs text-red-700 font-medium mb-1">Before:</div>
                                <div className="text-gray-900">{change.old}</div>
                              </div>
                              <div className="bg-green-100/50 rounded p-2">
                                <div className="text-xs text-green-700 font-medium mb-1">After:</div>
                                <div className="text-gray-900">{change.new}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GitCompare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No differences found between selected versions</p>
              <p className="text-sm text-gray-500 mt-2">The content appears to be identical</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

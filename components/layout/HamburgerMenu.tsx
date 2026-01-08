'use client';

import { useState } from 'react';
import { Menu, X, Sparkles, Target, Eye, GitCompare, History, Upload, Lightbulb, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HamburgerMenuProps {
  onOpenVersionHistory: () => void;
  onOpenImport: () => void;
  onOpenImpactEnhancer: () => void;
  onOpenSkillsGap: () => void;
  onOpenHeatmap: () => void;
  onOpenDiffViewer: () => void;
  onOpenSemanticAnalyzer: () => void;
  onOpenFluffDetector: () => void;
}

export function HamburgerMenu({
  onOpenVersionHistory,
  onOpenImport,
  onOpenImpactEnhancer,
  onOpenSkillsGap,
  onOpenHeatmap,
  onOpenDiffViewer,
  onOpenSemanticAnalyzer,
  onOpenFluffDetector
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: Sparkles,
      label: 'Impact Enhancer',
      description: 'AI-powered statement enhancement',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      onClick: () => {
        onOpenImpactEnhancer();
        setIsOpen(false);
      }
    },
    {
      icon: Target,
      label: 'Skills Gap Analysis',
      description: 'Compare skills vs requirements',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      onClick: () => {
        onOpenSkillsGap();
        setIsOpen(false);
      }
    },
    {
      icon: Eye,
      label: 'Resume Heatmap',
      description: 'See where recruiters look',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      onClick: () => {
        onOpenHeatmap();
        setIsOpen(false);
      }
    },
    {
      icon: GitCompare,
      label: 'Compare Versions',
      description: 'Visual diff between versions',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      onClick: () => {
        onOpenDiffViewer();
        setIsOpen(false);
      }
    },
    {
      icon: Lightbulb,
      label: 'Semantic Analyzer',
      description: 'Job role mapping',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      onClick: () => {
        onOpenSemanticAnalyzer();
        setIsOpen(false);
      }
    },
    {
      icon: AlertCircle,
      label: 'Fluff Detector',
      description: 'Remove weak language',
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      onClick: () => {
        onOpenFluffDetector();
        setIsOpen(false);
      }
    },
    {
      icon: History,
      label: 'Version History',
      description: 'View all saved versions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      onClick: () => {
        onOpenVersionHistory();
        setIsOpen(false);
      }
    },
    {
      icon: Upload,
      label: 'Import Resume',
      description: 'Load from JSON file',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      onClick: () => {
        onOpenImport();
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
        title="More Features"
      >
        <Menu className="w-4 h-4" />
        More
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-16 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[101] max-h-[calc(100vh-100px)] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Advanced Features</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="overflow-y-auto max-h-[calc(100vh-180px)] p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={item.onClick}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${item.bgColor} border border-transparent hover:border-gray-200`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{item.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                <p className="text-xs text-gray-600 text-center">
                  Press <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs">ESC</kbd> to close
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

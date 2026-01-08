'use client';

import { useResumeStore } from '@/stores';
import { exportToPDF } from '@/lib/pdfExport';
import { exportResumeAsJSON, importResumeFromJSON } from '@/lib/storage';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VersionHistoryModal } from '@/components/features/VersionHistoryModal';
import { SettingsModal } from '@/components/features/SettingsModal';
import { ATSCheckerModal } from '@/components/features/ATSCheckerModal';
import { JobMatcherModal } from '@/components/features/JobMatcherModal';
import { TemplatePickerModal } from '@/components/features/TemplatePickerModal';
import SemanticAnalyzerModal from '@/components/features/SemanticAnalyzerModal';
import FluffDetectorModal from '@/components/features/FluffDetectorModal';
import { LayoutEditorModal } from '@/components/features/LayoutEditorModal';
import { AIImpactEnhancer } from '@/components/features/AIImpactEnhancer';
import { SkillsGapAnalysis } from '@/components/features/SkillsGapAnalysis';
import { ResumeHeatmap } from '@/components/features/ResumeHeatmap';
import { OneClickTailoring } from '@/components/features/OneClickTailoring';
import { VersionDiffViewer } from '@/components/features/VersionDiffViewer';
import { HamburgerMenu } from '@/components/layout/HamburgerMenu';
import { TemplateGallery } from '@/components/features/TemplateGallery';
import { motion } from 'framer-motion';
import { 
  Save, 
  Download, 
  Settings, 
  FileText,
  CheckCircle,
  TrendingUp,
  Layout,
  Sparkles,
  Edit3,
  Zap
} from 'lucide-react';

export function Toolbar() {
  const router = useRouter();
  const currentResume = useResumeStore((state) => state.currentResume);
  const saveVersion = useResumeStore((state) => state.saveVersion);
  const loadResume = useResumeStore((state) => state.loadResume);
  const previewEditMode = useResumeStore((state) => state.previewEditMode);
  const setPreviewEditMode = useResumeStore((state) => state.setPreviewEditMode);
  const [isExporting, setIsExporting] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showATSChecker, setShowATSChecker] = useState(false);
  const [showJobMatcher, setShowJobMatcher] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showSemanticAnalyzer, setShowSemanticAnalyzer] = useState(false);
  const [showFluffDetector, setShowFluffDetector] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [showImpactEnhancer, setShowImpactEnhancer] = useState(false);
  const [showSkillsGap, setShowSkillsGap] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTailoring, setShowTailoring] = useState(false);
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  const handleSaveVersion = () => {
    const message = prompt('Enter version message:');
    if (message) {
      saveVersion(message);
      alert('Version saved successfully!');
    }
  };

  const handleExportPDF = async () => {
    if (!currentResume) {
      alert('No resume to export. Please create or load a resume first.');
      return;
    }
    
    setIsExporting(true);
    try {
      await exportToPDF(currentResume);
      // Success - the print dialog will open
    } catch (error: any) {
      console.error('PDF export failed:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`PDF export failed: ${errorMessage}\n\nTips:\n- Allow popups in your browser\n- Try using Chrome or Edge browser\n- Check if the resume preview is visible`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    if (!currentResume) return;
    exportResumeAsJSON(currentResume);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const resume = await importResumeFromJSON(file);
        loadResume(resume);
        alert('Resume imported successfully!');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import resume. Please check the file.');
      }
    };
    
    input.click();
  };

  return (
    <>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-16 border-b border-white/20 backdrop-blur-xl bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-6 flex items-center justify-between shadow-lg relative z-[102]"
      >
      <div className="flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <FileText className="w-6 h-6 text-white" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </div>
          <h1 className="text-xl font-bold text-white">ProResume Architect</h1>
        </motion.div>
        
        {currentResume && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/80 border-l border-white/20 pl-4"
          >
            {currentResume.metadata.title}
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveVersion}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
          title="Save Version"
        >
          <Save className="w-4 h-4" />
          Save
        </motion.button>

        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-white hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            title="Export as PDF"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </motion.button>
          
          {/* Dropdown menu with glass effect */}
          <div className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-white/90 rounded-lg shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={handleExportPDF}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-t-lg transition-colors"
            >
              Export as PDF
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-b-lg transition-colors"
            >
              Export as JSON
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/templates')}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
          title="Browse Template Gallery"
        >
          <Layout className="w-4 h-4" />
          Templates
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowATSChecker(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-100/80 hover:bg-green-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="ATS Checker"
        >
          <CheckCircle className="w-4 h-4" />
          ATS
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJobMatcher(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100/80 hover:bg-blue-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="Job Matcher"
        >
          <TrendingUp className="w-4 h-4" />
          Match
        </motion.button>

        <div className="w-px h-6 bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTailoring(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 hover:from-indigo-200/80 hover:to-purple-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="AI Tailor Resume"
        >
          <Zap className="w-4 h-4" />
          Tailor
        </motion.button>

        <div className="w-px h-6 bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPreviewEditMode(!previewEditMode)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all backdrop-blur-md shadow-lg ${
            previewEditMode
              ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600'
              : 'text-purple-700 bg-purple-100/80 hover:bg-purple-200/80'
          }`}
          title="Toggle Edit Mode"
        >
          <Edit3 className="w-4 h-4" />
          {previewEditMode ? 'Edit ON' : 'Edit'}
        </motion.button>

        <div className="w-px h-6 bg-white/20" />

        <HamburgerMenu
          onOpenVersionHistory={() => setShowVersionHistory(true)}
          onOpenImport={handleImport}
          onOpenImpactEnhancer={() => setShowImpactEnhancer(true)}
          onOpenSkillsGap={() => setShowSkillsGap(true)}
          onOpenHeatmap={() => setShowHeatmap(true)}
          onOpenDiffViewer={() => setShowDiffViewer(true)}
          onOpenSemanticAnalyzer={() => setShowSemanticAnalyzer(true)}
          onOpenFluffDetector={() => setShowFluffDetector(true)}
        />

        <div className="w-px h-6 bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.05, y: -2, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>

      <VersionHistoryModal 
        isOpen={showVersionHistory} 
        onClose={() => setShowVersionHistory(false)} 
      />
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      <ATSCheckerModal 
        isOpen={showATSChecker} 
        onClose={() => setShowATSChecker(false)} 
      />

      <JobMatcherModal 
        isOpen={showJobMatcher} 
        onClose={() => setShowJobMatcher(false)} 
      />

      <TemplatePickerModal 
        isOpen={showTemplatePicker} 
        onClose={() => setShowTemplatePicker(false)} 
      />

      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
      />

      <LayoutEditorModal
        isOpen={showLayoutEditor}
        onClose={() => setShowLayoutEditor(false)}
      />

      {currentResume && (
        <>
          <SemanticAnalyzerModal 
            isOpen={showSemanticAnalyzer} 
            onClose={() => setShowSemanticAnalyzer(false)}
            resume={currentResume}
          />

          <FluffDetectorModal 
            isOpen={showFluffDetector} 
            onClose={() => setShowFluffDetector(false)}
            resume={currentResume}
          />
        </>
      )}

      <AIImpactEnhancer 
        isOpen={showImpactEnhancer} 
        onClose={() => setShowImpactEnhancer(false)} 
      />

      <SkillsGapAnalysis 
        isOpen={showSkillsGap} 
        onClose={() => setShowSkillsGap(false)} 
      />

      <ResumeHeatmap 
        isOpen={showHeatmap} 
        onClose={() => setShowHeatmap(false)} 
      />

      <OneClickTailoring 
        isOpen={showTailoring} 
        onClose={() => setShowTailoring(false)} 
      />

      <VersionDiffViewer 
        isOpen={showDiffViewer} 
        onClose={() => setShowDiffViewer(false)} 
      />
    </>
  );
}

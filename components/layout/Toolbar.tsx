'use client';

import { useResumeStore } from '@/stores';
import { exportToPDF } from '@/lib/pdfExport';
import { exportResumeAsJSON, importResumeFromJSON } from '@/lib/storage';
import { useState } from 'react';
import { VersionHistoryModal } from '@/components/features/VersionHistoryModal';
import { SettingsModal } from '@/components/features/SettingsModal';
import { ATSCheckerModal } from '@/components/features/ATSCheckerModal';
import { JobMatcherModal } from '@/components/features/JobMatcherModal';
import { TemplatePickerModal } from '@/components/features/TemplatePickerModal';
import SemanticAnalyzerModal from '@/components/features/SemanticAnalyzerModal';
import FluffDetectorModal from '@/components/features/FluffDetectorModal';
import { LayoutEditorModal } from '@/components/features/LayoutEditorModal';
import { motion } from 'framer-motion';
import { 
  Save, 
  Download, 
  Upload, 
  Settings, 
  History, 
  FileText,
  CheckCircle,
  TrendingUp,
  Layout,
  Lightbulb,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export function Toolbar() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const saveVersion = useResumeStore((state) => state.saveVersion);
  const loadResume = useResumeStore((state) => state.loadResume);
  const [isExporting, setIsExporting] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showATSChecker, setShowATSChecker] = useState(false);
  const [showJobMatcher, setShowJobMatcher] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showSemanticAnalyzer, setShowSemanticAnalyzer] = useState(false);
  const [showFluffDetector, setShowFluffDetector] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);

  const handleSaveVersion = () => {
    const message = prompt('Enter version message:');
    if (message) {
      saveVersion(message);
      alert('Version saved successfully!');
    }
  };

  const handleExportPDF = async () => {
    if (!currentResume) return;
    
    setIsExporting(true);
    try {
      await exportToPDF(currentResume);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
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
        animate={{ y: 0, opacity: 1 }}        transition={{ duration: 0.3 }}        className="h-16 border-b border-white/20 backdrop-blur-xl bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-6 flex items-center justify-between shadow-lg\"
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
          Save Version
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowVersionHistory(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
          title="Version History"
        >
          <History className="w-4 h-4" />
          History
        </motion.button>

        <div className="w-px h-6 bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
          title="Import Resume"
        >
          <Upload className="w-4 h-4" />
          Import
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
          onClick={() => setShowTemplatePicker(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 shadow-lg"
          title="Change Template"
        >
          <Layout className="w-4 h-4" />
          Template
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLayoutEditor(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100/80 hover:bg-purple-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="Customize Layout"
        >
          <Layout className="w-4 h-4" />
          Customize
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowATSChecker(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-100/80 hover:bg-green-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="ATS Checker"
        >
          <CheckCircle className="w-4 h-4" />
          ATS Score
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJobMatcher(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100/80 hover:bg-blue-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="Job Description Matcher"
        >
          <TrendingUp className="w-4 h-4" />
          Job Match
        </motion.button>

        <div className="w-px h-6 bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSemanticAnalyzer(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100/80 hover:bg-purple-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="Semantic Job Mapper"
        >
          <Lightbulb className="w-4 h-4" />
          Semantic
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFluffDetector(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100/80 hover:bg-red-200/80 rounded-lg transition-all backdrop-blur-md shadow-lg"
          title="Fluff Detector"
        >
          <AlertCircle className="w-4 h-4" />
          Fluff
        </motion.button>

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
    </>
  );
}

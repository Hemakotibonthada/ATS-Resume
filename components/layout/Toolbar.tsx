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
  AlertCircle
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
      <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-600" />
          <h1 className="text-xl font-bold">ProResume Architect</h1>
        </div>
        
        {currentResume && (
          <span className="text-sm text-gray-500 border-l pl-4">
            {currentResume.metadata.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveVersion}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Save Version"
        >
          <Save className="w-4 h-4" />
          Save Version
        </button>

        <button
          onClick={() => setShowVersionHistory(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Version History"
        >
          <History className="w-4 h-4" />
          History
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Import Resume"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>

        <div className="relative group">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export as PDF"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={handleExportPDF}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              Export as PDF
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
            >
              Export as JSON
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={() => setShowTemplatePicker(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Change Template"
        >
          <Layout className="w-4 h-4" />
          Template
        </button>

        <button
          onClick={() => setShowATSChecker(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          title="ATS Checker"
        >
          <CheckCircle className="w-4 h-4" />
          ATS Score
        </button>

        <button
          onClick={() => setShowJobMatcher(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          title="Job Description Matcher"
        >
          <TrendingUp className="w-4 h-4" />
          Job Match
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={() => setShowSemanticAnalyzer(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          title="Semantic Job Mapper"
        >
          <Lightbulb className="w-4 h-4" />
          Semantic
        </button>

        <button
          onClick={() => setShowFluffDetector(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          title="Fluff Detector"
        >
          <AlertCircle className="w-4 h-4" />
          Fluff
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>

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

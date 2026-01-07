'use client';

import { useState } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { 
  generateGhostTextLayer, 
  exportGhostTextLayer, 
  validateGhostTextLayer,
  getGhostTextLayerDataURL 
} from '@/lib/ghostTextLayer';
import { Download, CheckCircle, AlertTriangle, Eye, FileText } from 'lucide-react';

/**
 * Ghost Text Layer Settings Component
 * 
 * Allows users to:
 * 1. Preview the ghost text layer
 * 2. Validate hierarchical structure
 * 3. Export as separate .txt file
 * 4. Enable/disable in PDF exports
 */
export default function GhostTextLayerSettings() {
  const resume = useResumeStore((state) => state.currentResume);
  const [showPreview, setShowPreview] = useState(false);
  const [ghostText, setGhostText] = useState('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    issues: string[];
    hierarchy: string[];
  } | null>(null);

  const handleGeneratePreview = () => {
    if (!resume) return;
    
    const text = generateGhostTextLayer(resume);
    setGhostText(text);
    setShowPreview(true);
    
    // Also validate
    const validationResult = validateGhostTextLayer(resume);
    setValidation(validationResult);
  };

  const handleExport = () => {
    if (!resume) return;
    exportGhostTextLayer(resume);
  };

  const handleValidate = () => {
    if (!resume) return;
    const validationResult = validateGhostTextLayer(resume);
    setValidation(validationResult);
  };

  const handleCopyToClipboard = async () => {
    if (!ghostText) return;
    
    try {
      await navigator.clipboard.writeText(ghostText);
      alert('Ghost text layer copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Ghost Text Layer (ATS Parsability)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          The Ghost Text Layer ensures your PDF has a purely linear, hierarchical text stream 
          for proper ATS parsing—even with visual columns. This invisible layer helps systems 
          like Eightfold.ai correctly parse: Header → Work History → Job 1 → Job 2 → Education → Skills.
        </p>
      </div>

      {/* Feature Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">
              Automatically Enabled in PDF Exports
            </p>
            <p className="text-xs text-green-700 mt-1">
              All PDF exports include an invisible ghost text layer for optimal ATS parsing.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleGeneratePreview}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        
        <button
          onClick={handleValidate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Validate
        </button>
        
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export .txt
        </button>
      </div>

      {/* Validation Results */}
      {validation && (
        <div className={`border rounded-lg p-4 ${
          validation.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            {validation.isValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    ✅ Ghost Text Layer is Valid
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Hierarchical structure is correct and ATS-ready.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    ⚠️ Validation Issues Found
                  </p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                    {validation.issues.map((issue, idx) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Hierarchy Preview */}
          {validation.hierarchy.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Detected Hierarchy ({validation.hierarchy.length} sections):
              </p>
              <div className="flex flex-wrap gap-2">
                {validation.hierarchy.map((section, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-white border border-gray-300 rounded"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && ghostText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Ghost Text Layer Preview</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copy
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-auto flex-1">
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap text-gray-800">
                  {ghostText}
                </pre>
              </div>
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-600">
                <strong>How it works:</strong> This text is embedded invisibly in your PDF exports. 
                ATS systems read this linear, hierarchical stream instead of trying to parse complex layouts.
                This ensures your resume is correctly understood by systems like Eightfold.ai.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          <strong>📋 What is a Ghost Text Layer?</strong><br />
          Modern ATS systems parse the raw text from PDFs. If your resume uses complex layouts 
          (columns, floating boxes), the parser may read text out of order. The ghost text layer 
          ensures a clean, sequential read: Contact → Summary → Experience → Education → Skills.
          <br /><br />
          <strong>✅ Benefits:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Guarantees proper section ordering for ATS parsing</li>
            <li>Prevents "floating text" confusion</li>
            <li>Optimized for Eightfold.ai knowledge graphs</li>
            <li>No visual impact on your resume design</li>
          </ul>
        </p>
      </div>
    </div>
  );
}

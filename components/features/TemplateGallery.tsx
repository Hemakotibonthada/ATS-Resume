'use client';

import { useState } from 'react';
import { X, Check, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { templates, Template } from '@/lib/templates';
import { useResumeStore } from '@/stores';
import { exportToPDF } from '@/lib/pdfExport';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateGallery({ isOpen, onClose }: TemplateGalleryProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  if (!isOpen || !currentResume) return null;

  const handleSelectTemplate = (template: Template) => {
    updateResume({ ...currentResume, templateId: template.id });
    onClose();
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewIndex(templates.findIndex(t => t.id === template.id));
  };

  const handleExportTemplate = async (template: Template) => {
    const tempResume = { ...currentResume, templateId: template.id };
    try {
      await exportToPDF(tempResume);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handlePrevPreview = () => {
    if (previewIndex > 0) {
      const newIndex = previewIndex - 1;
      setPreviewIndex(newIndex);
      setSelectedTemplate(templates[newIndex]);
    }
  };

  const handleNextPreview = () => {
    if (previewIndex < templates.length - 1) {
      const newIndex = previewIndex + 1;
      setPreviewIndex(newIndex);
      setSelectedTemplate(templates[newIndex]);
    }
  };

  const closePreview = () => {
    setSelectedTemplate(null);
  };

  return (
    <>
      {/* Main Gallery Modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-1">Resume Templates</h2>
              <p className="text-purple-100">Choose from {templates.length} professional templates</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => {
                const isSelected = currentResume.templateId === template.id;
                return (
                  <div
                    key={template.id}
                    className={`group relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 ring-4 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    {/* Template Preview Card */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center text-8xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50" />
                      <span className="relative z-10 drop-shadow-lg">{template.preview}</span>
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePreviewTemplate(template)}
                          className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                          title="Preview"
                        >
                          <Eye size={20} className="text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleSelectTemplate(template)}
                          className="p-3 bg-purple-600 text-white rounded-full hover:scale-110 transition-transform"
                          title="Use Template"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleExportTemplate(template)}
                          className="p-3 bg-green-600 text-white rounded-full hover:scale-110 transition-transform"
                          title="Export PDF"
                        >
                          <Download size={20} />
                        </button>
                      </div>

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check size={14} />
                          Active
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 text-gray-800">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      
                      {/* Template Features */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {template.style.layout}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {template.style.spacing}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectTemplate(template)}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 hover:bg-purple-100 text-gray-800'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Use This'}
                        </button>
                        <button
                          onClick={() => handlePreviewTemplate(template)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Select a template to apply it to your resume
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Close Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevPreview}
                  disabled={previewIndex === 0}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-purple-100">
                    Template {previewIndex + 1} of {templates.length}
                  </p>
                </div>
                <button
                  onClick={handleNextPreview}
                  disabled={previewIndex === templates.length - 1}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportTemplate(selectedTemplate)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Export PDF
                </button>
                <button
                  onClick={() => {
                    handleSelectTemplate(selectedTemplate);
                    closePreview();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Check size={18} />
                  Use Template
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex items-start justify-center">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl">
                <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30" />
                  <div className="text-center z-10">
                    <div className="text-9xl mb-4">{selectedTemplate.preview}</div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {selectedTemplate.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {template.style.layout} Layout
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {template.style.spacing} Spacing
                      </span>
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {template.style.sectionStyle} Sections
                      </span>
                      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {template.style.bulletStyle} Bullets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Tip:</span> Click "Use Template" to apply this design to your resume
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPreview}
                  disabled={previewIndex === 0}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                <button
                  onClick={handleNextPreview}
                  disabled={previewIndex === templates.length - 1}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

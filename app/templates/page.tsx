'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Check } from 'lucide-react';
import { templates } from '@/lib/templates';
import { useResumeStore } from '@/stores';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { exportToPDF } from '@/lib/pdfExport';

export default function TemplatesPage() {
  const router = useRouter();
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('modern');

  useEffect(() => {
    if (currentResume) {
      setSelectedTemplateId(currentResume.templateId);
    }
  }, [currentResume]);

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Loading...</h2>
        </div>
      </div>
    );
  }

  const handleSelectTemplate = (templateId: string) => {
    updateResume({ ...currentResume, templateId });
    router.push('/builder');
  };

  const handleExportTemplate = async (templateId: string) => {
    const tempResume = { ...currentResume, templateId };
    try {
      await exportToPDF(tempResume);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/builder')}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Switch Templates</h1>
              <p className="text-slate-400 text-sm">Choose from {templates.length} professional designs</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/builder')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Templates Sidebar */}
        <div className="w-80 bg-slate-800/30 backdrop-blur-xl border-r border-slate-700/50 overflow-y-auto">
          <div className="p-4 space-y-3">
            {templates.map((template) => {
              const isActive = currentResume.templateId === template.id;
              const isSelected = selectedTemplateId === template.id;
              
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-500/50 bg-slate-700/50'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }`}
                >
                  {/* Template Preview Thumbnail */}
                  <div className="relative aspect-[3/4] bg-white rounded-t-xl overflow-hidden">
                    <div className="absolute inset-0 transform scale-[0.25] origin-top-left">
                      <div className="w-[800px] h-[1132px]">
                        <ResumePreview 
                          resume={{ ...currentResume, templateId: template.id }}
                          isEditMode={false}
                          zoom={1}
                          onZoomIn={() => {}}
                          onZoomOut={() => {}}
                          onResetZoom={() => {}}
                        />
                      </div>
                    </div>
                    
                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check size={12} />
                        Active
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-3 bg-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{template.preview}</span>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{template.description}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template.id);
                        }}
                        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                          isActive
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                        disabled={isActive}
                      >
                        {isActive ? 'Current' : 'Use This'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportTemplate(template.id);
                        }}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title="Export as PDF"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Large Preview */}
        <div className="flex-1 overflow-auto bg-slate-900/50 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {templates.find(t => t.id === selectedTemplateId)?.name}
                    </h2>
                    <p className="text-sm text-purple-100">
                      {templates.find(t => t.id === selectedTemplateId)?.description}
                    </p>
                  </div>
                  <span className="text-4xl">
                    {templates.find(t => t.id === selectedTemplateId)?.preview}
                  </span>
                </div>
              </div>
              
              <div className="p-8 bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <ResumePreview 
                    resume={{ ...currentResume, templateId: selectedTemplateId }}
                    isEditMode={false}
                    zoom={1}
                    onZoomIn={() => {}}
                    onZoomOut={() => {}}
                    onResetZoom={() => {}}
                  />
                </div>
              </div>

              <div className="bg-white border-t border-gray-200 p-6 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {templates.find(t => t.id === selectedTemplateId)?.style.layout}
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                    {templates.find(t => t.id === selectedTemplateId)?.style.spacing} spacing
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleExportTemplate(selectedTemplateId)}
                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(selectedTemplateId)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      currentResume.templateId === selectedTemplateId
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    disabled={currentResume.templateId === selectedTemplateId}
                  >
                    <Check size={18} />
                    {currentResume.templateId === selectedTemplateId ? 'Current Template' : 'Use This Template'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

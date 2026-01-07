'use client';

import { useState } from 'react';
import { useResumeStore } from '@/stores';
import { templates, Template, TemplateId } from '@/lib/templates';
import { X, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePickerModal({ isOpen, onClose }: TemplatePickerModalProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    currentResume?.templateId || 'modern'
  );

  const handleApplyTemplate = () => {
    console.log('Applying template:', selectedTemplate);
    updateResume({ templateId: selectedTemplate });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-200/50">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Choose Template</h2>
                  <p className="text-sm text-gray-600">Select a visual style for your resume</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onClick={() => setSelectedTemplate(template.id)}
              />
            ))}
          </div>

          {/* Template Details */}
          <motion.div
            key={selectedTemplate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 backdrop-blur-md bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-lg"
          >
            <h3 className="font-semibold text-purple-900 mb-2">
              {templates.find(t => t.id === selectedTemplate)?.name}
            </h3>
            <p className="text-sm text-purple-800 mb-3">
              {templates.find(t => t.id === selectedTemplate)?.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
              <div>
                <span className="font-medium">Layout:</span>{' '}
                {templates.find(t => t.id === selectedTemplate)?.style.layout}
              </div>
              <div>
                <span className="font-medium">Header:</span>{' '}
                {templates.find(t => t.id === selectedTemplate)?.style.headerAlignment}
              </div>
              <div>
                <span className="font-medium">Style:</span>{' '}
                {templates.find(t => t.id === selectedTemplate)?.style.sectionStyle}
              </div>
              <div>
                <span className="font-medium">Spacing:</span>{' '}
                {templates.find(t => t.id === selectedTemplate)?.style.spacing}
              </div>
            </div>
          </motion.div>
        </div>

            {/* Footer */}
            <div className="border-t border-purple-200/50 p-6 flex justify-end gap-3">\n              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApplyTemplate}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Apply Template
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TemplateCard({
  template,
  isSelected,
  onClick,
}: {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        relative p-4 rounded-xl border-2 transition-all text-left overflow-hidden
        ${isSelected 
          ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl shadow-purple-200' 
          : 'border-gray-200 hover:border-purple-300 hover:shadow-lg backdrop-blur-sm bg-white/80'
        }
      `}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
      
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10">
        <motion.div
          className="text-4xl mb-3"
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {template.preview}
        </motion.div>
        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-xs text-gray-600">{template.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-xs px-2 py-0.5 bg-purple-100 rounded-full text-purple-700">
            {template.style.layout}
          </span>
          <span className="text-xs px-2 py-0.5 bg-pink-100 rounded-full text-pink-700">
            {template.style.sectionStyle}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

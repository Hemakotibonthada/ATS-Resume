'use client';

import { useState } from 'react';
import { useResumeStore } from '@/stores';
import { X, Layout, Columns, Grid, AlignLeft, AlignCenter, AlignRight, Eye, EyeOff, Palette, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateId } from '@/lib/templates';

interface LayoutEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayoutEditorModal({ isOpen, onClose }: LayoutEditorModalProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const updateSection = useResumeStore((state) => state.updateSection);

  if (!currentResume) return null;

  // Ensure theme object exists with defaults
  const theme = (currentResume as any).theme || {
    primaryColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    spacing: 'normal' as const,
  };

  const handleThemeColorChange = (color: string) => {
    updateResume({
      theme: {
        ...theme,
        primaryColor: color,
      },
    } as any);
  };

  const handleFontChange = (font: string) => {
    updateResume({
      theme: {
        ...theme,
        fontFamily: font,
      },
    } as any);
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    const sizeMap = { small: '10px', medium: '11px', large: '12px' };
    updateResume({
      theme: {
        ...theme,
        fontSize: sizeMap[size],
      },
    } as any);
  };

  const handleSpacingChange = (spacing: 'compact' | 'normal' | 'relaxed') => {
    updateResume({
      theme: {
        ...theme,
        spacing,
      },
    } as any);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const section = currentResume.sections.find((s) => s.id === sectionId);
    if (section) {
      updateSection(sectionId, {
        visible: !section.visible,
      });
    }
  };

  const presetColors = [
    { name: 'Royal Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Slate', value: '#475569' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  const fontFamilies = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier', value: 'Courier New, monospace' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-200/50">
              <div className="flex items-center gap-3">
                <Layout className="w-6 h-6 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Layout Editor
                  </h2>
                  <p className="text-sm text-gray-600">Customize your resume appearance</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Theme */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Theme Color</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {presetColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleThemeColorChange(color.value)}
                        className={`
                          relative h-12 rounded-lg border-2 transition-colors
                          ${theme.primaryColor === color.value
                            ? 'border-purple-600 ring-2 ring-purple-200'
                            : 'border-gray-200'
                          }
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {theme.primaryColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <div className="w-2 h-2 bg-purple-600 rounded-full" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleThemeColorChange(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Font Family */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Font Family</h3>
                  </div>
                  <div className="space-y-2">
                    {fontFamilies.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => handleFontChange(font.value)}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                          ${theme.fontFamily === font.value
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                          }
                        `}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Font Size</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className={`
                          px-4 py-3 rounded-lg border-2 transition-all capitalize
                          ${theme.fontSize === { small: '10px', medium: '11px', large: '12px' }[size]
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                          }
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Spacing</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() => handleSpacingChange(spacing)}
                        className={`
                          px-4 py-3 rounded-lg border-2 transition-all capitalize
                          ${theme.spacing === spacing
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                          }
                        `}
                      >
                        {spacing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Visibility */}
                <div className="col-span-full space-y-4">
                  <h3 className="font-semibold text-gray-900">Section Visibility</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentResume.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => toggleSectionVisibility(section.id)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all
                          ${section.visible
                            ? 'border-green-500 bg-green-50 text-green-900'
                            : 'border-gray-300 bg-gray-50 text-gray-500'
                          }
                        `}
                      >
                        {section.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm">{section.title}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Toggle sections on/off to show or hide them in your resume
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-purple-200/50 p-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

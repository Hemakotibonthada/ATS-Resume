'use client';

import { useResumeStore } from '@/stores';
import { X, Palette, Type, Layout, Save, Code } from 'lucide-react';
import { exportSchemaAsJSON, generateEightfoldSchema } from '@/lib/jsonLdSchema';
import { useState } from 'react';
import GhostTextLayerSettings from './GhostTextLayerSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fontOptions = [
  { label: 'Inter (Modern)', value: 'Inter' },
  { label: 'Merriweather (Serif)', value: 'Merriweather' },
  { label: 'Roboto (Clean)', value: 'Roboto' },
  { label: 'Open Sans (Friendly)', value: 'Open Sans' },
  { label: 'Lato (Professional)', value: 'Lato' },
  { label: 'Fira Code (Tech)', value: 'Fira Code' },
];

const colorPresets = [
  { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#0284c7' },
  { name: 'Forest Green', primary: '#10b981', secondary: '#059669' },
  { name: 'Royal Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
  { name: 'Sunset Orange', primary: '#f59e0b', secondary: '#d97706' },
  { name: 'Ruby Red', primary: '#ef4444', secondary: '#dc2626' },
  { name: 'Slate Gray', primary: '#64748b', secondary: '#475569' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateResume = useResumeStore((state) => state.updateResume);

  const [settings, setSettings] = useState(currentResume?.settings || {
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      accentColor: '#f59e0b',
      fontPair: { heading: 'Inter', body: 'Inter' },
    },
    layout: {
      pageSize: 'A4' as const,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      lineHeight: 1.5,
      sectionSpacing: 16,
    },
    atsMode: false,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    updateResume({ settings });
    onClose();
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSettings({
      ...settings,
      theme: {
        ...settings.theme,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold">Resume Settings</h2>
              <p className="text-sm text-gray-600">Customize your resume appearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Color Theme */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Theme
              </h3>
              
              <div className="space-y-4">
                {/* Color Presets */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quick Presets</label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="p-4 border rounded-lg hover:border-primary-500 transition-colors text-left"
                      >
                        <div className="flex gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <p className="text-sm font-medium">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, primaryColor: e.target.value },
                          })
                        }
                        className="w-12 h-10 rounded border"
                      />
                      <input
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, primaryColor: e.target.value },
                          })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme.secondaryColor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, secondaryColor: e.target.value },
                          })
                        }
                        className="w-12 h-10 rounded border"
                      />
                      <input
                        type="text"
                        value={settings.theme.secondaryColor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, secondaryColor: e.target.value },
                          })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading Font</label>
                  <select
                    value={settings.theme.fontPair.heading}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        theme: {
                          ...settings.theme,
                          fontPair: { ...settings.theme.fontPair, heading: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Body Font</label>
                  <select
                    value={settings.theme.fontPair.body}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        theme: {
                          ...settings.theme,
                          fontPair: { ...settings.theme.fontPair, body: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Layout */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Layout
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Page Size</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          layout: { ...settings.layout, pageSize: 'A4' },
                        })
                      }
                      className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                        settings.layout.pageSize === 'A4'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      A4 (210 × 297 mm)
                    </button>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          layout: { ...settings.layout, pageSize: 'Letter' },
                        })
                      }
                      className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                        settings.layout.pageSize === 'Letter'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Letter (8.5 × 11 in)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Margins (mm) - All sides: {settings.layout.margins.top}mm
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={settings.layout.margins.top}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setSettings({
                        ...settings,
                        layout: {
                          ...settings.layout,
                          margins: { top: value, right: value, bottom: value, left: value },
                        },
                      });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            {/* QR Codes */}
            <section>
              <h3 className="text-lg font-semibold mb-4">QR Codes</h3>
              
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.theme.showQRCodes ?? false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        theme: { ...settings.theme, showQRCodes: e.target.checked },
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Show QR Codes on Resume</span>
                    <p className="text-sm text-gray-600">
                      Display QR codes for LinkedIn, portfolio, and other contact links
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Ghost Text Layer */}
            <section>
              <GhostTextLayerSettings />
            </section>

            {/* JSON-LD Schema Export */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                JSON-LD Schema Export
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Export your resume as JSON-LD Schema.org structured data. 
                  Eightfold.ai and modern ATS systems can parse this for better matching.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (currentResume) {
                        const schema = exportSchemaAsJSON(currentResume, false);
                        const blob = new Blob([schema], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'resume-schema.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Export Basic Schema
                  </button>
                  
                  <button
                    onClick={() => {
                      if (currentResume) {
                        const schema = JSON.stringify(generateEightfoldSchema(currentResume), null, 2);
                        const blob = new Blob([schema], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'resume-eightfold-schema.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Export Eightfold Schema
                  </button>
                </div>
                
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
                  <strong>Tip:</strong> The Eightfold schema includes skill categorization and 
                  detailed work history optimized for Eightfold.ai's knowledge graph.
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

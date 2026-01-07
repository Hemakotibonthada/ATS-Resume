'use client';

import { ResumeSection, ContactData } from '@/types';
import { useResumeStore } from '@/stores';
import { Mail, Phone, MapPin, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

interface ContactEditorProps {
  section: ResumeSection;
}

export function ContactEditor({ section }: ContactEditorProps) {
  const updateSection = useResumeStore((state) => state.updateSection);
  const data = section.data as ContactData;

  const handleChange = (field: keyof ContactData, value: any) => {
    updateSection(section.id, {
      data: { ...data, [field]: value },
    });
  };

  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      type: 'custom' as const,
      label: 'New Link',
      url: '',
      showQR: false,
    };
    handleChange('links', [...(data.links || []), newLink]);
  };

  const removeLink = (linkId: string) => {
    handleChange('links', data.links.filter((l) => l.id !== linkId));
  };

  const updateLink = (linkId: string, updates: any) => {
    handleChange(
      'links',
      data.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l))
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Senior Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      {/* Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <LinkIcon className="w-4 h-4 inline mr-1" />
            Links & Social Media
          </label>
          <button
            onClick={addLink}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        <div className="space-y-3">
          {data.links?.map((link) => (
            <div key={link.id} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <select
                  value={link.type}
                  onChange={(e) => updateLink(link.id, { type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="website">Website</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(link.id, { label: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Label"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
                <label className="col-span-2 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.showQR ?? false}
                    onChange={(e) => updateLink(link.id, { showQR: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Show QR Code</span>
                </label>
              </div>
              <button
                onClick={() => removeLink(link.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
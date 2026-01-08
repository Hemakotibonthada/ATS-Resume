'use client';

import { InlineEdit } from './InlineEdit';
import { useResumeStore } from '@/stores';
import { ContactData } from '@/types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface HeaderBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function HeaderBlock({ sectionId, isInteractive }: HeaderBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);

  if (!currentResume) return null;

  const section = currentResume.sections.find((s) => s.id === sectionId);
  if (!section || section.type !== 'contact') return null;

  const data = section.data as ContactData;

  const handleUpdate = (field: keyof ContactData, value: string) => {
    updateSectionData(sectionId, { [field]: value });
  };

  return (
    <div className="text-center mb-6">
      {/* Name */}
      <InlineEdit
        value={data.fullName || ''}
        onChange={(val) => handleUpdate('fullName', val)}
        as="h1"
        className="text-4xl font-bold text-gray-900 mb-2"
        placeholder="Your Full Name"
        disabled={!isInteractive}
      />

      {/* Title */}
      <InlineEdit
        value={data.title || ''}
        onChange={(val) => handleUpdate('title', val)}
        as="p"
        className="text-xl text-gray-700 mb-4"
        placeholder="Professional Title"
        disabled={!isInteractive}
      />

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-600" />
            <InlineEdit
              value={data.email}
              onChange={(val) => handleUpdate('email', val)}
              className="text-sm"
              placeholder="email@example.com"
              disabled={!isInteractive}
            />
          </div>
        )}

        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-purple-600" />
            <InlineEdit
              value={data.phone}
              onChange={(val) => handleUpdate('phone', val)}
              className="text-sm"
              placeholder="+1 234 567 8900"
              disabled={!isInteractive}
            />
          </div>
        )}

        {data.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <InlineEdit
              value={data.location}
              onChange={(val) => handleUpdate('location', val)}
              className="text-sm"
              placeholder="City, Country"
              disabled={!isInteractive}
            />
          </div>
        )}

        {/* Social Links */}
        {data.links && data.links.map((link) => (
          <div key={link.id} className="flex items-center gap-2 text-sm">
            {link.type === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
            {link.type === 'github' && <Github className="w-4 h-4 text-gray-700" />}
            {(link.type === 'website' || link.type === 'portfolio') && <Globe className="w-4 h-4 text-green-600" />}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-purple-600"
            >
              {link.label || link.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

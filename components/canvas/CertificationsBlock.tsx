'use client';

import { useResumeStore } from '@/stores';
import { InlineEdit } from './InlineEdit';
import { Award, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CertificationsData, CertificationItem } from '@/types/resume';

interface CertificationsBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function CertificationsBlock({
  sectionId,
  isInteractive,
}: CertificationsBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);

  const section = currentResume?.sections.find((s) => s.id === sectionId);
  if (!section) return null;

  const data = section.data as CertificationsData;
  const theme = currentResume!.settings.theme;

  const handleUpdateCertification = (
    certId: string,
    field: string,
    value: string
  ) => {
    const updatedCertifications = data.items.map((cert) =>
      cert.id === certId ? { ...cert, [field]: value } : cert
    );
    updateSectionData(sectionId, { items: updatedCertifications });
  };

  const handleAddCertification = () => {
    const newCertification: CertificationItem = {
      id: uuidv4(),
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      date: new Date().toISOString().split('T')[0],
      expiryDate: '',
      url: '',
    };
    updateSectionData(sectionId, {
      items: [...data.items, newCertification],
    });
  };

  const handleRemoveCertification = (certId: string) => {
    const updatedCertifications = data.items.filter(
      (cert) => cert.id !== certId
    );
    updateSectionData(sectionId, { items: updatedCertifications });
  };

  return (
    <div>
      {/* Section Header */}
      <div
        className="flex items-center gap-2 mb-4 pb-2 border-b-2"
        style={{ borderColor: theme.primaryColor }}
      >
        <Award size={24} style={{ color: theme.primaryColor }} />
        <h2
          className="text-2xl font-bold"
          style={{
            color: theme.primaryColor,
            fontFamily: theme.fontPair.heading,
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Certification Items */}
      <div className="space-y-4">
        {data.items.map((cert) => (
          <div
            key={cert.id}
            className="group relative pl-4 border-l-2 pb-3"
            style={{ borderColor: theme.primaryColor }}
          >
            {/* Delete Certification Button */}
            {isInteractive && data.items.length > 1 && (
              <button
                onClick={() => handleRemoveCertification(cert.id)}
                className="absolute -left-2 top-0 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove certification"
              >
                <Trash2 size={14} />
              </button>
            )}

            {/* Certification Name and URL */}
            <div className="flex items-center gap-2 mb-1">
              <InlineEdit
                value={cert.name}
                onChange={(value) =>
                  handleUpdateCertification(cert.id, 'name', value)
                }
                as="h3"
                className="text-lg font-bold"
                disabled={!isInteractive}
              />
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                  title="View credential"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {/* Issuer */}
            <div className="mb-1">
              <InlineEdit
                value={cert.issuer}
                onChange={(value) =>
                  handleUpdateCertification(cert.id, 'issuer', value)
                }
                as="p"
                className="font-medium text-gray-700"
                disabled={!isInteractive}
              />
            </div>

            {/* Date Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Issued: </span>
                <InlineEdit
                  value={cert.date}
                  onChange={(value) =>
                    handleUpdateCertification(cert.id, 'date', value)
                  }
                  as="span"
                  placeholder="Issue Date"
                  disabled={!isInteractive}
                />
              </div>
              {cert.expiryDate && (
                <div className="flex items-center gap-1">
                  <span>Expires: </span>
                  <InlineEdit
                    value={cert.expiryDate}
                    onChange={(value) =>
                      handleUpdateCertification(cert.id, 'expiryDate', value)
                    }
                    as="span"
                    placeholder="Expiry Date"
                    disabled={!isInteractive}
                  />
                </div>
              )}
            </div>


          </div>
        ))}
      </div>

      {/* Add Certification Button */}
      {isInteractive && (
        <button
          onClick={handleAddCertification}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
        >
          <Award size={18} />
          Add Certification
        </button>
      )}
    </div>
  );
}

'use client';

import { useResumeStore } from '@/stores';
import { X, Clock, RotateCcw, Trash2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useState } from 'react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  const versions = useResumeStore((state) => state.versions);
  const loadVersion = useResumeStore((state) => state.loadVersion);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRestore = (versionId: string) => {
    if (confirm('Are you sure you want to restore this version? Current changes will be preserved as a new version.')) {
      loadVersion(versionId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold">Version History</h2>
              <p className="text-sm text-gray-600">Resume Time Travel</p>
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
          {versions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No versions yet
              </h3>
              <p className="text-gray-600">
                Click "Save Version" in the toolbar to create your first checkpoint
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((version) => (
                  <div
                    key={version.id}
                    className={`
                      border rounded-lg p-4 transition-all
                      ${selectedVersion === version.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setSelectedVersion(version.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                            v{version.versionNumber}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDistance(new Date(version.createdAt), new Date(), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {version.message}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version.id);
                          }}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                          title="Restore this version"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {versions.length} version{versions.length !== 1 ? 's' : ''} saved
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

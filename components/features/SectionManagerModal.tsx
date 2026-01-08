'use client';

import { useState } from 'react';
import { useResumeStore } from '@/stores';
import { X, Plus, Eye, EyeOff, Edit2, Trash2, GripVertical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionType } from '@/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SortableSectionProps {
  section: any;
  onToggleVisibility: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableSection({ section, onToggleVisibility, onRename, onDelete }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-4 rounded-lg border-2 transition-all
        ${section.visible 
          ? 'bg-white border-purple-200 shadow-sm' 
          : 'bg-gray-50 border-gray-200 opacity-60'
        }
      `}
    >
      {/* Drag Handle */}
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-purple-600 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Section Info */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{section.title}</h4>
        <p className="text-xs text-gray-500 capitalize">{section.type}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleVisibility(section.id)}
          className={`
            p-2 rounded-lg transition-all
            ${section.visible
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
            }
          `}
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onRename(section.id)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Rename section"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {section.type === 'custom' && (
          <button
            onClick={() => onDelete(section.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SectionManagerModal({ isOpen, onClose }: SectionManagerModalProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const deleteSection = useResumeStore((state) => state.deleteSection);
  const addSection = useResumeStore((state) => state.addSection);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState<SectionType>('custom');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentResume) return null;

  const sections = [...currentResume.sections].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(sections, oldIndex, newIndex);
      reorderSections(reordered);
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      updateSection(sectionId, { visible: !section.visible });
    }
  };

  const handleRename = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const newTitle = prompt('Enter new title:', section.title);
      if (newTitle && newTitle.trim()) {
        updateSection(sectionId, { title: newTitle.trim() });
      }
    }
  };

  const handleDelete = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      deleteSection(sectionId);
    }
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addSection({
        type: newSectionType,
        title: newSectionTitle.trim(),
        visible: true,
        data: { items: [] } as any,
      });
      setNewSectionTitle('');
      setShowAddSection(false);
    }
  };

  const availableSectionTypes: { type: SectionType; label: string; description: string }[] = [
    { type: 'experience', label: 'Experience', description: 'Work history and achievements' },
    { type: 'education', label: 'Education', description: 'Academic background' },
    { type: 'skills', label: 'Skills', description: 'Technical and soft skills' },
    { type: 'projects', label: 'Projects', description: 'Personal or professional projects' },
    { type: 'certifications', label: 'Certifications', description: 'Licenses and certificates' },
    { type: 'languages', label: 'Languages', description: 'Language proficiency' },
    { type: 'custom', label: 'Custom Section', description: 'Create your own section' },
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
            className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-200/50">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Manage Sections
                  </h2>
                  <p className="text-sm text-gray-600">Reorder, show/hide, or customize sections</p>
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
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Drag sections to reorder them, toggle visibility with the eye icon, or rename/delete custom sections.
                </p>
              </div>

              {/* Sections List */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        onToggleVisibility={handleToggleVisibility}
                        onRename={handleRename}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add New Section */}
              <div className="mt-6">
                {!showAddSection ? (
                  <button
                    onClick={() => setShowAddSection(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add New Section</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">Add New Section</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Type
                        </label>
                        <select
                          value={newSectionType}
                          onChange={(e) => setNewSectionType(e.target.value as SectionType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          {availableSectionTypes.map((type) => (
                            <option key={type.type} value={type.type}>
                              {type.label} - {type.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={newSectionTitle}
                          onChange={(e) => setNewSectionTitle(e.target.value)}
                          placeholder="e.g., Volunteer Experience"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleAddSection}
                          disabled={!newSectionTitle.trim()}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Section
                        </button>
                        <button
                          onClick={() => {
                            setShowAddSection(false);
                            setNewSectionTitle('');
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-purple-200/50 p-6 flex justify-end">
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

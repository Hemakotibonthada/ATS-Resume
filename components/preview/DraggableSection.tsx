'use client';

import { useState } from 'react';
import { GripVertical, Trash2, Eye, EyeOff, Edit2 } from 'lucide-react';
import { useResumeStore } from '@/stores';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableSectionProps {
  sectionId: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isEditMode: boolean;
}

export function DraggableSection({ 
  sectionId, 
  children, 
  style, 
  className,
  isEditMode 
}: DraggableSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const deleteSection = useResumeStore((state) => state.deleteSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const setIsEditing = useResumeStore((state) => state.setIsEditing);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: sectionId,
    disabled: !isEditMode,
  });

  if (!currentResume) return <div style={style} className={className}>{children}</div>;

  const section = currentResume.sections.find((s) => s.id === sectionId);
  if (!section) return <div style={style} className={className}>{children}</div>;

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection(sectionId, { visible: !section.visible });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete section "${section.title}"?`)) {
      deleteSection(sectionId);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSection(sectionId);
    setIsEditing(true);
  };

  if (!isEditMode) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...dragStyle,
        position: 'relative',
        border: isEditMode ? (isHovered ? '2px dashed #9333ea' : '2px dashed #e0d4f7') : 'none',
        borderRadius: '8px',
        transition: isDragging ? transition : 'all 0.2s ease',
        backgroundColor: isDragging ? '#faf5ff' : (isEditMode && isHovered ? '#faf5ff50' : 'transparent'),
        boxShadow: isDragging ? '0 10px 40px rgba(147, 51, 234, 0.3)' : (isEditMode && isHovered ? '0 2px 8px rgba(147, 51, 234, 0.15)' : 'none'),
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edit Controls Overlay */}
      {isEditMode && isHovered && !isDragging && (
        <div
          className="absolute -top-12 left-0 right-0 flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <button
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing hover:bg-white/20 p-1.5 rounded transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm">{section.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="hover:bg-white/20 p-1.5 rounded transition-colors"
              title="Edit section content"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleVisibility}
              className="hover:bg-white/20 p-1.5 rounded transition-colors"
              title={section.visible ? 'Hide section' : 'Show section'}
            >
              {section.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
            {section.type === 'custom' && (
              <button
                onClick={handleDelete}
                className="hover:bg-red-500 p-1.5 rounded transition-colors"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Dragging Indicator */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-100/90 rounded-lg z-40">
          <div className="text-center">
            <GripVertical className="w-8 h-8 text-purple-600 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-purple-900">Moving {section.title}...</p>
          </div>
        </div>
      )}

      <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
        {children}
      </div>
    </div>
  );
}

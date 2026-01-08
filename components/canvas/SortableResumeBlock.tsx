'use client';

import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/stores';

interface SortableResumeBlockProps {
  id: string;
  children: ReactNode;
  className?: string;
  isInteractive: boolean;
}

export function SortableResumeBlock({
  id,
  children,
  className = '',
  isInteractive,
}: SortableResumeBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const deleteSection = useResumeStore((state) => state.deleteSection);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isInteractive,
  });

  if (!currentResume) return <div className={className}>{children}</div>;

  const section = currentResume.sections.find((s) => s.id === id);
  if (!section) return <div className={className}>{children}</div>;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection(id, { visible: !section.visible });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${section.title}" section?`)) {
      deleteSection(id);
    }
  };

  // Non-interactive mode (Preview Mode)
  if (!isInteractive) {
    return <div className={className}>{children}</div>;
  }

  // Interactive mode (Edit Mode)
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative transition-all duration-200
        ${isDragging ? 'opacity-50 z-50' : 'opacity-100'}
        ${className}
      `}
    >
      {/* Hover Border */}
      <div
        className={`
          absolute inset-0 -m-2 rounded-lg pointer-events-none
          transition-all duration-200
          ${
            isDragging
              ? 'border-2 border-purple-500 bg-purple-50/20'
              : 'border-2 border-dashed border-transparent group-hover:border-purple-400'
          }
        `}
      />

      {/* Control Bar */}
      <div
        className="
          absolute -top-10 left-0 right-0 z-10
          flex items-center justify-between
          bg-gradient-to-r from-purple-600 to-pink-600
          text-white px-4 py-2 rounded-t-lg shadow-lg
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none group-hover:pointer-events-auto
        "
      >
        {/* Left: Drag Handle + Title */}
        <div className="flex items-center gap-3">
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing hover:bg-white/20 p-1 rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm">{section.title}</span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
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

      {/* Dragging Indicator */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-100/90 rounded-lg backdrop-blur-sm z-20">
          <div className="text-center">
            <GripVertical className="w-10 h-10 text-purple-600 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-purple-900">
              Moving {section.title}...
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-0 ${isDragging ? 'pointer-events-none' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

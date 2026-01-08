'use client';

import { useState, useRef, useEffect } from 'react';
import { GripVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { useResumeStore } from '@/stores';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const deleteSection = useResumeStore((state) => state.deleteSection);

  if (!currentResume) return <div style={style} className={className}>{children}</div>;

  const section = currentResume.sections.find((s) => s.id === sectionId);
  if (!section) return <div style={style} className={className}>{children}</div>;

  const handleDragStart = (e: React.DragEvent) => {
    if (!isEditMode) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId === sectionId) return;

    const sections = [...currentResume.sections].sort((a, b) => a.order - b.order);
    const draggedIndex = sections.findIndex((s) => s.id === draggedId);
    const targetIndex = sections.findIndex((s) => s.id === sectionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const draggedSection = sections[draggedIndex];
    sections.splice(draggedIndex, 1);
    sections.splice(targetIndex, 0, draggedSection);

    reorderSections(sections);
  };

  const handleToggleVisibility = () => {
    updateSection(sectionId, { visible: !section.visible });
  };

  const handleDelete = () => {
    if (confirm(`Delete section "${section.title}"?`)) {
      deleteSection(sectionId);
    }
  };

  if (!isEditMode) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        cursor: isEditMode ? 'move' : 'default',
        border: isHovered ? '2px dashed #9333ea' : '2px dashed transparent',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
      }}
      className={className}
    >
      {/* Edit Controls Overlay */}
      {isEditMode && isHovered && (
        <div
          className="absolute -top-10 right-0 flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-lg shadow-lg z-50"
          style={{ fontSize: '12px' }}
        >
          <GripVertical className="w-4 h-4 cursor-grab" />
          <span className="font-medium text-xs">{section.title}</span>
          <button
            onClick={handleToggleVisibility}
            className="hover:bg-purple-700 p-1 rounded transition-colors"
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {section.type === 'custom' && (
            <button
              onClick={handleDelete}
              className="hover:bg-red-600 p-1 rounded transition-colors"
              title="Delete section"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

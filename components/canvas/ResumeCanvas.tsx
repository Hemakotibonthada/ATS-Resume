'use client';

import { useResumeStore } from '@/stores';
import { SortableResumeBlock } from './SortableResumeBlock';
import { HeaderBlock } from './HeaderBlock';
import { SummaryBlock } from './SummaryBlock';
import { ExperienceBlock } from './ExperienceBlock';
import { SkillsBlock } from './SkillsBlock';
import { EducationBlock } from './EducationBlock';
import { ProjectsBlock } from './ProjectsBlock';
import { CertificationsBlock } from './CertificationsBlock';
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
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export function ResumeCanvas() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const isInteractiveMode = useResumeStore((state) => state.isInteractiveMode);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No resume loaded. Create or select a resume to begin.</p>
      </div>
    );
  }

  const { sections, settings } = currentResume;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const sectionIds = visibleSections.map((s) => s.id);

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = visibleSections.findIndex((s) => s.id === active.id);
      const newIndex = visibleSections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(visibleSections, oldIndex, newIndex);
        reorderSections(reordered);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Section Component Renderer
  const renderSectionContent = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return null;

    switch (section.type) {
      case 'contact':
        return (
          <HeaderBlock sectionId={sectionId} isInteractive={isInteractiveMode} />
        );
      case 'summary':
        return (
          <SummaryBlock sectionId={sectionId} isInteractive={isInteractiveMode} />
        );
      case 'experience':
        return (
          <ExperienceBlock
            sectionId={sectionId}
            isInteractive={isInteractiveMode}
          />
        );
      case 'education':
        return (
          <EducationBlock
            sectionId={sectionId}
            isInteractive={isInteractiveMode}
          />
        );
      case 'projects':
        return (
          <ProjectsBlock
            sectionId={sectionId}
            isInteractive={isInteractiveMode}
          />
        );
      case 'certifications':
        return (
          <CertificationsBlock
            sectionId={sectionId}
            isInteractive={isInteractiveMode}
          />
        );
      case 'skills':
        return (
          <SkillsBlock sectionId={sectionId} isInteractive={isInteractiveMode} />
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-500">
              Section type "{section.type}" not yet implemented in canvas mode.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Zoom Controls */}
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-purple-50 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} className="text-purple-600" />
        </button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-purple-50 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="text-purple-600" />
        </button>
        <div className="h-px bg-gray-200" />
        <button
          onClick={handleResetZoom}
          className="p-2 hover:bg-purple-50 rounded transition-colors"
          title="Reset Zoom"
        >
          <Maximize2 size={20} className="text-purple-600" />
        </button>
      </div>

      {/* Resume Container with Zoom */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div
          className="a4-page mx-auto print-exact"
          style={{
            backgroundColor: settings.theme.backgroundColor,
            color: settings.theme.textColor,
            fontFamily: settings.theme.fontPair.body,
          }}
        >
          {/* Interactive Mode Indicator */}
          {isInteractiveMode && (
            <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
              <span className="font-semibold">🎨 Interactive Mode</span>
              <span className="text-xs opacity-90">
                Click to edit • Drag to reorder
              </span>
            </div>
          )}

      <div
        style={{
          padding: `${settings.layout.margins.top}mm ${settings.layout.margins.right}mm ${settings.layout.margins.bottom + 5}mm ${settings.layout.margins.left}mm`,
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            {visibleSections.map((section) => (
              <SortableResumeBlock
                key={section.id}
                id={section.id}
                isInteractive={isInteractiveMode}
                className="mb-6"
              >
                {renderSectionContent(section.id)}
              </SortableResumeBlock>
            ))}
          </SortableContext>
        </DndContext>

        {/* Empty State */}
        {visibleSections.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No visible sections</p>
            <p className="text-sm">Add sections to build your resume</p>
          </div>
        )}
      </div>
    </div>
      </div>
    </>
  );
}

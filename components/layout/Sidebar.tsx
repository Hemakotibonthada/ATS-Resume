'use client';

import { useResumeStore } from '@/stores';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Languages,
  FolderOpen,
  Award,
  Plus,
  GripVertical,
  Settings
} from 'lucide-react';
import { SectionType, ResumeSection } from '@/types';
import { SectionManagerModal } from '@/components/features/SectionManagerModal';
import { analyzeATS } from '@/lib/atsChecker';

const sectionIcons: Record<SectionType, any> = {
  contact: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code,
  languages: Languages,
  projects: FolderOpen,
  certifications: Award,
  custom: Plus,
};

interface SortableSectionItemProps {
  section: ResumeSection;
  isActive: boolean;
  onClick: () => void;
}

function SortableSectionItem({ section, isActive, onClick }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = sectionIcons[section.type] || FileText;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 group"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ x: 2 }}
    >
      <button
        {...listeners}
        {...attributes}
        className="p-1.5 text-gray-400 hover:text-purple-600 cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      
      <button
        onClick={onClick}
        className={`
          flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium shadow-md' 
            : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
          }
        `}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{section.title}</span>
      </button>
    </motion.div>
  );
}

export function Sidebar() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const addSection = useResumeStore((state) => state.addSection);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const [showSectionManager, setShowSectionManager] = useState(false);

  // Calculate resume score dynamically
  const resumeScore = useMemo(() => {
    if (!currentResume) return 0;
    const analysis = analyzeATS(currentResume);
    return analysis.score;
  }, [currentResume]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentResume) return null;

  const sections = currentResume.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(sections, oldIndex, newIndex);
      reorderSections(reordered);
    }
  };

  const handleAddSection = () => {
    // Show a dialog to select section type
    const sectionType = prompt('Enter section type (experience, education, skills, etc.):');
    if (sectionType) {
      addSection({
        type: sectionType as SectionType,
        visible: true,
        title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
        data: { items: [] } as any,
      });
    }
  };

  return (
    <>
      <div className="w-64 border-r border-gray-200 bg-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Sections
            </h2>
            <button
              onClick={() => setShowSectionManager(true)}
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
              title="Manage Sections"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={handleAddSection}
          className="w-full flex items-center gap-3 px-3 py-2 mt-4 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      <div className="border-t border-gray-200 p-4 mt-auto">
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">Resume Score</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(resumeScore)}`} 
                style={{ width: `${resumeScore}%` }} 
              />
            </div>
            <span className="font-medium">{resumeScore}%</span>
          </div>
          <p className="text-xs mt-1 text-gray-400">
            {resumeScore >= 80 && '✓ Excellent'}
            {resumeScore >= 60 && resumeScore < 80 && '⚠ Good'}
            {resumeScore < 60 && '⚠ Needs work'}
          </p>
        </div>
      </div>
    </div>

    <SectionManagerModal
      isOpen={showSectionManager}
      onClose={() => setShowSectionManager(false)}
    />
  </>
  );
}

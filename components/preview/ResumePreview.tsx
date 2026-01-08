'use client';

import { useResumeStore } from '@/stores';
import { ContactData, SummaryData, ExperienceData, EducationData, SkillsData, LanguagesData, ProjectsData, CertificationsData, CustomData, ExperienceItem, EducationItem, ProjectItem, CertificationItem } from '@/types';
import { formatDateRange } from '@/lib/dateUtils';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Award, Code2, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContactQRCode } from '@/components/features/QRCodeGenerator';
import { getTemplate, templates } from '@/lib/templates';
import ReactMarkdown from 'react-markdown';
import { DraggableSection } from './DraggableSection';
import { SpaceOptimizedPreview } from './SpaceOptimizedPreview';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';

interface ResumePreviewProps {
  resume?: any;
  isEditMode?: boolean;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export function ResumePreview({ 
  resume: passedResume,
  isEditMode: passedEditMode,
  zoom: passedZoom,
  onZoomIn,
  onZoomOut,
  onResetZoom
}: ResumePreviewProps = {}) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const previewEditMode = useResumeStore((state) => state.previewEditMode);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const updateResume = useResumeStore((state) => state.updateResume);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Use passed props if available, otherwise use store
  const finalResume = passedResume || currentResume;
  const isEditMode = passedEditMode !== undefined ? passedEditMode : previewEditMode;
  const finalZoom = passedZoom !== undefined ? passedZoom : zoom;

  const handleZoomIn = onZoomIn || (() => setZoom((prev) => Math.min(prev + 0.1, 2)));
  const handleZoomOut = onZoomOut || (() => setZoom((prev) => Math.max(prev - 0.1, 0.5)));
  const handleResetZoom = onResetZoom || (() => setZoom(1));

  const handlePreviousTemplate = () => {
    if (!finalResume) return;
    const currentIndex = templates.findIndex(t => t.id === (finalResume.templateId || 'modern'));
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : templates.length - 1;
    updateResume({ ...finalResume, templateId: templates[previousIndex].id });
  };

  const handleNextTemplate = () => {
    if (!finalResume) return;
    const currentIndex = templates.findIndex(t => t.id === (finalResume.templateId || 'modern'));
    const nextIndex = currentIndex < templates.length - 1 ? currentIndex + 1 : 0;
    updateResume({ ...finalResume, templateId: templates[nextIndex].id });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!finalResume) {
    return <div>No resume to preview</div>;
  }

  const { sections, settings, templateId } = finalResume;
  const template = getTemplate(templateId || 'modern');
  const visibleSections = sections
    .filter((s: any) => s.visible)
    .sort((a: any, b: any) => a.order - b.order);

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = visibleSections.findIndex((s: any) => s.id === active.id);
      const newIndex = visibleSections.findIndex((s: any) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(visibleSections, oldIndex, newIndex) as any;
        reorderSections(reordered);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Log for debugging
  console.log('Current templateId:', templateId, 'Template:', template.id);

  // Template Navigation Component - Arrows on preview sides
  const TemplateNavigationArrows = () => {
    const currentIndex = templates.findIndex(t => t.id === template.id);
    return (
      <>
        {/* Left Arrow */}
        <button
          onClick={handlePreviousTemplate}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-purple-50 rounded-full p-4 shadow-2xl border border-gray-200 transition-all hover:scale-110 z-40 group"
          title={`Previous: ${templates[currentIndex > 0 ? currentIndex - 1 : templates.length - 1].name}`}
        >
          <ChevronLeft size={32} className="text-purple-600" />
        </button>
        
        {/* Right Arrow */}
        <button
          onClick={handleNextTemplate}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-purple-50 rounded-full p-4 shadow-2xl border border-gray-200 transition-all hover:scale-110 z-40 group"
          title={`Next: ${templates[currentIndex < templates.length - 1 ? currentIndex + 1 : 0].name}`}
        >
          <ChevronRight size={32} className="text-purple-600" />
        </button>

        {/* Template Info Badge */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-4 py-2 z-40 flex items-center gap-2">
          <span className="text-xl">{template.preview}</span>
          <div className="text-sm font-medium text-gray-700">{template.name}</div>
          <span className="text-xs text-gray-500">({currentIndex + 1}/{templates.length})</span>
        </div>
      </>
    );
  };

  // DevOps template uses special layout
  if (template.id === 'devops') {
    return (
      <>
        <DevOpsTemplatePreview resume={finalResume} isEditMode={isEditMode} zoom={finalZoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
      </>
    );
  }

  // Single page template uses compact layout
  if (template.id === 'single-page') {
    return (
      <>
        <SinglePageTemplatePreview resume={finalResume} isEditMode={isEditMode} zoom={finalZoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
      </>
    );
  }

  // Timeline Career template
  if (template.id === 'timeline-style') {
    return (
      <>
        <TimelineTemplatePreview resume={finalResume} isEditMode={isEditMode} zoom={finalZoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
      </>
    );
  }

  // Bold Professional template
  if (template.id === 'bold-professional') {
    return (
      <>
        <BoldProfessionalPreview resume={finalResume} isEditMode={isEditMode} zoom={finalZoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
      </>
    );
  }

  // Elegant Modern template
  if (template.id === 'elegant-modern') {
    return (
      <>
        <ElegantModernPreview resume={finalResume} isEditMode={isEditMode} zoom={finalZoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
      </>
    );
  }

  // Space Optimized template
  if (template.id === 'space-optimized') {
    return (
      <>
        <SpaceOptimizedPreview resume={finalResume} isEditMode={isEditMode} zoom={finalZoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
      </>
    );
  }

  // Apply template-specific spacing
  const spacingMap = {
    compact: '12px',
    normal: '20px',
    relaxed: '32px',
  };
  const sectionSpacing = spacingMap[template.style.spacing];

  const sectionIds = visibleSections.map((s: any) => s.id);

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
      {/* Edit Mode Indicator */}
      {previewEditMode && (
        <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <span className="font-semibold">✨ Edit Mode Active</span>
          <span className="text-xs opacity-90">Hover sections to edit • Drag to reorder</span>
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
            {visibleSections.map((section: any) => (
              <DraggableSection
                key={section.id}
                sectionId={section.id}
                style={{ marginBottom: sectionSpacing }}
                className={template.style.sectionStyle === 'card' ? 'p-4 bg-gray-50 rounded-lg' : ''}
                isEditMode={previewEditMode}
              >
                {section.type === 'contact' && <ContactPreview data={section.data as ContactData} theme={settings.theme} />}
                {section.type === 'summary' && <SummaryPreview data={section.data as SummaryData} theme={settings.theme} title={section.title} />}
                {section.type === 'experience' && <ExperiencePreview data={section.data as ExperienceData} theme={settings.theme} title={section.title} />}
                {section.type === 'education' && <EducationPreview data={section.data as EducationData} theme={settings.theme} title={section.title} />}
                {section.type === 'skills' && <SkillsPreview data={section.data as SkillsData} theme={settings.theme} title={section.title} />}
                {section.type === 'projects' && <ProjectsPreview data={section.data as ProjectsData} theme={settings.theme} title={section.title} />}
                {section.type === 'certifications' && <CertificationsPreview data={section.data as CertificationsData} theme={settings.theme} title={section.title} />}
                {section.type === 'custom' && <CustomSectionPreview data={section.data as CustomData} title={section.title} theme={settings.theme} />}
              </DraggableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
      </div>
    </>
  );
}

// DevOps Template - Two column with circular photo
function DevOpsTemplatePreview({ resume, isEditMode, zoom, onZoomIn, onZoomOut, onResetZoom }: { resume: any; isEditMode: boolean; zoom: number; onZoomIn: () => void; onZoomOut: () => void; onResetZoom: () => void }) {
  const { sections, settings } = resume;
  const visibleSections = sections.filter((s: any) => s.visible).sort((a: any, b: any) => a.order - b.order);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleSections.findIndex((s: any) => s.id === active.id);
      const newIndex = visibleSections.findIndex((s: any) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(visibleSections, oldIndex, newIndex);
        reorderSections(reordered as any);
      }
    }
  };
  
  const contactSection = visibleSections.find((s: any) => s.type === 'contact');
  const summarySection = visibleSections.find((s: any) => s.type === 'summary');
  const experienceSection = visibleSections.find((s: any) => s.type === 'experience');
  const educationSection = visibleSections.find((s: any) => s.type === 'education');
  const skillsSection = visibleSections.find((s: any) => s.type === 'skills');
  const projectsSection = visibleSections.find((s: any) => s.type === 'projects');
  const certificationsSection = visibleSections.find((s: any) => s.type === 'certifications');
  
  const contactData = contactSection?.data as ContactData;
  const getInitials = () => {
    if (!contactData?.fullName) return 'JD';
    const names = contactData.fullName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Zoom Controls */}
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-purple-50 rounded transition-colors" title="Zoom In">
          <ZoomIn size={20} className="text-purple-600" />
        </button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">{Math.round(zoom * 100)}%</div>
        <button onClick={onZoomOut} className="p-2 hover:bg-purple-50 rounded transition-colors" title="Zoom Out">
          <ZoomOut size={20} className="text-purple-600" />
        </button>
        <div className="h-px bg-gray-200" />
        <button onClick={onResetZoom} className="p-2 hover:bg-purple-50 rounded transition-colors" title="Reset Zoom">
          <Maximize2 size={20} className="text-purple-600" />
        </button>
      </div>
      {isEditMode && (
        <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <span className="font-semibold">✨ Edit Mode Active</span>
          <span className="text-xs opacity-90">Hover sections to edit • Drag to reorder</span>
        </div>
      )}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleSections.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
            <div
              className="a4-page mx-auto print-exact"
              style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                fontFamily: settings.theme.fontPair.body,
              }}
            >
              <div style={{ 
                padding: `${settings.layout.margins.top}mm ${settings.layout.margins.right}mm ${settings.layout.margins.bottom + 5}mm ${settings.layout.margins.left}mm` 
              }}>
        
        {/* Header with Name, Title, Contact and Photo */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-1" style={{ color: '#1e293b', fontFamily: settings.theme.fontPair.heading }}>
              {contactData?.fullName || 'YOUR NAME'}
            </h1>
            <p className="text-lg mb-3" style={{ color: settings.theme.primaryColor || '#0ea5e9' }}>
              {contactData?.title || 'Your Professional Title'}
            </p>
            
            {/* Contact Info Row */}
            <div className="flex items-center gap-4 text-xs flex-wrap">
              {contactData?.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" style={{ color: settings.theme.primaryColor }} />
                  <span>{contactData.phone}</span>
                </div>
              )}
              {contactData?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" style={{ color: settings.theme.primaryColor }} />
                  <span>{contactData.email}</span>
                </div>
              )}
              {contactData?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" style={{ color: settings.theme.primaryColor }} />
                  <span>{contactData.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Circular Photo Placeholder */}
          <div 
            className="flex-shrink-0 ml-6"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: settings.theme.primaryColor || '#0ea5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {getInitials()}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            
            {/* Summary */}
            {summarySection && (
              <DraggableSection sectionId={summarySection.id} isEditMode={isEditMode}>
                <div>
                  <h2 className="text-sm font-bold mb-2 pb-1 border-b-2 border-black uppercase">
                    {summarySection.title}
                  </h2>
                  <div className="text-xs leading-relaxed">
                    <ReactMarkdown>{(summarySection.data as SummaryData).content}</ReactMarkdown>
                  </div>
                </div>
              </DraggableSection>
            )}

            {/* Experience */}
            {experienceSection && (
              <DraggableSection sectionId={experienceSection.id} isEditMode={isEditMode}>
                <div>
                  <h2 className="text-sm font-bold mb-2 pb-1 border-b-2 border-black uppercase">
                    {experienceSection.title}
                  </h2>
                  <div className="space-y-3">
                    {(experienceSection.data as ExperienceData).items.map((item: ExperienceItem) => (
                      <div key={item.id}>
                        <div className="mb-1">
                          <h3 className="text-sm font-bold">{item.position}</h3>
                          <div className="flex items-center justify-between text-xs">
                            <span style={{ color: settings.theme.primaryColor }}>{item.company}</span>
                            <span className="text-gray-600">
                              {formatDateRange(item.startDate, item.endDate, item.current)}
                            </span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                        {item.highlights && item.highlights.length > 0 && (
                          <ul className="ml-3 space-y-0.5 text-xs">
                            {item.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1.5">•</span>
                                <span className="flex-1">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DraggableSection>
            )}

            {/* Education */}
            {educationSection && (
              <DraggableSection sectionId={educationSection.id} isEditMode={isEditMode}>
                <div>
                  <h2 className="text-sm font-bold mb-2 pb-1 border-b-2 border-black uppercase">
                    {educationSection.title}
                  </h2>
                  <div className="space-y-2">
                    {(educationSection.data as EducationData).items.map((item: EducationItem) => (
                      <div key={item.id}>
                        <h3 className="text-xs font-bold">{item.degree}</h3>
                        <div className="text-xs" style={{ color: settings.theme.primaryColor }}>
                          {item.institution}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatDateRange(item.startDate, item.endDate)} • {item.location}
                        </div>
                        {item.gpa && <div className="text-xs text-gray-600">GPA: {item.gpa}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </DraggableSection>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            
            {/* Projects */}
            {projectsSection && (
              <DraggableSection sectionId={projectsSection.id} isEditMode={isEditMode}>
                <div>
                  <h2 className="text-sm font-bold mb-2 pb-1 border-b-2 border-black uppercase">
                    {projectsSection.title}
                  </h2>
                  <div className="space-y-2">
                    {(projectsSection.data as ProjectsData).items.map((item: ProjectItem) => (
                      <div key={item.id}>
                        <h3 className="text-xs font-bold">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs leading-relaxed mb-1">{item.description}</p>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Tech:</span> {item.technologies.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DraggableSection>
            )}

            {/* Skills */}
            {skillsSection && (
              <DraggableSection sectionId={skillsSection.id} isEditMode={isEditMode}>
                <div>
                  <h2 className="text-sm font-bold mb-2 pb-1 border-b-2 border-black uppercase">
                    {skillsSection.title}
                  </h2>
                  <div className="space-y-2">
                    {(skillsSection.data as SkillsData).categories.map((category) => (
                      <div key={category.id}>
                        <div className="flex flex-wrap gap-1.5">
                          {category.skills.map((skill) => {
                            const getLevelDots = () => {
                              const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
                              const dots = levels[skill.level as keyof typeof levels] || 2;
                              return (
                                <div className="flex items-center gap-0.5 ml-1">
                                  {[1, 2, 3, 4].map((i) => (
                                    <div
                                      key={i}
                                      className="w-1 h-1 rounded-full"
                                      style={{
                                        backgroundColor: i <= dots ? settings.theme.primaryColor : '#d1d5db',
                                      }}
                                    />
                                  ))}
                                </div>
                              );
                            };
                            
                            return (
                              <div
                                key={skill.id}
                                className="flex items-center px-2 py-0.5 text-xs rounded"
                                style={{
                                  backgroundColor: settings.theme.primaryColor + '15',
                                  color: settings.theme.primaryColor,
                                  border: `1px solid ${settings.theme.primaryColor}40`,
                                }}
                              >
                                <span>{skill.name}</span>
                                {skill.level && getLevelDots()}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DraggableSection>
            )}

            {/* Certifications */}
            {certificationsSection && (
              <DraggableSection sectionId={certificationsSection.id} isEditMode={isEditMode}>
                <div>
                  <h2 className="text-sm font-bold mb-2 pb-1 border-b-2 border-black uppercase">
                    {certificationsSection.title}
                  </h2>
                  <div className="space-y-1.5">
                    {(certificationsSection.data as CertificationsData).items.map((item: CertificationItem) => (
                      <div key={item.id} className="text-xs">
                        <h3 className="font-bold">{item.name}</h3>
                        <div className="text-gray-600">{item.issuer} • {item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </DraggableSection>
            )}
          </div>
        </div>
      </div>
    </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

// Standard template previews below...

function ContactPreview({ data, theme }: { data: ContactData; theme: any }) {
  const iconMap: Record<string, any> = {
    linkedin: Linkedin,
    github: Github,
    website: Globe,
    portfolio: Globe,
    custom: Globe,
  };

  return (
    <div className="text-center border-b pb-6" style={{ borderColor: theme.primaryColor + '30' }}>
      <h1
        className="text-4xl font-bold mb-2"
        style={{
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
        }}
      >
        {data.fullName || 'Your Name'}
      </h1>
      <p className="text-xl mb-4" style={{ color: theme.secondaryColor }}>
        {data.title || 'Your Professional Title'}
      </p>

      <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{data.location}</span>
          </div>
        )}
      </div>

      {data.links && data.links.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {data.links.map((link) => {
              const Icon = iconMap[link.type];
              return (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex items-center gap-1 text-sm hover:underline"
                  style={{ color: theme.primaryColor }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
          
          {data.links.some((link) => link.showQR) && (
            <div className="flex items-center justify-center gap-4 mt-3 print:mt-2">
              {data.links
                .filter((link) => link.showQR)
                .map((link) => (
                  <ContactQRCode key={link.id} label={link.label} url={link.url} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryPreview({ data, theme, title }: { data: SummaryData; theme: any; title: string }) {
  if (!data.content) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function ExperiencePreview({ data, theme, title }: { data: ExperienceData; theme: any; title: string }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="space-y-5">
        {data.items.map((item) => (
          <div key={item.id} className="relative pl-6">
            <div className="absolute left-0 top-2 w-3 h-3 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
            
            <div className="mb-2">
              <h3 className="text-lg font-bold">{item.position}</h3>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-medium" style={{ color: theme.primaryColor }}>
                  {item.company}
                </span>
                <span className="text-sm text-gray-600">
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </span>
              </div>
              {item.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            {item.highlights && item.highlights.length > 0 && (
              <ul className="ml-4 space-y-1.5 text-sm text-gray-700">
                {item.highlights.map((highlight, idx) => (
                  <li key={idx} className="list-disc">
                    <ReactMarkdown className="inline">{highlight}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}

            {item.skills && item.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: theme.primaryColor + '15',
                      color: theme.primaryColor,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationPreview({ data, theme, title }: { data: EducationData; theme: any; title: string }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id}>
            <h3 className="text-lg font-bold">{item.degree}</h3>
            <div className="font-medium" style={{ color: theme.primaryColor }}>
              {item.institution}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {formatDateRange(item.startDate, item.endDate)} • {item.location}
            </div>
            {item.gpa && (
              <div className="text-sm text-gray-600">GPA: {item.gpa}</div>
            )}
            {item.honors && (
              <div className="text-sm italic text-gray-700">{item.honors}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsPreview({ data, theme, title }: { data: SkillsData; theme: any; title: string }) {
  if (!data.categories || data.categories.length === 0) return null;

  const getLevelDots = (level?: string) => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const dots = levels[level as keyof typeof levels] || 2;
    return (
      <div className="flex items-center gap-0.5 ml-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i <= dots ? theme.primaryColor : '#d1d5db',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="space-y-4">
        {data.categories.map((category) => (
          <div key={category.id}>
            <h3 className="font-semibold mb-2" style={{ color: theme.secondaryColor }}>
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center px-3 py-1.5 text-sm rounded-full"
                  style={{
                    backgroundColor: theme.primaryColor + '15',
                    color: theme.primaryColor,
                    border: `1px solid ${theme.primaryColor}40`,
                  }}
                >
                  <span>{skill.name}</span>
                  {skill.level && getLevelDots(skill.level)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPreview({ data, theme, title }: { data: ProjectsData; theme: any; title: string }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">{item.name}</h3>
              {item.url && (
                <a href={item.url} className="text-sm" style={{ color: theme.primaryColor }}>
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-700 mt-1">{item.description}</p>
            )}
            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: theme.primaryColor + '15',
                      color: theme.primaryColor,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsPreview({ data, theme, title }: { data: CertificationsData; theme: any; title: string }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="space-y-3">
        {data.items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Award className="w-5 h-5 mt-0.5" style={{ color: theme.primaryColor }} />
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <div className="text-sm text-gray-600">
                {item.issuer} • {item.date}
              </div>
              {item.credentialId && (
                <div className="text-xs text-gray-500">ID: {item.credentialId}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomSectionPreview({ data, title, theme }: { data: CustomData; title: string; theme: any }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
        {title}
      </h2>
      <div className="text-gray-700">
        {JSON.stringify(data.content)}
      </div>
    </div>
  );
}

// Single Page Template Preview - Compact and perfectly aligned
function SinglePageTemplatePreview({ 
  resume, 
  isEditMode = false,
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onResetZoom
}: { 
  resume: any;
  isEditMode?: boolean;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}) {
  const { sections, settings } = resume;
  const theme = settings.theme;
  const margins = settings.layout.margins;
  const { reorderSections } = useResumeStore();
  
  const visibleSections = sections
    .filter((s: any) => s.visible)
    .sort((a: any, b: any) => a.order - b.order);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleSections.findIndex((s: any) => s.id === active.id);
      const newIndex = visibleSections.findIndex((s: any) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(visibleSections, oldIndex, newIndex);
        reorderSections(reordered as any);
      }
    }
  };

  return (
    <>
      {/* Zoom Controls */}
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-purple-50 rounded transition-colors" title="Zoom In">
          <ZoomIn size={20} className="text-purple-600" />
        </button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">{Math.round(zoom * 100)}%</div>
        <button onClick={onZoomOut} className="p-2 hover:bg-purple-50 rounded transition-colors" title="Zoom Out">
          <ZoomOut size={20} className="text-purple-600" />
        </button>
        <div className="h-px bg-gray-200" />
        <button onClick={onResetZoom} className="p-2 hover:bg-purple-50 rounded transition-colors" title="Reset Zoom">
          <Maximize2 size={20} className="text-purple-600" />
        </button>
      </div>
      {isEditMode && (
        <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <span className="font-semibold">✨ Edit Mode Active</span>
          <span className="text-xs opacity-90">Hover sections to edit • Drag to reorder</span>
        </div>
      )}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleSections.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
            <div
              className="a4-page mx-auto print-exact bg-white"
              style={{
                width: `${settings.layout.pageSize.width}mm`,
                minHeight: `${settings.layout.pageSize.height}mm`,
                padding: `10mm 12mm 10mm 12mm`,
                fontFamily: theme.fontPair.body,
                fontSize: '9.5px',
                lineHeight: '1.3',
              }}
            >
      {/* Compact Header */}
      {visibleSections.find((s: any) => s.type === 'contact') && (
        <SinglePageContactPreview 
          data={visibleSections.find((s: any) => s.type === 'contact').data} 
          theme={theme}
        />
      )}

      {/* Professional Summary */}
      {visibleSections.find((s: any) => s.type === 'summary') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'summary').id} isEditMode={isEditMode}>
          <SinglePageSummaryPreview 
            data={visibleSections.find((s: any) => s.type === 'summary').data} 
            title={visibleSections.find((s: any) => s.type === 'summary').title}
            theme={theme}
          />
        </DraggableSection>
      )}

      {/* Experience */}
      {visibleSections.find((s: any) => s.type === 'experience') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'experience').id} isEditMode={isEditMode}>
          <SinglePageExperiencePreview 
            data={visibleSections.find((s: any) => s.type === 'experience').data} 
            title={visibleSections.find((s: any) => s.type === 'experience').title}
            theme={theme}
          />
        </DraggableSection>
      )}

      {/* Skills */}
      {visibleSections.find((s: any) => s.type === 'skills') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'skills').id} isEditMode={isEditMode}>
          <SinglePageSkillsPreview 
            data={visibleSections.find((s: any) => s.type === 'skills').data} 
            title={visibleSections.find((s: any) => s.type === 'skills').title}
            theme={theme}
          />
        </DraggableSection>
      )}

      {/* Education */}
      {visibleSections.find((s: any) => s.type === 'education') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'education').id} isEditMode={isEditMode}>
          <SinglePageEducationPreview 
            data={visibleSections.find((s: any) => s.type === 'education').data} 
            title={visibleSections.find((s: any) => s.type === 'education').title}
            theme={theme}
          />
        </DraggableSection>
      )}

      {/* Projects */}
      {visibleSections.find((s: any) => s.type === 'projects') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'projects').id} isEditMode={isEditMode}>
          <SinglePageProjectsPreview 
            data={visibleSections.find((s: any) => s.type === 'projects').data} 
            title={visibleSections.find((s: any) => s.type === 'projects').title}
            theme={theme}
          />
        </DraggableSection>
      )}

      {/* Certifications */}
      {visibleSections.find((s: any) => s.type === 'certifications') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'certifications').id} isEditMode={isEditMode}>
          <SinglePageCertificationsPreview 
            data={visibleSections.find((s: any) => s.type === 'certifications').data} 
            title={visibleSections.find((s: any) => s.type === 'certifications').title}
            theme={theme}
          />
        </DraggableSection>
      )}

      {/* Languages */}
      {visibleSections.find((s: any) => s.type === 'languages') && (
        <DraggableSection sectionId={visibleSections.find((s: any) => s.type === 'languages').id} isEditMode={isEditMode}>
          <SinglePageLanguagesPreview 
            data={visibleSections.find((s: any) => s.type === 'languages').data} 
            title={visibleSections.find((s: any) => s.type === 'languages').title}
            theme={theme}
          />
        </DraggableSection>
      )}
    </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

// Single Page Contact Section
function SinglePageContactPreview({ data, theme }: { data: ContactData; theme: any }) {
  return (
    <div className="text-center mb-0 pb-0.5" style={{ borderBottom: `2px solid ${theme.primaryColor}` }}>
      {/* Name */}
      <h1 
        className="text-3xl font-bold mb-0" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          letterSpacing: '0.5px'
        }}
      >
        {data.fullName}
      </h1>

      {/* Title */}
      {data.title && (
        <p className="text-sm font-medium mb-0.5" style={{ color: theme.secondaryColor }}>
          {data.title}
        </p>
      )}

      {/* Contact Info - Compact Single Line */}
      <div className="flex justify-center items-center gap-3 text-xs" style={{ color: '#555' }}>
        {data.email && (
          <span className="flex items-center gap-1">
            <Mail size={12} />
            {data.email}
          </span>
        )}
        {data.phone && (
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {data.phone}
          </span>
        )}
        {data.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {data.location}
          </span>
        )}
        {data.links?.find(l => l.type === 'linkedin') && (
          <span className="flex items-center gap-1">
            <Linkedin size={12} />
            LinkedIn
          </span>
        )}
        {data.links?.find(l => l.type === 'github') && (
          <span className="flex items-center gap-1">
            <Github size={12} />
            GitHub
          </span>
        )}
      </div>
    </div>
  );
}

// Single Page Summary Section
function SinglePageSummaryPreview({ data, title, theme }: { data: SummaryData; title: string; theme: any }) {
  return (
    <div className="mb-2.5">
      <h2 
        className="text-xs font-bold mb-1 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '1px'
        }}
      >
        {title}
      </h2>
      <p className="text-xs" style={{ color: '#333', textAlign: 'justify', lineHeight: '1.25' }}>
        {data.content}
      </p>
    </div>
  );
}

// Single Page Experience Section
function SinglePageExperiencePreview({ data, title, theme }: { data: ExperienceData; title: string; theme: any }) {
  return (
    <div className="mb-2.5">
      <h2 
        className="text-xs font-bold mb-1.5 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '1px'
        }}
      >
        {title}
      </h2>
      <div className="space-y-2">
        {data.items.map((item: ExperienceItem, idx: number) => (
          <div key={idx}>
            <div className="flex justify-between items-baseline mb-0.5">
              <div>
                <span className="font-bold text-xs" style={{ color: theme.secondaryColor }}>
                  {item.position}
                </span>
                <span className="text-xs mx-1.5" style={{ color: '#666' }}>•</span>
                <span className="text-xs font-medium" style={{ color: '#444' }}>
                  {item.company}
                </span>
                {item.location && (
                  <>
                    <span className="text-xs mx-1.5" style={{ color: '#666' }}>•</span>
                    <span className="text-xs" style={{ color: '#666' }}>
                      {item.location}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs italic" style={{ color: '#666' }}>
                {formatDateRange(item.startDate, item.endDate, item.current)}
              </span>
            </div>
            {item.description && (
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                {item.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} className="text-xs" style={{ color: '#333', lineHeight: '1.3' }}>
                    {line.trim().replace(/^[-•]\s*/, '')}
                  </li>
                ))}
              </ul>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                {item.highlights.map((highlight, hidx) => (
                  <li key={hidx} className="text-xs" style={{ color: '#333', lineHeight: '1.3' }}>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Page Skills Section
function SinglePageSkillsPreview({ data, title, theme }: { data: SkillsData; title: string; theme: any }) {
  const getLevelDots = (level: string) => {
    const levels: { [key: string]: number } = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };
    const count = levels[level.toLowerCase()] || 2;
    return (
      <div className="flex gap-0.5 ml-1.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i < count ? theme.primaryColor : '#d1d5db'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-4">
      <h2 
        className="text-sm font-bold mb-2 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '2px'
        }}
      >
        {title}
      </h2>
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px'
        }}
      >
        {data.categories.map((category, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-xs mb-1" style={{ color: theme.secondaryColor }}>
              {category.name}
            </h3>
            <div className="space-y-0.5">
              {category.skills.map((skill, sidx) => (
                <div key={sidx} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#444' }}>{skill.name}</span>
                  {getLevelDots(skill.level || 'intermediate')}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Page Education Section
function SinglePageEducationPreview({ data, title, theme }: { data: EducationData; title: string; theme: any }) {
  return (
    <div className="mb-4">
      <h2 
        className="text-sm font-bold mb-2 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '2px'
        }}
      >
        {title}
      </h2>
      <div className="space-y-1.5">
        {data.items.map((item: EducationItem, idx: number) => (
          <div key={idx} className="flex justify-between items-baseline">
            <div>
              <span className="font-bold text-xs" style={{ color: theme.secondaryColor }}>
                {item.degree}
              </span>
              {item.field && (
                <>
                  <span className="text-xs mx-1.5" style={{ color: '#666' }}>in</span>
                  <span className="text-xs font-medium" style={{ color: '#444' }}>
                    {item.field}
                  </span>
                </>
              )}
              <span className="text-xs mx-1.5" style={{ color: '#666' }}>•</span>
              <span className="text-xs" style={{ color: '#444' }}>
                {item.institution}
              </span>
              {item.gpa && (
                <>
                  <span className="text-xs mx-1.5" style={{ color: '#666' }}>•</span>
                  <span className="text-xs" style={{ color: '#666' }}>
                    GPA: {item.gpa}
                  </span>
                </>
              )}
            </div>
            <span className="text-xs italic" style={{ color: '#666' }}>
              {formatDateRange(item.startDate, item.endDate, false)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Page Projects Section
function SinglePageProjectsPreview({ data, title, theme }: { data: ProjectsData; title: string; theme: any }) {
  return (
    <div className="mb-4">
      <h2 
        className="text-sm font-bold mb-2 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '2px'
        }}
      >
        {title}
      </h2>
      <div className="space-y-2">
        {data.items.map((item: ProjectItem, idx: number) => (
          <div key={idx}>
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="font-bold text-xs" style={{ color: theme.secondaryColor }}>
                {item.name}
              </span>
              {item.startDate && (
                <span className="text-xs italic" style={{ color: '#666' }}>
                  {formatDateRange(item.startDate, item.endDate || null, false)}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs leading-snug" style={{ color: '#444' }}>
                {item.description}
              </p>
            )}
            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-0.5">
                {item.technologies.map((tech, tidx) => (
                  <span 
                    key={tidx} 
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor,
                      fontSize: '9px'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Page Certifications Section
function SinglePageCertificationsPreview({ data, title, theme }: { data: CertificationsData; title: string; theme: any }) {
  return (
    <div className="mb-4">
      <h2 
        className="text-sm font-bold mb-2 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '2px'
        }}
      >
        {title}
      </h2>
      <div className="space-y-1">
        {data.items.map((item: CertificationItem, idx: number) => (
          <div key={idx} className="flex justify-between items-baseline">
            <div>
              <span className="font-bold text-xs" style={{ color: theme.secondaryColor }}>
                {item.name}
              </span>
              <span className="text-xs mx-1.5" style={{ color: '#666' }}>•</span>
              <span className="text-xs" style={{ color: '#444' }}>
                {item.issuer}
              </span>
            </div>
            {item.date && (
              <span className="text-xs italic" style={{ color: '#666' }}>
                {item.date}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Page Languages Section
function SinglePageLanguagesPreview({ data, title, theme }: { data: LanguagesData; title: string; theme: any }) {
  return (
    <div className="mb-3">
      <h2 
        className="text-sm font-bold mb-1.5 uppercase tracking-wide" 
        style={{ 
          color: theme.primaryColor,
          fontFamily: theme.fontPair.heading,
          borderBottom: `1px solid ${theme.primaryColor}`,
          paddingBottom: '2px'
        }}
      >
        {title}
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
        {data.items.map((item, idx) => (
          <span key={idx} className="text-xs" style={{ color: '#444' }}>
            <span className="font-semibold">{item.language}</span>
            <span className="mx-1.5" style={{ color: '#666' }}>•</span>
            <span style={{ color: '#666' }}>{item.proficiency}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Timeline Career Template - Left sidebar with timeline markers
function TimelineTemplatePreview({ resume, isEditMode, zoom, onZoomIn, onZoomOut, onResetZoom }: { resume: any; isEditMode: boolean; zoom: number; onZoomIn: () => void; onZoomOut: () => void; onResetZoom: () => void }) {
  const { sections, settings } = resume;
  const theme = settings.theme;
  const visibleSections = sections.filter((s: any) => s.visible).sort((a: any, b: any) => a.order - b.order);
  const reorderSections = useResumeStore((state) => state.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = visibleSections.findIndex((s: any) => s.id === active.id);
      const newIndex = visibleSections.findIndex((s: any) => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(arrayMove(visibleSections, oldIndex, newIndex) as any);
      }
    }
  };

  const contactSection = visibleSections.find((s: any) => s.type === 'contact');
  const contactData = contactSection?.data as ContactData;

  return (
    <>
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-purple-50 rounded transition-colors"><ZoomIn size={20} className="text-purple-600" /></button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">{Math.round(zoom * 100)}%</div>
        <button onClick={onZoomOut} className="p-2 hover:bg-purple-50 rounded transition-colors"><ZoomOut size={20} className="text-purple-600" /></button>
        <div className="h-px bg-gray-200" />
        <button onClick={onResetZoom} className="p-2 hover:bg-purple-50 rounded transition-colors"><Maximize2 size={20} className="text-purple-600" /></button>
      </div>
      {isEditMode && (
        <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <span className="font-semibold">✨ Edit Mode Active</span>
        </div>
      )}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleSections.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="a4-page mx-auto print-exact bg-white" style={{ fontFamily: theme.fontPair.body, padding: '20mm' }}>
              <div className="flex items-start gap-6 mb-6 pb-6 border-b-2" style={{ borderColor: theme.primaryColor }}>
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold" style={{ backgroundColor: theme.primaryColor + '20', color: theme.primaryColor }}>
                    {contactData?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2" style={{ color: theme.textColor, fontFamily: theme.fontPair.heading }}>{contactData?.fullName || 'Your Name'}</h1>
                  <p className="text-xl mb-3" style={{ color: theme.primaryColor }}>{contactData?.title || 'Your Title'}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {contactData?.email && <div className="flex items-center gap-2"><Mail size={16} />{contactData.email}</div>}
                    {contactData?.phone && <div className="flex items-center gap-2"><Phone size={16} />{contactData.phone}</div>}
                    {contactData?.location && <div className="flex items-center gap-2"><MapPin size={16} />{contactData.location}</div>}
                  </div>
                </div>
              </div>
              <div className="relative pl-8 border-l-4" style={{ borderColor: theme.primaryColor + '40' }}>
                {visibleSections.filter((s: any) => s.type !== 'contact').map((section: any) => (
                  <DraggableSection key={section.id} sectionId={section.id} isEditMode={isEditMode}>
                    <div className="relative mb-8">
                      <div className="absolute -left-10 w-6 h-6 rounded-full border-4 border-white" style={{ backgroundColor: theme.primaryColor }} />
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-3" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>{section.title}</h2>
                        {section.type === 'summary' && <div className="prose"><ReactMarkdown>{(section.data as SummaryData).content}</ReactMarkdown></div>}
                        {section.type === 'experience' && <ExperiencePreview data={section.data} theme={theme} title="" />}
                        {section.type === 'education' && <EducationPreview data={section.data} theme={theme} title="" />}
                        {section.type === 'skills' && <SkillsPreview data={section.data} theme={theme} title="" />}
                        {section.type === 'projects' && <ProjectsPreview data={section.data} theme={theme} title="" />}
                      </div>
                    </div>
                  </DraggableSection>
                ))}
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

// Bold Professional Template
function BoldProfessionalPreview({ resume, isEditMode, zoom, onZoomIn, onZoomOut, onResetZoom }: { resume: any; isEditMode: boolean; zoom: number; onZoomIn: () => void; onZoomOut: () => void; onResetZoom: () => void }) {
  const { sections, settings } = resume;
  const theme = settings.theme;
  const visibleSections = sections.filter((s: any) => s.visible).sort((a: any, b: any) => a.order - b.order);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { const oldIndex = visibleSections.findIndex((s: any) => s.id === active.id); const newIndex = visibleSections.findIndex((s: any) => s.id === over.id); if (oldIndex !== -1 && newIndex !== -1) { reorderSections(arrayMove(visibleSections, oldIndex, newIndex) as any); }}};
  const contactSection = visibleSections.find((s: any) => s.type === 'contact');
  const contactData = contactSection?.data as ContactData;

  return (
    <>
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-purple-50 rounded transition-colors"><ZoomIn size={20} className="text-purple-600" /></button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">{Math.round(zoom * 100)}%</div>
        <button onClick={onZoomOut} className="p-2 hover:bg-purple-50 rounded transition-colors"><ZoomOut size={20} className="text-purple-600" /></button>
        <div className="h-px bg-gray-200" />
        <button onClick={onResetZoom} className="p-2 hover:bg-purple-50 rounded transition-colors"><Maximize2 size={20} className="text-purple-600" /></button>
      </div>
      {isEditMode && <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse"><span className="font-semibold">✨ Edit Mode Active</span></div>}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleSections.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="a4-page mx-auto print-exact bg-white">
              <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 text-white p-8 pb-12">
                <div className="flex items-start justify-between">
                  <div><h1 className="text-5xl font-bold mb-2" style={{ fontFamily: theme.fontPair.heading }}>{contactData?.fullName || 'Your Name'}</h1><p className="text-2xl opacity-90">{contactData?.title || 'Your Title'}</p></div>
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center"><span className="text-4xl font-bold" style={{ color: theme.primaryColor }}>{contactData?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'}</span></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: theme.primaryColor }} />
              </div>
              <div className="bg-gray-100 px-8 py-4 flex justify-center gap-8 text-sm border-b">
                {contactData?.email && <div className="flex items-center gap-2"><Mail size={16} />{contactData.email}</div>}
                {contactData?.phone && <div className="flex items-center gap-2"><Phone size={16} />{contactData.phone}</div>}
                {contactData?.location && <div className="flex items-center gap-2"><MapPin size={16} />{contactData.location}</div>}
              </div>
              <div className="grid grid-cols-3 gap-6 p-8">
                <div className="col-span-2 space-y-6">{visibleSections.filter((s: any) => ['summary', 'experience', 'projects'].includes(s.type)).map((section: any) => (<DraggableSection key={section.id} sectionId={section.id} isEditMode={isEditMode}><div className="mb-6"><h2 className="text-2xl font-bold mb-4 pb-2 border-b-4" style={{ color: theme.textColor, borderColor: theme.primaryColor, fontFamily: theme.fontPair.heading }}>{section.title}</h2>{section.type === 'summary' && <div className="prose"><ReactMarkdown>{(section.data as SummaryData).content}</ReactMarkdown></div>}{section.type === 'experience' && <ExperiencePreview data={section.data} theme={theme} title="" />}{section.type === 'projects' && <ProjectsPreview data={section.data} theme={theme} title="" />}</div></DraggableSection>))}</div>
                <div className="space-y-6">{visibleSections.filter((s: any) => ['skills', 'education', 'certifications'].includes(s.type)).map((section: any) => (<DraggableSection key={section.id} sectionId={section.id} isEditMode={isEditMode}><div className="mb-6"><h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}>{section.title}</h3>{section.type === 'skills' && <SkillsPreview data={section.data} theme={theme} title="" />}{section.type === 'education' && <EducationPreview data={section.data} theme={theme} title="" />}</div></DraggableSection>))}</div>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

// Elegant Modern Template
function ElegantModernPreview({ resume, isEditMode, zoom, onZoomIn, onZoomOut, onResetZoom }: { resume: any; isEditMode: boolean; zoom: number; onZoomIn: () => void; onZoomOut: () => void; onResetZoom: () => void }) {
  const { sections, settings } = resume;
  const theme = settings.theme;
  const visibleSections = sections.filter((s: any) => s.visible).sort((a: any, b: any) => a.order - b.order);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { const oldIndex = visibleSections.findIndex((s: any) => s.id === active.id); const newIndex = visibleSections.findIndex((s: any) => s.id === over.id); if (oldIndex !== -1 && newIndex !== -1) { reorderSections(arrayMove(visibleSections, oldIndex, newIndex) as any); }}};
  const contactSection = visibleSections.find((s: any) => s.type === 'contact');
  const contactData = contactSection?.data as ContactData;

  return (
    <>
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-purple-50 rounded transition-colors"><ZoomIn size={20} className="text-purple-600" /></button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">{Math.round(zoom * 100)}%</div>
        <button onClick={onZoomOut} className="p-2 hover:bg-purple-50 rounded transition-colors"><ZoomOut size={20} className="text-purple-600" /></button>
        <div className="h-px bg-gray-200" />
        <button onClick={onResetZoom} className="p-2 hover:bg-purple-50 rounded transition-colors"><Maximize2 size={20} className="text-purple-600" /></button>
      </div>
      {isEditMode && <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse"><span className="font-semibold">✨ Edit Mode Active</span></div>}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleSections.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="a4-page mx-auto print-exact bg-white" style={{ fontFamily: theme.fontPair.body, padding: '25mm' }}>
              <div className="text-center mb-10 pb-8 border-b" style={{ borderColor: theme.primaryColor }}>
                <div className="mb-4"><div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-4" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>{contactData?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'}</div></div>
                <h1 className="text-5xl font-light mb-3 tracking-wide" style={{ color: theme.textColor, fontFamily: theme.fontPair.heading }}>{contactData?.fullName || 'Your Name'}</h1>
                <p className="text-xl mb-4 font-light" style={{ color: theme.primaryColor }}>{contactData?.title || 'Your Title'}</p>
                <div className="flex justify-center gap-6 text-sm">
                  {contactData?.email && <div className="flex items-center gap-2"><Mail size={14} />{contactData.email}</div>}
                  {contactData?.phone && <div className="flex items-center gap-2"><Phone size={14} />{contactData.phone}</div>}
                  {contactData?.location && <div className="flex items-center gap-2"><MapPin size={14} />{contactData.location}</div>}
                </div>
              </div>
              <div className="space-y-10">{visibleSections.filter((s: any) => s.type !== 'contact').map((section: any) => (<DraggableSection key={section.id} sectionId={section.id} isEditMode={isEditMode}><div><h2 className="text-2xl font-light mb-6 pb-2 border-b tracking-wide" style={{ color: theme.primaryColor, borderColor: theme.primaryColor + '40', fontFamily: theme.fontPair.heading }}>{section.title}</h2><div className="pl-4">{section.type === 'summary' && <div className="prose leading-relaxed"><ReactMarkdown>{(section.data as SummaryData).content}</ReactMarkdown></div>}{section.type === 'experience' && <ExperiencePreview data={section.data} theme={theme} title="" />}{section.type === 'education' && <EducationPreview data={section.data} theme={theme} title="" />}{section.type === 'skills' && <SkillsPreview data={section.data} theme={theme} title="" />}{section.type === 'projects' && <ProjectsPreview data={section.data} theme={theme} title="" />}</div></div></DraggableSection>))}</div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}


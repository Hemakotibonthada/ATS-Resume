import React from 'react';
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ZoomIn, ZoomOut, Maximize2, Mail, Phone, MapPin, Linkedin, Github, Globe, Award } from 'lucide-react';
import { useResumeStore } from '@/stores';
import { DraggableSection } from './DraggableSection';
import { ContactData, SummaryData, ExperienceData, ExperienceItem, EducationData, EducationItem, SkillsData, ProjectsData, ProjectItem, CertificationsData, CertificationItem } from '@/types';

function formatDateRange(startDate: string, endDate: string | null, current: boolean) {
  if (!startDate) return '';
  const start = new Date(startDate);
  const startStr = `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getFullYear()}`;
  if (current) return `${startStr} - Present`;
  if (!endDate) return startStr;
  const end = new Date(endDate);
  const endStr = `${end.toLocaleDateString('en-US', { month: 'short' })} ${end.getFullYear()}`;
  return `${startStr} - ${endStr}`;
}

export function SpaceOptimizedPreview({ 
  resume, 
  isEditMode, 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onResetZoom 
}: { 
  resume: any; 
  isEditMode: boolean; 
  zoom: number; 
  onZoomIn: () => void; 
  onZoomOut: () => void; 
  onResetZoom: () => void;
}) {
  const { sections, settings } = resume;
  const theme = settings.theme;
  const visibleSections = sections.filter((s: any) => s.visible).sort((a: any, b: any) => a.order - b.order);
  const reorderSections = useResumeStore((state: any) => state.reorderSections);
  
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
  const summarySection = visibleSections.find((s: any) => s.type === 'summary');
  const experienceSection = visibleSections.find((s: any) => s.type === 'experience');
  const educationSection = visibleSections.find((s: any) => s.type === 'education');
  const skillsSection = visibleSections.find((s: any) => s.type === 'skills');
  const projectsSection = visibleSections.find((s: any) => s.type === 'projects');
  const certificationsSection = visibleSections.find((s: any) => s.type === 'certifications');
  
  const contactData = contactSection?.data as ContactData;

  return (
    <>
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-purple-50 rounded transition-colors">
          <ZoomIn size={20} className="text-purple-600" />
        </button>
        <div className="text-xs text-center font-medium text-gray-600 py-1">{Math.round(zoom * 100)}%</div>
        <button onClick={onZoomOut} className="p-2 hover:bg-purple-50 rounded transition-colors">
          <ZoomOut size={20} className="text-purple-600" />
        </button>
        <div className="h-px bg-gray-200" />
        <button onClick={onResetZoom} className="p-2 hover:bg-purple-50 rounded transition-colors">
          <Maximize2 size={20} className="text-purple-600" />
        </button>
      </div>
      
      {isEditMode && (
        <div className="fixed top-20 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <span className="font-semibold">✨ Edit Mode Active</span>
        </div>
      )}
      
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleSections.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
            <div 
              className="a4-page mx-auto print-exact bg-white" 
              style={{ 
                fontFamily: theme.fontPair.body, 
                fontSize: '9.5px', 
                lineHeight: '1.35', 
                padding: '12mm 15mm' 
              }}
            >
              
              {/* Ultra-Compact Header */}
              <div className="text-center mb-3 pb-2" style={{ borderBottom: `2px solid ${theme.primaryColor}` }}>
                <h1 
                  className="text-2xl font-bold mb-0.5" 
                  style={{ 
                    color: theme.primaryColor, 
                    fontFamily: theme.fontPair.heading, 
                    letterSpacing: '0.5px' 
                  }}
                >
                  {contactData?.fullName || 'Your Name'}
                </h1>
                {contactData?.title && (
                  <p className="text-xs font-medium mb-1.5" style={{ color: theme.secondaryColor }}>
                    {contactData.title}
                  </p>
                )}
                <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-0.5 text-[8.5px]" style={{ color: '#555' }}>
                  {contactData?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={10} />
                      {contactData.email}
                    </span>
                  )}
                  {contactData?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={10} />
                      {contactData.phone}
                    </span>
                  )}
                  {contactData?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      {contactData.location}
                    </span>
                  )}
                  {contactData?.links?.map((link: any) => (
                    <span key={link.id} className="flex items-center gap-1">
                      {link.type === 'linkedin' && <Linkedin size={10} />}
                      {link.type === 'github' && <Github size={10} />}
                      {link.type === 'website' && <Globe size={10} />}
                      {link.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Two-Column Layout for Maximum Space Efficiency */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                
                {/* Main Content Column */}
                <div className="space-y-2.5">
                  
                  {/* Summary */}
                  {summarySection && (
                    <DraggableSection sectionId={summarySection.id} isEditMode={isEditMode}>
                      <div>
                        <h2 
                          className="text-[10px] font-bold mb-1 uppercase tracking-wide pb-0.5" 
                          style={{ 
                            color: theme.primaryColor, 
                            borderBottom: `1px solid ${theme.primaryColor}` 
                          }}
                        >
                          {summarySection.title}
                        </h2>
                        <p className="text-[8.5px] leading-snug" style={{ textAlign: 'justify' }}>
                          {(summarySection.data as SummaryData).content}
                        </p>
                      </div>
                    </DraggableSection>
                  )}

                  {/* Experience */}
                  {experienceSection && (
                    <DraggableSection sectionId={experienceSection.id} isEditMode={isEditMode}>
                      <div>
                        <h2 
                          className="text-[10px] font-bold mb-1.5 uppercase tracking-wide pb-0.5" 
                          style={{ 
                            color: theme.primaryColor, 
                            borderBottom: `1px solid ${theme.primaryColor}` 
                          }}
                        >
                          {experienceSection.title}
                        </h2>
                        <div className="space-y-2">
                          {(experienceSection.data as ExperienceData).items.map((item: ExperienceItem) => (
                            <div key={item.id} className="relative pl-2 border-l border-gray-300">
                              <div className="flex justify-between items-start mb-0.5">
                                <div className="flex-1">
                                  <div className="font-bold text-[9px]" style={{ color: theme.secondaryColor }}>
                                    {item.position}
                                  </div>
                                  <div className="text-[8.5px] font-medium">
                                    {item.company}
                                    {item.location && ` • ${item.location}`}
                                  </div>
                                </div>
                                <div className="text-[8px] italic text-gray-600 ml-2 flex-shrink-0">
                                  {formatDateRange(item.startDate, item.endDate, item.current)}
                                </div>
                              </div>
                              {item.description && (
                                <ul className="list-disc list-inside space-y-0.5 ml-1 text-[8.5px]" style={{ lineHeight: '1.3' }}>
                                  {item.description.split('\n').filter((line: any) => line.trim()).map((line: any, i: any) => (
                                    <li key={i}>{line.trim().replace(/^[-•]\s*/, '')}</li>
                                  ))}
                                </ul>
                              )}
                              {item.highlights && item.highlights.length > 0 && (
                                <ul className="list-disc list-inside space-y-0.5 ml-1 text-[8.5px]" style={{ lineHeight: '1.3' }}>
                                  {item.highlights.map((highlight: any, idx: any) => (
                                    <li key={idx}>{highlight}</li>
                                  ))}
                                </ul>
                              )}
                              {item.skills && item.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.skills.slice(0, 8).map((skill: any, idx: any) => (
                                    <span 
                                      key={idx} 
                                      className="text-[7.5px] px-1.5 py-0.5 rounded" 
                                      style={{ 
                                        backgroundColor: `${theme.primaryColor}15`, 
                                        color: theme.primaryColor 
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
                    </DraggableSection>
                  )}

                  {/* Projects */}
                  {projectsSection && (
                    <DraggableSection sectionId={projectsSection.id} isEditMode={isEditMode}>
                      <div>
                        <h2 
                          className="text-[10px] font-bold mb-1.5 uppercase tracking-wide pb-0.5" 
                          style={{ 
                            color: theme.primaryColor, 
                            borderBottom: `1px solid ${theme.primaryColor}` 
                          }}
                        >
                          {projectsSection.title}
                        </h2>
                        <div className="space-y-1.5">
                          {(projectsSection.data as ProjectsData).items.map((item: ProjectItem) => (
                            <div key={item.id}>
                              <div className="font-bold text-[9px]" style={{ color: theme.secondaryColor }}>
                                {item.name}
                              </div>
                              {item.description && (
                                <p className="text-[8.5px] leading-snug mt-0.5">{item.description}</p>
                              )}
                              {item.technologies && item.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {item.technologies.map((tech: any, idx: any) => (
                                    <span 
                                      key={idx} 
                                      className="text-[7.5px] px-1.5 py-0.5 rounded" 
                                      style={{ 
                                        backgroundColor: `${theme.primaryColor}15`, 
                                        color: theme.primaryColor 
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
                    </DraggableSection>
                  )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-2.5">
                  
                  {/* Skills */}
                  {skillsSection && (
                    <DraggableSection sectionId={skillsSection.id} isEditMode={isEditMode}>
                      <div>
                        <h2 
                          className="text-[10px] font-bold mb-1.5 uppercase tracking-wide pb-0.5" 
                          style={{ 
                            color: theme.primaryColor, 
                            borderBottom: `1px solid ${theme.primaryColor}` 
                          }}
                        >
                          {skillsSection.title}
                        </h2>
                        <div className="flex flex-wrap gap-1">
                          {(skillsSection.data as SkillsData).categories.map((category: any) => 
                            category.skills.map((skill: any) => (
                              <span 
                                key={skill.id} 
                                className="text-[7.5px] px-1.5 py-0.5 rounded" 
                                style={{ 
                                  backgroundColor: `${theme.primaryColor}15`, 
                                  color: theme.primaryColor 
                                }}
                              >
                                {skill.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </DraggableSection>
                  )}

                  {/* Education */}
                  {educationSection && (
                    <DraggableSection sectionId={educationSection.id} isEditMode={isEditMode}>
                      <div>
                        <h2 
                          className="text-[10px] font-bold mb-1.5 uppercase tracking-wide pb-0.5" 
                          style={{ 
                            color: theme.primaryColor, 
                            borderBottom: `1px solid ${theme.primaryColor}` 
                          }}
                        >
                          {educationSection.title}
                        </h2>
                        <div className="space-y-1.5">
                          {(educationSection.data as EducationData).items.map((item: EducationItem) => (
                            <div key={item.id}>
                              <div className="font-bold text-[8.5px]" style={{ color: theme.secondaryColor }}>
                                {item.degree}
                              </div>
                              {item.field && <div className="text-[8px] font-medium">{item.field}</div>}
                              <div className="text-[8px]">{item.institution}</div>
                              <div className="text-[7.5px] text-gray-600">
                                {formatDateRange(item.startDate, item.endDate, false)}
                                {item.gpa && ` • GPA: ${item.gpa}`}
                              </div>
                              {item.honors && (
                                <div className="text-[7.5px] italic text-gray-700 mt-0.5">{item.honors}</div>
                              )}
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
                        <h2 
                          className="text-[10px] font-bold mb-1.5 uppercase tracking-wide pb-0.5" 
                          style={{ 
                            color: theme.primaryColor, 
                            borderBottom: `1px solid ${theme.primaryColor}` 
                          }}
                        >
                          {certificationsSection.title}
                        </h2>
                        <div className="space-y-1">
                          {(certificationsSection.data as CertificationsData).items.map((item: CertificationItem) => (
                            <div key={item.id} className="flex items-start gap-1.5">
                              <Award size={10} className="flex-shrink-0 mt-0.5" style={{ color: theme.primaryColor }} />
                              <div>
                                <div className="font-bold text-[8.5px]">{item.name}</div>
                                <div className="text-[7.5px] text-gray-600">
                                  {item.issuer} • {item.date}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DraggableSection>
                  )}
                </div>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

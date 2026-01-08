'use client';

import { useResumeStore } from '@/stores';
import { InlineEdit } from './InlineEdit';
import { Code, ExternalLink, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectsData, ProjectItem } from '@/types/resume';

interface ProjectsBlockProps {
  sectionId: string;
  isInteractive: boolean;
}

export function ProjectsBlock({ sectionId, isInteractive }: ProjectsBlockProps) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionData = useResumeStore((state) => state.updateSectionData);

  const section = currentResume?.sections.find((s) => s.id === sectionId);
  if (!section) return null;

  const data = section.data as ProjectsData;
  const theme = currentResume!.settings.theme;

  const handleUpdateProject = (projId: string, field: string, value: any) => {
    const updatedProjects = data.items.map((proj) =>
      proj.id === projId ? { ...proj, [field]: value } : proj
    );
    updateSectionData(sectionId, { items: updatedProjects });
  };

  const handleAddHighlight = (projId: string) => {
    const updatedProjects = data.items.map((proj) =>
      proj.id === projId
        ? { ...proj, highlights: [...proj.highlights, ''] }
        : proj
    );
    updateSectionData(sectionId, { items: updatedProjects });
  };

  const handleUpdateHighlight = (
    projId: string,
    highlightIndex: number,
    value: string
  ) => {
    const updatedProjects = data.items.map((proj) =>
      proj.id === projId
        ? {
            ...proj,
            highlights: proj.highlights.map((h, i) =>
              i === highlightIndex ? value : h
            ),
          }
        : proj
    );
    updateSectionData(sectionId, { items: updatedProjects });
  };

  const handleRemoveHighlight = (projId: string, highlightIndex: number) => {
    const updatedProjects = data.items.map((proj) =>
      proj.id === projId
        ? {
            ...proj,
            highlights: proj.highlights.filter((_, i) => i !== highlightIndex),
          }
        : proj
    );
    updateSectionData(sectionId, { items: updatedProjects });
  };

  const handleAddTechnology = (projId: string, tech: string) => {
    const project = data.items.find((p) => p.id === projId);
    if (!project || !tech.trim()) return;

    const updatedProjects = data.items.map((proj) =>
      proj.id === projId
        ? { ...proj, technologies: [...proj.technologies, tech.trim()] }
        : proj
    );
    updateSectionData(sectionId, { items: updatedProjects });
  };

  const handleRemoveTechnology = (projId: string, techIndex: number) => {
    const updatedProjects = data.items.map((proj) =>
      proj.id === projId
        ? {
            ...proj,
            technologies: proj.technologies.filter((_, i) => i !== techIndex),
          }
        : proj
    );
    updateSectionData(sectionId, { items: updatedProjects });
  };

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: uuidv4(),
      name: 'Project Name',
      description: 'Brief description of the project',
      technologies: [],
      url: '',
      startDate: '',
      endDate: null,
      highlights: [''],
    };
    updateSectionData(sectionId, {
      items: [...data.items, newProject],
    });
  };

  const handleRemoveProject = (projId: string) => {
    const updatedProjects = data.items.filter((proj) => proj.id !== projId);
    updateSectionData(sectionId, { items: updatedProjects });
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: theme.primaryColor }}>
        <Code size={24} style={{ color: theme.primaryColor }} />
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor, fontFamily: theme.fontPair.heading }}>
          {section.title}
        </h2>
      </div>

      {/* Project Items */}
      <div className="space-y-6">
        {data.items.map((project) => (
          <div
            key={project.id}
            className="group relative pl-4 border-l-2"
            style={{ borderColor: theme.primaryColor }}
          >
            {/* Delete Project Button */}
            {isInteractive && data.items.length > 1 && (
              <button
                onClick={() => handleRemoveProject(project.id)}
                className="absolute -left-2 top-0 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove project"
              >
                <Trash2 size={14} />
              </button>
            )}

            {/* Project Name and URL */}
            <div className="flex items-center gap-2 mb-2">
              <InlineEdit
                value={project.name}
                onChange={(value) => handleUpdateProject(project.id, 'name', value)}
                as="h3"
                className="text-lg font-bold"
                disabled={!isInteractive}
              />
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {/* Description */}
            <div className="mb-2">
              <InlineEdit
                value={project.description}
                onChange={(value) => handleUpdateProject(project.id, 'description', value)}
                as="p"
                multiline
                className="text-gray-700"
                disabled={!isInteractive}
              />
            </div>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200 flex items-center gap-1"
                  >
                    <InlineEdit
                      value={tech}
                      onChange={(value) => {
                        const updatedProjects = data.items.map((proj) =>
                          proj.id === project.id
                            ? {
                                ...proj,
                                technologies: proj.technologies.map((t, i) =>
                                  i === techIndex ? value : t
                                ),
                              }
                            : proj
                        );
                        updateSectionData(sectionId, { items: updatedProjects });
                      }}
                      as="span"
                      disabled={!isInteractive}
                    />
                    {isInteractive && (
                      <button
                        onClick={() => handleRemoveTechnology(project.id, techIndex)}
                        className="text-purple-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {isInteractive && (
                  <input
                    type="text"
                    placeholder="+ Add tech"
                    className="px-2 py-1 text-sm border border-dashed border-gray-300 rounded-full focus:outline-none focus:border-purple-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleAddTechnology(project.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                )}
              </div>
            )}

            {/* Highlights/Bullet Points */}
            {project.highlights.length > 0 && (
              <ul className="list-disc list-inside space-y-1 mt-2">
                {project.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex} className="group/bullet relative pl-2">
                    {isInteractive && (
                      <button
                        onClick={() => handleRemoveHighlight(project.id, highlightIndex)}
                        className="absolute -left-6 top-1 text-red-500 opacity-0 group-hover/bullet:opacity-100 transition-opacity hover:text-red-700"
                        title="Remove highlight"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                    <InlineEdit
                      value={highlight}
                      onChange={(value) => handleUpdateHighlight(project.id, highlightIndex, value)}
                      as="span"
                      multiline
                      placeholder="Project highlight or achievement"
                      disabled={!isInteractive}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* Add Highlight Button */}
            {isInteractive && (
              <button
                onClick={() => handleAddHighlight(project.id)}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                + Add highlight
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Project Button */}
      {isInteractive && (
        <button
          onClick={handleAddProject}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
        >
          <Code size={18} />
          Add Project
        </button>
      )}
    </div>
  );
}

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Resume, ResumeSection, ResumeVersion } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ResumeStore {
  // Current resume
  currentResume: Resume | null;
  
  // Version history
  versions: ResumeVersion[];
  
  // Editor state
  activeSection: string | null;
  isEditing: boolean;
  previewEditMode: boolean;
  
  // Actions
  createResume: (title: string) => void;
  loadResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
  
  // Section actions
  addSection: (section: Omit<ResumeSection, 'id' | 'order'>) => void;
  updateSection: (sectionId: string, updates: Partial<ResumeSection>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  
  // Editor actions
  setActiveSection: (sectionId: string | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  setPreviewEditMode: (enabled: boolean) => void;
  
  // Version control
  saveVersion: (message: string) => void;
  loadVersion: (versionId: string) => void;
  getVersions: () => ResumeVersion[];
  
  // Export
  exportResume: () => Resume | null;
}

const createDefaultResume = (title: string): Resume => ({
  id: uuidv4(),
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    title,
    description: '',
    tags: [],
  },
  settings: {
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      accentColor: '#f59e0b',
      fontPair: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
    layout: {
      pageSize: 'A4',
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
      lineHeight: 1.5,
      sectionSpacing: 16,
    },
    atsMode: false,
  },
  sections: [
    {
      id: uuidv4(),
      type: 'contact',
      order: 0,
      visible: true,
      title: 'Contact',
      data: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        links: [],
      },
    },
    {
      id: uuidv4(),
      type: 'summary',
      order: 1,
      visible: true,
      title: 'Professional Summary',
      data: {
        content: '',
      },
    },
    {
      id: uuidv4(),
      type: 'experience',
      order: 2,
      visible: true,
      title: 'Work Experience',
      data: {
        items: [],
      },
    },
    {
      id: uuidv4(),
      type: 'education',
      order: 3,
      visible: true,
      title: 'Education',
      data: {
        items: [],
      },
    },
    {
      id: uuidv4(),
      type: 'skills',
      order: 4,
      visible: true,
      title: 'Skills',
      data: {
        categories: [],
      },
    },
  ],
  templateId: 'modern', // Default template
});

export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentResume: null,
        versions: [],
        activeSection: null,
        isEditing: false,
        previewEditMode: false,

        createResume: (title: string) => {
          const newResume = createDefaultResume(title);
          set({ currentResume: newResume });
        },

        loadResume: (resume: Resume) => {
          set({ currentResume: resume });
        },

        updateResume: (updates: Partial<Resume>) => {
          set((state) => {
            if (!state.currentResume) return state;
            return {
              currentResume: {
                ...state.currentResume,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        addSection: (section) => {
          set((state) => {
            if (!state.currentResume) return state;
            
            const newSection: ResumeSection = {
              ...section,
              id: uuidv4(),
              order: state.currentResume.sections.length,
            };

            return {
              currentResume: {
                ...state.currentResume,
                sections: [...state.currentResume.sections, newSection],
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        updateSection: (sectionId: string, updates: Partial<ResumeSection>) => {
          set((state) => {
            if (!state.currentResume) return state;

            return {
              currentResume: {
                ...state.currentResume,
                sections: state.currentResume.sections.map((section) =>
                  section.id === sectionId
                    ? { ...section, ...updates }
                    : section
                ),
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        deleteSection: (sectionId: string) => {
          set((state) => {
            if (!state.currentResume) return state;

            const filteredSections = state.currentResume.sections
              .filter((section) => section.id !== sectionId)
              .map((section, index) => ({ ...section, order: index }));

            return {
              currentResume: {
                ...state.currentResume,
                sections: filteredSections,
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        reorderSections: (sections: ResumeSection[]) => {
          set((state) => {
            if (!state.currentResume) return state;

            const reorderedSections = sections.map((section, index) => ({
              ...section,
              order: index,
            }));

            return {
              currentResume: {
                ...state.currentResume,
                sections: reorderedSections,
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        setActiveSection: (sectionId: string | null) => {
          set({ activeSection: sectionId });
        },

        setIsEditing: (isEditing: boolean) => {
          set({ isEditing });
        },

        setPreviewEditMode: (enabled: boolean) => {
          set({ previewEditMode: enabled });
        },

        saveVersion: (message: string) => {
          set((state) => {
            if (!state.currentResume) return state;

            const newVersion: ResumeVersion = {
              id: uuidv4(),
              resumeId: state.currentResume.id,
              versionNumber: state.versions.length + 1,
              createdAt: new Date().toISOString(),
              message,
              snapshot: JSON.parse(JSON.stringify(state.currentResume)),
            };

            return {
              versions: [...state.versions, newVersion],
              currentResume: {
                ...state.currentResume,
                version: state.currentResume.version + 1,
              },
            };
          });
        },

        loadVersion: (versionId: string) => {
          set((state) => {
            const version = state.versions.find((v) => v.id === versionId);
            if (!version) return state;

            return {
              currentResume: JSON.parse(JSON.stringify(version.snapshot)),
            };
          });
        },

        getVersions: () => {
          return get().versions;
        },

        exportResume: () => {
          return get().currentResume;
        },
      }),
      {
        name: 'resume-storage',
        partialize: (state) => ({
          currentResume: state.currentResume,
          versions: state.versions,
        }),
      }
    )
  )
);

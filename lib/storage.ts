import { Resume } from '@/types';

const STORAGE_KEY = 'proresume_data';
const VERSIONS_KEY = 'proresume_versions';

/**
 * Save resume to localStorage
 */
export function saveResumeToLocal(resume: Resume): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  } catch (error) {
    console.error('Failed to save resume to localStorage:', error);
  }
}

/**
 * Load resume from localStorage
 */
export function loadResumeFromLocal(): Resume | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load resume from localStorage:', error);
    return null;
  }
}

/**
 * Export resume as JSON file
 */
export function exportResumeAsJSON(resume: Resume): void {
  const dataStr = JSON.stringify(resume, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.metadata.title.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import resume from JSON file
 */
export function importResumeFromJSON(file: File): Promise<Resume> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const resume = JSON.parse(e.target?.result as string);
        resolve(resume);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Clear all local data
 */
export function clearLocalData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERSIONS_KEY);
}

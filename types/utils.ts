/**
 * Utility Types
 */

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface DateRange {
  start: string;
  end: string | null;
  duration?: string; // e.g., "2 yrs 3 mos"
}

export interface EditorState {
  activeSection: string | null;
  isEditing: boolean;
  isDragging: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'json' | 'docx';
  includeMetadata: boolean;
  atsMode: boolean;
}

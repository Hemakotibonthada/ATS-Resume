'use client';

import { Bold, Italic, List, Link as LinkIcon } from 'lucide-react';

interface FormattingToolbarProps {
  onFormat: (format: string) => void;
}

export function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
      <button
        onClick={() => onFormat('bold')}
        className="p-1.5 hover:bg-white rounded transition-colors"
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => onFormat('italic')}
        className="p-1.5 hover:bg-white rounded transition-colors"
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4 text-gray-700" />
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button
        onClick={() => onFormat('bullet')}
        className="p-1.5 hover:bg-white rounded transition-colors"
        title="Bullet Point"
      >
        <List className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => onFormat('link')}
        className="p-1.5 hover:bg-white rounded transition-colors"
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
}

/**
 * Apply formatting to selected text or insert at cursor
 */
export function applyFormatting(
  text: string,
  cursorStart: number,
  cursorEnd: number,
  format: string
): { newText: string; newCursor: number } {
  const before = text.substring(0, cursorStart);
  const selected = text.substring(cursorStart, cursorEnd);
  const after = text.substring(cursorEnd);

  let newText = '';
  let newCursor = cursorStart;

  switch (format) {
    case 'bold':
      if (selected) {
        newText = `${before}**${selected}**${after}`;
        newCursor = cursorEnd + 4;
      } else {
        newText = `${before}****${after}`;
        newCursor = cursorStart + 2;
      }
      break;

    case 'italic':
      if (selected) {
        newText = `${before}*${selected}*${after}`;
        newCursor = cursorEnd + 2;
      } else {
        newText = `${before}**${after}`;
        newCursor = cursorStart + 1;
      }
      break;

    case 'bullet':
      newText = `${before}- ${after}`;
      newCursor = cursorStart + 2;
      break;

    case 'link':
      if (selected) {
        newText = `${before}[${selected}](url)${after}`;
        newCursor = cursorEnd + 7;
      } else {
        newText = `${before}[text](url)${after}`;
        newCursor = cursorStart + 1;
      }
      break;

    default:
      newText = text;
      newCursor = cursorStart;
  }

  return { newText, newCursor };
}

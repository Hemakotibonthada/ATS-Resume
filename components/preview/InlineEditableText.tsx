'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditMode: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
}

export function InlineEditableText({
  value,
  onChange,
  isEditMode,
  as: Component = 'p',
  className = '',
  style,
  placeholder = 'Click to edit',
  multiline = false,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      handleSave();
    }
  };

  if (!isEditMode) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  if (isEditing) {
    const baseInputClass = "bg-white border-2 border-purple-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300";
    
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${baseInputClass} w-full min-h-[60px] resize-y ${className}`}
            style={style}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${baseInputClass} w-full ${className}`}
            style={style}
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
          >
            <Check className="w-3 h-3" />
            Save {multiline && '(Ctrl+Enter)'}
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
          >
            <X className="w-3 h-3" />
            Cancel (Esc)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative inline-block group w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        className={`${className} cursor-pointer transition-all ${
          isHovered ? 'bg-purple-50 ring-2 ring-purple-200 rounded px-2 py-1' : ''
        }`}
        style={style}
        onClick={() => setIsEditing(true)}
      >
        {value || placeholder}
      </Component>
      {isHovered && (
        <Edit2
          className="absolute -top-6 -right-6 w-4 h-4 text-purple-600 bg-white rounded-full p-0.5 shadow-md"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </div>
  );
}

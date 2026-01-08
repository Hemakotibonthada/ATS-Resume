'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface InlineEditProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function InlineEdit({
  value,
  onChange,
  as: Component = 'span',
  multiline = false,
  className = '',
  placeholder = 'Click to edit',
  disabled = false,
  style,
}: InlineEditProps) {
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
      // Select all text for quick replacement
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue !== value) {
      onChange(trimmedValue || value); // Don't save empty string
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  if (disabled) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  // Editing State
  if (isEditing) {
    const baseInputClass = `
      w-full bg-white border-2 border-purple-500 rounded px-2 py-1
      focus:outline-none focus:ring-2 focus:ring-purple-300
      text-inherit font-inherit
    `;

    return (
      <div className="inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${baseInputClass} min-h-[80px] resize-y ${className}`}
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
            onBlur={handleSave}
            className={`${baseInputClass} ${className}`}
            style={style}
          />
        )}
        <div className="flex gap-2 mt-1 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            {multiline ? 'Ctrl+Enter to save' : 'Enter to save'}
          </span>
          <span className="flex items-center gap-1">
            <X className="w-3 h-3" />
            Esc to cancel
          </span>
        </div>
      </div>
    );
  }

  // Display State
  return (
    <Component
      className={`
        inline-block cursor-pointer transition-all
        ${isHovered ? 'bg-gray-100 ring-2 ring-purple-200 rounded px-2 py-1' : ''}
        ${className}
      `}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value || placeholder}
      {isHovered && (
        <Edit2
          className="inline-block ml-2 w-3 h-3 text-purple-600 align-middle"
          style={{ verticalAlign: 'middle' }}
        />
      )}
    </Component>
  );
}

'use client';

import { useState, useRef, useCallback } from 'react';
import { useImpactScore } from '@/hooks/useImpactScore';
import { FloatingAIToolbar } from '@/components/features/FloatingAIToolbar';
import { Lightbulb } from 'lucide-react';

interface ImpactLinedTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function ImpactLinedTextArea({
  value,
  onChange,
  placeholder = 'Type here...',
  className = '',
  rows = 3,
}: ImpactLinedTextAreaProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { weakPhrases } = useImpactScore(value);

  const handleTextSelect = useCallback(() => {
    if (!textareaRef.current) return;

    const selection = window.getSelection();
    const selected = selection?.toString().trim();

    if (selected && selected.length > 0) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        setSelectedText(selected);
        setSelectedRange({ start, end });

        // Calculate position for toolbar
        const rect = textareaRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        setToolbarPosition({
          x: rect.left + (rect.width / 2),
          y: rect.top + scrollTop,
        });
        
        setShowToolbar(true);
      }
    } else {
      setShowToolbar(false);
    }
  }, []);

  const handleReplace = useCallback((newText: string) => {
    if (!selectedRange || !textareaRef.current) return;

    const before = value.substring(0, selectedRange.start);
    const after = value.substring(selectedRange.end);
    const updatedValue = before + newText + after;

    onChange(updatedValue);
    setShowToolbar(false);
    setSelectedRange(null);

    // Restore focus
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [value, selectedRange, onChange]);

  const renderHighlightedText = () => {
    if (weakPhrases.length === 0) return value;

    let lastIndex = 0;
    const parts: JSX.Element[] = [];

    weakPhrases.forEach((phrase, idx) => {
      // Add text before weak phrase
      if (phrase.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {value.substring(lastIndex, phrase.start)}
          </span>
        );
      }

      // Add weak phrase with underline
      parts.push(
        <span
          key={`weak-${idx}`}
          className="relative group"
        >
          <span className="border-b-2 border-yellow-400 border-dotted">
            {value.substring(phrase.start, phrase.end)}
          </span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-64">
            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{phrase.reason}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="text-gray-400 mb-1">Try these power verbs:</p>
                <div className="flex flex-wrap gap-1">
                  {phrase.suggestions.map((suggestion, sidx) => (
                    <span
                      key={sidx}
                      className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs"
                    >
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </span>
      );

      lastIndex = phrase.end;
    });

    // Add remaining text
    if (lastIndex < value.length) {
      parts.push(
        <span key="text-end">
          {value.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Highlighted overlay */}
      <div
        className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-transparent select-none overflow-hidden"
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontFamily: 'inherit',
        }}
      >
        {renderHighlightedText()}
      </div>

      {/* Actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onMouseUp={handleTextSelect}
        onKeyUp={handleTextSelect}
        placeholder={placeholder}
        rows={rows}
        className={`relative w-full px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${className}`}
        style={{ caretColor: 'black' }}
      />

      {/* Floating AI Toolbar */}
      {showToolbar && (
        <FloatingAIToolbar
          selectedText={selectedText}
          position={toolbarPosition}
          onReplace={handleReplace}
          onClose={() => setShowToolbar(false)}
        />
      )}
    </div>
  );
}

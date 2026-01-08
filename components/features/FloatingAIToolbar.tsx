'use client';

import { useState, useEffect, useRef } from 'react';
import { Wand2, Scissors, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingAIToolbarProps {
  selectedText: string;
  position: { x: number; y: number };
  onReplace: (newText: string) => void;
  onClose: () => void;
}

export function FloatingAIToolbar({ selectedText, position, onReplace, onClose }: FloatingAIToolbarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = async (action: 'rewrite' | 'shorten' | 'grammar') => {
    setIsLoading(true);
    setActiveAction(action);

    try {
      const response = await fetch('/api/ai/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          action,
        }),
      });

      if (!response.ok) throw new Error('Failed to enhance text');

      const data = await response.json();
      onReplace(data.enhancedText);
      onClose();
    } catch (error) {
      console.error('Text enhancement failed:', error);
      alert('Failed to enhance text. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[200] bg-white rounded-lg shadow-2xl border border-gray-200 p-2 flex items-center gap-1"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 60}px`,
        }}
      >
        <button
          onClick={() => handleAction('rewrite')}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Rewrite with AI"
        >
          {isLoading && activeAction === 'rewrite' ? (
            <Loader2 size={16} className="animate-spin text-purple-600" />
          ) : (
            <Wand2 size={16} className="text-purple-600" />
          )}
          <span>Rewrite</span>
        </button>

        <div className="w-px h-6 bg-gray-200" />

        <button
          onClick={() => handleAction('shorten')}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Make it shorter"
        >
          {isLoading && activeAction === 'shorten' ? (
            <Loader2 size={16} className="animate-spin text-blue-600" />
          ) : (
            <Scissors size={16} className="text-blue-600" />
          )}
          <span>Shorten</span>
        </button>

        <div className="w-px h-6 bg-gray-200" />

        <button
          onClick={() => handleAction('grammar')}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Fix grammar"
        >
          {isLoading && activeAction === 'grammar' ? (
            <Loader2 size={16} className="animate-spin text-green-600" />
          ) : (
            <CheckCircle size={16} className="text-green-600" />
          )}
          <span>Fix Grammar</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

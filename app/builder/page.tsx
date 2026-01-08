'use client';

import { useResumeStore } from '@/stores';
import { ResumeEditor } from '@/components/editor/ResumeEditor';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { Toolbar } from '@/components/layout/Toolbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { KeywordHighlighter } from '@/components/features/KeywordHighlighter';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function BuilderPage() {
  const currentResume = useResumeStore((state) => state.currentResume);

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">No Resume Found</h2>
          <p className="text-gray-600">Creating a new resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Static background - performance optimized */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-300 rounded-full blur-3xl"
          style={{ top: '-10%', left: '-10%' }}
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Toolbar with glass effect */}
        <div>
          <Toolbar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar with glass effect */}
          <div className="bg-white/80 border-r border-white/20 shadow-lg">
            <Sidebar />
          </div>

          {/* Resizable panels for Editor and Preview */}
          <PanelGroup direction="horizontal" className="flex-1">
            {/* Center - Editor Pane with glass effect */}
            <Panel defaultSize={45} minSize={30}>
              <div className="h-full overflow-y-auto bg-white/90 shadow-lg">
                <ResumeEditor />
              </div>
            </Panel>

            {/* Resize Handle */}
            <PanelResizeHandle className="w-1 bg-purple-300/50 hover:bg-purple-500 transition-colors cursor-col-resize relative group">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </PanelResizeHandle>

            {/* Right - Preview Pane with enhanced glass effect */}
            <Panel defaultSize={55} minSize={30}>
              <div className="h-full overflow-y-auto overflow-x-auto bg-gradient-to-br from-white/90 to-purple-50/80 p-8 shadow-xl">
                <ResumePreview />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>

      {/* Keyword Highlighter - Floating Widget */}
      <KeywordHighlighter />
    </div>
  );
}

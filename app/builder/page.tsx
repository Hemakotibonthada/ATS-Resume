'use client';

import { useResumeStore } from '@/stores';
import { ResumeEditor } from '@/components/editor/ResumeEditor';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { Toolbar } from '@/components/layout/Toolbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function BuilderPage() {
  const currentResume = useResumeStore((state) => state.currentResume);

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Resume Found</h2>
          <p className="text-gray-600">Creating a new resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Section Navigation */}
        <Sidebar />

        {/* Center - Editor Pane */}
        <div className="flex-1 overflow-y-auto border-r border-gray-200 bg-white">
          <ResumeEditor />
        </div>

        {/* Right - Preview Pane */}
        <div className="w-[600px] overflow-y-auto bg-gray-100 p-8">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}

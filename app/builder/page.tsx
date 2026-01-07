'use client';

import { useResumeStore } from '@/stores';
import { ResumeEditor } from '@/components/editor/ResumeEditor';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { Toolbar } from '@/components/layout/Toolbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { motion } from 'framer-motion';

export default function BuilderPage() {
  const currentResume = useResumeStore((state) => state.currentResume);

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">No Resume Found</h2>
          <p className="text-gray-600">Creating a new resume...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Subtle animated background - optimized */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-purple-300 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '-10%', left: '-10%' }}
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Toolbar with glass effect */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Toolbar />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar with glass effect */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 border-r border-white/20 shadow-lg"
          >
            <Sidebar />
          </motion.div>

          {/* Center - Editor Pane with glass effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto border-r border-white/20 bg-white/90 shadow-lg"
          >
            <ResumeEditor />
          </motion.div>

          {/* Right - Preview Pane with enhanced glass effect */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-[600px] overflow-y-auto bg-gradient-to-br from-white/90 to-purple-50/80 p-8 shadow-xl"
          >
            <ResumePreview />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

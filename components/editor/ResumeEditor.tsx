'use client';

import { useResumeStore } from '@/stores';
import { ContactEditor } from './sections/ContactEditor';
import { SummaryEditor } from './sections/SummaryEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { EducationEditor } from './sections/EducationEditor';
import { SkillsEditor } from './sections/SkillsEditor';
import { CustomSectionEditor } from './sections/CustomSectionEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export function ResumeEditor() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const activeSection = useResumeStore((state) => state.activeSection);

  if (!currentResume) {
    return <div className="p-8">No resume loaded</div>;
  }

  const section = currentResume.sections.find((s) => s.id === activeSection);

  if (!section) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Welcome to ProResume Architect
            </h2>
            <p className="text-gray-600 mb-6">
              Select a section from the sidebar to start editing your resume.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-purple-600" />
              </motion.div>
              <h3 className="font-semibold text-purple-900">Quick Tips:</h3>
            </div>
            <ul className="space-y-3">
              {[
                { icon: TrendingUp, text: "Use the sidebar to navigate between sections" },
                { icon: Shield, text: "Drag and drop to reorder sections" },
                { icon: Zap, text: "All changes are saved automatically" },
                { icon: Sparkles, text: "Use 'Save Version' to create checkpoints" },
              ].map((tip, idx) => (
                <motion.li
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 text-sm text-purple-800"
                >
                  <tip.icon className="w-4 h-4 text-purple-600" />
                  {tip.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="p-8"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {section.title}
            </h2>
            <p className="text-gray-600">
              Edit your {section.type} information below
            </p>
          </motion.div>

          {section.type === 'contact' && <ContactEditor section={section} />}
          {section.type === 'summary' && <SummaryEditor section={section} />}
          {section.type === 'experience' && <ExperienceEditor section={section} />}
          {section.type === 'education' && <EducationEditor section={section} />}
          {section.type === 'skills' && <SkillsEditor section={section} />}
          {section.type === 'custom' && <CustomSectionEditor section={section} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

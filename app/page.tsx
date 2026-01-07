'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/stores';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Rocket, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const currentResume = useResumeStore((state) => state.currentResume);
  const createResume = useResumeStore((state) => state.createResume);

  const handleGetStarted = () => {
    if (!currentResume) {
      createResume('My Resume');
    }
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative">
      {/* Animated background elements - optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none\">
        <motion.div
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: \"easeInOut\"
          }}
          style={{ top: '10%', left: '10%' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <FileText className="w-20 h-20 text-white" strokeWidth={1.5} />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-7xl font-black text-white mb-6 tracking-tight">
              ProResume <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">Architect</span>
            </h1>
            <p className="text-2xl text-white/90 mb-4 font-light">
              Build ATS-Optimized Resumes That Get You Hired
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              AI-Powered • Privacy-First • Professional Templates • Real-Time Preview
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: Zap, title: "AI-Powered", desc: "Smart suggestions and optimization" },
              { icon: Shield, title: "ATS Optimized", desc: "Pass applicant tracking systems" },
              { icon: Rocket, title: "Get Hired Faster", desc: "Professional templates that work" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl"
              >
                <feature.icon className="w-12 h-12 text-yellow-300 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              Get Started Free
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
            <p className="text-white/60 mt-4">No credit card required • 100% Free • Privacy-First</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

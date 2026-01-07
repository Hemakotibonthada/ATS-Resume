'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'purple' | 'blue' | 'green' | 'pink';
  text?: string;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const colors = {
  purple: 'from-purple-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  pink: 'from-pink-500 to-rose-500',
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'purple',
  text 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizes[size]} rounded-full bg-gradient-to-r ${colors[color]} opacity-20`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Spinning ring */}
        <motion.div
          className={`absolute inset-0 ${sizes[size]} rounded-full border-4 border-transparent bg-gradient-to-r ${colors[color]} bg-clip-padding`}
          style={{
            backgroundClip: 'padding-box',
            borderImage: `linear-gradient(to right, currentColor, transparent) 1`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full bg-white" />
        </motion.div>

        {/* Center dot */}
        <motion.div
          className={`absolute inset-0 m-auto w-2 h-2 rounded-full bg-gradient-to-r ${colors[color]}`}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {text && (
        <motion.p
          className="text-sm font-medium text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          className="space-y-3"
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2" />
        </motion.div>
      ))}
    </div>
  );
}

export function PulsatingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export function WaveLoader() {
  return (
    <div className="flex gap-1 items-end h-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          animate={{ height: ['20%', '100%', '20%'] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function CircularProgress({ progress = 0 }: { progress: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          {progress}%
        </span>
      </div>
    </div>
  );
}

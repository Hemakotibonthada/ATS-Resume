'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: {
    bg: 'from-green-500 to-emerald-500',
    icon: 'text-white',
    border: 'border-green-400',
  },
  error: {
    bg: 'from-red-500 to-pink-500',
    icon: 'text-white',
    border: 'border-red-400',
  },
  info: {
    bg: 'from-blue-500 to-cyan-500',
    icon: 'text-white',
    border: 'border-blue-400',
  },
  warning: {
    bg: 'from-yellow-500 to-orange-500',
    icon: 'text-white',
    border: 'border-yellow-400',
  },
};

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const Icon = icons[type];
  const color = colors[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl
        backdrop-blur-xl bg-gradient-to-r ${color.bg}
        border ${color.border} min-w-[320px] max-w-md
      `}
    >
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 flex items-center gap-3 flex-1">
        <motion.div
          animate={{ rotate: type === 'success' ? [0, 360] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-5 h-5 ${color.icon}`} />
        </motion.div>
        <p className="text-sm font-medium text-white">{message}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose(id)}
        className="relative z-10 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </motion.button>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-b-xl"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

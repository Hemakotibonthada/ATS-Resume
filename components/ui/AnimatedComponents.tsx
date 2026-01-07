'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '',
  hover = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`
        backdrop-blur-md bg-white/80 rounded-xl border border-white/20 
        shadow-lg hover:shadow-xl transition-shadow
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  icon?: ReactNode;
  error?: string;
}

export function AnimatedInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  error,
}: AnimatedInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
            {icon}
          </div>
        )}
        <motion.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          whileFocus={{ scale: 1.01 }}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''} rounded-lg
            border-2 border-gray-200
            focus:border-purple-500 focus:ring-4 focus:ring-purple-100
            transition-all duration-200 outline-none
            backdrop-blur-sm bg-white/50
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
          `}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 left-0 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

interface AnimatedTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export function AnimatedTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
}: AnimatedTextareaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        whileFocus={{ scale: 1.01 }}
        className="
          w-full px-4 py-3 rounded-lg
          border-2 border-gray-200
          focus:border-purple-500 focus:ring-4 focus:ring-purple-100
          transition-all duration-200 outline-none
          backdrop-blur-sm bg-white/50
          resize-none
        "
      />
    </motion.div>
  );
}

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  className = '',
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
}

interface AnimatedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export function AnimatedSelect({
  label,
  value,
  onChange,
  options,
}: AnimatedSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <motion.select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        whileFocus={{ scale: 1.01 }}
        className="
          w-full px-4 py-3 rounded-lg
          border-2 border-gray-200
          focus:border-purple-500 focus:ring-4 focus:ring-purple-100
          transition-all duration-200 outline-none
          backdrop-blur-sm bg-white/50
          cursor-pointer
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
    </motion.div>
  );
}

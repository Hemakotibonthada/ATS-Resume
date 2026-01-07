'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/stores';

export default function Home() {
  const router = useRouter();
  const currentResume = useResumeStore((state) => state.currentResume);
  const createResume = useResumeStore((state) => state.createResume);

  useEffect(() => {
    // If no resume exists, create a default one
    if (!currentResume) {
      createResume('My Resume');
    }
    
    // Redirect to builder
    router.push('/builder');
  }, [currentResume, createResume, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ProResume Architect</h1>
        <p className="text-gray-600">Loading your resume builder...</p>
      </div>
    </div>
  );
}

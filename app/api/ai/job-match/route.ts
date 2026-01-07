import { NextRequest, NextResponse } from 'next/server';
import { matchResumeToJob } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    const analysis = await matchResumeToJob(resumeText, jobDescription);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to match resume to job' },
      { status: 500 }
    );
  }
}

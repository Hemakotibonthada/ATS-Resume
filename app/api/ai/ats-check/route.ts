import { NextRequest, NextResponse } from 'next/server';
import { analyzeResumeForATS } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeResumeForATS(resumeText);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}

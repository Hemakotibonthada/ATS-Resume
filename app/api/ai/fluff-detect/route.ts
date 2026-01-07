import { NextRequest, NextResponse } from 'next/server';
import { detectFluff } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const analysis = await detectFluff(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect fluff' },
      { status: 500 }
    );
  }
}

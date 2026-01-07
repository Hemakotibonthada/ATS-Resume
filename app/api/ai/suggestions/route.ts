import { NextRequest, NextResponse } from 'next/server';
import { generateBulletPointSuggestions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { bulletPoint, context } = await request.json();

    if (!bulletPoint) {
      return NextResponse.json(
        { error: 'Bullet point is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateBulletPointSuggestions(bulletPoint, context);

    return NextResponse.json({
      suggestions,
      reasoning: suggestions.length > 0 
        ? 'AI-powered suggestions based on professional resume writing best practices.'
        : 'Unable to generate suggestions at this time.'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

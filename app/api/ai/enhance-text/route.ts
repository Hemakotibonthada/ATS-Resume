import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, action } = await request.json();

    if (!text || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Define prompts for each action
    const prompts: Record<string, string> = {
      rewrite: `Rewrite this resume bullet point to be more impactful and professional. Use strong action verbs and quantify achievements where possible. Keep it concise:\n\n"${text}"`,
      shorten: `Shorten this resume bullet point while maintaining its key information and impact. Make it more concise:\n\n"${text}"`,
      grammar: `Fix any grammar, spelling, or punctuation errors in this resume bullet point. Keep the meaning and style intact:\n\n"${text}"`,
    };

    const prompt = prompts[action];
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer and career advisor. Your responses should be clear, impactful, and ATS-friendly. Return only the improved text without explanations or quotes.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to enhance text' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const enhancedText = data.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({ enhancedText });
  } catch (error) {
    console.error('Error enhancing text:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

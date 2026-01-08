import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, style, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const stylePrompts: Record<string, string> = {
      quantified: `Transform this resume bullet point into a high-impact statement with specific metrics, numbers, and measurable results. Add percentages, timeframes, team sizes, or dollar amounts where appropriate. Make it quantifiable and impressive.`,
      action: `Rewrite this resume bullet point starting with a powerful action verb (like Led, Architected, Spearheaded, Orchestrated, Pioneered). Make the language dynamic and impactful.`,
      leadership: `Enhance this resume bullet point to emphasize leadership qualities, team management, mentoring, strategic thinking, and cross-functional collaboration. Show how you led and influenced others.`,
      technical: `Rewrite this resume bullet point to showcase technical expertise, specific technologies, tools, frameworks, and innovative technical solutions. Include relevant technical keywords and methodologies.`
    };

    const systemPrompt = `You are an expert resume writer and career coach. Your job is to transform weak, generic resume bullet points into powerful, ATS-friendly impact statements that impress recruiters.

Rules:
1. Start with a strong action verb
2. Include specific metrics when possible (even if estimated reasonably)
3. Mention relevant technologies/tools
4. Show both action AND impact
5. Keep it concise (1-2 lines max)
6. Use past tense for previous roles
7. Make it ATS-friendly with industry keywords
8. Be truthful but compelling

${stylePrompts[style] || stylePrompts.quantified}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Original statement: "${text}"\n\nProvide only the enhanced version, nothing else.` }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const enhanced = completion.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({
      enhanced,
      style,
      originalLength: text.length,
      enhancedLength: enhanced.length
    });

  } catch (error) {
    console.error('AI Enhancement Error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance statement', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

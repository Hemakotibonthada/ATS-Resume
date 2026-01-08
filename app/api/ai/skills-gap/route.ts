import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription, targetRole } = await req.json();

    const currentSkills = resume.skills?.categories?.flatMap((cat: any) => cat.skills) || [];
    
    const systemPrompt = `You are an expert career advisor and skills analyst. Analyze the candidate's current skills against job requirements and provide actionable insights.

Return a JSON object with this structure:
{
  "present": ["skill1", "skill2"],  // Skills they already have
  "missing": ["skill3", "skill4"],  // Critical skills they need
  "emerging": ["skill5", "skill6"], // Future-focused skills
  "suggestions": ["action1", "action2"], // Specific action items
  "matchScore": 75, // 0-100 percentage
  "industryTrends": ["trend1", "trend2"] // Industry insights
}`;

    const userPrompt = `Current Skills: ${currentSkills.join(', ')}
${targetRole ? `Target Role: ${targetRole}` : ''}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Provide a comprehensive skills gap analysis with specific, actionable recommendations.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Skills Gap Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skills gap' },
      { status: 500 }
    );
  }
}

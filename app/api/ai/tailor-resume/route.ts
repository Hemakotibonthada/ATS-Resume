import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription, companyName } = await req.json();

    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. Your task is to tailor a resume to match a specific job description while maintaining accuracy and authenticity.

Guidelines:
1. Extract key requirements, skills, and keywords from the job description
2. Optimize the professional summary to align with the role
3. Reorder work experience bullet points to prioritize relevant achievements
4. Add missing but relevant skills that the candidate likely has based on their experience
5. Enhance language to match the job description's tone
6. Improve ATS compatibility by naturally incorporating keywords
7. Maintain truthfulness - only suggest changes based on existing experience
8. Return the complete tailored resume in the same JSON structure

Return a JSON object with:
{
  "tailoredResume": { /* complete resume structure */ },
  "result": {
    "changes": [{ "section": "", "type": "added|modified|removed|reordered", "description": "", "impact": "high|medium|low" }],
    "keywordMatches": 0,
    "atsScore": 0,
    "summary": ""
  }
}`;

    const userPrompt = `Job Description:
${jobDescription}

${companyName ? `Company: ${companyName}` : ''}

Current Resume:
${JSON.stringify(resume, null, 2)}

Tailor this resume for maximum impact. Provide both the tailored resume and a summary of changes made.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const data = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return NextResponse.json(data);

  } catch (error) {
    console.error('Resume Tailoring Error:', error);
    return NextResponse.json(
      { error: 'Failed to tailor resume' },
      { status: 500 }
    );
  }
}

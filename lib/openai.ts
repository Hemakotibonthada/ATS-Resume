import OpenAI from 'openai';

let openai: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openai;
}

export async function generateBulletPointSuggestions(
  bulletPoint: string,
  context?: string
): Promise<string[]> {
  const client = getOpenAIClient();
  
  if (!client) {
    return [];
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional resume writer and career coach. Your task is to improve bullet points for resumes by:
1. Starting with strong action verbs
2. Including specific metrics and quantifiable results
3. Highlighting impact and outcomes
4. Making them ATS-friendly with relevant keywords
5. Keeping them concise and powerful

Provide 3 improved versions of the bullet point.`
        },
        {
          role: 'user',
          content: `Improve this resume bullet point:\n\n"${bulletPoint}"\n\n${context ? `Context: ${context}` : ''}\n\nProvide exactly 3 improved versions, each on a new line, without numbering.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const suggestions = completion.choices[0]?.message?.content
      ?.split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.match(/^\d+\./)) // Remove numbering if present
      .slice(0, 3) || [];

    return suggestions;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return [];
  }
}

export async function analyzeResumeForATS(resumeText: string): Promise<{
  score: number;
  suggestions: string[];
  keywords: string[];
}> {
  const client = getOpenAIClient();
  
  if (!client) {
    return { score: 0, suggestions: [], keywords: [] };
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) expert. Analyze resumes for ATS compatibility and provide actionable feedback. Return a JSON object with:
- score (0-100)
- suggestions (array of strings)
- keywords (array of important keywords found)`
        },
        {
          role: 'user',
          content: `Analyze this resume for ATS compatibility:\n\n${resumeText}\n\nReturn JSON only.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      score: result.score || 0,
      suggestions: result.suggestions || [],
      keywords: result.keywords || []
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return { score: 0, suggestions: [], keywords: [] };
  }
}

export async function matchResumeToJob(
  resumeText: string,
  jobDescription: string
): Promise<{
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}> {
  const client = getOpenAIClient();
  
  if (!client) {
    return { matchScore: 0, strengths: [], gaps: [], recommendations: [] };
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional recruiter. Compare a resume to a job description and provide detailed matching analysis. Return a JSON object with:
- matchScore (0-100)
- strengths (array of matching points)
- gaps (array of missing skills/experience)
- recommendations (array of actionable improvements)`
        },
        {
          role: 'user',
          content: `Compare this resume to the job description:\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nReturn JSON only.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      matchScore: result.matchScore || 0,
      strengths: result.strengths || [],
      gaps: result.gaps || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return { matchScore: 0, strengths: [], gaps: [], recommendations: [] };
  }
}

export async function detectFluff(text: string): Promise<{
  fluffScore: number;
  fluffyPhrases: Array<{ phrase: string; reason: string; replacement: string }>;
  cleanedVersion: string;
}> {
  const client = getOpenAIClient();
  
  if (!client) {
    return { fluffScore: 0, fluffyPhrases: [], cleanedVersion: text };
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a resume expert specializing in removing vague, generic "fluff" language. Identify fluffy phrases and provide concrete alternatives. Return a JSON object with:
- fluffScore (0-100, higher = more fluff)
- fluffyPhrases (array of {phrase, reason, replacement})
- cleanedVersion (text with fluff removed)`
        },
        {
          role: 'user',
          content: `Analyze this text for fluff:\n\n"${text}"\n\nReturn JSON only.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      fluffScore: result.fluffScore || 0,
      fluffyPhrases: result.fluffyPhrases || [],
      cleanedVersion: result.cleanedVersion || text
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return { fluffScore: 0, fluffyPhrases: [], cleanedVersion: text };
  }
}

/**
 * Semantic Job Mapper - The "Context" Engine
 * Analyzes job descriptions to find hidden requirements and semantic links
 */

export interface SemanticAnalysis {
  impliedSkills: ImpliedSkill[];
  semanticMatches: SemanticMatch[];
  suggestions: SemanticSuggestion[];
  contextScore: number; // 0-100
}

export interface ImpliedSkill {
  explicit: string; // What the user wrote
  implied: string; // What the JD actually needs
  confidence: number; // 0-1
  reasoning: string;
}

export interface SemanticMatch {
  resumeText: string;
  jdRequirement: string;
  strength: 'strong' | 'moderate' | 'weak';
  suggestion: string;
}

export interface SemanticSuggestion {
  type: 'skill-to-task' | 'context-link' | 'impact-enhancement';
  original: string;
  improved: string;
  reasoning: string;
}

/**
 * Analyze semantic relationships between resume and job description
 * This creates the "Skill-to-Task" relationship that Eightfold's knowledge graph loves
 */
export function analyzeSemanticContext(
  resumeText: string,
  jobDescription: string
): SemanticAnalysis {
  const impliedSkills = findImpliedSkills(resumeText, jobDescription);
  const semanticMatches = findSemanticMatches(resumeText, jobDescription);
  const suggestions = generateSemanticSuggestions(impliedSkills, semanticMatches);
  const contextScore = calculateContextScore(semanticMatches);

  return {
    impliedSkills,
    semanticMatches,
    suggestions,
    contextScore,
  };
}

/**
 * Find implied skills that the JD needs but user hasn't explicitly connected
 */
function findImpliedSkills(resumeText: string, jobDescription: string): ImpliedSkill[] {
  const implications: ImpliedSkill[] = [];
  
  // Common semantic mappings for tech roles
  const semanticMap: { [key: string]: string[] } = {
    'Python': ['distributed systems', 'microservices', 'data pipelines'],
    'React': ['component architecture', 'state management', 'performance optimization'],
    'AWS': ['cloud infrastructure', 'scalability', 'DevOps'],
    'Docker': ['containerization', 'orchestration', 'CI/CD'],
    'Kubernetes': ['container orchestration', 'deployment automation', 'scaling'],
    'PostgreSQL': ['database design', 'query optimization', 'data modeling'],
    'TypeScript': ['type safety', 'code maintainability', 'enterprise applications'],
    'Node.js': ['backend services', 'API development', 'real-time systems'],
  };

  // Extract user's explicit skills
  const userSkills = extractSkills(resumeText);
  
  // Find JD requirements
  const jdRequirements = extractRequirements(jobDescription);

  // Match and suggest semantic links
  userSkills.forEach(skill => {
    const implied = semanticMap[skill];
    if (implied) {
      implied.forEach(impliedSkill => {
        if (jdRequirements.some(req => req.toLowerCase().includes(impliedSkill.toLowerCase()))) {
          // JD mentions the implied skill, but user hasn't connected it
          if (!resumeText.toLowerCase().includes(impliedSkill.toLowerCase())) {
            implications.push({
              explicit: skill,
              implied: impliedSkill,
              confidence: 0.85,
              reasoning: `The job description emphasizes "${impliedSkill}". Consider rewriting your ${skill} experience to highlight this aspect.`,
            });
          }
        }
      });
    }
  });

  return implications;
}

/**
 * Find semantic matches between resume and JD
 */
function findSemanticMatches(resumeText: string, jobDescription: string): SemanticMatch[] {
  const matches: SemanticMatch[] = [];
  
  // Extract key phrases from JD
  const jdPhrases = extractKeyPhrases(jobDescription);
  const resumePhrases = extractKeyPhrases(resumeText);

  jdPhrases.forEach(jdPhrase => {
    // Find similar or related phrases in resume
    resumePhrases.forEach(resumePhrase => {
      const similarity = calculateSimilarity(resumePhrase, jdPhrase);
      
      if (similarity > 0.7) {
        matches.push({
          resumeText: resumePhrase,
          jdRequirement: jdPhrase,
          strength: 'strong',
          suggestion: `Great match! Your "${resumePhrase}" directly addresses the requirement.`,
        });
      } else if (similarity > 0.4) {
        matches.push({
          resumeText: resumePhrase,
          jdRequirement: jdPhrase,
          strength: 'moderate',
          suggestion: `Consider rewording "${resumePhrase}" to more closely match "${jdPhrase}".`,
        });
      }
    });
  });

  return matches;
}

/**
 * Generate actionable semantic suggestions
 */
function generateSemanticSuggestions(
  impliedSkills: ImpliedSkill[],
  semanticMatches: SemanticMatch[]
): SemanticSuggestion[] {
  const suggestions: SemanticSuggestion[] = [];

  // Skill-to-Task suggestions
  impliedSkills.forEach(skill => {
    suggestions.push({
      type: 'skill-to-task',
      original: `Used ${skill.explicit}`,
      improved: `Built ${skill.implied} using ${skill.explicit}`,
      reasoning: skill.reasoning,
    });
  });

  // Context link suggestions
  semanticMatches
    .filter(match => match.strength === 'moderate')
    .forEach(match => {
      suggestions.push({
        type: 'context-link',
        original: match.resumeText,
        improved: match.jdRequirement,
        reasoning: match.suggestion,
      });
    });

  return suggestions;
}

/**
 * Calculate overall context score
 */
function calculateContextScore(matches: SemanticMatch[]): number {
  if (matches.length === 0) return 0;
  
  const strongMatches = matches.filter(m => m.strength === 'strong').length;
  const moderateMatches = matches.filter(m => m.strength === 'moderate').length;
  
  const score = ((strongMatches * 10) + (moderateMatches * 5)) / matches.length * 10;
  return Math.min(100, Math.round(score));
}

/**
 * Helper: Extract skills from text
 */
function extractSkills(text: string): string[] {
  const skillPattern = /\b(Python|JavaScript|TypeScript|React|Node\.js|AWS|Docker|Kubernetes|PostgreSQL|MongoDB|Redis|GraphQL)\b/gi;
  const matches = text.match(skillPattern) || [];
  return [...new Set(matches)]; // Deduplicate
}

/**
 * Helper: Extract requirements from JD
 */
function extractRequirements(jd: string): string[] {
  // Simple extraction - look for sentences with key requirement indicators
  const requirementIndicators = ['experience with', 'knowledge of', 'proficiency in', 'skilled in', 'expertise in'];
  const sentences = jd.split(/[.!?]+/);
  
  return sentences.filter(sentence => 
    requirementIndicators.some(indicator => 
      sentence.toLowerCase().includes(indicator)
    )
  );
}

/**
 * Helper: Extract key phrases
 */
function extractKeyPhrases(text: string): string[] {
  // Extract noun phrases (simplified)
  const words = text.split(/\s+/);
  const phrases: string[] = [];
  
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = words.slice(i, i + 3).join(' ');
    if (phrase.length > 10) {
      phrases.push(phrase);
    }
  }
  
  return phrases;
}

/**
 * Helper: Calculate text similarity (simple version)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

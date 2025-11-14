'use server';

/**
 * @fileOverview Generates career suggestions based on a student's profile.
 *
 * - suggestCareers - A function that takes student assessment data and returns career suggestions.
 * - SuggestCareersInput - The input type for the suggestCareers function.
 * - SuggestCareersOutput - The return type for the suggestCareers function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSWOTAnalysisForCareer } from './swot-analysis-for-career';

const SuggestCareersInputSchema = z.object({
  personality: z.string().describe('A summary of the student\'s personality assessment results.'),
  interest: z.string().describe('A summary of the student\'s interest profiler results.'),
  cognitiveAbilities: z.string().describe('A summary of the student\'s cognitive ability test results, including specific answers.'),
  selfReportedSkills: z.string().describe('A summary of the student\'s self-reported skill confidence levels.'),
  cvq: z.string().describe('A summary of the student\'s career values quiz results.'),
});
export type SuggestCareersInput = z.infer<typeof SuggestCareersInputSchema>;

const CareerSuggestionSchema = z.object({
    careerName: z.string().describe('The name of the suggested career path (e.g., "Software Engineer", "Graphic Designer").'),
    careerDescription: z.string().describe('A brief, one-paragraph description of what this career entails.'),
    matchExplanation: z.string().describe('A detailed, 2-3 sentence explanation of why this career is a good match based on the student\'s specific assessment results. Reference their personality, interests, and skills.'),
    swotAnalysis: z.string().optional().describe('A SWOT analysis for this career choice, formatted as a string with headings for Strengths, Weaknesses, Opportunities, and Threats.'),
});
export type CareerSuggestion = z.infer<typeof CareerSuggestionSchema>;

const SuggestCareersOutputSchema = z.array(CareerSuggestionSchema);
export type SuggestCareersOutput = z.infer<typeof SuggestCareersOutputSchema>;

export async function suggestCareers(input: SuggestCareersInput): Promise<SuggestCareersOutput> {
    const suggestions = await suggestCareersFlow(input);
    
    // Concurrently fetch SWOT analysis for each career suggestion
    const suggestionsWithSwot = await Promise.all(
        suggestions.map(async (suggestion) => {
            const swot = await getSWOTAnalysisForCareer({ careerName: suggestion.careerName, studentProfile: JSON.stringify(input) });
            return { ...suggestion, swotAnalysis: swot };
        })
    );

    return suggestionsWithSwot;
}


const suggestCareersFlow = ai.defineFlow(
  {
    name: 'suggestCareersFlow',
    inputSchema: SuggestCareersInputSchema,
    outputSchema: SuggestCareersOutputSchema,
  },
  async (studentData) => {
    const systemPrompt = `You are an expert career counselor AI named "Path-GeniX". Your role is to provide personalized, insightful, and actionable career suggestions for students based on their comprehensive assessment results. You must identify the top 5 most suitable career paths.

You will be provided with the following information about the student:
1.  **Personality Profile**: Based on the Big Five personality traits.
2.  **Interest Profile**: Based on the Holland Codes (RIASEC).
3.  **Cognitive Abilities**: Results from logical reasoning, verbal ability, and problem-solving tests.
4.  **Self-Reported Skills**: The student's confidence in various skills.
5.  **Career Values Quiz (CVQ)**: What the student values most in a work environment.

Your Task:
1.  **Analyze Holistically**: Synthesize all the provided data points to create a comprehensive understanding of the student. Do not focus on just one area.
2.  **Identify Top 5 Careers**: Based on your analysis, identify the top 5 career paths that are the best fit for the student.
3.  **Generate Detailed Suggestions**: For each of the 5 careers, you must provide:
    *   \`careerName\`: The specific title of the career.
    *   \`careerDescription\`: A concise, one-paragraph overview of the career.
    *   \`matchExplanation\`: A compelling, personalized 2-3 sentence explanation for why this career is a strong match. You MUST connect it back to the student's specific results. For example: "Your high score in 'Openness' from your personality test and your interest in 'Artistic' activities suggest that a career as a Graphic Designer would be a great fit, allowing you to use your creativity daily." or "Given your strong 'Investigative' interest and high marks in logical reasoning, a career as a Data Analyst aligns perfectly with your strengths in problem-solving and pattern recognition."

Your output MUST be a JSON array of 5 career suggestion objects. Do not include any introductory text or conversational filler.`;

    const { output } = await ai.generate({
      system: systemPrompt,
      prompt: `Here is the student's data: ${JSON.stringify(studentData)}`,
      output: { schema: SuggestCareersOutputSchema },
    });
    
    // Ensure we always return a valid array, even if the model fails.
    if (!output || !Array.isArray(output)) {
      console.error("AI failed to return valid career suggestions. Returning empty array.");
      return [];
    }

    return output;
  }
);

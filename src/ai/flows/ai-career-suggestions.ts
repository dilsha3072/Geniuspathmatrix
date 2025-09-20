'use server';

/**
 * @fileOverview An AI-powered career suggestion flow based on student assessment results.
 *
 * - suggestCareers - A function that suggests potential careers.
 * - SuggestCareersInput - The input type for the suggestCareers function.
 * - SuggestCareersOutput - The return type for the suggestCareers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCareersInputSchema = z.object({
  personality: z
    .string()
    .describe('The personality assessment results (Big Five - OCEAN).'),
  interest: z.string().describe('The interest assessment results (RIASEC).'),
  cognitiveAbilities: z
    .string()
    .describe('The cognitive abilities assessment results (VAT).'),
  selfReportedSkills: z
    .string()
    .describe('The self-reported skills of the student.'),
  cvq: z.string().describe('The Contextual Viability Quotient results, which includes financial, geographic, and cultural constraints. These are important filters.'),
});
export type SuggestCareersInput = z.infer<typeof SuggestCareersInputSchema>;

const CareerSuggestionSchema = z.object({
  careerName: z.string().describe('The name of the suggested career.'),
  careerDescription: z.string().describe('A brief description of the career.'),
  swotAnalysis: z.string().describe('A detailed SWOT analysis of the career path for the student, considering their profile. Use bullet points for each section. The output should be in markdown format.'),
  matchExplanation: z.string().describe("An explanation of why this career is a good match based on the user's assessment results (personality, interests, skills) and constraints (CVQ)."),
});

const SuggestCareersOutputSchema = z.array(CareerSuggestionSchema).min(10).describe('A list of at least 10 career suggestions based on the input.');
export type SuggestCareersOutput = z.infer<typeof SuggestCareersOutputSchema>;

export async function suggestCareers(input: SuggestCareersInput): Promise<SuggestCareersOutput> {
  return suggestCareersFlow(input);
}

const suggestCareersPrompt = ai.definePrompt({
  name: 'suggestCareersPrompt',
  input: {schema: SuggestCareersInputSchema},
  output: {schema: SuggestCareersOutputSchema},
  prompt: `You are a pragmatic and experienced AI career advisor with a deep understanding of future job market trends. Your primary goal is to suggest reliable, in-demand, and future-proof careers with strong long-term market viability. You must consider the rise of AI and automation, and suggest roles that are either newly emerging due to these trends or are time-tested professions that require skills less likely to be automated (e.g., complex problem-solving, creativity, emotional intelligence, strategy).

Based on the following assessment results, suggest at least 10 potential careers that align with the student's profile.

Crucially, you must use the CVQ results as a filter. If the CVQ indicates significant constraints (e.g., financial limitations, unwillingness to relocate), do not suggest careers that would be impractical.

Personality: {{{personality}}}
Interest: {{{interest}}}
Cognitive Abilities: {{{cognitiveAbilities}}}
Self-Reported Skills: {{{selfReportedSkills}}}
CVQ (Constraints): {{{cvq}}}

For each suggestion, provide:
1. The career name.
2. A brief description.
3. A detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the student in this career. Use markdown bullet points for each section.
4. A detailed explanation of why it's a good match, referencing specific traits from the assessments AND how it aligns with the constraints from the CVQ.
`, 
});

const suggestCareersFlow = ai.defineFlow(
  {
    name: 'suggestCareersFlow',
    inputSchema: SuggestCareersInputSchema,
    outputSchema: SuggestCareersOutputSchema,
  },
  async input => {
    const {output} = await suggestCareersPrompt(input);
    return output!;
  }
);

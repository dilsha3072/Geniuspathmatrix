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
  cvq: z.string().describe('The Contextual Viability Quotient results.'),
});
export type SuggestCareersInput = z.infer<typeof SuggestCareersInputSchema>;

const CareerSuggestionSchema = z.object({
  careerName: z.string().describe('The name of the suggested career.'),
  careerDescription: z.string().describe('A brief description of the career.'),
  swotAnalysis: z.string().describe('A SWOT analysis of the career path.'),
  matchExplanation: z.string().describe("An explanation of why this career is a good match based on the user's assessment results (traits and constraints)."),
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
  prompt: `You are an AI career advisor. Based on the following assessment results, suggest at least 10 potential careers that align with the student's profile.

Personality: {{{personality}}}
Interest: {{{interest}}}
Cognitive Abilities: {{{cognitiveAbilities}}}
Self-Reported Skills: {{{selfReportedSkills}}}
CVQ: {{{cvq}}}

For each suggestion, provide the career name, a brief description, a SWOT analysis, and a detailed explanation of why it's a good match, referencing the specific traits from the assessments and considering any constraints.
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

'use server';
/**
 * @fileOverview Generates a SWOT analysis for a given career path.
 *
 * - getSwotAnalysis - A function that generates the SWOT analysis.
 * - SwotAnalysisInput - The input type for the getSwotAnalysis function.
 * - SwotAnalysisOutput - The return type for the getSwotAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SwotAnalysisInputSchema = z.object({
  careerName: z.string().describe('The name of the career to analyze.'),
  studentSkills: z.array(z.string()).optional().describe('The skills of the student.'),
  studentInterests: z.array(z.string()).optional().describe('The interests of the student.'),
});
export type SwotAnalysisInput = z.infer<typeof SwotAnalysisInputSchema>;

const SwotAnalysisOutputSchema = z.object({
  strengths: z.string().describe('The strengths of the career path.'),
  weaknesses: z.string().describe('The weaknesses of the career path.'),
  opportunities: z.string().describe('The opportunities presented by the career path.'),
  threats: z.string().describe('The threats to success in the career path.'),
});
export type SwotAnalysisOutput = z.infer<typeof SwotAnalysisOutputSchema>;

export async function getSwotAnalysis(input: SwotAnalysisInput): Promise<SwotAnalysisOutput> {
  return swotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'swotAnalysisPrompt',
  input: {schema: SwotAnalysisInputSchema},
  output: {schema: SwotAnalysisOutputSchema},
  prompt: `You are a career counselor helping students evaluate career paths.

  Based on the career, student skills, and student interests provided, generate a SWOT analysis for the career path.

  Career: {{{careerName}}}
  Student Skills: {{#if studentSkills}}{{#each studentSkills}}- {{{this}}}{{/each}}{{else}}None{{/if}}
  Student Interests: {{#if studentInterests}}{{#each studentInterests}}- {{{this}}}{{/each}}{{else}}None{{/if}}

  Strengths:
  Weaknesses:
  Opportunities:
  Threats:`,
});

const swotAnalysisFlow = ai.defineFlow(
  {
    name: 'swotAnalysisFlow',
    inputSchema: SwotAnalysisInputSchema,
    outputSchema: SwotAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

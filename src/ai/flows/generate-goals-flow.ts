'use server';
/**
 * @fileOverview Generates a SMART goal plan for a given career path and custom timelines.
 *
 * - generateGoalsForCareer - A function that generates the goal plan.
 * - GenerateGoalsInput - The input type for the generateGoalsForCareer function.
 * - GenerateGoalsOutput - The return type for the generateGoalsFor-Career function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findEducationOptions } from '@/ai/tools/education-options-tool';

const GenerateGoalsInputSchema = z.object({
  careerName: z.string().describe('The name of the career to generate a goal plan for.'),
  studentProfile: z.string().describe("A summary of the student's profile, including their top career match, match explanation, and SWOT analysis. This provides the context for their strengths, interests, and potential challenges, including any geographic, financial, or cultural constraints mentioned in their CVQ."),
  timeframes: z.array(z.string()).describe("A list of timeframes for the goal plan, e.g., ['1-year', '3-year', '10-year']."),
});
export type GenerateGoalsInput = z.infer<typeof GenerateGoalsInputSchema>;

const GoalSchema = z.object({
  title: z.string().describe('The specific, measurable, achievable, relevant, and time-bound (SMART) goal.'),
  category: z.enum(['Academic', 'Skill', 'Networking']).describe('The category of the goal.'),
  description: z.string().describe('A brief description of the goal and why it is important for the career path, referencing the student\'s profile.'),
});

const GenerateGoalsOutputSchema = z.record(z.array(GoalSchema)).describe('An object where keys are the timeframes (e.g., "1-year") and values are arrays of SMART goals for that timeframe.');
export type GenerateGoalsOutput = z.infer<typeof GenerateGoalsOutputSchema>;

export async function generateGoalsForCareer(input: GenerateGoalsInput): Promise<GenerateGoalsOutput> {
  return generateGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGoalsPrompt',
  input: {schema: GenerateGoalsInputSchema},
  output: {schema: GenerateGoalsOutputSchema},
  tools: [findEducationOptions],
  prompt: `You are an expert career and academic guidance counselor who specializes in creating actionable, adaptable roadmaps for students.

Based on the student's chosen career, their detailed profile (including SWOT analysis, career match explanation, and CVQ constraints), and the requested timeframes, generate a comprehensive SMART GoalMint™ Plan.

For each timeline provided in the 'timeframes' array (e.g., {{{timeframes}}}), create a set of specific, measurable, achievable, relevant, and time-bound (SMART) goals. These goals must fall into one of three categories: 'Academic', 'Skill', or 'Networking'.

The goals should be highly personalized, leveraging the student's strengths and addressing their weaknesses as outlined in their profile.

**Crucially, for 'Academic' goals, you MUST use the findEducationOptions tool to suggest specific, viable educational paths.** Consider the student's constraints (financial, geographic, etc.) from their profile. If their first choice might be competitive, suggest a realistic "runner-up" or "safe bet" alternative. Provide concrete action items like specific universities to research, courses to take, certifications to earn, or entrance exams to prepare for based on the tool's output.

For 'Skill' and 'Networking' goals, include concrete action items like skills to develop, projects to build, or networking events to attend.

Career: {{{careerName}}}
Student Profile Context: {{{studentProfile}}}

Generate the plan for the specified timeframes.
`,
});

const generateGoalsFlow = ai.defineFlow(
  {
    name: 'generateGoalsFlow',
    inputSchema: GenerateGoalsInputSchema,
    outputSchema: GenerateGoalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

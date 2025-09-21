'use server';
/**
 * @fileOverview Generates a SMART goal plan for a given career path and custom timelines.
 *
 * - generateGoalsForCareer - A function that generates the goal plan.
 * - GenerateGoalsInput - The input type for the generateGoalsForCareer function.
 * - GenerateGoalsOutput - The return type for the generateGoalsForCareer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGoalsInputSchema = z.object({
  careerName: z.string().describe('The name of the career to generate a goal plan for.'),
  studentProfile: z.string().describe("A summary of the student's profile, including skills, interests, and personality traits."),
  timeframes: z.array(z.string()).describe("A list of timeframes for the goal plan, e.g., ['1-year', '3-year', '10-year']."),
});
export type GenerateGoalsInput = z.infer<typeof GenerateGoalsInputSchema>;

const GoalSchema = z.object({
  title: z.string().describe('The specific, measurable, achievable, relevant, and time-bound (SMART) goal.'),
  category: z.enum(['Academic', 'Skill', 'Networking']).describe('The category of the goal.'),
  description: z.string().describe('A brief description of the goal and why it is important for the career path.'),
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
  prompt: `You are an expert career planner who specializes in creating actionable roadmaps for students.

Based on the student's chosen career, their profile, and the requested timeframes, generate a comprehensive SMART GoalMint™ Plan.

For each timeline provided in the 'timeframes' array (e.g., {{{timeframes}}}), create a set of specific, measurable, achievable, relevant, and time-bound (SMART) goals. These goals must fall into one of three categories: 'Academic', 'Skill', or 'Networking'.

Include concrete action items like specific courses to take, skills to develop, projects to build, certifications to earn, or networking events to attend.

Career: {{{careerName}}}
Student Profile: {{{studentProfile}}}

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

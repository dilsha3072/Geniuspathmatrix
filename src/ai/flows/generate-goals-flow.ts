'use server';

/**
 * @fileOverview A flow for generating a SMART goal plan for a student.
 * 
 * - generateGoals - A function that creates a personalized goal plan.
 * - GenerateGoalsInput - The input type for the generateGoals function.
 * - GenerateGoalsOutput - The return type for the generateGoals function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GoalSchema = z.object({
    id: z.string().describe("A unique identifier for the goal (e.g., 'academic-1')."),
    title: z.string().describe('A concise, one-sentence title for the goal.'),
    category: z.enum(['Academic', 'Skill', 'Networking']).describe('The category of the goal.'),
    description: z.string().describe('A detailed, 2-3 sentence SMART description of the goal (Specific, Measurable, Achievable, Relevant, Time-bound).'),
});

const GenerateGoalsInputSchema = z.object({
  careerName: z.string().describe("The student's chosen career path."),
  studentProfile: z.string().describe("A JSON string containing the student's assessment results and career suggestions."),
  timeframes: z.array(z.string()).describe("An array of timeframes for which to generate goals (e.g., ['1-year', '3-year', '5-year'])."),
});
export type GenerateGoalsInput = z.infer<typeof GenerateGoalsInputSchema>;

const GenerateGoalsOutputSchema = z.record(z.array(GoalSchema)).describe("An object where keys are the timeframes (e.g., '1-year') and values are arrays of goals for that timeframe.");
export type GenerateGoalsOutput = z.infer<typeof GenerateGoalsOutputSchema>;


export async function generateGoals(input: GenerateGoalsInput): Promise<GenerateGoalsOutput> {
  return generateGoalsFlow(input);
}


const generateGoalsFlow = ai.defineFlow(
  {
    name: 'generateGoalsFlow',
    inputSchema: GenerateGoalsInputSchema,
    outputSchema: GenerateGoalsOutputSchema,
  },
  async ({ careerName, studentProfile, timeframes }) => {
    const systemPrompt = `You are an expert career and academic advisor AI named "GoalMint". Your task is to create a comprehensive and personalized SMART goal plan for a student based on their chosen career path and their detailed assessment profile.

The plan should be broken down into specific timeframes provided by the user (e.g., 1-year, 3-year, 5-year).

For each timeframe, you must generate a set of goals across three categories:
1.  **Academic**: Concrete educational milestones (e.g., courses to take, degrees to pursue, certifications to earn).
2.  **Skill**: Specific hard and soft skills to develop (e.g., learning a programming language, improving public speaking).
3.  **Networking**: Actionable steps to build professional connections (e.g., attending industry events, conducting informational interviews).

**CRITICAL INSTRUCTIONS**:
*   **SMART Goals**: Every goal must be Specific, Measurable, Achievable, Relevant, and Time-bound. The description for each goal must reflect this.
*   **Personalization**: The goals must be highly relevant to the student's chosen career (${careerName}) and their unique profile (interests, skills, personality). Refer to the provided student profile to tailor your suggestions.
*   **Action-Oriented**: Phrase goals in a way that encourages action.
*   **Structured Output**: Your output must be a JSON object where the keys are the requested timeframes (e.g., "1-year", "3-year") and the value for each key is an array of goal objects. Each goal object must have an id, title, category, and a detailed SMART description.

**Example Goal for a future Software Engineer:**
{
  "id": "skill-1",
  "title": "Master a Front-End JavaScript Framework",
  "category": "Skill",
  "description": "Dedicate 5-7 hours per week over the next 6 months to complete a comprehensive online course on React.js. Build and deploy at least three small projects to a personal portfolio to demonstrate measurable proficiency."
}

Analyze the student's profile and chosen career, then generate a detailed and actionable plan for the following timeframes: ${timeframes.join(', ')}.`;

    const { output } = await ai.generate({
      system: systemPrompt,
      prompt: `Student Profile for ${careerName}: ${studentProfile}`,
      output: { schema: GenerateGoalsOutputSchema },
    });
    
    if (!output) {
      console.error("AI failed to return valid goals. Returning empty object.");
      return {};
    }

    return output;
  }
);

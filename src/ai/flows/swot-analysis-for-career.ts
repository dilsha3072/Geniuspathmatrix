'use server';

/**
 * @fileOverview Generates a SWOT analysis for a student considering a specific career.
 * 
 * - getSWOTAnalysisForCareer - A function that takes a career name and student profile to generate a SWOT analysis.
 * - SWOTAnalysisInput - The input type for the function.
 * - SWOTAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SWOTAnalysisInputSchema = z.object({
  careerName: z.string().describe('The career for which to generate the analysis.'),
  studentProfile: z.string().describe('A JSON string of the student\'s assessment results (personality, interests, skills).'),
});
export type SWOTAnalysisInput = z.infer<typeof SWOTAnalysisInputSchema>;

export type SWOTAnalysisOutput = string;


export async function getSWOTAnalysisForCareer(input: SWOTAnalysisInput): Promise<SWOTAnalysisOutput> {
    return swotAnalysisFlow(input);
}


const swotAnalysisFlow = ai.defineFlow(
  {
    name: 'swotAnalysisFlow',
    inputSchema: SWOTAnalysisInputSchema,
    outputSchema: z.string(),
  },
  async ({ careerName, studentProfile }) => {
    const systemPrompt = `You are a career strategy expert. Your task is to generate a concise SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for a student considering a specific career path.

You will be given the student's profile and their chosen career.

**Instructions**:
1.  **Analyze Strengths**: Based on the student's profile, what are their internal strengths that align with this career? (e.g., "High 'Openness' score aligns with the creativity needed in Graphic Design.")
2.  **Analyze Weaknesses**: What internal weaknesses or skill gaps might they need to address? (e.g., "Lower confidence in public speaking could be a challenge in a sales role.")
3.  **Identify Opportunities**: What external factors or trends could benefit them in this career? (e.g., "The growing demand for data scientists provides ample job opportunities.")
4.  **Identify Threats**: What external factors could pose a challenge? (e.g., "Automation may impact certain administrative roles in the long term.")

**Output Format**:
Provide the output as a single, formatted string. Use markdown-style headings for each section. For example:

**Strengths:**
- [Strength 1]
- [Strength 2]

**Weaknesses:**
- [Weakness 1]
- [Weakness 2]

**Opportunities:**
- [Opportunity 1]
- [Opportunity 2]

**Threats:**
- [Threat 1]
- [Threat 2]
`;

    const { output } = await ai.generate({
        system: systemPrompt,
        prompt: `Generate a SWOT analysis for the career of "${careerName}" based on this student profile: ${studentProfile}`,
    });

    return output?.text ?? "Could not generate SWOT analysis at this time.";
  }
);

'use server';

/**
 * @fileOverview A tool for the Mentor AI to look up educational paths.
 * 
 * - getEducationOptions - A Genkit tool definition for finding education options.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EducationOptionsInputSchema = z.object({
  careerName: z.string().describe('The name of the career to find educational options for.'),
  level: z.enum(['certificate', 'degree', 'online course']).optional().describe('The level of education to search for.'),
});

const EducationOptionSchema = z.object({
  programName: z.string(),
  institution: z.string(),
  type: z.string().describe('E.g., Bachelor of Science, Professional Certificate'),
  duration: z.string().describe('E.g., 4 years, 6 months'),
});

const EducationOptionsOutputSchema = z.array(EducationOptionSchema);

// This is a mock tool. In a real application, this would query a database
// of educational programs or an external API like Coursera or a university search API.
const mockEducationDB: z.infer<typeof EducationOptionsOutputSchema> = [
    { programName: "Bachelor of Science in Computer Science", institution: "State University", type: "Degree", duration: "4 years" },
    { programName: "Data Science Professional Certificate", institution: "Tech Institute Online", type: "Certificate", duration: "9 months" },
    { programName: "Introduction to Graphic Design", institution: "Design Academy", type: "Online Course", duration: "8 weeks" },
    { programName: "Full-Stack Web Development Bootcamp", institution: "Code Labs", type: "Certificate", duration: "6 months" },
    { programName: "Master of Business Administration (MBA)", institution: "Commerce College", type: "Degree", duration: "2 years" },
    { programName: "Digital Marketing Specialization", institution: "Online University", type: "Online Course", duration: "7 months" },
];


export const getEducationOptions = ai.defineTool(
  {
    name: 'getEducationOptions',
    description: 'Looks up potential educational programs, degrees, or courses for a given career path. Use this when a student asks about what to study or where to go to school.',
    inputSchema: EducationOptionsInputSchema,
    outputSchema: EducationOptionsOutputSchema,
  },
  async (input) => {
    console.log(`[EducationTool] Searching for options for career: ${input.careerName} at level: ${input.level || 'any'}`);
    
    // Simulate a database lookup
    const results = mockEducationDB.filter(option => {
        const careerLower = input.careerName.toLowerCase();
        const programLower = option.programName.toLowerCase();
        
        let match = false;
        if (careerLower.includes('computer') || careerLower.includes('software') || careerLower.includes('web')) {
            match = programLower.includes('computer science') || programLower.includes('web development');
        }
        if (careerLower.includes('data')) {
            match = programLower.includes('data science');
        }
         if (careerLower.includes('design')) {
            match = programLower.includes('graphic design');
        }
        if (careerLower.includes('business') || careerLower.includes('marketing')) {
            match = programLower.includes('business') || programLower.includes('marketing');
        }

        if (input.level) {
            return match && option.type.toLowerCase().includes(input.level);
        }
        return match;
    });

    return results.length > 0 ? results : mockEducationDB.slice(0, 2); // return top 2 if no specific match
  }
);

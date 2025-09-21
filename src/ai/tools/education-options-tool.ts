'use server';

/**
 * @fileOverview A tool for finding and filtering educational options.
 *
 * - findEducationOptions - An AI tool that allows searching for educational programs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Mock database of educational institutions. In a real app, this would be a database or an external API.
const educationDB = [
  { id: 'stanford_cs', name: 'Stanford University, Computer Science', country: 'USA', city: 'Stanford', annualTuition: 60000, ranking: 2, type: 'university', field: 'Computer Science' },
  { id: 'mit_cs', name: 'Massachusetts Institute of Technology (MIT), Computer Science', country: 'USA', city: 'Cambridge', annualTuition: 62000, ranking: 1, type: 'university', field: 'Computer Science' },
  { id: 'cmu_cs', name: 'Carnegie Mellon University, Computer Science', country: 'USA', city: 'Pittsburgh', annualTuition: 63000, ranking: 3, type: 'university', field: 'Computer Science' },
  { id: 'uiuc_cs', name: 'University of Illinois Urbana-Champaign, Computer Science', country: 'USA', city: 'Champaign', annualTuition: 40000, ranking: 5, type: 'university', field: 'Computer Science' },
  { id: 'ga_tech_cs', name: 'Georgia Institute of Technology, Computer Science', country: 'USA', city: 'Atlanta', annualTuition: 35000, ranking: 6, type: 'university', field: 'Computer Science' },
  { id: 'coursera_google_pm', name: 'Google Project Management Certificate on Coursera', country: 'Online', city: 'Online', annualTuition: 500, ranking: null, type: 'certification', field: 'Project Management' },
  { id: 'udacity_ds', name: 'Udacity Data Scientist Nanodegree', country: 'Online', city: 'Online', annualTuition: 2000, ranking: null, type: 'nanodegree', field: 'Data Science' },
  { id: 'iit_bombay_cs', name: 'Indian Institute of Technology Bombay, Computer Science', country: 'India', city: 'Mumbai', annualTuition: 3000, ranking: 47, type: 'university', field: 'Computer Science' },
  { id: 'iit_delhi_cs', name: 'Indian Institute of Technology Delhi, Computer Science', country: 'India', city: 'Delhi', annualTuition: 3000, ranking: 48, type: 'university', field: 'Computer Science' },
];

const EducationOptionsSchema = z.object({
    fieldOfStudy: z.string().describe("The field of study the user is interested in, e.g., 'Computer Science', 'Data Science'."),
    country: z.string().optional().describe("The country to search for options in, e.g., 'USA', 'India', 'Online'."),
    maxTuition: z.number().optional().describe("The maximum annual tuition fee the user can afford."),
    programType: z.enum(['university', 'certification', 'nanodegree']).optional().describe("The type of program to search for."),
});

export const findEducationOptions = ai.defineTool(
    {
        name: 'findEducationOptions',
        description: 'Finds educational options like universities or online courses based on various criteria. Useful for suggesting specific academic paths.',
        inputSchema: EducationOptionsSchema,
        outputSchema: z.array(z.object({
            name: z.string(),
            description: z.string(),
        })),
    },
    async (input) => {
        console.log(`[findEducationOptions] Searching with input:`, input);
        let results = educationDB.filter(option => 
            option.field.toLowerCase().includes(input.fieldOfStudy.toLowerCase())
        );

        if (input.country) {
            results = results.filter(option => option.country === input.country);
        }
        if (input.maxTuition) {
            results = results.filter(option => option.annualTuition <= input.maxTuemption);
        }
        if (input.programType) {
            results = results.filter(option => option.type === input.programType);
        }
        
        // Sort by ranking (best first), putting unranked items last
        results.sort((a, b) => {
            if (a.ranking === null) return 1;
            if (b.ranking === null) return -1;
            return a.ranking - b.ranking;
        });

        // Return a simplified summary for the AI
        return results.slice(0, 5).map(option => ({ // Limit to top 5 results
            name: option.name,
            description: `Type: ${option.type}, Location: ${option.city}, ${option.country}, Annual Tuition: $${option.annualTuition}, Ranking: ${option.ranking || 'N/A'}`
        }));
    }
);

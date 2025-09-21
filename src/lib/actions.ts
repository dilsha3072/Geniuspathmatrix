
'use server';

import { suggestCareers, SuggestCareersInput } from '@/ai/flows/ai-career-suggestions';
import { getSwotAnalysis, SwotAnalysisInput } from '@/ai/flows/swot-analysis-for-career';
import { generateGoalsForCareer, GenerateGoalsInput } from '@/ai/flows/generate-goals-flow';
import { getSocraticResponse, Message } from '@/ai/flows/mentor-flow';

export async function getCareerSuggestions(input: SuggestCareersInput) {
  try {
    const suggestions = await suggestCareers(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    return { success: false, error: 'Failed to generate career suggestions.' };
  }
}

export async function generateSwotAnalysis(input: SwotAnalysisInput) {
  try {
    const analysis = await getSwotAnalysis(input);
    return { success: true, data: analysis };
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    return { success: false, error: 'Failed to generate SWOT analysis.' };
  }
}

export async function getGeneratedGoals(input: GenerateGoalsInput) {
    try {
        const goals = await generateGoalsForCareer(input);
        return { success: true, data: goals };
    } catch (error) {
        console.error('Error generating goals:', error);
        return { success: false, error: 'Failed to generate goals.' };
    }
}

export async function sendParentQuiz(parentContact: { email?: string, phone?: string }) {
  // TODO: Implement actual email/SMS sending logic here.
  // This is a placeholder to simulate the action.
  console.log('Simulating sending parent quiz to:', parentContact);
  if (!parentContact.email && !parentContact.phone) {
    return { success: false, error: 'No contact information provided.' };
  }
  // In a real app, you would generate a unique, secure link to the /parent-quiz page.
  const quizLink = '/parent-quiz'; 
  console.log(`(Pretend) Sending link ${quizLink} to parent.`);
  
  // Simulate success
  return { success: true, message: 'Parent quiz sent successfully!' };
}

export async function getMentorResponse(messages: Message[]) {
  try {
    const response = await getSocraticResponse(messages);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error getting mentor response:', error);
    return { success: false, error: 'Failed to get mentor response.' };
  }
}

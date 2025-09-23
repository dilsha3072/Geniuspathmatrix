
'use server';

import { suggestCareers, SuggestCareersInput } from '@/ai/flows/ai-career-suggestions';
import { getSwotAnalysis, SwotAnalysisInput } from '@/ai/flows/swot-analysis-for-career';
import { generateGoalsForCareer, GenerateGoalsInput } from '@/ai/flows/generate-goals-flow';
import { getSocraticResponse, MentorInput, Message } from '@/ai/flows/mentor-flow';
import { auth, db } from '@/lib/firebase-admin'; // Using admin SDK on the server
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';


// This helper function assumes you have a way to get the current user's ID.
// In a real app, you'd get this from the session. For now, we'll pass it in.
async function getCurrentUserId(request: { userId?: string }): Promise<string> {
    // In a real Next.js app with server-side auth, you'd verify the session token.
    // For this prototype, we're trusting the client to send the userId.
    if (request.userId) {
        return request.userId;
    }
    // This is a fallback and should be replaced with proper session management.
    const users = await auth.listUsers(1);
    if (users.users.length > 0) return users.users[0].uid;
    throw new Error('User not authenticated');
}


export async function getCareerSuggestions(input: SuggestCareersInput & { userId: string }) {
  try {
    const userId = input.userId;
    const suggestions = await suggestCareers(input);
    
    // Save assessment answers and career suggestions to Firestore
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        assessment: {
            ...input,
            updatedAt: new Date(),
        },
        careerSuggestions: suggestions,
    });
    
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate career suggestions.';
    return { success: false, error: errorMessage };
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

export async function getGeneratedGoals(input: GenerateGoalsInput & { userId: string }) {
    try {
        const userId = input.userId;
        const goals = await generateGoalsForCareer(input);
        
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            goalPlan: goals,
        });

        return { success: true, data: goals };
    } catch (error)
 {
        console.error('Error generating goals:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate goals.';
        return { success: false, error: errorMessage };
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
  const quizLink = '/parent-quiz?uid=<some-unique-token>'; 
  console.log(`(Pretend) Sending link ${quizLink} to parent.`);
  
  // Simulate success
  return { success: true, message: 'Parent quiz sent successfully!' };
}

export async function getMentorResponse(input: MentorInput & { userId: string }) {
  try {
    const userId = input.userId;
    const response = await getSocraticResponse(input);
    
    // Save both user message and model response to Firestore
    const userDocRef = doc(db, "users", userId);
    const userMessage = input.messages[input.messages.length - 1];

    // Use arrayUnion to add the new messages to the chat history
    await updateDoc(userDocRef, {
        mentorChat: arrayUnion(userMessage, { role: 'model', content: response })
    }, { merge: true }); // Use merge to avoid overwriting the whole document
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error getting mentor response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get mentor response.';
    return { success: false, error: errorMessage };
  }
}

export async function getUserData(userId: string) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated." };
        }
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            // This case can happen if the user document wasn't created on signup
            // For robustness, we could create it here, but for now, we return null.
            return { success: true, data: null };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data.';
        return { success: false, error: errorMessage };
    }
}

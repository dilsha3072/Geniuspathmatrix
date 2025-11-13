
'use server';

import { suggestCareers, SuggestCareersInput } from '@/ai/flows/ai-career-suggestions';
import { generateGoalsForCareer, GenerateGoalsInput } from '@/ai/flows/generate-goals-flow';
import { getSocraticResponse, MentorInput } from '@/ai/flows/mentor-flow';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

type GeneralInfo = {
    dob: string;
    gender: string;
    classOfStudy: string;
    place: string;
    schoolOrCollege: string;
};

export async function getCareerSuggestions(input: SuggestCareersInput & { userId: string, generalInfo: GeneralInfo }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");

    // 1. Get career suggestions from the AI flow
    const suggestions = await suggestCareers(input);
    
    // 2. Save assessment data and suggestions to the user's document
    const userDocRef = db.collection("users").doc(userId);
    await userDocRef.set({
        assessment: {
            ...input,
            updatedAt: FieldValue.serverTimestamp(),
        },
        careerSuggestions: suggestions,
    }, { merge: true });

    // 3. Generate and save the summary report
    const reportDocRef = db.collection("reports").doc(userId);
    const reportData = {
        userId: userId,
        assessmentSummary: {
            personality: input.personality.substring(0, 100) + '...', // Store a summary
            interest: input.interest.substring(0, 100) + '...',
            cognitiveAbilities: input.cognitiveAbilities.substring(0, 100) + '...',
            cvq: input.cvq.substring(0, 100) + '...',
        },
        generatedAt: FieldValue.serverTimestamp(),
    };
    await reportDocRef.set(reportData, { merge: true });
    
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate career suggestions.';
    return { success: false, error: errorMessage };
  }
}

export async function getGeneratedGoals(input: GenerateGoalsInput & { userId: string }) {
    try {
        const userId = input.userId;
        if (!userId) throw new Error("User not authenticated.");

        const goals = await generateGoalsForCareer(input);
        
        const userDocRef = db.collection("users").doc(userId);
        await userDocRef.update({
            goalPlan: goals,
            'careerSuggestions.0.selected': true, // Mark the first career as selected for goal planning
        });

        return { success: true, data: goals };
    } catch (error)
 {
        console.error('Error generating goals:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate goals.';
        return { success: false, error: errorMessage };
    }
}

export async function sendParentQuiz(data: { email?: string, phone?: string, studentId: string }) {
  console.log('Simulating sending parent quiz for student:', data.studentId);
  if (!data.email && !data.phone) {
    return { success: false, error: 'No contact information provided.' };
  }
  // In a real app, you would use a unique token for the student.
  const quizLink = `/parent-quiz?studentId=${data.studentId}`; 
  console.log(`(Pretend) Sending link ${quizLink} to parent with contact:`, { email: data.email, phone: data.phone });
  
  return { success: true, message: 'Parent quiz has been sent successfully!' };
}

export async function saveParentQuizAnswers(data: { studentId: string, answers: Record<string, string> }) {
    try {
        const { studentId, answers } = data;
        if (!studentId || !answers) {
            throw new Error('Missing student ID or answers for parent quiz.');
        }

        const answersCollectionRef = db.collection('parentAnswers');
        await answersCollectionRef.add({
            studentId,
            answers,
            submittedAt: FieldValue.serverTimestamp(),
        });
        
        return { success: true, message: 'Answers saved successfully.' };
    } catch (error) {
        console.error('Error saving parent quiz answers:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save parent quiz answers.';
        return { success: false, error: errorMessage };
    }
}


export async function getMentorResponse(input: MentorInput & { userId: string }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");
    
    const response = await getSocraticResponse(input);
    
    const userDocRef = db.collection("users").doc(userId);
    const userMessage = input.messages[input.messages.length - 1];

    // Check if the chat history exists, if not, create it before updating
    const userDoc = await userDocRef.get();
    if (!userDoc.exists() || !userDoc.data()?.mentorChat) {
         await userDocRef.set({ mentorChat: [] }, { merge: true });
    }
    
    // Atomically add both the user's message and the model's response
    await userDocRef.update({
        mentorChat: FieldValue.arrayUnion(userMessage, { role: 'model', content: response })
    });
    
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
        const userDocRef = db.collection("users").doc(userId);
        const docSnap = await userDocRef.get();

        if (docSnap.exists) {
            // Firestore admin SDK returns Timestamps, which are not directly serializable
            // for client components. We need to convert them.
            const data = docSnap.data();
            if (data) {
                // A simple and safe way to convert all timestamps in a nested object
                const serializableData = JSON.parse(JSON.stringify(data, (key, value) => {
                    if (value && value.toDate) { // Check if it's a Firestore Timestamp
                        return value.toDate().toISOString();
                    }
                    return value;
                }));
                return { success: true, data: serializableData };
            }
             return { success: true, data: null };
        } else {
            return { success: true, data: null };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data.';
        return { success: false, error: errorMessage };
    }
}

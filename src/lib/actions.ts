
'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import type { GoalPlan, CareerSuggestion } from './types';
import { FieldValue } from 'firebase-admin/firestore';


type GeneralInfo = {
    dob: string;
    gender: string;
    classOfStudy: string;
    place: string;
    schoolOrCollege: string;
};

type SuggestCareersInput = {
    personality: string;
    interest: string;
    cognitiveAbilities: string;
    selfReportedSkills: string;
    cvq: string;
}

type GenerateGoalsInput = {
    careerName: string;
    studentProfile: string;
    timeframes: string[];
}

type MentorInput = {
    messages: { role: 'user' | 'model', content: string }[];
    studentProfile: string;
}


export async function createUserDocument(user: { uid: string; email: string | null, username: string, phone: string }) {
    try {
        const userDocRef = adminDb.collection("users").doc(user.uid);
        await userDocRef.set({
            uid: user.uid,
            email: user.email,
            username: user.username,
            phone: user.phone,
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error creating user document:', error);
        // Check for specific Firestore errors if needed, e.g., permissions
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user document.';
        return { success: false, error: errorMessage };
    }
}


export async function getCareerSuggestions(input: SuggestCareersInput & { userId: string, generalInfo: GeneralInfo }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");

    // MOCK: Return mock career suggestions
    const suggestions: CareerSuggestion[] = [
        {
            careerName: "Software Engineer",
            careerDescription: "Designs, develops, and maintains software applications. It's a field with high demand and diverse opportunities.",
            matchExplanation: "Your strong logical reasoning and interest in building things make this a great fit. Your personality suggests you enjoy complex problem-solving.",
            swotAnalysis: `**Strengths:**
- High problem-solving skills.
- Interest in technology.

**Weaknesses:**
- Limited experience with large-scale projects.

**Opportunities:**
- High demand for software engineers.
- Many free online resources to learn.

**Threats:**
- Fast-paced industry requires constant learning.
- AI code generation tools might change the landscape.`
        },
        {
            careerName: "Graphic Designer",
            careerDescription: "Creates visual concepts to communicate ideas that inspire, inform, or captivate consumers. They work with both text and images.",
            matchExplanation: "Your artistic interests and creative personality are a perfect match for this career. Your attention to detail is also a great asset.",
            swotAnalysis: `**Strengths:**
- High creativity and artistic interest.
- Good attention to detail.

**Weaknesses:**
- May need to build a stronger portfolio.

**Opportunities:**
- Freelance opportunities are abundant.
- Growing need for digital design skills.

**Threats:**
- Competitive field.
- AI image generation tools.`
        },
    ];
    
    // 2. Save assessment data and suggestions to the user's document
    const userDocRef = adminDb.collection("users").doc(userId);
    await userDocRef.set({
        assessment: {
            ...input,
            updatedAt: FieldValue.serverTimestamp(),
        },
        careerSuggestions: suggestions,
    }, { merge: true });

    // 3. Generate and save the summary report
    const reportDocRef = adminDb.collection("reports").doc(userId);
    const reportData = {
        userId: userId,
        assessmentSummary: {
            personality: input.personality?.substring(0, 100) + '...', // Store a summary
            interest: input.interest?.substring(0, 100) + '...',
            cognitiveAbilities: input.cognitiveAbilities?.substring(0, 100) + '...',
            cvq: input.cvq?.substring(0, 100) + '...',
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

        // MOCK: Return mock goals
        const goals: GoalPlan = {
            '1-year': [
                { id: 'acad-1', title: 'Complete an online Python course', category: 'Academic', description: 'Finish a comprehensive Python for beginners course on Coursera or Udemy within 6 months.' },
                { id: 'skill-1', title: 'Build a personal portfolio website', category: 'Skill', description: 'Create and deploy a simple website to showcase your projects using HTML, CSS, and basic JavaScript.' }
            ],
            '3-year': [
                { id: 'acad-2', title: 'Achieve a relevant certification', category: 'Academic', description: 'Obtain a certification like AWS Certified Cloud Practitioner to demonstrate foundational cloud knowledge.' },
                { id: 'net-1', title: 'Attend 3 industry meetups', category: 'Networking', description: 'Find and attend local or virtual meetups related to your chosen career path.' }
            ]
        };
        
        const userDocRef = adminDb.collection("users").doc(userId);
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

        const answersCollectionRef = adminDb.collection('parentAnswers');
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
    
    // MOCK: Return a mock Socratic response
    const response = "That's an interesting thought. Can you tell me more about what led you to that conclusion?";
    
    const userDocRef = adminDb.collection("users").doc(userId);
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
        const userDocRef = adminDb.collection("users").doc(userId);
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

export async function getAppData(docId: string) {
    try {
        const appDataRef = adminDb.collection("app_data").doc(docId);
        const docSnap = await appDataRef.get();

        if (docSnap.exists) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: `Document ${docId} not found.` };
        }
    } catch (error) {
        console.error('Error fetching app data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch app data.';
        return { success: false, error: errorMessage };
    }
}

// This function is for seeding the database with initial data.
// It is not meant to be a part of the regular application flow.
export async function seedDatabase() {
    try {
        const batch = adminDb.batch();

        const assessmentRef = adminDb.collection('app_data').doc('assessment');
        batch.set(assessmentRef, {
            questions: {
                personality: [
                    { id: 'p1', question: 'I am the life of the party.' },
                    { id: 'p2', question: 'I am always prepared.' },
                    { id: 'p3', question: 'I get stressed out easily.' },
                    { id: 'p4', question: 'I have a rich vocabulary.' },
                    { id: 'p5', question: 'I am not interested in other people\'s problems.' },
                    { id: 'p6', question: 'I leave my belongings around.' },
                    { id: 'p7', question: 'I am relaxed most of the time.' },
                    { id: 'p8', question: 'I have difficulty understanding abstract ideas.' },
                    { id: 'p9', question: 'I feel comfortable around people.' },
                    { id: 'p10', question: 'I pay attention to details.' }
                ],
                interest: [
                    { id: 'i1', question: 'Building kitchen cabinets' },
                    { id: 'i2', question: 'Developing a new medicine' },
                    { id: 'i3', question: 'Writing books or plays' },
                    { id: 'i4', question: 'Teaching school' },
                    { id: 'i5', question: 'Buying and selling stocks and bonds' },
                    { id: 'i6', question: 'Operating a copy machine' },
                    { id: 'i7', question: 'Assembling electronic parts' },
                    { id: 'i8', question: 'Doing scientific experiments' },
                    { id: 'i9', question: 'Singing in a band' },
                    { id: 'i10', question: 'Helping people with personal or emotional problems' }
                ],
                cognitive: [
                    { id: 'c1', question: 'Which number logically follows this series? 4, 6, 9, 6, 14, 6, ...', options: ['6', '17', '19', '21'] },
                    { id: 'c2', question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. Then, how is A related to D?', options: ['Grandfather', 'Grandmother', 'Daughter', 'Granddaughter'] },
                    { id: 'c3', question: 'An animal shelter has a 30% discount on all cats, and a 10% discount on all dogs. If a cat costs $100 and a dog costs $150, what is the total cost for one of each?', options: ['$200', '$205', '$210', '$215'] },
                    { id: 'c4', question: 'If you rearrange the letters \'CIFAIPC\' you would have the name of a(n):', options: ['City', 'Animal', 'Ocean', 'River'] },
                    { id: 'c5', question: 'What is the missing number in the series? 2, 5, 10, 17, ?, 37', options: ['24', '26', '28', '30'] }
                ],
                skillMapping: [
                    { id: 's1', question: 'Analyzing data and drawing conclusions' },
                    { id: 's2', question: 'Leading a team to achieve a goal' },
                    { id: 's3', question: 'Coming up with creative ideas' },
                    { id: 's4', question: 'Organizing your work and managing time effectively' },
                    { id: 's5', question: 'Persuading or influencing others' }
                ],
                cvq: [
                    { id: 'v1', section: 'Independence', question: 'I want to be able to make my own decisions.' },
                    { id: 'v2', section: 'Independence', question: 'I want to be able to work on my own.' },
                    { id: 'v3', section: 'Support', question: 'I want a supervisor who backs up the workers with management.' },
                    { id: 'v4', section: 'Support', question: 'I want the company to administer its policies fairly.' },
                    { id: 'v5', section: 'Relationships', question: 'I want to have co-workers who are easy to get along with.' },
                    { id: 'v6', section: 'Relationships', question: 'I want to be able to do things for other people.' },
                    { id: 'v7', section: 'Working Conditions', question: 'I want to have a job where I do not have to worry about being laid off.' },
                    { id: 'v8', section: 'Working Conditions', question: 'I want to be busy all the time.' },
                    { id: 'v9', section: 'Achievement', question: 'I want to make use of my abilities and skills.' },
                    { id: 'v10', question: 'I want to have a sense of accomplishment from my job.' }
                ]
            }
        });

        const reportsRef = adminDb.collection('app_data').doc('reports');
        batch.set(reportsRef, {
            list: [
              { id: 'pathxplore', title: 'PathXplore Full Report', description: 'A comprehensive report detailing your assessment results and top career matches.', requiresAssessment: true, requiresGoalPlan: false },
              { id: 'personality', title: 'Personality Deep Dive', description: 'An in-depth look at your personality traits and how they relate to career satisfaction.', requiresAssessment: true, requiresGoalPlan: false },
              { id: 'goalmint', title: 'GoalMint Action Plan', description: 'A printable version of your personalized 1, 3, and 5-year goal plan.', requiresAssessment: true, requiresGoalPlan: true },
              { id: 'interview', title: 'Interview Prep Guide', description: 'A guide to help you prepare for interviews for your chosen career path.', requiresAssessment: true, requiresGoalPlan: true },
            ]
        });

        await batch.commit();
        console.log('Database seeded successfully!');
        return { success: true };
    } catch (error) {
        console.error("Error seeding database: ", error);
        return { success: false, error: "Failed to seed database." };
    }
}

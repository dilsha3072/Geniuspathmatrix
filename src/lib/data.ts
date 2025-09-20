import type { Mentor, Goal } from './types';

export const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Anya Sharma',
    title: 'AI & Machine Learning Lead',
    specialties: ['Artificial Intelligence', 'Data Science', 'Academia'],
    imageId: 'mentor-1',
  },
  {
    id: '2',
    name: 'Ben Carter',
    title: 'Senior Software Engineer @ Google',
    specialties: ['Software Development', 'Cloud Computing', 'Career Growth'],
    imageId: 'mentor-2',
  },
  {
    id: '3',
    name: 'Chloe Davis',
    title: 'UX/UI Design Director',
    specialties: ['Product Design', 'User Experience', 'Creative Leadership'],
    imageId: 'mentor-3',
  },
  {
    id: '4',
    name: 'David Rodriguez',
    title: 'Startup Founder & CEO',
    specialties: ['Entrepreneurship', 'Business Strategy', 'Venture Capital'],
    imageId: 'mentor-4',
  },
];

export const goals: { [key: string]: Goal[] } = {
  '1-year': [
    { id: '1y-1', title: 'Achieve 90%+ in Mathematics', category: 'Academic', completed: true, dueDate: new Date('2024-05-15') },
    { id: '1y-2', title: 'Complete a Python for Beginners course', category: 'Skill', completed: false, dueDate: new Date('2024-08-30') },
    { id: '1y-3', title: 'Attend a local tech meetup', category: 'Networking', completed: false, dueDate: new Date('2024-11-01') },
  ],
  '3-year': [
    { id: '3y-1', title: 'Internship at a tech company', category: 'Academic', completed: false, dueDate: new Date('2026-06-01') },
    { id: '3y-2', title: 'Build and deploy a full-stack web application', category: 'Skill', completed: false, dueDate: new Date('2025-12-31') },
    { id: '3y-3', title: 'Find a long-term mentor in the software industry', category: 'Networking', completed: false, dueDate: new Date('2025-01-15') },
  ],
  '5-year': [
    { id: '5y-1', title: 'Graduate with a Computer Science degree', category: 'Academic', completed: false, dueDate: new Date('2028-05-20') },
    { id: '5y-2', title: 'Contribute to a major open-source project', category: 'Skill', completed: false, dueDate: new Date('2027-09-01') },
    { id: '5y-3', title: 'Speak at a developer conference', category: 'Networking', completed: false, dueDate: new Date('2028-10-15') },
  ],
};


export const chartData = [
  { name: 'Problem Solving', value: 75 },
  { name: 'Creativity', value: 85 },
  { name: 'Teamwork', value: 90 },
  { name: 'Leadership', value: 60 },
  { name: 'Coding', value: 70 },
  { name: 'Communication', value: 80 },
];

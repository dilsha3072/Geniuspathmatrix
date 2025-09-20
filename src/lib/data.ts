
import type { Goal, CareerPath } from './types';

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

export const careerPaths: CareerPath[] = [
    {
      id: 'swe',
      title: 'Software Engineer',
      description: 'Design, develop, and maintain software systems. A blend of creativity and problem-solving.',
      matchReasons: [
        'Strong alignment with your problem-solving skills shown in the cognitive assessment.',
        'Your interest in building and creating things matches well with software development.',
        'High score in the "Investigative" interest area points towards a good fit.',
      ],
      avgSalary: '$110,000 / year',
      jobOutlook: '22% growth (Much faster than average)',
      minEducation: "Bachelor's Degree",
      responsibilities: [
        'Write clean, efficient code.',
        'Collaborate with cross-functional teams.',
        'Test and debug applications.',
        'Deploy software updates.',
      ],
      skillMatch: [
        { skill: 'Problem Solving', match: 90 },
        { skill: 'Programming', match: 85 },
        { skill: 'Logical Thinking', match: 88 },
        { skill: 'Teamwork', match: 75 },
      ],
    },
    {
      id: 'pm',
      title: 'Product Manager',
      description: 'Guide the success of a product and lead the cross-functional team that is responsible for improving it.',
      matchReasons: [
        'Your personality assessment shows strong leadership and organizational skills.',
        'High "Enterprising" interest score indicates a knack for leading and persuading.',
        'Combines technical understanding with business acumen.',
      ],
      avgSalary: '$125,000 / year',
      jobOutlook: '10% growth (Faster than average)',
      minEducation: "Bachelor's Degree",
      responsibilities: [
        'Define product vision and strategy.',
        'Gather and prioritize product requirements.',
        'Work with design, engineering, and marketing.',
        'Analyze market and competitive conditions.',
      ],
      skillMatch: [
        { skill: 'Leadership', match: 85 },
        { skill: 'Communication', match: 92 },
        { skill: 'Strategic Thinking', match: 88 },
        { skill: 'Organization', match: 95 },
      ],
    },
    {
      id: 'ds',
      title: 'Data Scientist',
      description: 'Extract insights from data. Use scientific methods, processes, and algorithms to solve complex problems.',
       matchReasons: [
        'Excellent performance on analytical questions in the cognitive assessment.',
        'Your "Investigative" and "Conventional" interests align with data analysis.',
        'Curiosity and love for learning new things are key traits for a data scientist.',
      ],
      avgSalary: '$120,000 / year',
      jobOutlook: '36% growth (Much faster than average)',
      minEducation: "Master's Degree often preferred",
      responsibilities: [
        'Collect and clean large datasets.',
        'Build predictive models and machine-learning algorithms.',
        'Present findings to stakeholders.',
        'Identify trends and patterns in data.',
      ],
      skillMatch: [
        { skill: 'Statistics', match: 85 },
        { skill: 'Machine Learning', match: 78 },
        { skill: 'Data Visualization', match: 82 },
        { skill: 'Critical Thinking', match: 90 },
      ],
    },
];

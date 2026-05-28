export type SubTopic = {
  id: string;
  name: string;
  completed: boolean;
};

export type Chapter = {
  id: string;
  name: string;
  subtopics: SubTopic[];
};

export type Subject = {
  name: 'Reasoning' | 'Quants';
  chapters: Chapter[];
};

export const ADDA247_SYLLABUS: Subject[] = [
  {
    name: 'Reasoning',
    chapters: [
      {
        id: 'r1',
        name: 'Puzzles & Seating Arrangement',
        subtopics: [
          { id: 'r1s1', name: 'Circular Seating', completed: false },
          { id: 'r1s2', name: 'Linear Row Arrangement', completed: false },
          { id: 'r1s3', name: 'Box Puzzles', completed: false },
          { id: 'r1s4', name: 'Floor/Flat Puzzles', completed: false },
          { id: 'r1s5', name: 'Scheduling (Months/Days)', completed: false },
        ],
      },
      {
        id: 'r2',
        name: 'Syllogism',
        subtopics: [
          { id: 'r2s1', name: 'Only a Few/Few cases', completed: false },
          { id: 'r2s2', name: 'Possibility cases', completed: false },
        ],
      },
      {
        id: 'r3',
        name: 'Inequality',
        subtopics: [
          { id: 'r3s1', name: 'Direct Inequalities', completed: false },
          { id: 'r3s2', name: 'Coded Inequalities', completed: false },
        ],
      },
      {
        id: 'r4',
        name: 'Coding-Decoding',
        subtopics: [
          { id: 'r4s1', name: 'Chinese Coding', completed: false },
          { id: 'r4s2', name: 'New Pattern Coding', completed: false },
        ],
      },
      {
        id: 'r5',
        name: 'Input-Output',
        subtopics: [
          { id: 'r5s1', name: 'Single Shift', completed: false },
          { id: 'r5s2', name: 'Double Shift Arrangement', completed: false },
        ],
      },
    ],
  },
  {
    name: 'Quants',
    chapters: [
      {
        id: 'q1',
        name: 'Data Interpretation',
        subtopics: [
          { id: 'q1s1', name: 'Table DI', completed: false },
          { id: 'q1s2', name: 'Line Graph', completed: false },
          { id: 'q1s3', name: 'Bar Graph', completed: false },
          { id: 'q1s4', name: 'Pie Chart', completed: false },
          { id: 'q1s5', name: 'Caselet DI', completed: false },
        ],
      },
      {
        id: 'q2',
        name: 'Number Series',
        subtopics: [
          { id: 'q2s1', name: 'Missing Number Series', completed: false },
          { id: 'q2s2', name: 'Wrong Number Series', completed: false },
        ],
      },
      {
        id: 'q3',
        name: 'Arithmetic Word Problems',
        subtopics: [
          { id: 'q3s1', name: 'Percentage & Ratio', completed: false },
          { id: 'q3s2', name: 'Profit, Loss & Discount', completed: false },
          { id: 'q3s3', name: 'Simple & Compound Interest', completed: false },
          { id: 'q3s4', name: 'Time, Speed & Distance', completed: false },
          { id: 'q3s5', name: 'Time & Work', completed: false },
        ],
      },
      {
        id: 'q4',
        name: 'Quadratic Equations',
        subtopics: [
          { id: 'q4s1', name: 'Standard Comparisons', completed: false },
        ],
      },
    ],
  },
];

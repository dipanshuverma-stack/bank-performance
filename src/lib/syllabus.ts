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
          { id: 'r1s6', name: 'Designation Based Puzzles', completed: false },
          { id: 'r1s7', name: 'Uncertain Number of Persons', completed: false },
        ],
      },
      {
        id: 'r2',
        name: 'Syllogism',
        subtopics: [
          { id: 'r2s1', name: 'Only a Few/Few cases', completed: false },
          { id: 'r2s2', name: 'Possibility cases', completed: false },
          { id: 'r2s3', name: 'Reverse Syllogism', completed: false },
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
          { id: 'r4s3', name: 'Condition Based Coding', completed: false },
        ],
      },
      {
        id: 'r5',
        name: 'Input-Output',
        subtopics: [
          { id: 'r5s1', name: 'Single Shift', completed: false },
          { id: 'r5s2', name: 'Double Shift Arrangement', completed: false },
          { id: 'r5s3', name: 'Number Based Input-Output', completed: false },
        ],
      },
      {
        id: 'r6',
        name: 'Critical Reasoning',
        subtopics: [
          { id: 'r6s1', name: 'Statement & Assumption', completed: false },
          { id: 'r6s2', name: 'Course of Action', completed: false },
          { id: 'r6s3', name: 'Cause & Effect', completed: false },
          { id: 'r6s4', name: 'Strength of Argument', completed: false },
        ],
      },
    ],
  },
  {
    name: 'Quants',
    chapters: [
      {
        id: 'q0',
        name: 'Simplification & Approximation',
        subtopics: [
          { id: 'q0s1', name: 'Fraction to % Conversion', completed: false },
          { id: 'q0s2', name: 'Square & Cube Roots', completed: false },
          { id: 'q0s3', name: 'VBODMAS Rule', completed: false },
          { id: 'q0s4', name: 'Approximation Techniques', completed: false },
        ],
      },
      {
        id: 'q1',
        name: 'Data Interpretation',
        subtopics: [
          { id: 'q1s1', name: 'Table DI', completed: false },
          { id: 'q1s2', name: 'Line Graph', completed: false },
          { id: 'q1s3', name: 'Bar Graph', completed: false },
          { id: 'q1s4', name: 'Pie Chart', completed: false },
          { id: 'q1s5', name: 'Caselet DI (Venn Diagram)', completed: false },
          { id: 'q1s6', name: 'Missing DI', completed: false },
          { id: 'q1s7', name: 'Radar/Spider Chart', completed: false },
          { id: 'q1s8', name: 'Arithmetic Based DI', completed: false },
        ],
      },
      {
        id: 'q2',
        name: 'Number Series',
        subtopics: [
          { id: 'q2s1', name: 'Missing Number Series', completed: false },
          { id: 'q2s2', name: 'Wrong Number Series', completed: false },
          { id: 'q2s3', name: 'Double Layer Series', completed: false },
        ],
      },
      {
        id: 'q3',
        name: 'Arithmetic Core',
        subtopics: [
          { id: 'q3s1', name: 'Percentage', completed: false },
          { id: 'q3s2', name: 'Ratio & Proportion', completed: false },
          { id: 'q3s3', name: 'Averages', completed: false },
          { id: 'q3s4', name: 'Mixture & Alligation', completed: false },
          { id: 'q3s5', name: 'Problems on Ages', completed: false },
          { id: 'q3s6', name: 'Partnership', completed: false },
        ],
      },
      {
        id: 'q4',
        name: 'Arithmetic Advance',
        subtopics: [
          { id: 'q4s1', name: 'Profit, Loss & Discount', completed: false },
          { id: 'q4s2', name: 'Simple & Compound Interest', completed: false },
          { id: 'q4s3', name: 'Time, Speed & Distance', completed: false },
          { id: 'q4s4', name: 'Boats & Streams', completed: false },
          { id: 'q4s5', name: 'Time & Work', completed: false },
          { id: 'q4s6', name: 'Pipes & Cisterns', completed: false },
          { id: 'q4s7', name: 'Mensuration 2D & 3D', completed: false },
          { id: 'q4s8', name: 'Probability', completed: false },
          { id: 'q4s9', name: 'Permutation & Combination', completed: false },
        ],
      },
      {
        id: 'q5',
        name: 'Quadratic Equations',
        subtopics: [
          { id: 'q5s1', name: 'Standard Comparisons', completed: false },
          { id: 'q5s2', name: 'Root Comparisons', completed: false },
          { id: 'q5s3', name: 'Coded Quadratic', completed: false },
        ],
      },
      {
        id: 'q6',
        name: 'Data Sufficiency & Comparisons',
        subtopics: [
          { id: 'q6s1', name: 'Data Sufficiency (2 Statement)', completed: false },
          { id: 'q6s2', name: 'Data Sufficiency (3 Statement)', completed: false },
          { id: 'q6s3', name: 'Quantity 1 vs Quantity 2', completed: false },
        ],
      },
    ],
  },
];

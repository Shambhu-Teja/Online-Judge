export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  acceptanceRate: number;
  likes: number;
  dislikes: number;
  examples: Example[];
  constraints: string[];
}

export interface Example {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  solvedProblems: string[];
}

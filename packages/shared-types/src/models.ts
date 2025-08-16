import { Difficulty, QuestionType, Level } from './common';

// Core data models
export interface Role {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  createdAt: Date;
}

export interface Roadmap {
  id: string;
  roleId: string;
  level: Level;
  title: string;
  description: string;
  topics: Topic[];
  estimatedHours: number;
  prerequisites: string[];
  createdAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  questions: string[];
  order: number;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'tutorial' | 'documentation';
}

export interface Question {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  technologies: string[];
  roles: string[];
  companies: string[];
  solution: Solution;
  tags: string[];
  rating: number;
  submittedBy: string;
  createdAt: Date;
}

export interface Solution {
  explanation: string;
  codeExamples: CodeExample[];
  timeComplexity: string;
  spaceComplexity: string;
  alternativeApproaches: string[];
}

export interface CodeExample {
  language: string;
  code: string;
  explanation?: string;
}
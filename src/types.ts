export interface ReferenceExample {
  label: string;
  code: string;
}

export interface ReferenceEntry {
  name: string;
  syntax: string;
  description: string;
  examples: ReferenceExample[];
}

export interface ReferenceCategory {
  id: string;
  title: string;
  summary: string;
  entries: ReferenceEntry[];
}

export interface Exercise {
  prompt: string;
  starterCode?: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  concept: string[];
  examples: ReferenceExample[];
  exercises: Exercise[];
}

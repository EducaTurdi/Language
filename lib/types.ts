export type ExerciseKind = "mcq" | "text" | "order";

export interface McqExercise {
  kind: "mcq";
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

export interface TextExercise {
  kind: "text";
  id: string;
  prompt: string;
  accepted: string[]; // respostas aceitas, normalizadas em minúsculas
  hint?: string;
}

export interface OrderExercise {
  kind: "order";
  id: string;
  prompt: string;
  tokens: string[]; // fora de ordem
  correctOrder: string[]; // ordem correta
  hint?: string;
}

export type Exercise = McqExercise | TextExercise | OrderExercise;

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  xp: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  name: string;
  tagline: string;
  color: "fossil" | "seafoam" | "amber";
  icon: string;
  units: Unit[];
}

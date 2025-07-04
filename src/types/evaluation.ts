export interface Colleague {
  id: string;
  nome: string;
  cargo: string;
  area: string;
  tempo: string;
  projectName: string; 
}

export type Question = {
  id: string;
  type: 'scale' | 'justification' | 'text';
  text: string;
};

export interface Section {
  key: string;
  title: string;
  icon: React.ReactNode;
  total?: number;
  done?: number;
  questions: Question[];
}

export interface Answer {
    trim(): unknown;
    scale?: string;
    justification?: string;
}

export interface Evaluation {
    id: number;
    collaborator: string;
    department: string;
    track: string;
    status: string;
    progress: number;
    deadline: string;
    completedAt: string;
    cycleId: string;
    cycleName: string;
    projectName: string;
    projectId: string;
}

export interface EvaluationTableFromApi {
    data: Evaluation[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }
}

export interface Cycle {
  id: string;
  name: string;
  status: string;
}
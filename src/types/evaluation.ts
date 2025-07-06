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
  id: string               // ← é esse campo que vamos usar
  collaboratorId: string;   // ← É esse que você precisa
  collaborator: string;     // <-- só o nome de exibição
  cycleId: string;
  cycleName: string
  track: string
  status: string
  progress: number
  projectName: string
  deadline: string
  completedAt: string
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

export interface SelfEvaluationRecord {
  userId: string;
  cycleId: string;
  criterionId: string;
  score: number;
  scoreDescription: string;
  justification: string | null;
  criterion: {
    id: string;
    name: string;
  };
}

export interface PeerEvaluationRecord {
  id: string;
  score: number;
  comment?: string;
  evaluatorUser: {
    id: string;
    name: string;
  };
  evaluatedUserId: string;    // ou collaboratorId, como você escolher
  cycleId: string;
}
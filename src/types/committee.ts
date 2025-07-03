export type CommitteeTab = 'equalizacao' | 'insights' | 'exportacao';

export interface CommitteeCollaboratorsEvaluations{
  id: string;
  collaboratorName: string; 
  collaboratorRole: string;
  collaboratorId: string;
  cycleName: string;
  cycleId: string;
  status: 'Completo' | 'Parcial' | 'Pendente';
  selfEvaluationScore: number;
  peerEvaluationScore: number;
  managerEvaluationScore: number;
  finalScore?: number;      // posso adicionar/editar
  observation?: string;     // posso adicionar/editar  
}

export interface CommitteePanelTable{
  evaluations: CommitteeCollaboratorsEvaluations [];
  pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }
}

export interface SummaryApiResponse {
  summary: string;
}

export interface CommitteeSummary{
  readyEvaluations: number;
  overallAverage: number;
  totalCollaborators: number;
  pendingEvaluations: number;
}
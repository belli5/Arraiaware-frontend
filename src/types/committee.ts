export type CommitteeTab = 'equalizacao' | 'insights' | 'exportacao';

export interface ColaboradorAvaliacao {
  id: string;
  nome: string;
  cargo: string;
  status: 'Completo' | 'Parcial' | 'Pendente';
  autoavaliacaoMedia: number;
  paresMedia: number;
  lideresMedia: number;
}

export interface CommitteeSummary{
  readyEvaluations: number;
  overallAverage: number;
  totalCollaborators: number;
  pendingEvaluations: number;
}
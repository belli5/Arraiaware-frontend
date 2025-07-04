export type CriterionType = 'Comportamento' | 'Execução' | 'Gestão e Liderança';

export interface Criterion {
  id: string;
  pillar: CriterionType;
  description: string;
  criterionName: string;
}

export interface Track {
  id: string;
  name: string;
  department: string;
  criteria: Criterion[];
}

export type RHTabId = 'Cadastrar' |'status' | 'criterios' | 'historico' | 'cargos' ;

export type Role = 'Colaborador' | 'Gestor' | 'RH';

export type UploadResult = {
  status: 'success' | 'error';
  title: string;
  message: string;
}

export interface NewCriterionData {
  name: string;
  type: CriterionType;
  description: string;
}

export interface ExistingCriterionData extends NewCriterionData {
  id: string;
}

export interface TracksFromApi{
  id: string;
  nome_da_trilha: string,
  criterios: Criterion[];
  department?: string;
}

export interface ImportHistoryEntry {
  id: string;
  file: string;
  date: string;
  status: string;
}

export interface DashboardData {
  totalEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  overdueEvaluations: number;
}

export interface TrackSignUp {
  id: string; 
  name: string; 
}

export interface RoleFromApi {
  id: string;
  name: string;
  type: "TRILHA" | "CARGO" | "VINCULO";
  description: string;
}
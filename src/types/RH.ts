export type CriterionType = 'Comportamento' | 'Execução' | 'Gestão e Liderança';

export interface Criterion {
  id: number;
  name: string;
  description: string;
  type: CriterionType;
}

export interface Track {
  id: number;
  name: string;
  department: string;
  criteria: Criterion[];
}

export type RHTabId = 'Cadastrar' |'status' | 'criterios' | 'historico' ;

export type Role = 'Colaborador' | 'Gestor' | 'RH';

export type UploadResult = {
  status: 'success' | 'error';
  title: string;
  message: string;
}
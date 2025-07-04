import type { Evaluation, Section } from "./evaluation";

export type managerTabId = 'status' | 'insights' | 'evaluation';

export interface ManagerDashboardData {
  sections: Section[];
  cycleId: string;
  summary: {
    totalCollaborators: number;
    completed: number;
    pending: number;
    overdue: number;
    overallProgress: number; 
  };
  
  evaluations: Evaluation[]; 

  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}
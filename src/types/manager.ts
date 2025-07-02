import type { Evaluation } from "./evaluation";

export type managerTabId = 'status' | 'insights' | 'evaluation';

export interface ManagerDashboardData {
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
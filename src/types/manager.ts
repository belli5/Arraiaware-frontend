import type { Evaluation, Section } from "./evaluation";

export type managerTabId = 'status' | 'evaluation' | 'brutalfact' | 'projeto'


export interface ManagerDashboardData {
  equalizationDate: string | undefined;
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

export interface TeamMemberDto {
  id: string;
  name: string;
  email: string;
}

export interface ManagedTeamDto {
  projectId: string;
  projectName: string;
  cycleId: string;
  cycleName: string;
  collaborators: TeamMemberDto[];
}
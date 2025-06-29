import axios from 'axios';

export interface QuestionDto {
  id: string;
  type: 'scale' | 'justification';
  text: string;
}

export interface CriteriaDto {
  id: string;
  key: string;           // deve bater com section.key
  title: string;
  iconName: string;      // ex: 'FaStar', 'FaUsers', ...
  questions: QuestionDto[];
}

export const criteriaApi = {
  getAll: () => axios.get<CriteriaDto[]>('/criteria'),
};

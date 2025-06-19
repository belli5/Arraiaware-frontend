export interface Colleague {
  id: string;
  nome: string;
  cargo: string;
  area: string;
  tempo: string;
}

export interface Question {
  id: string;
  type: 'scale' | 'text'; 
  text: string;
}

export interface Section {
  key: string;
  title: string;
  icon: React.ReactNode;
  total?: number;
  done?: number;
  questions: Question[];
}
export interface UserData {
    name: string;
    email: string;
    role: {
    type: 'rh' | 'gestor' | 'colaborador';
  };
}
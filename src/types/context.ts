export interface DecodedToken {
  name: string;
  email: string;
  userType: 'ADMIN' | 'RH' | 'GESTOR' | 'COLABORADOR';
  iat: number;
  exp: number;
  id: string
}
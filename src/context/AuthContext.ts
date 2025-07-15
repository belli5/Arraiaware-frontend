import { createContext } from 'react';
import type { DecodedToken } from '../types/context';

export interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;        // agora DecodedToken tem `id: string`
  login: (token: string, decoded: DecodedToken) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
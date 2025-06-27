import { createContext } from 'react';
import type { DecodedToken } from '../types/context';

export interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  login: (token: string, DecodedToken: DecodedToken) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
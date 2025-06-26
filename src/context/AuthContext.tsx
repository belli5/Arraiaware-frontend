import { createContext } from 'react';
import type { UserData } from '../types/context';

export interface AuthContextType {
  token: string | null;
  user: UserData | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
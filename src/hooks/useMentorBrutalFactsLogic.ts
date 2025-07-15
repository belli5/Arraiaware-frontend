
import { useState, useEffect } from 'react';
import type { BrutalFacts } from '../types/committee';

interface Notification {
  status: 'error' | 'success';
  title: string;
  message: string;
}

export function useBrutalFactsLogic() {
  const [brutalFacts, setBrutalFacts] = useState<BrutalFacts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);

  useEffect(() => {
    const rawToken = localStorage.getItem('token');
    if (!rawToken) {
        setNotification({ status: 'error', title: 'Erro de Autenticação', message: 'Faça login para continuar.' });
        return;
    };
    
    try {
      const base64Payload = rawToken.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64Payload)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { sub } = JSON.parse(json);
      setMentorId(sub);
    } catch (e) {
      console.error('Não conseguiu decodificar token:', e);
      setNotification({ status: 'error', title: 'Erro de Autenticação', message: 'Seu token é inválido ou expirou.' });
    }
  }, []);

  useEffect(() => {
    const fetchBrutalFacts = async () => {
      if (!mentorId) return;

      setIsLoading(true);
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`http://localhost:3000/api/mentors/${mentorId}/brutal-facts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch Brutal Facts.');
        
        const data: BrutalFacts[] = await response.json();
        setBrutalFacts(data);

      } catch (err) {
        if (err instanceof Error) {
          setNotification({ status: 'error', title: 'Network Error', message: err.message });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrutalFacts();
  }, [mentorId]);

  return {
    brutalFacts,
    isLoading,
    notification,
  };
}
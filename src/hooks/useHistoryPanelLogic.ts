import { useState, useEffect, useCallback } from 'react';
import type { ImportHistoryEntry } from '../types/RH';

interface HistoryFromApi {
  id: string;
  fileName: string;
  importDate: string;
  status: string;
}

export const useHistoryPanelLogic = () => {
  const [history, setHistory] = useState<ImportHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Autenticação necessária.");
      setIsLoading(false); 
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/import-history', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico: ${response.statusText}`);
      }

      const apiData: HistoryFromApi[] = await response.json();
      const formattedHistory: ImportHistoryEntry[] = apiData.map(item => ({
        id: item.id,
        file: item.fileName,
        date: item.importDate,
        status: item.status,
      }));
      
      setHistory(formattedHistory);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    const loadInitialHistory = async () => {
      setIsLoading(true);
      await fetchHistory();
      setIsLoading(false);
    };

    loadInitialHistory();
  }, [fetchHistory]); 

  const handleDeleteHistory = useCallback(async (id: string) => {
    if (!window.confirm("Você tem certeza que deseja excluir este registro?")) {
      return;
    }
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/api/import-history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Falha ao excluir o registro.');
      
      await fetchHistory(); 
    } catch (err) {
      console.error(err);
      alert((err as Error).message); 
    }
  }, [fetchHistory]); 

  const handleDownload = useCallback(async (entry: ImportHistoryEntry) => {
    setDownloadingId(entry.id);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:3000/api/import-history/${entry.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Não foi possível baixar o arquivo.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = entry.file;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setDownloadingId(null);
    }
  }, []); 

  return {
    history,
    isLoading,
    error,
    downloadingId,
    handleDeleteHistory,
    handleDownload,
    refreshHistory: fetchHistory, 
  };
};
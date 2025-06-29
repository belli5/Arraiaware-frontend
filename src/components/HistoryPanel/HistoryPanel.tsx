import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import ImportHistoryTable from '../ImportHistoryTable/ImportHistoryTable';
import FileUploadZone from '../FileUploadZone/FileUploadZone';
import GuidelinesBox from '../GuidelinesBox/GuidelinesBox';
import HistoryPanelSkeleton from '../HistoryPanelSkeleton/HistoryPanelSkeleton';
import type { ImportHistoryEntry } from '../../types/RH'; 

interface HistoryFromApi {
  id: string;
  fileName: string;
  importDate: string; 
  status: string;
}

export default function HistoryPanel() {
  const [history, setHistory] = useState<ImportHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const fetchHistory = async () => {
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Autenticação necessária.");
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
        date: new Date(item.importDate).toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }),
        status: item.status,
      }));
      
      setHistory(formattedHistory);

    } catch (err) {
      setError((err as Error).message);
    } 
  };

  useEffect(() => {
  const loadInitialHistory = async () => {
    setIsLoading(true);
    await fetchHistory();
    setIsLoading(false);
  };

  loadInitialHistory();
}, []);

  const handleDeleteHistory = async (id: string) => {
    if (!window.confirm("Você tem certeza que deseja excluir este registro do histórico?")) {
      return;
    }
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`http://localhost:3000/api/import-history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir o registro.');
      }
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (entry: ImportHistoryEntry) => {
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
    } finally {
      setDownloadingId(null); 
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md space-y-12">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Importação de Históricos - Arraiware</h2>
        <p className="text-base text-gray-500 mt-1">Faça upload de arquivos Excel ou CSV com históricos de avaliações para utilização imediata</p>
        <FileUploadZone />
      </div>

      <GuidelinesBox />

      <div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Histórico de Importações</h2>
            <p className="text-base text-gray-500 mt-1">Acompanhe o status das importações realizadas</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-semibold">
            <Download className="h-4 w-4" />
            <span>Exportar Log</span>
          </button>
        </div>
        <div className="mt-6">
          {isLoading ? (
            <HistoryPanelSkeleton />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <ImportHistoryTable history={history} onDelete={handleDeleteHistory}  onDownload={handleDownload} downloadingId={downloadingId}/>
          )}
        </div>
      </div>
    </div>
  );
}
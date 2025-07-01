import { useState, useEffect } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect/CustomSelect';
import type { SelectOption } from '../CustomSelect/CustomSelect';
import type { Cycle } from '../../types/evaluation'; 

export default function CommitteeExportPanel() {
  const [cycles, setCycles] = useState<SelectOption[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<SelectOption | null>(null);
  const [isLoadingCycles, setIsLoadingCycles] = useState<boolean>(true);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCycles = async () => {
      setIsLoadingCycles(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Autenticação necessária.");
        setIsLoadingCycles(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/cycles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao buscar ciclos de avaliação.');
        
        const data: Cycle[] = await response.json();
        const formattedCycles = data.map(cycle => ({
          id: cycle.id,
          name: cycle.name,
        }));
        setCycles(formattedCycles);
      } catch (err) {
        setError((err as Error).message);
        console.error("Erro ao buscar ciclos:", err);
      } finally {
        setIsLoadingCycles(false);
      }
    };
    fetchCycles();
  }, []);

  const handleExport = async () => {
    if (!selectedCycle) {
      setError("Por favor, selecione um ciclo para exportar.");
      return;
    }
    
    setIsDownloading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:3000/api/committee/export/cycle/${selectedCycle.id}/excel`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Falha ao exportar o arquivo (Status: ${response.status})`);
      }

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Avaliacoes_Ciclo_${selectedCycle.name.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click(); 
      

      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (err) {
      setError((err as Error).message);
      console.error("Erro ao exportar:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md ">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Exportar Avaliações</h2>
        <p className="text-gray-500 mt-1">Selecione o ciclo para baixar o relatório completo em formato Excel.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-gray-700">Ciclo de Avaliação</label>
        <CustomSelect
          options={cycles}
          selected={selectedCycle}
          onChange={setSelectedCycle}
          placeholder={isLoadingCycles ? "Carregando ciclos..." : "Selecione um ciclo"}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      {/* Card de Download */}
      <div className={`mt-8 border-2 ${selectedCycle ? 'border-orange-500' : 'border-gray-300'} border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all`}>
        <FileDown className={`h-12 w-12 ${selectedCycle ? 'text-orange-500' : 'text-gray-400'}`} />
        <h3 className="mt-4 text-lg font-semibold text-gray-800">Exportar para Excel</h3>
        <p className="mt-1 text-sm text-gray-500">
          Exporte os dados consolidados das avaliações concluídas do ciclo selecionado.
        </p>
        <button
          onClick={handleExport}
          disabled={!selectedCycle || isDownloading || isLoadingCycles}
          className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
        >
          {isDownloading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Exportando...
            </>
          ) : (
            'Baixar Relatório'
          )}
        </button>
      </div>
    </div>
  );
}
import { Download } from 'lucide-react';
import ImportHistoryTable from '../ImportHistoryTable/ImportHistoryTable';
import FileUploadZone from '../FileUploadZone/FileUploadZone';
import GuidelinesBox from '../GuidelinesBox/GuidelinesBox';
import HistoryPanelSkeleton from '../HistoryPanelSkeleton/HistoryPanelSkeleton';
import { useHistoryPanelLogic } from '../../hooks/useHistoryPanelLogic'; 

export default function HistoryPanel() {
  const {
    history,
    isLoading,
    error,
    downloadingId,
    handleDeleteHistory,
    handleDownload,
    refreshHistory, 
  } = useHistoryPanelLogic();

  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md space-y-12">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Importação de Históricos - Arraiware</h2>
        <p className="text-base text-gray-500 mt-1">Faça upload de arquivos Excel ou CSV com históricos de avaliações para utilização imediata</p>
        
        <FileUploadZone onUploadSuccess={refreshHistory} />
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
            <ImportHistoryTable
              history={history}
              onDelete={handleDeleteHistory}
              onDownload={handleDownload}
              downloadingId={downloadingId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
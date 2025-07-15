import { Download } from 'lucide-react';
import ImportHistoryTable from './ImportHistoryTable';
import FileUploadZone from './FileUploadZone';
import GuidelinesBox from './GuidelinesBox';
import HistoryPanelSkeleton from './HistoryPanelSkeleton';
import { useHistoryPanelLogic } from '../../../hooks/useHistoryPanelLogic'; 
import NotificationMessages from '../../../components/NotificationMessages/NotificationMessages';
import { useRef } from 'react';
import { ConfirmationMessage } from '../../../components/ConfirmationMessage/ConfirmationMessage';
import { useConfirmationMessage } from '../../../hooks/useConfirmationMessageLogic';

interface HistoryPanelProps {
  onImportSuccess: () => void;
}

export default function HistoryPanel({ onImportSuccess }: HistoryPanelProps) {
  const {
    history,
    isLoading,
    error,
    downloadingId,
    notification,          
    handleDeleteHistory,
    handleDownload,
    refreshHistory,
    handleCriteriaImport,
    closeNotification,
  } = useHistoryPanelLogic();

  const { 
    isOpen: isConfirmOpen, 
    message: confirmMessage, 
    showConfirmation, 
    handleConfirm, 
    handleCancel 
  } = useConfirmationMessage();

  const criteriaInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCriteriaImport(file);
    }
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleFileUploadSuccess = () => {
    refreshHistory(); 
    onImportSuccess(); 
  };

  const requestDeleteConfirmation = (id: string) => {
    showConfirmation({
      message: 'Você tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
      onConfirm: () => handleDeleteHistory(id),
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md space-y-12">
      {notification && (
        <NotificationMessages 
          status={notification.status}
          title={notification.title}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Importação de Históricos - Arraiware</h2>
        <p className="text-base text-gray-500 mt-1">Faça upload de arquivos Excel ou CSV com históricos de avaliações para utilização imediata</p>
        
        <FileUploadZone onUploadSuccess={handleFileUploadSuccess} />
      </div>
      <GuidelinesBox />

      <div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Histórico de Importações</h2>
            <p className="text-base text-gray-500 mt-1">Acompanhe o status das importações realizadas</p>
          </div>
          <input 
            type="file"
            ref={criteriaInputRef}
            onChange={handleFileSelect}
            accept=".xlsx" 
            style={{ display: 'none' }}
          />
          
          <button 
            onClick={() => criteriaInputRef.current?.click()}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            <span>Importar Critérios</span>
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
              onDelete={requestDeleteConfirmation}
              onDownload={handleDownload}
              downloadingId={downloadingId}
            />
          )}
        </div>
      </div>

      <ConfirmationMessage
        isOpen={isConfirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

    </div>
  );
}
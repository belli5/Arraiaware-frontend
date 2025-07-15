import { useCommitteeEvaluationsLogic } from '../../../hooks/useCommitteeEvaluationsLogic';
import { Search,Loader2} from 'lucide-react';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import CommitteeEvaluationsTableSkeleton from './CommitteeTableSkeleton';
import { useRef,useEffect } from 'react';
import CommitteeEvaluationsTable from './CommitteeEvaluationsTable';
import ReactMarkdown from 'react-markdown';
import EqualizationPanel from './EqualizationPanel';
import NotificationMessages from '../../../components/NotificationMessages/NotificationMessages';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';

export default function CommitteeEvaluationsPanel() {
  const {
    evaluations, isLoading, searchTerm, currentPage, totalPages,
    handleSearchChange, setCurrentPage, isUpdating, selectedEvaluation,notification,
    setNotification,cycleOptions, cycleFilter,handleCycleChange,
    isLoadingCycles,
        
    //edicao de linha:
    editingEvaluationId,editableScore,setEditableScore,handleStartEditScore,
    handleCancelEditScore, handleSaveScore,
    // Modal de Resumo
    isSummaryModalOpen, summaryContent, isSummaryLoading, summaryError,
    handleOpenSummaryModal, handleCloseSummaryModal,
    
    // Modal de Observação
    isObservationModalOpen, editableObservation, setEditableObservation,
    handleOpenObservationModal, handleCloseObservationModal, handleSaveObservation,

    //Modal de Equalizacao
    isEqualizeModalOpen,equalizationData,isEqualizationLoading,equalizationError,
    handleOpenEqualizeModal, handleCloseEqualizeModal,handleSaveFromPanel

} = useCommitteeEvaluationsLogic();

    const panelRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (currentPage && panelRef.current) {
            const elementTop = panelRef.current.getBoundingClientRect().top + window.scrollY;
            const offset = 150;
            window.scrollTo({
                top: elementTop - offset,
                behavior: 'smooth'
            });
        }
    }, [currentPage]);

  return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {notification && (
                <NotificationMessages
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <h3 ref={panelRef} className="text-xl font-semibold text-gray-700 mb-4">Painel de Avaliações do Comitê</h3>
            {/* Seção de Busca */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Filtro de Busca por Colaborador*/}
                <div className="relative col-span-2 mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por colaborador..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                {/* Filtro de Ciclo  */}
                <div className="relative col-span-1">
                    <CustomSelect
                        placeholder="Filtrar por ciclo..."
                        options={cycleOptions}
                        selected={cycleFilter}
                        onChange={handleCycleChange}
                        disabled={isLoadingCycles}
                    />
                </div>
            </div>
            {/* Tabela de Dados */}
            {isLoading ? (
                <CommitteeEvaluationsTableSkeleton />
            ) : (
                <CommitteeEvaluationsTable
                evaluations={evaluations}
                handleOpenObservationModal={handleOpenObservationModal}
                handleOpenSummaryModal={handleOpenSummaryModal}
                handleOpenEqualizeModal={handleOpenEqualizeModal}
                editingEvaluationId={editingEvaluationId}
                editableScore={editableScore}
                setEditableScore={setEditableScore}
                handleStartEditScore={handleStartEditScore}
                handleCancelEditScore={handleCancelEditScore}
                handleSaveScore={handleSaveScore}
                />
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            
            <Modal
              isOpen={isSummaryModalOpen}
              onClose={handleCloseSummaryModal}
              title={`Resumo de ${selectedEvaluation?.collaboratorName || ''}`}
              width="w-[85%]"
              height="max-h-[85vh]"
            >
              {isSummaryLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  <p className="mt-4 text-gray-600">Gerando resumo, por favor aguarde...</p>
                </div>
              ) : (
                <div className="p-4 text-gray-700 overflow-y-auto">
                    {summaryError 
                        ? <p className="text-red-600">{summaryError}</p> 
                        : <ReactMarkdown>{summaryContent}</ReactMarkdown>
                    }
                </div>
              )}
            </Modal>

            <Modal
                isOpen={isObservationModalOpen}
                onClose={handleCloseObservationModal}
                title={`Observação de ${selectedEvaluation?.collaboratorName || ''}`}
            >
                <div className="p-4 space-y-4">
                    <div>
                        <label htmlFor="observation" className="block text-sm font-medium text-gray-700">
                            Observação do Comitê
                        </label>
                        <textarea
                            id="observation"
                            rows={6}
                            className="mt-1 w-full border border-1 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-500"
                            placeholder="Insira uma observação para registro histórico..."
                            value={editableObservation || ''}
                            onChange={(e) => setEditableObservation(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <button type="button" onClick={handleCloseObservationModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Fechar
                        </button>
                        <button type="button" onClick={handleSaveObservation} disabled={isUpdating} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                            {isUpdating ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
              isOpen={isEqualizeModalOpen}
              onClose={handleCloseEqualizeModal}
              title={`Visão Consolidada de ${selectedEvaluation?.collaboratorName || ''}`}
              width="w-[95%]"
              height="max-h-[95vh]"
            >
              <EqualizationPanel
                data={equalizationData}
                isLoading={isEqualizationLoading}
                error={equalizationError}
                onClose={handleCloseEqualizeModal}
                initialScore={selectedEvaluation?.finalScore?.toString() || ''}
                initialObservation={selectedEvaluation?.observation || ''}
                onSave={handleSaveFromPanel}
                collaboratorId={selectedEvaluation?.collaboratorId || ''} 
              />
            </Modal>
        </div>
    );
};

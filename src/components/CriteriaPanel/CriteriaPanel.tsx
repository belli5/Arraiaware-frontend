import { PlusCircle, Search } from 'lucide-react';
import Modal from '../Modal/Modal';
import TrackCriteria from '../TrackCriteria/TrackCriteria';
import CriteriaForm from '../CriteriaForm/CriteriaForm';
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import CreateTrackForm from '../CreateTrackForm/CreateTrackForm';
import AssociateCriterionForm from '../AssociateCriterionForm/AssociateCriterionForm';
import TrackCriteriaSkeleton from '../TrackCriteriaSkeleton/TrackCriteriaSkeleton';
import { useCriteriaPanelLogic } from '../../hooks/useCriteriaPanelLogic';
import { useConfirmationMessage } from '../../hooks/useConfirmationMessageLogic';
import { ConfirmationMessage } from '../ConfirmationMessage/ConfirmationMessage';

export default function CriteriaPanel() {
  const {
    viewMode,
    isLoading,
    isSubmitting,
    trackSearchTerm,
    filteredTracks,
    isModalOpen,
    editingCriterion,
    tracks,
    isAssociateModalOpen,
    associatingTrack,
    allCriteria,
    notification,
    setViewMode,
    setTrackSearchTerm,
    setNotification,
    handleFormSubmit,
    handleCreateTrackSubmit,
    handleDeleteCriterion,
    handleAssociateCriterionSubmit,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleOpenAssociateModal,
    handleCloseAssociateModal,
  } = useCriteriaPanelLogic();

  const {
    isOpen: isConfirmOpen,
    message: confirmMessage,
    showConfirmation,
    handleConfirm,
    handleCancel
  } = useConfirmationMessage();

  const requestDisassociationConfirmation = (trackId: string, criterionId: string) => {
    showConfirmation({
      message: 'Você tem certeza que deseja desassociar este critério da trilha? Esta ação não pode ser desfeita.',
      onConfirm: () => handleDeleteCriterion(trackId, criterionId),
    });
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
        {/* Cabeçalho */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Configuração de Critérios - Arraiware</h2>
          <p className="text-base text-gray-500 mt-1">Configure critérios personalizados para cada trilha de desenvolvimento</p>
        </div>

        {/* Abas internas e Botão de Ação */}
        <div className="mt-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={() => setViewMode('manage')} className={`pb-2 text-sm font-semibold ${viewMode === 'manage' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
              Gerenciar Trilhas
            </button>
            <button onClick={() => setViewMode('create')} className={`pb-2 text-sm font-semibold ${viewMode === 'create' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
              Criar Nova Trilha
            </button>
          </div>

          {/* Botão de ação "Criar Novo Critério" */}
          {viewMode === 'manage' && (
            <button
              onClick={handleOpenCreateModal} 
              className="mb-2 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Criar Novo Critério
              <PlusCircle size={18} />
            </button>
          )}
        </div>

        {/* Conteúdo da Aba */}
        <div className="mt-6">
          {viewMode === 'manage' && (
            <div className="space-y-6">
              {/* Input de Busca */}
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por trilha..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                  value={trackSearchTerm}
                  onChange={(e) => setTrackSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <TrackCriteriaSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <>
                  {filteredTracks.map(track => (
                    <TrackCriteria
                      key={track.id}
                      track={track}
                      onDeleteCriterion={requestDisassociationConfirmation}
                      onEditCriterion={(criterion) => handleOpenEditModal(track.id, criterion)}
                      onOpenAssociateModal={handleOpenAssociateModal}
                    />
                  ))}
                  {filteredTracks.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhuma trilha encontrada.</p>
                  )}
                </>
              )}
            </div>
          )}
          {viewMode === 'create' && (
            <CreateTrackForm
              onSubmit={handleCreateTrackSubmit}
              isSubmitting={isSubmitting}               
            />
          )}
        </div>
      </div>
      
      {/* Modal para Adicionar ou Editar Critérios */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCriterion ? 'Editar Critério' : 'Adicionar Novo Critério'}
      >
        <CriteriaForm
          tracks={tracks}
          onCancel={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={editingCriterion}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      {/* Modal para Associar Critérios */}
      {associatingTrack && (
        <Modal
          isOpen={isAssociateModalOpen}
          onClose={handleCloseAssociateModal}
          title={`Associar Critério à Trilha "${associatingTrack.name}"`}
        >
          <AssociateCriterionForm
            track={associatingTrack}
            allCriteria={allCriteria}
            onCancel={handleCloseAssociateModal}
            onSubmit={handleAssociateCriterionSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {/* Notificações */}
      {notification && (
        <NotificationMessages
          status={notification.status}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <ConfirmationMessage
        isOpen={isConfirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
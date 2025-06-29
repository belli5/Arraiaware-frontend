import { useState,useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import Modal from '../Modal/Modal';
import TrackCriteria from '../TrackCriteria/TrackCriteria';
import CriteriaForm from '../CriteriaForm/CriteriaForm';
import type { Criterion, Track } from '../../types/RH';
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import type { NotificationState } from '../../types/global';
import type { NewCriterionData,ExistingCriterionData,TracksFromApi} from '../../types/RH';
import CreateTrackForm from '../CreateTrackForm/CreateTrackForm';
import AssociateCriterionForm from '../AssociateCriterionForm/AssociateCriterionForm';
import TrackCriteriaSkeleton from '../TrackCriteriaSkeleton/TrackCriteriaSkeleton';

export default function CriteriaPanel() {
  const [viewMode, setViewMode] = useState<'manage' | 'create'>('manage');

  const [tracks, setTracks] = useState<Track[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  
  const [trackSearchTerm, setTrackSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingCriterion, setEditingCriterion] = useState<{ trackId: string; criterion: Criterion } | null>(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [allCriteria, setAllCriteria] = useState<Criterion[]>([]);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [associatingTrack, setAssociatingTrack] = useState<Track | null>(null);

  const filteredTracks = tracks.filter(track =>
    track.name && track.name.toLowerCase().includes(trackSearchTerm.toLowerCase())
  );

  useEffect(() => {
  const loadInitialData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTracks(),
      fetchAllCriteria()
    ]);
    setIsLoading(false);
  };
  loadInitialData();
}, []);

  const fetchAllCriteria = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/criteria', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao buscar a lista de critérios.');
      const criteria: Criterion[] = await response.json();
      setAllCriteria(criteria);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTracks = async () => {
  setError(null);
  const token = localStorage.getItem('token');
  if (!token) {
    setError("Autenticação necessária.");
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/roles/trilhas', {
      method: "GET",
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar trilhas: ${response.statusText}`);
    }

    const apiTracks: TracksFromApi[] = await response.json();
    const formattedTracks: Track[] = apiTracks.map(trackFromApi => ({
      id: trackFromApi.id,
      name: trackFromApi.nome_da_trilha, 
      department: trackFromApi.department || 'Departamento não informado', 
      criteria: trackFromApi.criterios, 
    }));

    setTracks(formattedTracks);
  } catch (err) {
    setError((err as Error).message);
  }
};

  const handleAssociateCriterionSubmit = async (trackId: string, criterionId: string) => {
    setIsSubmitting(true);
    setNotification(null);
    const token = localStorage.getItem('token');
    const endpoint = `http://localhost:3000/api/criteria/${criterionId}/associate-role`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roleId: trackId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status} ao associar critério.`);
      }

      setNotification({ status: 'success', title: 'Sucesso!', message: 'Critério associado à trilha com sucesso!' });
      setIsAssociateModalOpen(false); 
      fetchTracks(); 
    } catch (error) {
      setNotification({ status: 'error', title: 'Falha na Associação', message: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (trackId: string, data: NewCriterionData | ExistingCriterionData) => {
  setIsSubmitting(true);
  setNotification(null);
  const token = localStorage.getItem('token');
  
  if (!token) {
    setNotification({ status: 'error', title: 'Erro de Autenticação', message: 'Por favor, faça login.' });
    setIsSubmitting(false);
    return;
  }
  const isEditing = 'id' in data;
  
  try {
    if (isEditing) {
      const endpoint = `http://localhost:3000/api/criteria/${data.id}`;
      const requestBody = {
        criterionName: data.name,
        description: data.description,
        pillar: data.type,
      };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status} ao atualizar.`);
      }

      setNotification({ status: 'success', title: 'Sucesso!', message: 'Critério atualizado com sucesso.' });

    } else {
      const createEndpoint = 'http://localhost:3000/api/criteria';
      const createRequestBody = {
        criterionName: data.name,
        description: data.description,
        pillar: data.type,
      };

      const createResponse = await fetch(createEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(createRequestBody)
      });

      if (!createResponse.ok) {
        throw new Error('Falha ao criar o novo critério.');
      }
      
      const newCriterion: Criterion = await createResponse.json();
      const associateEndpoint = `http://localhost:3000/api/criteria/${newCriterion.id}/associate-role`;
      const associateRequestBody = { roleId: trackId };

      const associateResponse = await fetch(associateEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(associateRequestBody)
      });
      
      if (!associateResponse.ok) {
        throw new Error('Critério foi criado, mas ocorreu uma falha ao associá-lo à trilha.');
      }
      setNotification({ status: 'success', title: 'Sucesso!', message: 'Critério criado e associado à trilha com sucesso!' });
    }
    handleCloseModal();
    fetchTracks();

  } catch (error) {
    setNotification({ status: 'error', title: 'Falha na Operação', message: (error as Error).message });
  } finally {
    setIsSubmitting(false);
  }
};

const handleCreateTrackSubmit = async (data: { name: string; description: string }) => {
  setIsSubmitting(true);
  setNotification(null);
  const token = localStorage.getItem('token');
  
  if (!token) {
    setNotification({ status: 'error', title: 'Erro de Autenticação', message: 'Por favor, faça login novamente.' });
    setIsSubmitting(false);
    return;
  }

  try {
    const requestBody = {
      name: data.name,
      type: 'TRILHA', 
      description: data.description,
    };

    const response = await fetch('http://localhost:3000/api/roles', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Não foi possível criar a trilha.`);
    }

    setNotification({ status: 'success', title: 'Sucesso!', message: `A trilha "${data.name}" foi criada.` });
    setViewMode('manage'); 
    fetchTracks(); 

  } catch (error) {
    setNotification({ status: 'error', title: 'Falha na Criação', message: (error as Error).message });
  } finally {
    setIsSubmitting(false);
  }
};
  const handleDeleteCriterion = async (trackId: string, criterionId: string) => {
  const isConfirmed = window.confirm(
    "Você tem certeza que deseja desassociar este critério desta trilha? A ação não pode ser desfeita."
  );

  if (!isConfirmed) {
    return; 
  }

  setIsSubmitting(true);
  setNotification(null);
  const token = localStorage.getItem('token');

  if (!token) {
    setNotification({ status: 'error', title: 'Erro de Autenticação', message: 'Por favor, faça login novamente.' });
    setIsSubmitting(false);
    return;
  }

  const endpoint = `http://localhost:3000/api/criteria/${criterionId}/disassociate-role`;
  const requestBody = { roleId: trackId };

  try {
    const response = await fetch(endpoint, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status} ao desassociar o critério.`);
    }

    setNotification({ status: 'success', title: 'Sucesso!', message: 'Critério desassociado da trilha.' });
    fetchTracks();

  } catch (error) {
    setNotification({ status: 'error', title: 'Falha na Operação', message: (error as Error).message });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleOpenCreateModal = () => {
    setEditingCriterion(null); 
    setIsModalOpen(true);      
  };

  const handleOpenEditModal = (trackId: string, criterion: Criterion) => {
    setEditingCriterion({ trackId, criterion }); 
    setIsModalOpen(true);                       
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCriterion(null);
  };

  const handleOpenAssociateModal = (track: Track) => {
    setAssociatingTrack(track);
    setIsAssociateModalOpen(true);
  };

  const handleCloseAssociateModal = () => {
    setIsAssociateModalOpen(false);
    setAssociatingTrack(null);
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
                      onDeleteCriterion={handleDeleteCriterion}
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
    </>
  );
}
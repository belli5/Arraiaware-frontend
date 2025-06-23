import { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import Modal from '../Modal/Modal';
import TrackCriteria from '../TrackCriteria/TrackCriteria';
import CriteriaForm from '../CriteriaForm/CriteriaForm';
import type { Criterion, Track } from '../../types/RH';

const initialTracks: Track[] = [
  {
    id: 1,
    name: 'Desenvolvimento Frontend',
    department: 'Tecnologia',
    criteria: [
      { id: 101, name: 'Entregar com qualidade', description: 'Capacidade de entregar tarefas com alta qualidade e poucos bugs.', type: 'Execução' },
      { id: 102, name: 'Sentimento de Dono', description: 'Proatividade e responsabilidade com as entregas e o produto.', type: 'Comportamento' },
    ],
  },
  {
    id: 2,
    name: 'Desenvolvimento Backend',
    department: 'Tecnologia',
    criteria: [
      { id: 201, name: 'Atender aos prazos', description: 'Consegue cumprir os prazos acordados para as tarefas.', type: 'Execução' },
      { id: 105, name: 'Ser "team player"', description: 'Colabora efetivamente com os membros da equipe.', type: 'Comportamento' },
      { id: 203, name: 'Conhecimento em nuvem', description: 'Experiência com arquiteturas e serviços de cloud computing.', type: 'Gestão e Liderança' },
    ],
  },
];

export default function CriteriaPanel() {
  const [viewMode, setViewMode] = useState<'manage' | 'create'>('manage');
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<{ trackId: number; criterion: Criterion } | null>(null);
  const [trackSearchTerm, setTrackSearchTerm] = useState('');

  const filteredTracks = tracks.filter(track =>
    track.name.toLowerCase().includes(trackSearchTerm.toLowerCase())
  );

  const handleAddCriterion = (trackId: number, newCriterionData: Omit<Criterion, 'id'>) => {
    const newCriterion: Criterion = {
      id: Date.now(),
      ...newCriterionData
    };

    setTracks(currentTracks =>
      currentTracks.map(track =>
        track.id === trackId ? { ...track, criteria: [...track.criteria, newCriterion] } : track
      )
    );
    closeModals();
  };

  const handleEditCriterion = (trackId: number, updatedCriterion: Criterion) => {
    setTracks(currentTracks =>
      currentTracks.map(track => {
        if (track.id === trackId) {
          const updatedCriteria = track.criteria.map(c =>
            c.id === updatedCriterion.id ? updatedCriterion : c
          );
          return { ...track, criteria: updatedCriteria };
        }
        return track;
      })
    );
    closeModals();
  };

  const handleDeleteCriterion = (trackId: number, criterionId: number) => {
    setTracks(currentTracks =>
      currentTracks.map(track =>
        track.id === trackId ? { ...track, criteria: track.criteria.filter(c => c.id !== criterionId) } : track
      )
    );
  };

  const openEditModal = (trackId: number, criterion: Criterion) => {
    setEditingCriterion({ trackId, criterion });
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingCriterion(null);
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
          {/* Filho 1: Agrupamento das abas */}
          <div className="flex space-x-4">
            <button onClick={() => setViewMode('manage')} className={`pb-2 text-sm font-semibold ${viewMode === 'manage' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
              Gerenciar Trilhas
            </button>
            <button onClick={() => setViewMode('create')} className={`pb-2 text-sm font-semibold ${viewMode === 'create' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
              Criar Nova Trilha
            </button>
          </div>

          {/* Filho 2: Botão de ação */}
          {viewMode === 'manage' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
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
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por trilha..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={trackSearchTerm}
                  onChange={(e) => setTrackSearchTerm(e.target.value)}
                />
              </div>
              {filteredTracks.map(track => (
                <TrackCriteria
                  key={track.id}
                  track={track}
                  onDeleteCriterion={handleDeleteCriterion}
                  onEditCriterion={(criterion) => openEditModal(track.id, criterion)}
                />
              ))}
              {filteredTracks.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma trilha encontrada.</p>
              )}
            </div>
          )}
          {viewMode === 'create' && (
            <div><p>Formulário para criar nova trilha (Em breve)</p></div>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={isAddModalOpen || !!editingCriterion}
        onClose={closeModals}
        title={editingCriterion ? 'Editar Critério' : 'Adicionar Novo Critério'}
      >
        <CriteriaForm
          tracks={tracks}
          onCancel={closeModals}
          onSubmit={(trackId, data) => {
            if (editingCriterion) {
              handleEditCriterion(trackId, data as Criterion);
            } else {
              handleAddCriterion(trackId, data as Omit<Criterion, 'id'>);
            }
          }}
          initialData={editingCriterion}
        />
      </Modal>
    </>
  );
}
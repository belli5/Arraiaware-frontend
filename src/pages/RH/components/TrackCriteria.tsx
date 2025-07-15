import { Trash2, Pencil,Link2 } from 'lucide-react'; 
import type { Criterion, Track, CriterionType } from '../../../types/RH';

const TypeBadge = ({ type }: { type: CriterionType }) => {
  const typeStyles = {
    'Comportamento': 'bg-green-100 text-green-700',
    'Execução': 'bg-blue-100 text-blue-700',
    'Gestão e Liderança': 'bg-purple-100 text-purple-700',
  };
  const style = typeStyles[type] || 'bg-gray-100 text-gray-700';
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style}`}>{type}</span>;
}

interface TrackCriteriaProps {
  track: Track;
  onDeleteCriterion: (trackId: string, criterionId: string) => void;
  onEditCriterion: (criterion: Criterion) => void;
  onOpenAssociateModal: (track: Track) => void;
}

export default function TrackCriteria({ track, onDeleteCriterion, onEditCriterion, onOpenAssociateModal }: TrackCriteriaProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Cabeçalho da Trilha */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{track.name}</h3> 
          <p className="text-sm text-gray-500">{track.department}</p>
        </div>
        <span className="text-sm font-medium text-gray-600">{track.criteria.length} critérios</span>
      </div>

      {/* Lista de Critérios Configurados */}
      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm text-gray-700">Critérios Configurados:</h4>
          <button 
            onClick={() => onOpenAssociateModal(track)}
            className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-800 font-semibold"
            title="Associar critério existente"
          >
            <Link2 size={16}/>
            Associar Critério
          </button>
        </div>
        {track.criteria.map(criterion => (
          <div key={criterion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-gray-800">{criterion.criterionName}</p>
                <TypeBadge type={criterion.pillar} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
            </div>
            {/* Botões de ação: Editar e Excluir */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditCriterion(criterion)}
                className="text-gray-400 hover:text-blue-500"
                title="Editar critério"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDeleteCriterion(track.id, criterion.id)}
                className="text-gray-400 hover:text-red-500"
                title="Excluir critério"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {track.criteria.length === 0 && (
          <p className="text-sm text-gray-500 italic">Nenhum critério configurado para esta trilha.</p>
        )}
      </div>
    </div>
  );
}
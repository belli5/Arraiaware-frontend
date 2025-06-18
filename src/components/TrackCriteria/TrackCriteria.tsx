import { Trash2 } from 'lucide-react';

type CriterionType = 'Comportamento' | 'Execução' | 'Gestão e Liderança';
interface Criterion { id: number; name: string; description: string; type: CriterionType; }
interface Track { id: number; name: string; department: string; criteria: Criterion[]; }

// Componente auxiliar para a "tag" de tipo
const TypeBadge = ({ type }: { type: CriterionType }) => {
    const typeStyles = {
        'Comportamento': 'bg-green-100 text-green-700',
        'Execução': 'bg-blue-100 text-blue-700',
        'Gestão e Liderança': 'bg-purple-100 text-purple-700',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles[type]}`}>{type}</span>;
}

// Props que o nosso novo componente vai receber
interface TrackCriteriaProps {
  track: Track;
  onDeleteCriterion: (trackId: number, criterionId: number) => void;
}

export default function TrackCriteria({ track, onDeleteCriterion }: TrackCriteriaProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Cabeçalho da Trilha */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-long font-bold text-gray-800">{track.name}</h3>
          <p className="text-sm text-gray-500">{track.department}</p>
        </div>
        <span className="text-sm font-medium text-gray-600">{track.criteria.length} critérios</span>
      </div>

      {/* Lista de Critérios Configurados */}
      <div className="mt-4 space-y-3">
        <h4 className="font-semibold text-sm text-gray-700">Critérios Configurados:</h4>
        {track.criteria.map(criterion => (
          <div key={criterion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-gray-800">{criterion.name}</p>
                <TypeBadge type={criterion.type} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
            </div>
            <button onClick={() => onDeleteCriterion(track.id, criterion.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {track.criteria.length === 0 && (
            <p className="text-sm text-gray-500 italic">Nenhum critério configurado para esta trilha.</p>
        )}
      </div>
    </div>
  );
}
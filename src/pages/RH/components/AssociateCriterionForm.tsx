import { useState } from 'react';
import type { Criterion, Track,CriterionType } from '../../../types/RH';
import PillarBadge from '../../../components/PillarBadge/PillarBadge';

interface AssociateCriterionFormProps {
  track: Track;
  allCriteria: Criterion[];
  onCancel: () => void;
  onSubmit: (trackId: string, criterionIds: string[]) => Promise<void>;
  isSubmitting: boolean;
}

const PREDEFINED_PILLARS: CriterionType[] = [
  'Comportamento', 
  'Execução', 
  'Gestão e Liderança'
];

export default function AssociateCriterionForm({
  track,
  allCriteria,
  onCancel,
  onSubmit,
  isSubmitting,
}: AssociateCriterionFormProps) {
  

const [selectedIds, setSelectedIds] = useState<string[]>(() =>
  track.criteria.map(c => c.id)
);

const filteredCriteria = allCriteria.filter(criterion => 
    PREDEFINED_PILLARS.includes(criterion.pillar)
  );

const handleSelectionChange = (criterionId: string) => {
  setSelectedIds(prevSelectedIds => {
    if (prevSelectedIds.includes(criterionId)) {
      return prevSelectedIds.filter(id => id !== criterionId);
    } else {
      return [...prevSelectedIds, criterionId];
    }
  });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await onSubmit(track.id, selectedIds);
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Selecione os critérios que devem fazer parte da trilha{' '}
          <span className="font-bold">{track.name}</span>. Os critérios já marcados são os que estão atualmente associados.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700">Critérios Existentes</label>
          <div className="mt-2 p-3 border border-gray-200 rounded-md max-h-60 overflow-y-auto space-y-2">
            {filteredCriteria.length > 0 ? (
              filteredCriteria.map(criterion => (
                <div key={criterion.id} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded-md">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`criterion-${criterion.id}`}
                      checked={selectedIds.includes(criterion.id)}
                      onChange={() => handleSelectionChange(criterion.id)}
                      className="h-4 w-4 accent-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor={`criterion-${criterion.id}`} className="ml-2 block text-sm text-gray-900 cursor-pointer">
                      {criterion.criterionName}
                    </label>
                  </div>
                  <PillarBadge pillar={criterion.pillar} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhum critério encontrado.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 disabled:bg-orange-300"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Associações'}
        </button>
      </div>
    </form>
  );
}
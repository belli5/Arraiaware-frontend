import { useState } from 'react';
import type { Criterion, Track } from '../../types/RH';
import CustomSelect from '../CustomSelect/CustomSelect'; 
import type { SelectOption } from '../CustomSelect/CustomSelect';

interface AssociateCriterionFormProps {
  track: Track;
  allCriteria: Criterion[];
  onSubmit: (trackId: string, criterionId: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function AssociateCriterionForm({
  track,
  allCriteria,
  onSubmit,
  onCancel,
  isSubmitting,
}: AssociateCriterionFormProps) {
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) {
      alert('Por favor, selecione um critério.');
      return;
    }
    onSubmit(track.id, selectedOption.id);
  };

  const criteriaOptions: SelectOption[] = allCriteria.map(criterion => ({
    id: criterion.id,
    name: `${criterion.criterionName} (${criterion.pillar})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-600">
        Selecione um critério existente para adicionar à trilha{' '}
        <span className="font-bold text-gray-800">{track.name}</span>.
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Critérios Disponíveis
        </label>
      
        <CustomSelect 
          options={criteriaOptions}
          selected={selectedOption}
          onChange={setSelectedOption}
          placeholder="Selecione um critério..."
        />

      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting || !selectedOption} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300">
          {isSubmitting ? 'Associando...' : 'Associar Critério'}
        </button>
      </div>
    </form>
  );
}
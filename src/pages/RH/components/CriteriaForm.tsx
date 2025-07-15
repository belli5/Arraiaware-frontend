import { useState,useEffect,useMemo } from 'react';
import { Check } from 'lucide-react';
import type {Criterion,Track, CriterionType} from '../../../types/RH';
import type { NewCriterionData,ExistingCriterionData } from '../../../types/RH';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import type { SelectOption } from '../../../components/CustomSelect/CustomSelect';

interface CriteriaFormProps {
  tracks: Track[];
  onCancel: () => void;
  onSubmit: (trackId: string, data: NewCriterionData | ExistingCriterionData) => void;
  initialData?: { trackId: string; criterion: Criterion } | null;
  isSubmitting: boolean; 
}


const criterionTypes: CriterionType[] = ['Comportamento', 'Execução', 'Gestão e Liderança'];

export default function CriteriaForm({ tracks, onCancel, onSubmit, initialData, isSubmitting }: CriteriaFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<CriterionType | ''>('');
  const [description, setDescription] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<SelectOption | null>(null);
  
  const trackOptions: SelectOption[] = useMemo(() => {
    return tracks.map(track => ({
      id: track.id,
      name: track.name,
    }));
  }, [tracks]);

  const [errors, setErrors] = useState({
    trackId: '', name: '', type: '', description: ''
  });
  
  const validate = () => {
    const newErrors = { trackId: '', name: '', type: '', description: '' };
    let isValid = true;

    if (!selectedTrack) { newErrors.trackId = 'Por favor, selecione uma trilha.'; isValid = false; }
    if (!type) { newErrors.type = 'Por favor, selecione um tipo.'; isValid = false; }
    if (!name.trim()) { newErrors.name = 'O nome do critério é obrigatório.'; isValid = false; }
    if (!description.trim()) { newErrors.description = 'A descrição é obrigatória.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  // Efeito para preencher o formulário quando initialData muda (modo de edição)
  // ou para resetar o formulário quando initialData é null (modo de criação)
  const isEditing = !!initialData;
  useEffect(() => {
    if (isEditing && initialData) {
      const trackToEdit = trackOptions.find(t => t.id === initialData.trackId);
      setSelectedTrack(trackToEdit || null);
      setName(initialData.criterion.criterionName);
      setDescription(initialData.criterion.description);
      setType(initialData.criterion.pillar);
    } else {
      setSelectedTrack(null);
      setName('');
      setDescription('');
      setType('');
    }
  }, [initialData, isEditing,trackOptions]);

  
  const handleSubmit = () => {
    if (!validate()) return;
    if (selectedTrack && type) {
      if (isEditing && initialData) {
        const dataToSubmit: ExistingCriterionData = { id: initialData.criterion.id, name, description, type };
        onSubmit(selectedTrack.id, dataToSubmit);
      } else {
        const dataToSubmit: NewCriterionData = { name, description, type };
        onSubmit(selectedTrack.id, dataToSubmit);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Seção 1: Seleção da Trilha */}
      <div>
        <label htmlFor="track-select" className="block text-sm font-medium text-gray-700">Adicionar à Trilha</label>
        <div className="mt-1">
          <CustomSelect
            options={trackOptions}
            selected={selectedTrack}
            onChange={setSelectedTrack}
            placeholder="Selecione uma trilha"
            disabled={isEditing}
          />
        </div>
        {errors.trackId && <p className="mt-1 text-xs text-red-600">{errors.trackId}</p>}
      </div>

      {/* Seção 2: Detalhes do Critério*/}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Detalhes do Critério
        </h3>

        <div className="space-y-4 bg-gray-50/80 p-5 rounded-xl border border-gray-200">
          <div>
            <label htmlFor="criterion-name" className="block text-sm font-medium text-gray-700">Nome do Critério</label>
            <input
              id="criterion-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <div className="mt-2 flex rounded-md shadow-sm border border-gray-300 p-1 bg-gray-50">
              {criterionTypes.map((criterionType) => (
                <button
                  key={criterionType}
                  type="button"
                  onClick={() => setType(criterionType)}
                  className={`w-full py-1.5 text-sm font-semibold transition-colors duration-150 rounded-md focus:outline-none ${
                    type === criterionType
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {criterionType}
                </button>
              ))}
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
          </div>
          <div>
            <label htmlFor="criterion-description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="criterion-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Rodapé do Formulário com as Ações */}
      <div className="pt-8 flex justify-end gap-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-x-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <Check size={16} />
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Edição' : 'Salvar Critério')}
        </button>
      </div>
    </div>
  );
};
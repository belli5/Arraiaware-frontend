import { useState } from 'react';

type CriterionType = 'Comportamento' | 'Execução' | 'Gestão e Liderança';

interface Track { id: number; name: string; }
interface NewCriterionData {
  name: string;
  type: CriterionType;
  description: string;
}

interface AddCriteriaFormProps {
  tracks: Track[];
  onCancel: () => void;
  onSubmit: (trackId: number, data: NewCriterionData) => void;
}


const criterionTypes: CriterionType[] = ['Comportamento', 'Execução', 'Gestão e Liderança'];

export default function AddCriteriaForm({ tracks, onCancel, onSubmit }: AddCriteriaFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<CriterionType | ''>(''); 
  const [description, setDescription] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<number | ''>('');

  const handleSubmit = () => {
    if (!selectedTrackId) { alert("Por favor, selecione uma trilha."); return; }
    if (!type) { alert("Por favor, selecione um tipo."); return; } 
    if (!name.trim() || !description.trim()) { alert("Por favor, preencha o nome e a descrição."); return; }

    onSubmit(selectedTrackId, { name, type, description });
  };

  return (
    <div className="space-y-6">
      {/* Seção 1: Seleção da Trilha */}
      <div>
        <label htmlFor="track-select" className="block text-sm font-semibold text-gray-800 mb-1">Adicionar à Trilha</label>
        <select id="track-select" value={selectedTrackId} onChange={e => setSelectedTrackId(Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500">
          <option disabled value="">Selecione uma trilha</option>
          {tracks.map(track => <option key={track.id} value={track.id}>{track.name}</option>)}
        </select>
      </div>

      {/* Seção 2: Detalhes do Critério */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
        <div className="md:col-span-2">
          <label htmlFor="criterion-name" className="block text-sm font-semibold text-gray-800">Nome do Critério</label>
          <input id="criterion-name" type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
        </div>
        <div>
          <label htmlFor="criterion-type" className="block text-sm font-semibold text-gray-800">Tipo</label>
          <select id="criterion-type" value={type} onChange={e => setType(e.target.value as CriterionType)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500">
            <option disabled value="">Selecione um tipo</option>
            {criterionTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="criterion-description" className="block text-sm font-semibold text-gray-800">Descrição</label>
          <textarea id="criterion-description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
        </div>
      </div>

      {/* Rodapé do Formulário com as Ações */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          Cancelar
        </button>
        <button onClick={handleSubmit} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600">
          Salvar Critério
        </button>
      </div>
    </div>
  );
}
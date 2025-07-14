import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import type { Reference } from '../../types/evaluation';

interface ReferenceFormProps {
  initialReferences: Reference[];
  onSaveReferences: (references: Reference[]) => Promise<void> | void;
}

export default function ReferenceForm({ initialReferences, onSaveReferences }: ReferenceFormProps) {
  const [references, setReferences] = useState(initialReferences);

  const handleChange = (index: number, field: keyof Reference, value: string) => {
    const updated = [...references];
    updated[index] = { ...updated[index], [field]: value };
    setReferences(updated);
  };

  const addNewReference = () => {
    setReferences(prev => [
      ...prev,
      { id: String(Date.now()), name: '', email: '', type: '', areaOfKnowledge: '' }
    ]);
  };

  const removeReference = (index: number) => {
    setReferences(updated => updated.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSaveReferences(references);
  };


   return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Referências Técnicas e Culturais</h2>

      {references.map((ref, index) => (
        <div key={ref.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3"
                value={ref.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl p-3"
                value={ref.email}
                onChange={(e) => handleChange(index, 'email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                className="w-full border border-gray-300 rounded-xl p-3"
                value={ref.type}
                onChange={(e) => handleChange(index, 'type', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="technical">Técnica</option>
                <option value="cultural">Cultural</option>
                <option value="both">Ambas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área de Conhecimento</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3"
                value={ref.areaOfKnowledge}
                onChange={(e) => handleChange(index, 'areaOfKnowledge', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="text-red-600 text-sm" onClick={() => removeReference(index)}>
              Remover referência
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button onClick={addNewReference} className="flex items-center gap-2 text-orange-600">
          <PlusCircle size={18} />
          Adicionar nova referência
        </button>
        <button onClick={handleSubmit} className="bg-orange-600 text-white px-4 py-2 rounded-lg">
          Salvar Referências
        </button>
      </div>
    </div>
  );
}
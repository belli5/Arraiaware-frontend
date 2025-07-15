import { useState } from 'react'
import type { ReferenceIndication, Colleague } from '../../../types/evaluation';

interface ReferenceFormProps {
  availableUsers: Colleague[];
  initialReferences: ReferenceIndication[];
  onSaveReferences: (references: ReferenceIndication[]) => Promise<void> | void;
}

export default function ReferenceForm({ availableUsers, initialReferences, onSaveReferences }: ReferenceFormProps) {
  const [references, setReferences] = useState<ReferenceIndication[]>(initialReferences);

  const toggleUser = (userId: string, checked: boolean) => {
    if (checked) {
      setReferences(prev => [...prev, { indicatedUserId: userId, justification: '' }]);
    } else {
      setReferences(prev => prev.filter(r => r.indicatedUserId !== userId));
    }
  };

  const changeJustification = (userId: string, text: string) => {
    setReferences(prev =>
      prev.map(r =>
        r.indicatedUserId === userId ? { ...r, justification: text } : r
      )
    );
  };

  const handleSubmit = () => {
    onSaveReferences(references);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Indicação de Referências</h2>
      <div className="flex gap-6">
        {/* Lista rolável de usuários */}
        <div className="flex-1 border border-gray-200 rounded-md max-h-80 overflow-y-auto divide-y divide-gray-100 p-4">
          {availableUsers.map(user => {
            const isChecked = references.some(r => r.indicatedUserId === user.id);
            return (
              <label key={user.id} className="flex items-center py-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e => toggleUser(user.id, e.target.checked)}
                  className="h-4 w-4 text-orange-600 mr-3"
                />
                <span className="font-medium">{user.nome}</span>
              </label>
            );
          })}
        </div>
        {/* Caixa de justificativas */}
        <div className="flex-1 space-y-4 max-h-80 overflow-y-auto p-4">
          {references.map(ref => {
            const user = availableUsers.find(u => u.id === ref.indicatedUserId);
            return (
              <div key={ref.indicatedUserId}>
                <p className="font-medium mb-2">{user?.nome}</p>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Justifique sua indicação"
                  value={ref.justification}
                  onChange={e => changeJustification(ref.indicatedUserId, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Salvar Indicações
        </button>
      </div>
    </div>
  );
}

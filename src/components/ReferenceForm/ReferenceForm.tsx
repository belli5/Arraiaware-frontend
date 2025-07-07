import { useState } from 'react'
import { PlusCircle } from 'lucide-react'

type Reference = {
  name: string
  email: string
  type: 'TÉCNICA' | 'CULTURAL'
  area: string
  comment?: string
}

interface ReferenceFormProps {
  onSubmit: (refs: Reference[]) => void
}

export default function ReferenceForm({ onSubmit }: ReferenceFormProps) {
  const [references, setReferences] = useState<Reference[]>([])

  const handleChange = (index: number, field: keyof Reference, value: string) => {
    const updated = [...references]
    updated[index] = { ...updated[index], [field]: value }
    setReferences(updated)
  }

  const addNewReference = () => {
    setReferences(prev => [
      ...prev,
      { name: '', email: '', type: 'TÉCNICA', area: '', comment: '' }
    ])
  }

  const removeReference = (index: number) => {
    const updated = [...references]
    updated.splice(index, 1)
    setReferences(updated)
  }

  const handleSubmit = () => {
    onSubmit(references)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Referências Técnicas e Culturais</h2>

      {references.map((ref, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 p-4 space-y-4 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Referência
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
                value={ref.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
                value={ref.email}
                onChange={(e) => handleChange(index, 'email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Referência
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
                value={ref.type}
                onChange={(e) => handleChange(index, 'type', e.target.value as 'TÉCNICA' | 'CULTURAL')}
              >
                <option value="TÉCNICA">Técnica</option>
                <option value="CULTURAL">Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área de Atuação ou Relação
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
                value={ref.area}
                onChange={(e) => handleChange(index, 'area', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentário opcional
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
              rows={3}
              value={ref.comment}
              placeholder="Comentário opcional..."
              onChange={(e) => handleChange(index, 'comment', e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="text-red-600 text-sm"
              onClick={() => removeReference(index)}
            >
              Remover referência
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button
          onClick={addNewReference}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm"
        >
          <PlusCircle size={18} />
          Adicionar nova referência
        </button>

        <button
          onClick={handleSubmit}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Salvar Referências
        </button>
      </div>
    </div>
  )
}
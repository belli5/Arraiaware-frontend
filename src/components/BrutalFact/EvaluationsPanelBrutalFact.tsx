import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

export interface BrutalFact {
  pillar: string
  severity: 'Baixa' | 'Média' | 'Alta'
  description: string
  impact: number
}

export interface EvaluationsPanelBrutalFactProps {
  managerId: string
  cycleId: string
  userName?: string
  projectName?: string
  cycleName?: string
  equalizationDate?: string
  facts?: BrutalFact[]
  onViewDetails: () => void
  onCreateActionPlan: () => void
}

const severityColorMap = {
  Baixa: { border: 'border-green-500', text: 'text-green-500' },
  Média: { border: 'border-yellow-500', text: 'text-yellow-500' },
  Alta: { border: 'border-red-500', text: 'text-red-500' },
}

export default function EvaluationsPanelBrutalFact({
  managerId,
  cycleId,
  userName = '—',
  projectName = '—',
  cycleName = '—',
  equalizationDate = '',
  facts = [],
  onViewDetails,
  onCreateActionPlan,
}: EvaluationsPanelBrutalFactProps) {
  const [factList, setFactList] = useState<BrutalFact[]>(facts)

  // Busca real do backend
  useEffect(() => {
    fetch(`/api/managers/${managerId}/cycles/${cycleId}/brutalfacts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json() as Promise<BrutalFact[]>)
      .then(setFactList)
      .catch(console.error)
  }, [managerId, cycleId])

  // iniciais para avatar
  const initials = (userName || ' ')
    .split(' ')
    .map(n => n[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-full mx-auto px-6 lg:px-10">
      
    {/* HEADER LARANJA */}
    <div className="bg-orange-500 rounded-t-lg p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-semibold text-orange-500">
            {initials}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-sm opacity-90">
              Projeto: <strong>{projectName}</strong> • Ciclo:{' '}
              <strong>{cycleName}</strong>
            </p>
            <p className="text-xs">
              {equalizationDate
                ? `Equalização: ${equalizationDate}`
                : '–'}
            </p>
          </div>
        </div>
        <button className="bg-white text-orange-500 rounded-full px-4 py-1 font-medium">
          {factList.length} Brutal Facts
        </button>
      </div>

      {/* CARTÕES BRUTAL FACTS */}
      <div className="bg-white p-6 rounded-b-lg shadow-md space-y-6">
        {factList.map((fact, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-xs rounded-full border border-orange-500 text-orange-500">
                {fact.pillar}
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  severityColorMap[fact.severity].border
                } ${severityColorMap[fact.severity].text}`}
              >
                {fact.severity}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">
              {fact.description}
            </h3>
            <p className="text-sm text-gray-500 mb-1">Impacto na Performance</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
              <div
                className="h-2 bg-black rounded-full"
                style={{ width: `${fact.impact}%` }}
              />
            </div>
            <p className="text-sm font-medium text-gray-800">
              {fact.impact}%
            </p>
          </div>
        ))}

        {/* RODAPÉ */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 font-medium mb-2">
            Próximos Passos Recomendados:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
            <li>Agendar sessão de desenvolvimento individual</li>
            <li>Definir plano de ação específico</li>
            <li>Estabelecer métricas de acompanhamento</li>
          </ul>
          <div className="flex justify-end gap-3">
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg font-medium"
            >
              <ChevronRight size={16} /> Voltar
            </button>
            <button
              onClick={onCreateActionPlan}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium"
            >
              Criar Plano de Ação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

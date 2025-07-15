// src/components/EvaluationsTable/EvaluationsTableManager.tsx
import type { Evaluation } from '../../../types/evaluation';
import FormattedDate from '../../../components/FormattedDate/FormattedDate';

interface EvaluationsTableManagerProps {
  evaluations: Evaluation[];
  onViewEvaluation?: (item: Evaluation) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const base = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  let color = 'bg-gray-100 text-gray-700';
  if (status === 'Concluída') color = 'bg-green-100 text-green-700';
  if (status === 'Pendente') color = 'bg-amber-100 text-amber-700';
  if (status === 'Em Atraso') color = 'bg-red-100 text-red-700';
  return <span className={`${base} ${color}`}>{status}</span>;
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="flex items-center gap-2">
    <div className="w-20 bg-gray-200 rounded-full h-1.5">
      <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
    </div>
    <span className="text-sm text-gray-600">{progress}%</span>
  </div>
);

export default function EvaluationsTableManager({ evaluations, onViewEvaluation }: EvaluationsTableManagerProps) {
  if (evaluations.length === 0) {
    return <p className="text-center text-gray-500 py-8">Nenhuma avaliação encontrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciclo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trilha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluída em</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes da Avaliação</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {evaluations.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.collaborator}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cycleName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.track}</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap"><ProgressBar progress={item.progress} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.projectName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <FormattedDate isoDate={item.deadline} options={{ day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo' }} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <FormattedDate isoDate={item.completedAt} options={{ day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo' }} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {onViewEvaluation && (
                  <button
                    onClick={() => onViewEvaluation(item)}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Ver Avaliação
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

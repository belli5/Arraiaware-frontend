// src/components/EvaluationsTable/EvaluationsTableBrutalFact.tsx
import type { Evaluation } from '../../types/evaluation';

// Badge para status
const StatusBadge = ({ status }: { status: string }) => {
  const base = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  let color = 'bg-gray-100 text-gray-700';
  if (status === 'Concluída') color = 'bg-green-100 text-green-700';
  if (status === 'Pendente')  color = 'bg-amber-100 text-amber-700';
  if (status === 'Em Atraso') color = 'bg-red-100 text-red-700';
  return <span className={`${base} ${color}`}>{status}</span>;
};

interface EvaluationsTableBrutalFactProps {
   evaluations: Evaluation[];
   /** Chamado quando o usuário clica em "Visualizar" */
   onViewEvaluation?: (item: Evaluation) => void;
 }

export default function BrutalFact({
   evaluations,
   onViewEvaluation,
 }: EvaluationsTableBrutalFactProps) {

  if (evaluations.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Nenhuma avaliação encontrada.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Colaborador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ciclo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Projeto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {evaluations.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {item.collaborator}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.cycleName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {item.projectName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                 onClick={() => onViewEvaluation?.(item)}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Visualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

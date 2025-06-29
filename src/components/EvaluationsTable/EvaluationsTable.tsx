import type { Evaluation } from "../../types/evaluation";
import FormattedDate from "../FormattedDate/FormattedDate"; 

interface EvaluationsTableProps {
    evaluations: Evaluation[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    let colorStyle = "";

    switch (status) {
        case 'Concluída': colorStyle = "bg-green-100 text-green-700"; break;
        case 'Pendente': colorStyle = "bg-amber-100 text-amber-700"; break;
        case 'Em Atraso': colorStyle = "bg-red-100 text-red-700"; break;
        default: colorStyle = "bg-gray-100 text-gray-700";
    }
    return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
}

const ProgressBar = ({ progress }: { progress: number }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
        </div>
    )
}


export default function EvaluationsTable({ evaluations }: EvaluationsTableProps) {
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluída em</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {evaluations.map((evalItem) => (
                        <tr key={evalItem.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.collaborator}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.cycleName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.track}</td>
                            <td className="pl-3 pr-6 py-4 whitespace-nowrap"><StatusBadge status={evalItem.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap"><ProgressBar progress={evalItem.progress} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <FormattedDate 
                                    isoDate={evalItem.deadline} 
                                    options={{
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'America/Sao_Paulo'
                                    }} 
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                <FormattedDate 
                                    isoDate={evalItem.completedAt} 
                                    options={{
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'America/Sao_Paulo'
                                    }} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
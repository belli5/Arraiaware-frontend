// src/components/EvaluationsTable/EvaluationsTable.tsx

const evaluations = [
    { id: 1, collaborator: 'Ana Silva', department: 'Tecnologia', track: 'Desenvolvimento Frontend', status: 'Concluída', progress: 100, deadline: '14/01/2024', completedAt: '11/01/2024' },
    { id: 2, collaborator: 'Carlos Santos', department: 'Tecnologia', track: 'Desenvolvimento Backend', status: 'Pendente', progress: 65, deadline: '19/01/2024', completedAt: '-' },
    { id: 3, collaborator: 'Maria Oliveira', department: 'Marketing', track: 'Marketing Digital', status: 'Em Atraso', progress: 30, deadline: '09/01/2024', completedAt: '-' },
    { id: 4, collaborator: 'João Costa', department: 'Vendas', track: 'Vendas Consultivas', status: 'Concluída', progress: 100, deadline: '17/01/2024', completedAt: '15/01/2024' },
    { id: 5, collaborator: 'Fernanda Lima', department: 'RH', track: 'Gestão de Pessoas', status: 'Pendente', progress: 80, deadline: '24/01/2024', completedAt: '-' },
];

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

interface EvaluationsTableProps {
    searchTerm: string;
    statusFilter: string;
    departmentFilter: string;
}

export default function EvaluationsTable({ searchTerm, statusFilter, departmentFilter }: EvaluationsTableProps) {
    
    const filteredEvaluations = evaluations.filter(evaluation => {
        const statusMatch = statusFilter === 'Todos' || evaluation.status === statusFilter;
        const departmentMatch = departmentFilter === 'Todos' || evaluation.department === departmentFilter;
        const searchMatch = (
            evaluation.collaborator.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evaluation.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evaluation.track.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return statusMatch && departmentMatch && searchMatch;
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trilha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluída em</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvaluations.map((evalItem) => (
                        <tr key={evalItem.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.collaborator}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.track}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={evalItem.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap"><ProgressBar progress={evalItem.progress} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.deadline}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{evalItem.completedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
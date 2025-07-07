import type { CommitteeCollaboratorsEvaluations } from '../../types/committee';
import { MessageSquare, Pencil, Check, X } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import StatusBadge from '../StatusBadge/StatusBadge';

interface CommitteeEvaluationsTableProps {
    evaluations: CommitteeCollaboratorsEvaluations[];
    handleOpenSummaryModal: (evaluation: CommitteeCollaboratorsEvaluations) => void;
    handleOpenObservationModal: (evaluation: CommitteeCollaboratorsEvaluations) => void; 

    editingEvaluationId: string | null;
    editableScore: string;
    setEditableScore: (score: string) => void;
    handleStartEditScore: (evaluation: CommitteeCollaboratorsEvaluations) => void;
    handleCancelEditScore: () => void;
    handleSaveScore: () => void;

    handleOpenEqualizeModal: (evaluation: CommitteeCollaboratorsEvaluations) => void;
}

export default function CommitteeEvaluationsTable({ evaluations, handleOpenSummaryModal, handleOpenObservationModal, 
    editingEvaluationId,
    editableScore,
    setEditableScore,
    handleStartEditScore,
    handleCancelEditScore,
    handleSaveScore,
    handleOpenEqualizeModal    
}: CommitteeEvaluationsTableProps) {

   return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciclo</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Autoav.</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pares</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Líderes</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Final</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {evaluations.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                            Nenhum colaborador encontrado com os critérios de busca.
                        </td>
                    </tr>
                ) : (
                    evaluations.map((evaluation) => {
                        const isEditing = editingEvaluationId === evaluation.id;
                        return (
                            <tr key={evaluation.id} className={isEditing ? 'bg-orange-100' : ''}>
                                
                                {/* CÉLULA DO COLABORADOR */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">{evaluation.collaboratorName}</span>
                                        <button onClick={() => handleOpenObservationModal(evaluation)} 
                                            className={`p-1 transition-colors ${evaluation.observation ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 hover:text-blue-600'}`} 
                                            data-tooltip-id="actions-tooltip" 
                                            data-tooltip-content="Ver/Editar Observação">
                                            <MessageSquare size={16} />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-500">{evaluation.collaboratorRole}</div>
                                </td>

                                {/* Células de Ciclo a Líderes  */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evaluation.cycleName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <StatusBadge status={evaluation.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{typeof evaluation.selfEvaluationScore === 'number' ? evaluation.selfEvaluationScore.toFixed(1) : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{typeof evaluation.peerEvaluationScore === 'number' ? evaluation.peerEvaluationScore.toFixed(1) : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{typeof evaluation.managerEvaluationScore === 'number' ? evaluation.managerEvaluationScore.toFixed(1) : '-'}</td>
                                
                                {/* CÉLULA DA NOTA FINAL */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    {isEditing ? (
                                        <input
                                            type="number" step="0.1" value={editableScore}
                                            onChange={(e) => setEditableScore(e.target.value)}
                                            className="w-24 text-center border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveScore();
                                                if (e.key === 'Escape') handleCancelEditScore();
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="font-bold text-blue-600">{evaluation.finalScore != null ? evaluation.finalScore.toFixed(1) : '-'}</span>
                                            <button onClick={() => handleStartEditScore(evaluation)} className="p-1 text-gray-400 hover:text-indigo-600" data-tooltip-id="actions-tooltip" data-tooltip-content="Editar Nota Final"><Pencil size={16} /></button>
                                        </div>
                                    )}
                                </td>
                                
                                {/* AÇÕES  */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleSaveScore} className="p-1 text-green-600 hover:text-green-800" data-tooltip-id="edit-tooltip" data-tooltip-content="Salvar Nota"><Check size={20} /></button>
                                                <button onClick={handleCancelEditScore} className="p-1 text-red-600 hover:text-red-800" data-tooltip-id="edit-tooltip" data-tooltip-content="Cancelar Edição"><X size={20} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleOpenSummaryModal(evaluation)} 
                                                    className="bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-1 rounded-md hover:bg-slate-300 transition-colors"
                                                >
                                                    Resumo IA
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenEqualizeModal(evaluation)} 
                                                    className="bg-orange-500 text-white font-semibold text-xs px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                                                >
                                                    Equalizar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
        <Tooltip id="actions-tooltip" />
        <Tooltip id="edit-tooltip" />
    </div>
);
}
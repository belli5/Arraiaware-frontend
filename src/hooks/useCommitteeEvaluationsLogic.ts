import { useState, useEffect, useCallback } from 'react';
import type { CommitteeCollaboratorsEvaluations, CommitteePanelTable,SummaryApiResponse } from '../types/committee';

export const useCommitteeEvaluationsLogic = () => {

    // Estados da Tabela e UI
    const [evaluations, setEvaluations] = useState<CommitteeCollaboratorsEvaluations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState<CommitteeCollaboratorsEvaluations | null>(null);
    
    // Estados do Modal de Resumo (IA)
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    // Estados do Modal de Observação
    const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
    const [editableObservation, setEditableObservation] = useState('');

    //Estados para edição de Nota
    const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(null);
    const [editableScore, setEditableScore] = useState<string>('');

    //Equalizacao
    const [isEqualizeModalOpen, setIsEqualizeModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvaluations = async () => {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Você não está autenticado.");
                setIsLoading(false);
                return;
            }

            try {
                const params = new URLSearchParams();
                if (searchTerm) {
                    params.append('search', searchTerm);
                }
                params.append('page', currentPage.toString());
                params.append('limit', '10'); 

                const response = await fetch(`http://localhost:3000/api/committee/panel?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error("Falha ao buscar as avaliações do comitê.");
                }
                
                const data: CommitteePanelTable = await response.json();
                
                setEvaluations(data.evaluations);
                setTotalPages(data.pagination.totalPages);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluations();
    }, [searchTerm, currentPage,isUpdating]); 


    //Edicao de nota
    const handleStartEditScore = (evaluation: CommitteeCollaboratorsEvaluations) => {
        setEditingEvaluationId(evaluation.id);
        setEditableScore(evaluation.finalScore?.toString() || '');
    };

    const handleCancelEditScore = () => {
        setEditingEvaluationId(null);
        setEditableScore('');
    };

    const handleSaveScore = async () => {
        if (!editingEvaluationId) return;

        setIsUpdating(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Você não está autenticado.");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                finalScore: parseFloat(editableScore)
            };

            if (isNaN(payload.finalScore)) {
                throw new Error("Nota inválida.");
            }

            const response = await fetch(`http://localhost:3000/api/committee/panel/${editingEvaluationId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Falha ao salvar a nota.");
            setEditingEvaluationId(null);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsUpdating(prev => !prev);
        }
    };

    // Observacao
    const handleSaveObservation = async () => {
        if (!selectedEvaluation) return;

        setIsUpdating(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Sessão expirada.");
            setIsUpdating(false);
            return;
        }

        try {
            const payload = {
                observation: editableObservation,
            };

            const response = await fetch(`http://localhost:3000/api/committee/panel/${selectedEvaluation.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Falha ao salvar a avaliação.");
            }

            const updatedEvaluation: CommitteeCollaboratorsEvaluations = await response.json();

            setEvaluations(current => current.map(ev => ev.id === selectedEvaluation.id ? updatedEvaluation : ev));
            setIsObservationModalOpen(false);
            setSelectedEvaluation(null);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenObservationModal = (evaluation: CommitteeCollaboratorsEvaluations) => {
        setSelectedEvaluation(evaluation);
        setEditableObservation(evaluation.observation || '');
        setIsObservationModalOpen(true);
    };

    const handleCloseObservationModal = () => {
        setIsObservationModalOpen(false);
        setEditableObservation('');
        setSelectedEvaluation(null);
    };

    // Resumo da IA
    const fetchSummary = async (userId: string, cycleId: string) => {
        setIsSummaryLoading(true);
        setSummaryError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Você não está autenticado.");
            setIsSummaryLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/equalization/consolidated-view/${userId}/summary?cycleId=${cycleId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Falha ao buscar o resumo da avaliação.");
            }
            const data: SummaryApiResponse = await response.json();
            setSummaryContent(data.summary);

        } catch (err) {
            setSummaryError((err as Error).message);
            setSummaryContent(""); 
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleOpenSummaryModal = (evaluation: CommitteeCollaboratorsEvaluations) => {
        setSelectedEvaluation(evaluation);
        setIsSummaryModalOpen(true);
        fetchSummary(evaluation.collaboratorId, evaluation.cycleId); 
    };

    const handleCloseSummaryModal = () => {
        setIsSummaryModalOpen(false);
        setSelectedEvaluation(null);
        setSummaryContent(''); 
        setSummaryError(null);
    };

    //Equalização
    const handleOpenEqualizeModal = (evaluation: CommitteeCollaboratorsEvaluations) => {
        setSelectedEvaluation(evaluation);
        setIsEqualizeModalOpen(true);
    };

    const handleCloseEqualizeModal = () => {
        setSelectedEvaluation(null);
        setIsEqualizeModalOpen(false);
    };

    const handleConfirmEqualization = async () => {
        if (!selectedEvaluation) return;
        console.log(`Equalização confirmada para o colaborador ${selectedEvaluation.id}`);
        handleCloseEqualizeModal();
    };

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); 
    }, []);

    
    return {
        //UI
        evaluations, isLoading, error, searchTerm, currentPage, totalPages,
        handleSearchChange, setCurrentPage, isUpdating, selectedEvaluation,
        
        //edicao de linha:
        editingEvaluationId,editableScore,setEditableScore,handleStartEditScore,
        handleCancelEditScore, handleSaveScore,
        // Modal de Resumo
        isSummaryModalOpen, summaryContent, isSummaryLoading, summaryError,
        handleOpenSummaryModal, handleCloseSummaryModal,
        
        // Modal de Observação
        isObservationModalOpen, editableObservation, setEditableObservation,
        handleOpenObservationModal, handleCloseObservationModal, handleSaveObservation,

        //Modal de Equalizacao
        isEqualizeModalOpen, handleOpenEqualizeModal,handleCloseEqualizeModal,
        handleConfirmEqualization,

    };
};
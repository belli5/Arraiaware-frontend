import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Evaluation, Cycle, EvaluationTableFromApi } from '../types/evaluation';
import type { ManagerDashboardData } from '../types/manager';
import type { SelectOption } from '../components/CustomSelect/CustomSelect';

const statusOptions: SelectOption[] = [
    { id: 'all', name: 'Todos os Status' },
    { id: 'Concluída', name: 'Concluída' },
    { id: 'Pendente', name: 'Pendente' },
    { id: 'Em Atraso', name: 'Em Atraso' }
];

interface UseEvaluationsPanelLogicProps {
    managerId?: string;
}

export const useEvaluationsPanelLogic = ({ managerId }: UseEvaluationsPanelLogicProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<SelectOption | null>(statusOptions[0]);
    const [cycleFilter, setCycleFilter] = useState<SelectOption | null>({ id: 'all', name: 'Todos os Ciclos' });
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchCycles = async () => {
            setIsLoadingCycles(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:3000/api/cycles', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao buscar ciclos de avaliação.');
                const data: Cycle[] = await response.json();
                setCycles(data);
            } catch (err) {
                console.error("Erro ao buscar ciclos:", err);
            } finally {
                setIsLoadingCycles(false);
            }
        };
        fetchCycles();
    }, []); 

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
                if (searchTerm) params.append('search', searchTerm);
                if (statusFilter && statusFilter.id !== 'all') params.append('status', statusFilter.id);
                if (cycleFilter && cycleFilter.id !== 'all') params.append('cycleId', cycleFilter.id);
                params.append('page', currentPage.toString());
                params.append('limit', '10');

                const endpoint = managerId
                    ? `http://localhost:3000/api/dashboard/manager/${managerId}`
                    : 'http://localhost:3000/api/rh/evaluations';

                const response = await fetch(`${endpoint}?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar dados: ${response.statusText}`);
                }

                if (managerId) {
                    const result: ManagerDashboardData = await response.json();
                    setEvaluations(result.evaluations);
                    setTotalPages(result.pagination.totalPages);
                } else {
                    const result: EvaluationTableFromApi = await response.json();
                    setEvaluations(result.data);
                    setTotalPages(result.pagination.totalPages);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluations();
    }, [searchTerm, statusFilter, cycleFilter, currentPage, managerId]);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }, []);

    const handleStatusSelect = useCallback((option: SelectOption) => {
        setStatusFilter(option);
        setCurrentPage(1);
    }, []);

    const handleCycleSelect = useCallback((option: SelectOption) => {
        setCycleFilter(option);
        setCurrentPage(1);
    }, []);


    const cycleOptions = useMemo<SelectOption[]>(() => [
        { id: 'all', name: 'Todos os Ciclos' },
        ...cycles.map(c => ({ id: c.id, name: c.name }))
    ], [cycles]);

    return {
        // Estados
        searchTerm, statusFilter, cycleFilter, cycles, isLoadingCycles,
        evaluations, isLoading, error, currentPage, totalPages,
        // Dados Derivados
        cycleOptions, statusOptions,
        // Handlers e Setters
        handleSearchChange, handleStatusSelect, handleCycleSelect, setCurrentPage,
    };
};
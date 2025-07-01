import { useState,useEffect,useRef } from 'react';
import { Search,Loader2 } from "lucide-react";
import EvaluationsTable from "../EvaluationsTable/EvaluationsTable";
import type { EvaluationTableFromApi,Evaluation,Cycle } from '../../types/evaluation';
import Pagination from '../Pagination/Pagination';
import EvaluationsTableSkeleton from '../EvaluationsTableSkeleton/EvaluationsTableSkeleton';
import type { ManagerDashboardData } from '../../types/manager';
import CustomSelect, { type SelectOption } from '../CustomSelect/CustomSelect';

const statusOptions: SelectOption[] = [
    { id: 'all', name: 'Todos os Status' },
    { id: 'Concluída', name: 'Concluída' },
    { id: 'Pendente', name: 'Pendente' },
    { id: 'Em Atraso', name: 'Em Atraso' }
];

interface EvaluationsPanelProps {
    managerId?: string;
}

export default function EvaluationsPanel({managerId} : EvaluationsPanelProps) {
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
    const panelRef = useRef<HTMLDivElement>(null);

    const handleStatusSelect = (option: SelectOption) => {
        setStatusFilter(option);
        setCurrentPage(1); 
    }

    const handleCycleSelect = (option: SelectOption) => {
        setCycleFilter(option);
        setCurrentPage(1);
    }

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); 
    }

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
    }, [searchTerm, statusFilter, cycleFilter, currentPage,managerId]);

    useEffect(() => {
    if (currentPage > 1 && panelRef.current) {
        const elementTop = panelRef.current.getBoundingClientRect().top + window.scrollY;
        const offset = 150; 
        window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
        });
    }
    }, [currentPage]); 

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

    const cycleOptions: SelectOption[] = [
        { id: 'all', name: 'Todos os Ciclos' },
        ...cycles.map(c => ({ id: c.id, name: c.name }))
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
            {/* Cabeçalho do Painel */}
            <div ref={panelRef}>
                <h2 className="text-xl font-bold text-gray-800">
                    {managerId ? 'Avaliações das Equipes' : 'Avaliações - Arraiware'}
                </h2>
                <p className="text-base text-gray-500 mt-1">
                    {managerId
                    ? 'Acompanhe o progresso das avaliações de todos seus liderados'
                    : 'Acompanhe o progresso de todas as avaliações em andamento'}
                </p>
            </div>

            {/* Barra de Ações (Busca e Filtros) */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
    
                {/* Campo de Busca */}
                <div className="relative flex-grow" style={{ minWidth: '300px' }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input 
                        type="text"
                        placeholder="Buscar por colaborador, departamento ou trilha..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                
                {/* Filtros e Exportação*/}
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                    <div className="w-48">
                         <CustomSelect
                            options={statusOptions}
                            selected={statusFilter}
                            onChange={handleStatusSelect}
                            placeholder="Filtrar por Status"
                        />
                    </div>
                    <div className="w-48">
                        {isLoadingCycles ? (
                             <div className="flex items-center justify-center text-gray-500 border border-gray-300 px-4 py-2 rounded-lg text-sm">
                                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Carregando...
                            </div>
                        ) : (
                            <CustomSelect
                                options={cycleOptions}
                                selected={cycleFilter}
                                onChange={handleCycleSelect}
                                placeholder="Filtrar por Ciclo"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Tabela de Dados */}
            <div className="mt-8">
                {error && <p className="text-red-500">{error}</p>}
                
                {isLoading ? (
                <EvaluationsTableSkeleton />
                ) : (
                !error && (
                    <>
                    <EvaluationsTable evaluations={evaluations} />
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    </>
                )
                )}
            </div>
        </div>
    );
}
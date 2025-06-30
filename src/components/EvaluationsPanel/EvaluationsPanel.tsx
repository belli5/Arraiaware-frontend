import { useState,useEffect,useRef } from 'react';
import { Search, Filter, Download, ChevronDown,Loader2 } from "lucide-react";
import EvaluationsTable from "../EvaluationsTable/EvaluationsTable";
import type { EvaluationTableFromApi,Evaluation,Cycle } from '../../types/evaluation';
import Pagination from '../Pagination/Pagination';
import EvaluationsTableSkeleton from '../EvaluationsTableSkeleton/EvaluationsTableSkeleton';

const statusOptions = [
  { value: 'all', label: 'Progresso' },
  { value: 'Concluída', label: 'Concluída' },
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Em Atraso', label: 'Em Atraso' }
];

export default function EvaluationsPanel() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [cycleFilter, setCycleFilter] = useState('all');
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isCycleDropdownOpen, setIsCycleDropdownOpen] = useState(false);

    const handleStatusSelect = (status: string) => {
        setStatusFilter(status);
        setIsStatusDropdownOpen(false); 
        setCurrentPage(1); 
    }

    const handleCycleSelect = (cycleId: string) => {
        setCycleFilter(cycleId);
        setIsCycleDropdownOpen(false);
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
                if (statusFilter !== 'all') params.append('status', statusFilter);
                if (cycleFilter !== 'all') params.append('cycleId', cycleFilter); 
                params.append('page', currentPage.toString());
                params.append('limit', '10'); 

                const response = await fetch(`http://localhost:3000/api/rh/evaluations?${params.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar dados: ${response.statusText}`);
                }

                const result: EvaluationTableFromApi = await response.json();
                setEvaluations(result.data);
                setTotalPages(result.pagination.totalPages);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluations();
    }, [searchTerm, statusFilter, cycleFilter, currentPage]);

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

    const selectedStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || 'Progresso';
    const selectedCycleName = cycleFilter === 'all' 
        ? 'Ciclo' 
        : cycles.find(c => c.id === cycleFilter)?.cycleName|| 'Ciclo';

    return (
        <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
            
            {/* Cabeçalho do Painel */}
            <div ref={panelRef} >
                <h2 className="text-xl font-bold text-gray-800">Painel de Avaliações - Arraiware</h2>
                <p className="text-base text-gray-500 mt-1">Acompanhe o progresso de todas as avaliações em andamento</p>
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
                    {/* Container do Dropdown de Status */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="flex items-center justify-between gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm w-40" 
                        >
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="flex-grow text-left">{selectedStatusLabel}</span> 
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                        {isStatusDropdownOpen && (
                            <div className="absolute top-full mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                            <ul>
                                {statusOptions.map(option => (
                                <li 
                                    key={option.value} 
                                    onClick={() => handleStatusSelect(option.value)} 
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    {option.label}
                                </li>
                                ))}
                            </ul>
                            </div>
                        )}
                    </div>
                    {/* Container do Dropdown de ciclo */}
                    <div className="relative">
                        <button onClick={() => setIsCycleDropdownOpen(!isCycleDropdownOpen)} className="flex items-center justify-between gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm w-48">
                        <span className="flex-grow text-left">{selectedCycleName}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                        {isCycleDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            {isLoadingCycles ? (
                            <p className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Carregando...</p>
                            ) : (
                            <ul>
                                <li onClick={() => handleCycleSelect('all')} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Todos os Ciclos</li>
                                {cycles.map(cycle => (
                                <li key={cycle.id} onClick={() => handleCycleSelect(cycle.id)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">{cycle.cycleName}</li>
                                ))}
                            </ul>
                            )}
                        </div>
                        )}
                    </div>

                    {/* Botão de Exportar */}
                    <button className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-semibold">
                        <Download className="h-4 w-4" />
                        <span>Exportar</span>
                    </button>
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
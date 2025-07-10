import { useRef, useEffect } from 'react';
import { Search, Loader2 } from "lucide-react";
import EvaluationsTable from "../EvaluationsTable/EvaluationsTable";
import Pagination from '../Pagination/Pagination';
import EvaluationsTableSkeleton from '../EvaluationsTableSkeleton/EvaluationsTableSkeleton';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useEvaluationsPanelLogic } from '../../hooks/useEvaluationsPanelLogic'; 

interface EvaluationsPanelProps {
    managerId?: string;
}

export default function EvaluationsPanel({ managerId }: EvaluationsPanelProps) {
    const {
        searchTerm, statusFilter, cycleFilter, evaluations, isLoading, error,
        currentPage, totalPages, isLoadingCycles, cycleOptions, statusOptions,
        handleSearchChange, handleStatusSelect, handleCycleSelect, setCurrentPage
    } = useEvaluationsPanelLogic({ managerId });

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentPage>1 && panelRef.current) {
            const elementTop = panelRef.current.getBoundingClientRect().top + window.scrollY;
            const offset = 150;
            window.scrollTo({
                top: elementTop - offset,
                behavior: 'smooth'
            });
        }
    }, [currentPage]);

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
           <div className="grid grid-cols-4 gap-4 mb-3 mt-2">
                {/* Campo de Busca  */}
                <div className="relative col-span-2 mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input 
                        type="text"
                        placeholder="Buscar por colaborador, departamento ou trilha..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                
                {/* Filtro de Status (Ocupando 1 coluna) */}
                <div className="relative col-span-1 mt-1">
                    <CustomSelect
                        options={statusOptions}
                        selected={statusFilter}
                        onChange={handleStatusSelect}
                        placeholder="Filtrar por Status"
                    />
                </div>
                
                {/* Filtro de Ciclo (Ocupando 1 coluna) */}
                <div className="relative col-span-1 mt-1">
                    {isLoadingCycles ? (
                        <div className="flex items-center justify-center text-gray-500 border border-gray-300 px-4 py-2 rounded-lg text-sm h-full">
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
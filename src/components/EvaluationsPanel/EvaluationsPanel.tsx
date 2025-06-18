import { useState } from 'react';
import { Search, Filter, Download, ChevronDown } from "lucide-react";
import EvaluationsTable from "../EvaluationsTable/EvaluationsTable";

const statusOptions = ['Todos', 'Concluída', 'Pendente', 'Em Atraso'];
const departmentOptions = ['Todos', 'Tecnologia', 'Marketing', 'Vendas', 'RH'];

export default function EvaluationsPanel() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [departmentFilter, setDepartmentFilter] = useState('Todos');
    
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);

    const handleStatusSelect = (status: string) => {
        setStatusFilter(status);
        setIsStatusDropdownOpen(false); 
    }

    const handleDepartmentSelect = (department: string) => {
        setDepartmentFilter(department);
        setIsDepartmentDropdownOpen(false); 
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
            
            {/* Cabeçalho do Painel */}
            <div>
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Filtros e Exportação*/}
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                    {/* Container do Dropdown de Status */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="flex items-center justify-between gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm w-36"
                        >
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="flex-grow text-left">{statusFilter}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                        {isStatusDropdownOpen && (
                            <div className="absolute top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <ul>
                                    {statusOptions.map(option => (
                                        <li key={option} onClick={() => handleStatusSelect(option)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Container do Dropdown de Departamento */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                            className="flex items-center justify-between gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm w-36"
                        >
                            <span className="flex-grow text-left">{departmentFilter}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                        {isDepartmentDropdownOpen && (
                            <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <ul>
                                    {departmentOptions.map(option => (
                                        <li key={option} onClick={() => handleDepartmentSelect(option)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
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
                <EvaluationsTable 
                    searchTerm={searchTerm} 
                    statusFilter={statusFilter} 
                    departmentFilter={departmentFilter}
                />
            </div>
        </div>
    );
}
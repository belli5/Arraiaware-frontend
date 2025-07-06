// src/components/EvaluationsPanel/EvaluationsPanelManager.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Pagination from '../Pagination/Pagination';
import EvaluationsTableSkeleton from '../EvaluationsTableSkeleton/EvaluationsTableSkeleton';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useEvaluationsPanelLogic } from '../../hooks/useEvaluationsPanelLogic';
import type { Evaluation, SelfEvaluationRecord } from '../../types/evaluation';
import EvaluationsTableManager from '../EvaluationsTable/EvolutionTableManager';

interface EvaluationsPanelManagerProps {
  managerId?: string;
  cycleId: string;
}

export default function EvaluationsPanelManager({ managerId, cycleId }: EvaluationsPanelManagerProps) {
  const {
    searchTerm,
    statusFilter,
    cycleFilter,
    evaluations,
    isLoading,
    error,
    currentPage,
    totalPages,
    isLoadingCycles,
    cycleOptions,
    statusOptions,
    handleSearchChange,
    handleStatusSelect,
    handleCycleSelect,
    setCurrentPage,
  } = useEvaluationsPanelLogic({ managerId });

  const panelRef = useRef<HTMLDivElement>(null);

  // Detalhe de avaliação
  const [selectedEvalItem, setSelectedEvalItem] = useState<Evaluation | null>(null);
  const [selfRecords, setSelfRecords] = useState<SelfEvaluationRecord[]>([]);
  const [loadingSelf, setLoadingSelf] = useState(false);
  const [errorSelf, setErrorSelf] = useState<string | null>(null);

  // Aba ativa no detalhe
  const [activeSubTab, setActiveSubTab] = useState<'self' | 'peer' | 'leader'>('self');

  const API_BASE = 'http://localhost:3000';

  // Fetch da autoavaliação quando um item é selecionado e aba for 'self'
  useEffect(() => {
    if (!selectedEvalItem || activeSubTab !== 'self') return;
    setLoadingSelf(true);
    setErrorSelf(null);
    const { collaboratorId: userId, cycleId: selCycleId } = selectedEvalItem;
    const token = localStorage.getItem('token');

    fetch(
      `${API_BASE}/api/evaluations/self/${userId}?cycleId=${selCycleId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}: não foi possível carregar a autoavaliação`);
        return res.json() as Promise<SelfEvaluationRecord[]>;
      })
      .then(setSelfRecords)
      .catch(err => setErrorSelf(err.message))
      .finally(() => setLoadingSelf(false));
  }, [selectedEvalItem, activeSubTab]);

  // Scroll ao mudar página
  useEffect(() => {
    if (currentPage > 1 && panelRef.current) {
      const top = panelRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 150, behavior: 'smooth' });
    }
  }, [currentPage]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
      {/* Cabeçalho de lista, oculto no detalhe */}
      {!selectedEvalItem && (
        <div ref={panelRef} className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {managerId ? 'Avaliações das Equipes' : 'Avaliações - Arraiware'}
            </h2>
            <p className="text-base text-gray-500 mt-1">
              {managerId
                ? 'Acompanhe o progresso das avaliações de todos seus liderados'
                : 'Acompanhe o progresso de todas as avaliações em andamento'}
            </p>
          </div>
        </div>
      )}

      {/* Cabeçalho de detalhe com abas */}
      {selectedEvalItem && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold">
                {activeSubTab === 'self'    ? 'Autoavaliação de'
                 : activeSubTab === 'peer'    ? 'Avaliação de Pares de'
                 /* else */                 : 'Avaliação do Líder de'}{' '}
                <span className="text-orange-600">{selectedEvalItem.collaborator}</span>
              </h3>
              <p className="text-sm text-gray-500">
                Ciclo: {selectedEvalItem.cycleName} • Projeto: {selectedEvalItem.projectName}
              </p>
            </div>
            <button
              onClick={() => setSelectedEvalItem(null)}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              ← Voltar
            </button>
          </div>

          {/* Abas retangulares full-width */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(['self','peer','leader'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`py-2 text-center font-medium rounded-t-lg
                  ${activeSubTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600'}`}
              >
                {tab === 'self'  ? 'Autoavaliação'
                 : tab === 'peer'  ? 'Pares'
                 /* else */       : 'Líder'}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Conteúdo: lista ou detalhe de acordo com a aba */}
      {selectedEvalItem ? (
        activeSubTab === 'self' ? (
          <div className="space-y-4">
            {loadingSelf && <p>Carregando autoavaliação...</p>}
            {errorSelf && <p className="text-red-500">{errorSelf}</p>}
            {!loadingSelf && !errorSelf && selfRecords.map(rec => (
              <div key={rec.criterionId} className="bg-gray-50 p-4 rounded shadow-sm">
                <h4 className="font-semibold mb-1">{rec.criterion.name}</h4>
                <p>Nota: {rec.score} ({rec.scoreDescription})</p>
                {rec.justification && (
                  <p className="mt-2 text-gray-700">Justificativa: {rec.justification}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Conteúdo da aba {activeSubTab === 'peer' ? 'Pares' : 'Líder'} em breve...
          </p>
        )
      ) : (
        <>
          {/* Filtros e Busca */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="relative flex-grow" style={{ minWidth: '300px' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por colaborador, departamento ou trilha..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
              />
            </div>
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

          {/* Tabela e Paginação */}
          <div className="mt-8">
            {error && <p className="text-red-500">{error}</p>}
            {isLoading ? (
              <EvaluationsTableSkeleton />
            ) : (
              !error && (
                <>
                  <EvaluationsTableManager
                    evaluations={evaluations}
                    onViewEvaluation={setSelectedEvalItem}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

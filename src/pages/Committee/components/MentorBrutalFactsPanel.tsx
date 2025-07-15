import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import NotificationMessages from '../../../components/NotificationMessages/NotificationMessages';
import { useBrutalFactsLogic } from "../../../hooks/useMentorBrutalFactsLogic"; 
import { LoaderCircle, FileSearch } from 'lucide-react';

const ScoreDisplay = ({ label, score }: { label: string; score: number }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200">
    <span className="text-xs text-slate-500 font-medium">{label}</span>
    <span className="text-2xl font-bold text-orange-600">{score.toFixed(1)}</span>
  </div>
);

export default function MentorBrutalFactsPanel() {
  const { 
    brutalFacts, 
    isLoading, 
    notification,
    cycles,
    clearNotification,
    selectedCycleId,
    setSelectedCycleId
  } = useBrutalFactsLogic();

  const selectedCycleObject = useMemo(
    () => cycles.find(cycle => cycle.id === selectedCycleId) || null,
    [cycles, selectedCycleId]
  );

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6">
      {notification && (
        <NotificationMessages
          status={notification.status}
          title={notification.title}
          message={notification.message}
          onClose={clearNotification} 
        />
      )}

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Painel de Performance</h1>
        <p className="text-base text-slate-500 mt-1">Analise os dados de performance dos seus mentorados por ciclo.</p>
      </header>

      <div className="mb-8 w-full max-w-xs relative">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Filtrar por Ciclo
        </label>
        <CustomSelect
          placeholder="Selecione um ciclo"
          options={cycles}
          selected={selectedCycleObject}
          onChange={(option) => setSelectedCycleId(option.id)}
          disabled={isLoading || cycles.length === 0}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-sm">
          <LoaderCircle className="h-10 w-10 text-orange-500 animate-spin" />
          <h3 className="mt-4 text-lg font-semibold text-slate-700">Buscando dados...</h3>
          <p className="mt-1 text-sm text-slate-500">Aguarde um momento, por favor.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {brutalFacts.length > 0 ? (
            brutalFacts.map((fact) => (
              <div key={`${fact.menteeId}-${fact.cycleId}`} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
                  <h2 className="text-xl font-bold">{fact.menteeName}</h2>
                  {/* Nome do projeto já exibido ao lado do ciclo */}
                  <p className="text-xs opacity-90 font-light">{`${fact.projectName} - ${fact.cycleName}`}</p>
                </div>
                
                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    {/* Bloco de nota final com tamanho reduzido */}
                    <div className="col-span-3 flex flex-col items-center justify-center p-3 bg-orange-500 text-white rounded-lg">
                      <span className="text-sm font-semibold tracking-wider uppercase">Final Score</span>
                      <span className="text-3xl font-bold">{fact.finalScore.toFixed(1)}</span>
                    </div>
                    <ScoreDisplay label="Self Evaluation" score={fact.selfEvaluationScore} />
                    <ScoreDisplay label="Peer Evaluation" score={fact.peerEvaluationScore} />
                    <ScoreDisplay label="Leader Evaluation" score={fact.leaderEvaluationScore} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">AI Briefing 🧠</h3>
                    <div className="p-4 bg-orange-50 rounded-md border border-orange-200">
                      <div className="prose prose-sm max-w-none text-slate-700 prose-headings:text-slate-800 prose-strong:text-slate-800">
                        <ReactMarkdown>{fact.aiBriefing}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-sm">
              <FileSearch className="h-10 w-10 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-700">Nenhum dado encontrado</h3>
              <p className="mt-1 text-sm text-slate-500">Não há dados de performance para o ciclo selecionado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
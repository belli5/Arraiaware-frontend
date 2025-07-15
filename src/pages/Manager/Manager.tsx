import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../../components/Header/Header_Gestor';
import StatCard from '../../components/StatCard/StatCard'; 
import { Users, CheckCircle2, Clock, AlertTriangle, BarChart2, ClipboardList, PlusCircle} from 'lucide-react'; 
import OverallProgressManager from './components/OverallProgressManager';
import Tabs from '../../components/Tabs/Tabs';
import Footer from '../../components/Footer/Footer';
import type { Tab } from '../../types/tabs';
import type { managerTabId, ManagerDashboardData } from '../../types/manager';
import SkeletonStatCard from '../../components/SkeletonStatCard/SkeletonStatCard';
import ManagerEvaluation from './components/ManagerEvaluation';
import type { Evaluation, Question } from '../../types/evaluation';
import EvaluationsPanelManager from './components/EvolutionPanelManager';
import { useEvaluationsPanelLogic } from '../../hooks/useEvaluationsPanelLogic';
import Pagination from '../../components/Pagination/Pagination';
import EvaluationsTableBrutalFact from '../../components/BrutalFact/BrutalFact';      
import EvaluationsPanelBrutalFact from '../../components/BrutalFact/EvaluationsPanelBrutalFact';
import CreateProjectPanel from '../../components/CreateProjectPanel/CreateProjectPanel';


const managerTabOptions: Tab[] = [
  { id: 'status', label: 'Status dos liderados', icon: <CheckCircle2 size={18} /> },
  { id: 'evaluation', label: 'Avaliação de liderados', icon: <ClipboardList size={18} /> },
  { id: 'brutalfact', label: 'Brutal Facts', icon: <BarChart2 size={18} /> },
  { id: 'projeto', label: 'Crie um Projeto', icon: <PlusCircle  size={18} /> },
];

const managerQuestions: Question[] = [
  {
    id: 'deliveryScore',
    type: 'scale',
    text: 'Qualidade e pontualidade das entregas'
  },
  {
    id: 'proactivityScore',
    type: 'scale',
    text: 'Proatividade e iniciativa na resolução de problemas'
  },
  {
    id: 'collaborationScore',
    type: 'scale',
    text: 'Colaboração e trabalho em equipe'
  },
  {
    id: 'skillScore',
    type: 'scale',
    text: 'Habilidades técnicas e de negócio'
  },
  {
    id: 'justification',
    type: 'text',
    text: 'Justificativa ou observações gerais sobre o desempenho'
  }
];

export default function Manager() { 
  const [activeTab, setActiveTab] = useState<managerTabId>('status');
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const [selectedEval, setSelectedEval] = useState<Evaluation|null>(null);
  const [dashboardData, setDashboardData] = useState<ManagerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  const userObject = useMemo(() => {
    const storedUserString = localStorage.getItem('user');
    if (storedUserString) {
      try {
        return JSON.parse(storedUserString);
      } catch (error) {
        console.error("Erro ao converter o objeto do usuário do localStorage:", error);
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (!userObject?.sub) {
      setError("ID do gestor não encontrado. Por favor, faça o login novamente.");
      setIsLoading(false);
      return;
    }
    
    const fetchManagerData = async () => {
      setIsLoading(true); 
      setError(null);     
      const token = localStorage.getItem('token');

      if (!token) {
        setError("Você não está autenticado.");
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:3000/api/dashboard/manager/${userObject.sub}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar os dados do gestor.");
        }
        
        const data: ManagerDashboardData = await response.json();
        setDashboardData(data);
        console.log("cycleId vindo do backend:", data.cycleId)
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchManagerData(); 
  }, [userObject]); 

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as managerTabId);
    setTimeout(() => {
      if (contentPanelRef.current) {
        const elementTop = contentPanelRef.current.getBoundingClientRect().top + window.scrollY;
        const offset = 150;
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        });
      }
    }, 0); 
  };

  // chamada INCONDICIONAL (CERTO – sempre no topo)
 const brutalLogic = useEvaluationsPanelLogic({
   managerId: userObject?.sub,
   cycleId: dashboardData?.cycleId,
 });

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <main className="pt-24">
        <section className="mb-10 px-6 md:px-12 text-left">
          <h1 className="text-3xl md:text-4xl font-bold">
            Acompanhamento de {userObject?.name || 'Liderados'}
          </h1>
          <p className="text-gray-600">
            Monitore o progresso de preenchimento dos seus liderados
          </p>
        </section>

        <div className='max-w-[1600px] mx-auto px-6 lg:px-10'>
          {isLoading ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </div>
            </>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total de Liderados"
                  value={dashboardData?.summary.totalCollaborators.toString() ?? '0'}
                  subtitle="Colaboradores ativos"
                  Icon={Users}
                  borderColor="border-black-500"
                  valueColor="text-black-500"
                  iconColor="text-black-500"
                />
                <StatCard 
                  title="Concluídos"
                  value={dashboardData?.summary.completed.toString() ?? '0'}
                  subtitle="Avaliações finalizadas"
                  Icon={CheckCircle2}
                  borderColor="border-green-500" 
                  valueColor="text-green-500" 
                  iconColor="text-green-500"
                />
                <StatCard 
                  title="Pendentes"
                  value={dashboardData?.summary.pending.toString() ?? '0'}
                  subtitle="Aguardando conclusão"
                  Icon={Clock}
                  borderColor="border-amber-500" 
                  valueColor="text-amber-500" 
                  iconColor="text-amber-500"
                />
                <StatCard 
                  title="Em Atraso"
                  value={dashboardData?.summary.overdue.toString() ?? '0'}
                  subtitle="Requer atenção"
                  Icon={AlertTriangle}
                  borderColor="border-red-500" 
                  valueColor="text-red-500" 
                  iconColor="text-red-500"
                />
              </div>
              
              {dashboardData && <OverallProgressManager summary={dashboardData.summary} />} 
            </>
          )}

          <Tabs 
            tabs={managerTabOptions}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            className="mt-8 mb-4" 
          />
        
          <div ref={contentPanelRef} className="mt-8">
            {activeTab === 'status' && userObject && dashboardData && (
              <EvaluationsPanelManager
                managerId={userObject.sub}
                cycleId={dashboardData.cycleId}
              />
            )}
            
            {activeTab === 'brutalfact' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Se houver selectedEval, troca para o painel de detalhes */}
                {selectedEval ? (
                  <EvaluationsPanelBrutalFact
                  managerId={userObject!.sub}
                  cycleId={dashboardData!.cycleId}
                  userName={selectedEval.collaborator}
                  projectName={selectedEval.projectName}    
                  cycleName={selectedEval.cycleName}        
                  onViewDetails={() => setSelectedEval(null)}
                  onCreateActionPlan={() => { /*…*/ }}
                />
                ) : (
                  <>

                  {/* ==== introdução na visão de lista ==== */}
                    <section className="mb-6 text-left px-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Brutal Facts
                      </h1>
                      <p className="text-gray-600 mt-1">
                        Aqui você encontra os principais pontos de atenção imediata
                        que podem impactar o desempenho dos seus liderados neste ciclo.
                      </p>
                    </section>
                    
                    {brutalLogic.error && <p className="text-red-500">{brutalLogic.error}</p>}
                    {brutalLogic.isLoading ? (
                      <p>Carregando Brutal Facts…</p>
                    ) : (
                      <>
                        <EvaluationsTableBrutalFact
                          evaluations={brutalLogic.evaluations}
                          onViewEvaluation={setSelectedEval}
                        />
                        <div className="mt-4">
                          <Pagination
                            currentPage={brutalLogic.currentPage}
                            totalPages={brutalLogic.totalPages}
                            onPageChange={brutalLogic.setCurrentPage}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'projeto' && userObject && dashboardData && (
            <div className="w-full  mt-2">
              <CreateProjectPanel
                managerId={userObject.sub}
                cycleId={dashboardData.cycleId}
              />
              </div>
            )}

            {activeTab === 'evaluation' && dashboardData && (           
              <div className="bg-white p-8 rounded-lg shadow-md">
                <section className="mb-10 text-left">
                  <h2 className="text-xl font-bold text-gray-800">
                    <span>Avaliação de {userObject?.name || 'seus Liderados'}</span>
                  </h2>
                  <p className="text-base text-gray-500 mt-1">
                    Avalie os seus liderados conforme seu progresso no ciclo
                </p>
                </section>
                <ManagerEvaluation
                  managerId={userObject.sub}
                  cycleId={dashboardData.cycleId}       // passe exatamente o UUID
                  questions={managerQuestions}
                />
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
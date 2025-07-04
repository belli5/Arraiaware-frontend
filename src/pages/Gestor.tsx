import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/Header/Header_Gestor';
import StatCard from '../components/StatCard/StatCard'; 
import { Users, CheckCircle2, Clock, AlertTriangle, BarChart2, ClipboardList} from 'lucide-react'; 
import OverallProgressManager from '../components/OverallProgressRH/OverallProgressManager';
import Tabs from '../components/Tabs/Tabs';
import EvaluationsPanel from '../components/EvaluationsPanel/EvaluationsPanel';
import Footer from '../components/Footer/Footer';
import type { Tab } from '../types/tabs';
import type { managerTabId, ManagerDashboardData } from '../types/manager';
import SkeletonStatCard from '../components/SkeletonStatCard/SkeletonStatCard';
import ManagerEvaluation from '../components/ManagerEvaluation/ManagerEvaluation';
import type { Question } from '../types/evaluation';


const managerTabOptions: Tab[] = [
  { id: 'status', label: 'Status dos liderados', icon: <CheckCircle2 size={18} /> },
  { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> },
  { id: 'evaluation', label: 'Avaliação de liderados', icon: <ClipboardList size={18} /> }
];

const managerQuestions: Question[] = [
  { id: 'mq1', type: 'scale', text: 'Como você avalia a clareza de comunicação deste colaborador?' },
  { id: 'mq2', type: 'scale', text: 'Quão proativo ele(a) foi durante o ciclo?' },
  { id: 'mq3', type: 'text',  text: 'Quais pontos de melhoria você identifica?' },
  { id: 'mq4', type: 'text',  text: 'Dê um exemplo de um bom resultado entregue.' },
];

export default function Manager() {
  const [activeTab, setActiveTab] = useState<managerTabId>('status');
  const contentPanelRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <main className="pt-24 pb-12">
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
            {activeTab === 'status' && userObject && (
              <EvaluationsPanel managerId={userObject.sub} />
            )}
            {activeTab === 'insights' && (
              <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                <p>Painel de Insights em construção.</p>
              </div>
            )}

            {activeTab === 'evaluation' && (            
              <div className="bg-white p-8 rounded-lg shadow-md">
                <section className="mb-10 px-6 md:px-12 text-left">
                  <h3 className="text-3xl md:text-4xl font-bold flex items-center space-x-2">
                    <span>📝</span>
                    <span>Avaliação de {userObject?.name || 'seus Liderados'}</span>
                  </h3>
                  <p className="uppercase text-sm text-amber-600 font-medium mt-1">
                    Andamento • Desempenho • Insights
                  </p>
                </section>
                <ManagerEvaluation
                  managerId={userObject!.sub}
                  cycleId={dashboardData!.cycleId}
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
import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/Header/Header_Gestor';
import StatCard from '../components/StatCard/StatCard'; 
import { Users, CheckCircle2, Clock, AlertTriangle, BarChart2, Loader2 } from 'lucide-react'; 
import OverallProgressManager from '../components/OverallProgressRH/OverallProgressManager';
import Tabs from '../components/Tabs/Tabs';
import EvaluationsPanel from '../components/EvaluationsPanel/EvaluationsPanel';
import Footer from '../components/Footer/Footer';
import type { Tab } from '../types/tabs';
import type { managerTabId, ManagerDashboardData } from '../types/manager';

const managerTabOptions: Tab[] = [
  { id: 'status', label: 'Status dos liderados', icon: <CheckCircle2 size={18} /> },
  { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> }
];

export default function Manager() {
  const [activeTab, setActiveTab] = useState<managerTabId>('status');
  const contentPanelRef = useRef<HTMLDivElement>(null);

  const [dashboardData, setDashboardData] = useState<ManagerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [userObject]); // A dependência garante que a busca rode se o usuário mudar.

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as managerTabId);
  };

  useEffect(() => {
    if (!isLoading && contentPanelRef.current) {
      const elementTop = contentPanelRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = 150;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  }, [activeTab, isLoading]);
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-50">
        <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-orange-50 text-red-600">
        <AlertTriangle size={40} className="mb-4" />
        <p className="text-xl font-semibold">Erro ao carregar dados</p>
        <p>{error}</p>
      </div>
    );
  }
    
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total de Liderados"
              value={dashboardData?.summary.totalCollaborators.toString() ?? '0'}
              subtitle="Colaboradores ativos"
              Icon={Users}
            />
            <StatCard 
              title="Concluídos"
              value={dashboardData?.summary.completed.toString() ?? '0'}
              subtitle="Avaliações finalizadas"
              Icon={CheckCircle2}
              borderColor="border-green-500" valueColor="text-green-500" iconColor="text-green-500"
            />
            <StatCard 
              title="Pendentes"
              value={dashboardData?.summary.pending.toString() ?? '0'}
              subtitle="Aguardando conclusão"
              Icon={Clock}
              borderColor="border-amber-500" valueColor="text-amber-500" iconColor="text-amber-500"
            />
            <StatCard 
              title="Em Atraso"
              value={dashboardData?.summary.overdue.toString() ?? '0'}
              subtitle="Requer atenção"
              Icon={AlertTriangle}
              borderColor="border-red-500" valueColor="text-red-500" iconColor="text-red-500"
            />
          </div>
          
          {dashboardData && <OverallProgressManager summary={dashboardData.summary} />} 

          <Tabs 
            tabs={managerTabOptions}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            className="mt-4 mb-4" 
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
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
import Header from '../components/Header/Header_Gestor';
import StatCard from '../components/StatCard/StatCard'; 
import { Users, CheckCircle2, Clock, AlertTriangle,BarChart2,DownloadCloud } from 'lucide-react'; 
import OverallProgress from '../components/OverallProgressRH/OverallProgress_Gestor';
import { useState,useRef } from 'react';
import Tabs from '../components/Tabs/Tabs';
import type { Tab } from '../types/tabs';
import type { managerTabId } from '../types/manager';
import EvaluationsPanel from '../components/EvaluationsPanel/EvaluationsPanel';
import CriteriaPanel from '../components/CriteriaPanel/CriteriaPanel'; 
import HistoryPanel from '../components/HistoryPanel/HistoryPanel'; 
import Footer from '../components/Footer/Footer';

const managerTabOptions: Tab[] = [
  { id: 'status', label: 'Status dos liderados', icon: <CheckCircle2 size={18} /> },
  { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> },               
  { id: 'exportacao', label: 'Exportar Dados', icon: <DownloadCloud size={18} /> }, 
];

export default function RH() {
  const [activeTab, setActiveTab] = useState<managerTabId>('status');
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const handleTabClick = (tabId: string) => {
      setActiveTab(tabId as managerTabId);
      setTimeout(() => {
        if (contentPanelRef.current) {
          contentPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50); 
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <main className="pt-24">
        <section className="mb-10 pl-12 text-left">
            <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
                Acompanhamento de Liderados <span></span>
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
                Monitore o progresso de preenchimento da sua equipe
            </p>
        </section>
        <div className='max-w-[1600px] mx-auto px-6 lg:px-10'>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Total de Liderados"
                value="5"
                subtitle="Colaboradores ativos"
                Icon={Users}
            />
            <StatCard 
                title="Concluídos"
                value="2"
                subtitle="59% do total"
                Icon={CheckCircle2}
                borderColor="border-green-500"
                valueColor="text-green-500"
                iconColor="text-green-500"
            />
            <StatCard 
                title="Pendentes"
                value="2"
                subtitle="Aguardando conclusão"
                Icon={Clock}
                borderColor="border-amber-500"
                valueColor="text-amber-500"
                iconColor="text-amber-500"
            />
            <StatCard 
                title="Em Atraso"
                value="1"
                subtitle="Requer atenção"
                Icon={AlertTriangle}
                borderColor="border-red-500"
                valueColor="text-red-500"
                iconColor="text-red-500"
            />
            </div>
            <OverallProgress />  

            <Tabs 
              tabs={managerTabOptions}
              activeTab={activeTab}          
              onTabClick={handleTabClick}
              className="mt-4 mb-4" 
            />
          
            <div ref={contentPanelRef}  className="mt-8">
            {activeTab === 'status' && <EvaluationsPanel />}
            {activeTab === 'criterios' && <CriteriaPanel />}
            {activeTab === 'historico' && <HistoryPanel />}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
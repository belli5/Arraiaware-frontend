import Header from '../components/Header/Header_RH';
import StatCard from '../components/StatCard/StatCard'; 
import { Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'; 
import OverallProgress from '../components/OverallProgressRH/OverallProgress';
import { useState,useRef } from 'react';
import Tabs from '../components/Tabs/Tabs';
import type {Tab} from '../components/Tabs/Tabs';
import EvaluationsPanel from '../components/EvaluationsPanel/EvaluationsPanel';
import CriteriaPanel from '../components/CriteriaPanel/CriteriaPanel'; 
import HistoryPanel from '../components/HistoryPanel/HistoryPanel'; 
import Footer from '../components/Footer/Footer';

export default function RH() {
  const [activeTab, setActiveTab] = useState<Tab>('status');
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);

    setTimeout(() => {
      if (contentPanelRef.current) {
        const elementTop = contentPanelRef.current.getBoundingClientRect().top + window.scrollY;
        const offset = 110; 

        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        });
      }
    }, 50); 
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <main className="pt-24">
        <section className="mb-10 pl-12 text-left">
            <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
                Acompanhamento RH <span></span>
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
                Monitore o progresso de preenchimento de todas as avaliações da empresa
            </p>
        </section>
        <div className='max-w-[1600px] mx-auto px-6 lg:px-10'>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Total de Avaliações"
                value="150"
                subtitle="Colaboradores ativos"
                Icon={Users}
            />
            <StatCard 
                title="Concluídas"
                value="89"
                subtitle="59% do total"
                Icon={CheckCircle2}
                borderColor="border-green-500"
                valueColor="text-green-500"
                iconColor="text-green-500"
            />
            <StatCard 
                title="Pendentes"
                value="61"
                subtitle="Aguardando conclusão"
                Icon={Clock}
                borderColor="border-amber-500"
                valueColor="text-amber-500"
                iconColor="text-amber-500"
            />
            <StatCard 
                title="Em Atraso"
                value="12"
                subtitle="Requer atenção"
                Icon={AlertTriangle}
                borderColor="border-red-500"
                valueColor="text-red-500"
                iconColor="text-red-500"
            />
            </div>
            <OverallProgress />  

            <Tabs 
              activeTab={activeTab} 
              setActiveTab={handleTabChange}
              className="mt-8" 
            />
            <div ref={contentPanelRef} className="mt-[-1px]">
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
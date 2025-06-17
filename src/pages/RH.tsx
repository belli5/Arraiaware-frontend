import Header from '../components/Header/Header_geral';
import StatCard from '../components/StatCard/StatCard'; 
import { Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'; 
import OverallProgress from '../components/OverallProgressRH/OverallProgress';
import { useState } from 'react';
import Tabs from '../components/Tabs/Tabs';
import type {Tab} from '../components/Tabs/Tabs';
import EvaluationsPanel from '../components/EvaluationsPanel/EvaluationsPanel';

export default function RH() {
  const [activeTab, setActiveTab] = useState<Tab>('status');
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-100">
      <Header />
      <main className="pt-24">
        <div className='max-w-[1600px] mx-auto'>
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
              setActiveTab={setActiveTab}
              className="mt-12" 
            />
            <div className="mt-[-1px]">
            {activeTab === 'status' && <EvaluationsPanel />}
            {activeTab === 'criterios' && <div>Painel de Critérios (Em breve)</div>}
            {activeTab === 'historico' && <div>Painel de Históricos (Em breve)</div>}
          </div>
        </div>


      </main>
    </div>
  );
}
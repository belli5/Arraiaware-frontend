import { useState, useRef } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import StatCard from '../../components/StatCard/StatCard';
import Tabs from '../../components/Tabs/Tabs';
import type { Tab } from '../../types/tabs';
import { ShieldCheck, Download, Settings, Users, Recycle } from 'lucide-react';
import AuditLogDownloader from './components/AuditLogDownloader';

const adminTabOptions: Tab[] = [
  { id: 'logs', label: 'Download de Logs', icon: <Download size={18} /> },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('logs');
  const contentPanelRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setTimeout(() => {
      contentPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <main className="pt-24 pb-12">
        <section className="mb-10 pl-12 text-left">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <ShieldCheck size={36} className="text-orange-500" />
              Painel de Administração
            </h1>
            <p className="text-gray-600 mt-2 ml-3">
              Gerencie as configurações globais e monitore a saúde do sistema.
            </p>
        </section>
        <div className='max-w-[1600px] mx-auto px-6 lg:px-10'>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Usuários Ativos"
                value="1,240"
                subtitle="Total de usuários no sistema"
                Icon={Users}
                borderColor="border-blue-500"
                valueColor="text-blue-500"
                iconColor="text-blue-500"
            />
            <StatCard 
                title="Ciclos de Avaliação"
                value="5"
                subtitle="Ciclos concluídos e ativos"
                Icon={Recycle}
                borderColor="border-green-500"
                valueColor="text-green-500"
                iconColor="text-green-500"
            />
            <StatCard
                title="Logs Gerados (Hoje)"
                value="8,592"
                subtitle="Registros de auditoria"
                Icon={Download}
                borderColor="border-gray-500"
                valueColor="text-gray-500"
                iconColor="text-gray-500"
            />
            <StatCard
                title="Configurações Ativas"
                value="27"
                subtitle="Parâmetros globais do sistema"
                Icon={Settings}
                borderColor="border-amber-500"
                valueColor="text-amber-500"
                iconColor="text-amber-500"
            />
          </div>
    
          <Tabs 
            tabs={adminTabOptions}
            activeTab={activeTab} 
            onTabClick={handleTabClick}
            className="mt-12 mb-6" 
          />

          <div ref={contentPanelRef}>
            {activeTab === 'logs' && <AuditLogDownloader />}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
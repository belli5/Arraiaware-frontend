import { useState, useRef} from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CommitteeStatsGrid from './components/CommitteeStatsGrid';
import CommitteeInsightsPanel from './components/CommitteeInsightsPanel';
import type { CommitteeTab} from '../../types/committee';
import Tabs from '../../components/Tabs/Tabs';
import type { Tab } from '../../types/tabs';
import { DownloadCloud, BarChart2, CheckCircle2,Users,UserPlus } from 'lucide-react';
import CommitteeExportPanel from './components/CommitteeExportPanel';
import CommitteeEvaluationsPanel from './components/CommitteeEvaluationsPanel';
import MentorBrutalFactsPanel from './components/MentorBrutalFactsPanel';
import AddMenteePanel from './components/AddMenteePanel';

const committeeTabOptions: Tab[] = [
  { id: 'exportacao', label: 'Exportar Dados', icon: <DownloadCloud size={18} /> },
  { id: 'equalizacao', label: 'Equalização por Colaborador', icon: <CheckCircle2 size={18} /> },
  { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> },
  { id: 'mentor', label: 'Mentorados', icon: <Users size={18} /> },
  { id: 'mentorar', label: 'Adicionar mentorado', icon: <UserPlus size={18} /> },
];


export default function Comite() {
  const [activeTab, setActiveTab] = useState<CommitteeTab>('exportacao');
  const contentPanelRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
      setActiveTab(tabId as CommitteeTab);
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
      <main className="pt-24">
        <section className="mb-10 pl-12 text-left">
            <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
                Acompanhamento da equalização <span></span>
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
                Veja as principais estatísticas do ciclo atual
            </p>
        </section>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <CommitteeStatsGrid /> 
          <Tabs
            tabs={committeeTabOptions}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            className="mb-4"
          />

          {/* Conteúdo das Abas */}
          <div ref={contentPanelRef} className="mt-[-1px]">
            {activeTab === 'exportacao' && <CommitteeExportPanel />}
            {activeTab === 'equalizacao' && <CommitteeEvaluationsPanel/>}
            {activeTab === 'insights' && <CommitteeInsightsPanel />}
            {activeTab === 'mentor' && <MentorBrutalFactsPanel />}
            {activeTab === 'mentorar' && <AddMenteePanel />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
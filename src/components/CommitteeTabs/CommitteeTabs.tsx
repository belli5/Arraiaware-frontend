import { DownloadCloud, BarChart2, CheckCircle2 } from 'lucide-react';

export type CommitteeTab = 'equalizacao' | 'insights' | 'exportacao';

interface CommitteeTabsProps {
  activeTab: CommitteeTab;
  setActiveTab: (tab: CommitteeTab) => void;
  className?: string;
}

const CommitteeTabs: React.FC<CommitteeTabsProps> = ({ activeTab, setActiveTab, className }) => {
  const tabs: { id: CommitteeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'equalizacao', label: 'Equalização por Colaborador', icon: <CheckCircle2 size={18} /> },
    { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> },
    { id: 'exportacao', label: 'Exportar Dados', icon: <DownloadCloud size={18} /> },
  ];

  return (
    <nav className={`flex border-b border-gray-200 mt-8 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-3 px-6 text-sm font-medium flex items-center gap-2 ${activeTab === tab.id ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} transition-colors duration-200`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default CommitteeTabs;
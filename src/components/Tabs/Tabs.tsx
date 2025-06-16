export type Tab = 'status' | 'criterios' | 'historico';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  className?: string;
}

const tabOptions = [
  { id: 'status', label: 'Status das Avaliações' },
  { id: 'criterios', label: 'Critérios por Trilha' },
  { id: 'historico', label: 'Importar Históricos' },
];

export default function Tabs({ activeTab, setActiveTab, className='' }: TabsProps) {
  return (
    <nav className={`flex space-x-4 ${className}`}>
      {tabOptions.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as Tab)}
          className={`
            px-5 py-2.5 flex-1 text-base rounded-t-lg text-sent font-medium transition-colors
            ${activeTab === tab.id
              ? 'bg-white text-orange-500 shadow-sm' 
              : 'bg-gray-100 text-gray-500 hover:text-gray-700' 
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
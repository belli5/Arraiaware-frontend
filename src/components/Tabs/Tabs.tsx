import type { Tab } from '../../types/tabs';

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
  className?: string;
}

export default function Tabs({ 
  tabs, 
  activeTab, 
  onTabClick, 
  className = '' 
}: TabsProps) {
  return (
    <nav className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`
            py-3 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 border-b-2
            ${activeTab === tab.id 
              ? 'border-orange-500 text-orange-600' // Estilo da aba ATIVA
              : 'text-gray-500 hover:text-gray-700 border-b-transparent hover:border-gray-300' // Estilo da aba INATIVA
            }
          `}
        >
          {tab.icon && tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
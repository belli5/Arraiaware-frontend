// src/components/PeerEvaluationPanel/PeerEvaluationPanel.tsx
import { FaUsers, FaUserCheck} from 'react-icons/fa';
import { Search } from 'lucide-react';
import type { Colleague } from '../../types/evaluation';
import ColleagueCard from '../ColleagueCard/ColleagueCard';
import InfoBox from '../InfoBox/InfoBox';

interface PeerEvaluationPanelProps {
  colleagues: Colleague[];
  onEvaluate: (id: string) => void;
  sectionKey: 'peer' | 'leader';
   searchName: string;
   onSearchChange: (value: string) => void;
}

export default function PeerEvaluationPanel({
  colleagues,
  onEvaluate,
  sectionKey,
  searchName,
   onSearchChange,
}: PeerEvaluationPanelProps) {
  const isLeader = sectionKey === 'leader';

  const title = isLeader
    ? 'Avaliação dos meus liderados'
    : 'Avaliação de Pares';

  const text = isLeader
    ? 'Avalie seus liderados com os quais você teve interação durante o ciclo'
    : 'Avalie colegas que trabalharam com você por mais de 1 mês';

  const icon = isLeader
    ? <FaUserCheck />
    : <FaUsers />;

  return (
    <>
      {/* Banner azul */}
      <InfoBox icon={icon} title={title} text={text} />

      {/* Campo de busca logo abaixo do banner */}
      <div className="relative mb-4 mt-4">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <Search className="h-5 w-5 text-gray-400" />
       </div>
       <input
         type="search"
         placeholder="Buscar colaborador..."
         value={searchName}
         onChange={e => onSearchChange(e.target.value)}
         className="
          block w-full bg-white
           border border-gray-300 rounded-lg
           pl-10 pr-3 py-2
           placeholder-gray-500
           focus:outline-none focus:ring-1 focus:ring-orange-500
         "
       />
     </div>

      {/* Lista de colegas */}
      <div className="space-y-4 mt-6">
        {colleagues.map(col => (
          <ColleagueCard
            key={col.id}
            colleague={col}
            onEvaluate={onEvaluate}
          />
        ))}
      </div>
    </>
  );
}

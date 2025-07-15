// src/components/PeerEvaluationPanel/PeerEvaluationPanel.tsx
import { FaUsers, FaUserCheck } from 'react-icons/fa';
import type { Colleague } from '../../../types/evaluation';
import ColleagueCard from '../../../components/ColleagueCard/ColleagueCard';
import InfoBox from '../../../components/InfoBox/InfoBox';

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
      <div className="mb-4 mt-4 px-4">
        <input
          type="text"
          placeholder="Buscar colaborador..."
          value={searchName}
          onChange={e => onSearchChange(e.target.value)}
          className="
            w-full sm:w-1/2
            px-4 py-2
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-orange-500
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

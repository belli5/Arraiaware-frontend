import { FaUsers, FaUserCheck } from 'react-icons/fa';
import type { Colleague } from '../../types/evaluation';
import ColleagueCard from '../ColleagueCard/ColleagueCard';
import InfoBox from '../InfoBox/InfoBox';

interface PeerEvaluationPanelProps {
  colleagues: Colleague[];
  onEvaluate: (id: string) => void;
  sectionKey: 'peer' | 'leader';
}

export default function PeerEvaluationPanel({
  colleagues,
  onEvaluate,
  sectionKey,
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
      <InfoBox icon={icon} title={title} text={text} />
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

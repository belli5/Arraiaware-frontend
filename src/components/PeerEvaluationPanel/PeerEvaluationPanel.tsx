import { FaUsers, FaCrown } from 'react-icons/fa';
import type { Colleague } from '../../types/evaluation';
import ColleagueCard from '../ColleagueCard/ColleagueCard';
import InfoBox from '../InfoBox/InfoBox';

interface PeerEvaluationPanelProps {
  colleagues: Colleague[];
  onEvaluate: (id: string) => void;
  sectionKey: 'peer' | 'leader'; // Indica se é avaliação de pares ou líderes
}

export default function PeerEvaluationPanel({
  colleagues,
  onEvaluate,
  sectionKey,
}: PeerEvaluationPanelProps) {
  // Ajuste dinâmico do título, ícone e texto com base na seção
  const isPeer = sectionKey === 'peer';
  const title = isPeer ? 'Avaliação de Pares' : 'Avaliação de Líderes';
  const text = isPeer
    ? 'Avalie colegas que trabalharam com você por mais de 1 mês'
    : 'Avalie líderes com os quais você teve interação durante o ciclo';
  const icon = isPeer ? <FaUsers /> : <FaCrown />;

  return (
    <>
      {/* Caixa azul de informação */}
      <InfoBox icon={icon} title={title} text={text} />

      {/* Lista de colegas ou líderes */}
      <div className="space-y-4 mt-6">
        {colleagues.map(colega => (
          <ColleagueCard
            key={colega.id}
            colleague={colega}
            onEvaluate={onEvaluate}
          />
        ))}
      </div>
    </>
  );
}

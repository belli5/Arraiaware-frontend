import { FaUsers } from 'react-icons/fa';
import type { Colleague } from '../../types/evaluation';
import ColleagueCard from '../ColleagueCard/ColleagueCard';
import InfoBox from '../InfoBox/InfoBox';


interface PeerEvaluationPanelProps {
  colleagues: Colleague[];
  onEvaluate: (id: string) => void;
}

export default function PeerEvaluationPanel({colleagues, onEvaluate }: PeerEvaluationPanelProps) {
  return (
    <>
      {/* Caixa azul de informação */}
      <InfoBox 
        icon={<FaUsers />} 
        title="Avaliação de Pares" 
        text="Avalie Colegas que trabalharam com você por mais de 1 mês"
      />

      {/* Lista de Colegas */}
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
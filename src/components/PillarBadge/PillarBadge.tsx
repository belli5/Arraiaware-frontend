import type { CriterionType } from '../../types/RH'; 

interface PillarBadgeProps {
  pillar: CriterionType;
}

export default function PillarBadge({ pillar }: PillarBadgeProps) {
  const pillarStyles = {
    'Comportamento': 'bg-green-100 text-green-800',
    'Execução': 'bg-blue-100 text-blue-800',
    'Gestão e Liderança': 'bg-purple-100 text-purple-800',
  };

  const style = pillarStyles[pillar] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${style}`}>
      {pillar}
    </span>
  );
}
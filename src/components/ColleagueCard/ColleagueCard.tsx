import React from 'react';
import type { Colleague } from '../../types/evaluation';

interface ColleagueCardProps {
  colleague: Colleague;
  onEvaluate: (id: string) => void; // A prop é uma função que recebe um id e não retorna nada
}

const ColleagueCard: React.FC<ColleagueCardProps> = ({ colleague, onEvaluate }) => {
  return (
    <div
      className="flex justify-between items-center rounded-xl p-4 border border-gray-200
                 hover:shadow-lg hover:-translate-y-1 transition transform"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-semibold">
          {colleague.nome.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{colleague.nome}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{colleague.cargo}</span>
            <span className="text-gray-400">•</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {colleague.area}
            </span>
            <span className="text-gray-400">•</span>
            <span>Trabalhando juntos há {colleague.tempo}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onEvaluate(colleague.id)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
      >
        Avaliar →
      </button>
    </div>
  );
};

export default ColleagueCard;
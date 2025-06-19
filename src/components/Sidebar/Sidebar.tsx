import React from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import type { Section } from '../../types/evaluation';

interface SidebarProps {
  sections: Section[];
}

const Sidebar: React.FC<SidebarProps> = ({ sections }) => {
  return (
    <aside className="w-1/3 space-y-6">
      {/* Painel de Dicas */}
      <div className="bg-white rounded-xl shadow p-4 text-left">
        <div className="flex items-center gap-2 mb-5 text-lg font-semibold">
          <FaRegLightbulb className="text-orange-500" /> Dicas
        </div>
        <ul className="list-disc list-outside pl-7 space-y-2">
          <li>Seja honesto e específico em suas respostas</li>
          <li>Use exemplos concretos quando possível</li>
          <li>Considere feedback recebido anteriormente</li>
          <li>Pense em seu crescimento ao longo do período</li>
        </ul>
      </div>

      {/* Painel de Progresso */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Progresso por Seção</h3>
        <div className="space-y-4">
          {sections.map(s => (
            <div key={s.key}>
              <div className="flex justify-between mb-1 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">{s.icon}</span>
                  <span>{s.title}</span>
                </div>
                <span>{s.done}/{s.total}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${s.total === 0 ? 0 : (s.done / s.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
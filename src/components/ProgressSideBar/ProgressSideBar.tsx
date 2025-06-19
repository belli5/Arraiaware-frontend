import { FaRegLightbulb } from 'react-icons/fa';
import type { Section } from '../../types/evaluation';

interface ProgressSidebarProps {
  sections: Section[];
  answers: Record<string, string>;
}

export default function ProgressSidebar({ sections, answers }: ProgressSidebarProps) {
  return (
    <aside className="w-1/3 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5 text-left">
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
          <FaRegLightbulb className="text-orange-500" /> Dicas para Avaliação
        </div>
        <ul className="list-disc list-outside pl-5 space-y-2 text-gray-600 text-sm">
          <li>Seja honesto e específico em suas respostas</li>
          <li>Use exemplos concretos quando possível</li>
          <li>Considere feedback recebido anteriormente</li>
          <li>Pense em seu crescimento ao longo do período</li>
        </ul>
      </div>

      {/* Card de Progresso */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso por Seção</h3>
        <div className="space-y-4">
          {sections.map((s) => {
            const done = s.questions.filter((q) => answers[q.id]).length;
            const total = s.questions.length;
            const progress = total === 0 ? 0 : (done / total) * 100;
            const isSpecialSection = total === 0;

            return (
              <div key={s.key}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">{s.icon}</span>
                    <span>{s.title}</span>
                  </div>
                  <span className="text-gray-500">
                    {/* Exibe N/A para seções sem perguntas */}
                    {isSpecialSection ? 'N/A' : `${done}/${total}`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
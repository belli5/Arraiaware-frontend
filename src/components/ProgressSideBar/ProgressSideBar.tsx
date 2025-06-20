import { FaRegLightbulb } from 'react-icons/fa';
import type { Answer, Section, Colleague } from '../../types/evaluation';

interface ProgressSidebarProps {
  sections: Section[];
  answers: Record<string, Answer>;
  peerAnswers: Record<string, Record<string, Answer>>;
  leaderAnswers: Record<string, Record<string, Answer>>;
  colleagues: Colleague[];
}

export default function ProgressSidebar({
  sections,
  answers,
  peerAnswers,
  leaderAnswers,
  colleagues,
}: ProgressSidebarProps) {
  const peerSection = sections.find(s => s.key === 'peer');
  const leaderSection = sections.find(s => s.key === 'leader');
  const totalPeers = colleagues.length;

  const completedPeers = colleagues.filter(col => {
    const ans = peerAnswers[col.id] || {};
    const doneCount = peerSection?.questions.filter(q =>
      ans[q.id]?.scale && ans[q.id]?.justification?.trim()
    ).length || 0;
    return doneCount === (peerSection?.questions.length || 0);
  }).length;

  const completedLeaders = colleagues.filter(col => {
    const ans = leaderAnswers[col.id] || {};
    const doneCount = leaderSection?.questions.filter(q =>
      ans[q.id]?.scale && ans[q.id]?.justification?.trim()
    ).length || 0;
    return doneCount === (leaderSection?.questions.length || 0);
  }).length;

  return (
    <aside className="w-1/3 space-y-6">
      {/* Dicas */}
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

      {/* Progresso por Seção */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Progresso por Seção
        </h3>
        <div className="space-y-4">
          {sections.map(s => {
            if (s.key === 'peer') {
              const pct = totalPeers === 0 ? 0 : (completedPeers / totalPeers) * 100;
              return (
                <div key={s.key}>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-orange-500">{s.icon}</span>
                      <span>{s.title}</span>
                    </div>
                    <span className="text-gray-500">
                      {completedPeers}/{totalPeers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            }

            if (s.key === 'leader') {
              const pct = totalPeers === 0 ? 0 : (completedLeaders / totalPeers) * 100;
              return (
                <div key={s.key}>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-orange-500">{s.icon}</span>
                      <span>{s.title}</span>
                    </div>
                    <span className="text-gray-500">
                      {completedLeaders}/{totalPeers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            }

            const done = s.questions.filter(q => {
              const ans = answers[q.id];
              return ans && ans.scale && ans.justification?.trim();
            }).length;
            const total = s.questions.length;
            const pct = total === 0 ? 0 : (done / total) * 100;
            const display = total === 0 ? 'N/A' : `${done}/${total}`;

            return (
              <div key={s.key}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">{s.icon}</span>
                    <span>{s.title}</span>
                  </div>
                  <span className="text-gray-500">{display}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
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
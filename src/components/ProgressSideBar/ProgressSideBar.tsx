import { FaRegLightbulb } from 'react-icons/fa';
import type { Answer, Section, Colleague, Question } from '../../types/evaluation';

interface ProgressSidebarProps {
  sections: Section[];
  answers: Record<string, Answer>;
  peerAnswers: Record<string, Record<string, Answer>>;
  leaderAnswers: Record<string, Record<string, Answer>>;
  colleagues: Colleague[];
  leaders: Colleague[];
  isReferenceSectionComplete: boolean; 
}

export default function ProgressSidebar({
  sections,
  answers,
  peerAnswers,
  leaderAnswers,
  colleagues,
  leaders,
  isReferenceSectionComplete
}: ProgressSidebarProps) {

  const isPersonEvaluationComplete = (
    personId: string,
    questions: Question[],
    answersMap: Record<string, Record<string, Answer>>,
    sectionKey: string
  ) => {
    const personAnswers = answersMap[personId] || {};

    if (sectionKey === 'peer') {
      // pq1 e pq2: só precisa de scale
      return questions.every(q => {
        const ans = personAnswers[q.id];
        if (q.id === 'pq1' || q.id === 'pq2') {
          return !!ans?.scale;
        }
        // pq3 e pq4: precisa de justificativa
        return !!ans?.justification?.trim();
      });
    }

    // líder e self continuam exigindo escala + justificativa
    return questions.every(q => {
      const ans = personAnswers[q.id];
      return !!ans?.scale && !!ans?.justification?.trim();
    });
  };

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
            let done = 0;
            let total = 0;
            if (s.key === 'peer') {
              total = colleagues.length;
              done = colleagues.filter(p =>
                isPersonEvaluationComplete(p.id, s.questions, peerAnswers, s.key)
              ).length;
            } 
            else if (s.key === 'reference') {
              total = 1;
              done = isReferenceSectionComplete ? 1 : 0;
            }
            else if (s.key === 'leader') {
              total = leaders.length;
              done = leaders.filter(l =>
                isPersonEvaluationComplete(l.id, s.questions, leaderAnswers, s.key)
              ).length;
            } else {
              total = s.questions.length;
              done = s.questions.filter(q => {
                const ans = answers[q.id];
                return ans && ans.scale && ans.justification?.trim() !== '';
              }).length;
            }
            
            const progress = total > 0 ? (done / total) * 100 : 0;
            const display = total > 0 ? `${done}/${total}` : 'N/A';

            return (
              <div key={s.key}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">{s.icon}</span>
                    <span>{s.title}</span>
                  </div>
                  <span className="text-gray-500">{display}</span>
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
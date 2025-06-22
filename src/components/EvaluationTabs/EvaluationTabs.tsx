import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import type { Section , Answer, Colleague} from '../../types/evaluation';

interface EvaluationTabsProps {
  sections: Section[];
  currentSectionIndex: number;
  answers: Record<string, Answer>;
  peerAnswers: Record<string, Record<string, Answer>>;
  leaderAnswers: Record<string, Record<string, Answer>>;
  peerColleagues: Colleague[];
  leaderColleagues: Colleague[];
}

export default function EvaluationTabs({ 
  sections, 
  answers, 
  currentSectionIndex,
  peerAnswers,
  leaderAnswers,
  peerColleagues,
  leaderColleagues,
 }: EvaluationTabsProps) {
  const navigate = useNavigate();

  return (
    <nav className="flex gap-2 mb-6 flex-wrap">
      {sections.map((s, idx) => {
        let doneCount = 0;
        let totalCount = 0;
        if (s.key === 'peer') {
          totalCount = peerColleagues.length;
          // Conta quantos colegas foram totalmente avaliados
          doneCount = peerColleagues.filter(colleague => {
            const colleagueAnswers = peerAnswers[colleague.id] || {};
            const answeredQuestions = s.questions.filter(q => 
              colleagueAnswers[q.id]?.scale && colleagueAnswers[q.id]?.justification?.trim() !== ''
            ).length;
            return answeredQuestions === s.questions.length;
          }).length;

        } else if (s.key === 'leader') {
          totalCount = leaderColleagues.length;
          // Conta quantos líderes foram totalmente avaliados
          doneCount = leaderColleagues.filter(leader => {
            const leaderAnswersData = leaderAnswers[leader.id] || {};
            const answeredQuestions = s.questions.filter(q => 
              leaderAnswersData[q.id]?.scale && leaderAnswersData[q.id]?.justification?.trim() !== ''
            ).length;
            return answeredQuestions === s.questions.length;
          }).length;
          
        } else {
          totalCount = s.questions.length;
          doneCount = s.questions.filter((q) => {
            const answer = answers[q.id];
            return answer && answer.scale && answer.justification?.trim() !== '';
          }).length;
        }

        const completed = totalCount > 0 && doneCount === totalCount;
        const isActive = idx === currentSectionIndex;

        const base = 'flex items-center gap-2 px-5 py-2.5 rounded-lg border text-base font-medium transition-colors';
        const activeCls = 'bg-orange-500 text-white border-orange-500 shadow-sm';
        const doneCls = 'bg-green-100 text-green-800 border-green-200';
        const defaultCls = 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50';

        return (
          <button
            key={s.key}
            onClick={() => navigate(`/avaliacao/${s.key}`)}
            className={`${base} ${isActive ? activeCls : completed ? doneCls : defaultCls}`}
          >
            {completed && !isActive ? <FaCheckCircle /> : s.icon}
            <span className="whitespace-nowrap">{s.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
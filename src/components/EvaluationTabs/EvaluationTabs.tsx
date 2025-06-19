import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import type { Section , Answer} from '../../types/evaluation';

interface EvaluationTabsProps {
  sections: Section[];
  answers: Record<string, Answer>;
  currentSectionIndex: number;
}

export default function EvaluationTabs({ sections, answers, currentSectionIndex }: EvaluationTabsProps) {
  const navigate = useNavigate();

  return (
    <nav className="flex gap-2 mb-6 flex-wrap">
      {sections.map((s, idx) => {
        const hasQuestions = s.questions.length > 0;
        const doneCount = hasQuestions
          ? s.questions.filter((q) => {
              const answer = answers[q.id];
              return answer && answer.scale && answer.justification?.trim() !== '';
            }).length
          : 0;
        const completed = hasQuestions ? doneCount === s.questions.length : false;
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
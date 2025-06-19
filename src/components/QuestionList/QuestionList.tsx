import type { Question } from '../../types/evaluation';

interface QuestionListProps {
  questions: Question[];
  answers: Record<string, string>;
  onScaleChange: (questionId: string, value: number) => void;
  onTextChange: (questionId: string, value: string) => void;
}

const isLastQuestion = (idx: number, arr: Question[]) => idx === arr.length - 1;

export default function QuestionList({ questions, answers, onScaleChange, onTextChange }: QuestionListProps) {
  return (
    <>
      {questions.map((q, idx, arr) => (
        <div
          key={q.id}
          className={`text-left ${!isLastQuestion(idx, arr) ? 'pb-6 mb-6 border-b border-gray-200' : ''}`}
        >
          <label className="block font-medium mb-3">{q.text}</label>

          {q.type === 'scale' ? (
            <div>
              <div className="grid grid-cols-5 justify-items-center gap-4">
                {[...Array(5)].map((_, i) => {
                  const val = i + 1;
                  const checked = answers[q.id] === val.toString();
                  return (
                    <label key={val} className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={q.id}
                        value={val}
                        checked={checked}
                        onChange={() => onScaleChange(q.id, val)}
                        className={`appearance-none w-6 h-6 rounded-full border-2 border-orange-500 relative cursor-pointer before:content-[''] before:absolute before:rounded-full before:bg-orange-500 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 transition-all duration-200 ${checked ? 'before:w-3 before:h-3' : 'before:w-0 before:h-0'}`}
                      />
                    </label>
                  );
                })}
              </div>
              <div className="grid grid-cols-5 justify-items-center gap-4 mt-1 text-xs text-gray-900">
                {[...Array(5)].map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Muito baixo</span>
                <span>Excelente</span>
              </div>
            </div>
          ) : (
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-orange-300 focus:border-orange-300"
              placeholder="Digite sua resposta aqui..."
              value={answers[q.id] || ''}
              onChange={(e) => onTextChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </>
  );
}
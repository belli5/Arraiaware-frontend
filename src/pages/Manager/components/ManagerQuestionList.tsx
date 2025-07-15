// src/components/ManagerQuestionList/ManagerQuestionList.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Question, Answer } from '../../../types/evaluation';

interface Props {
  questions: Question[];
  answers: Record<string, Answer>;
  onAnswerChange: (qid: string, field: 'scale' | 'justification', val: string) => void;
}

export default function ManagerQuestionList({ questions, answers, onAnswerChange }: Props) {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const handleToggleQuestion = (qid: string) =>
    setOpenQuestionId(prev => (prev === qid ? null : qid));

  return (
    <div className="space-y-4">
      {questions.map(q => {
        const isOpen = openQuestionId === q.id;
        const ans = answers[q.id] || {};

        return (
          <div
            key={q.id}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => handleToggleQuestion(q.id)}
              className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
            >
              <span className="font-medium text-gray-800">{q.text}</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="p-4 border-t border-gray-200 bg-white space-y-4">
                {/* Escala 1–5 */}
                <div>
                  <div className="grid grid-cols-5 justify-items-center gap-4">
                    {[1, 2, 3, 4, 5].map(v => {
                      const checked = ans.scale === String(v);
                      return (
                        <label key={v} className="flex flex-col items-center">
                          <input
                            type="radio"
                            name={q.id}
                            value={v}
                            checked={checked}
                            onChange={() =>
                              onAnswerChange(q.id, 'scale', String(v))
                            }
                            className={`
                              appearance-none w-6 h-6 rounded-full border-2 border-orange-500
                              relative cursor-pointer
                              before:content-[''] before:absolute before:rounded-full
                              before:left-1/2 before:top-1/2 before:-translate-x-1/2
                              before:-translate-y-1/2 transition-all duration-200
                              ${checked ? 'before:w-3 before:h-3 before:bg-orange-500' : 'before:w-0 before:h-0'}
                            `}
                          />
                        </label>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-5 justify-items-center gap-4 mt-1 text-xs text-gray-900">
                    {[1, 2, 3, 4, 5].map(v => (
                      <div key={v}>{v}</div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Discordo totalmente</span>
                    <span>Concordo totalmente</span>
                  </div>
                </div>

                {/* Justificativa */}
                <div className="pt-4 border-t border-gray-200">
                  <label
                    htmlFor={`just-${q.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Justificativa (opcional)
                  </label>
                  <textarea
                    id={`just-${q.id}`}
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
                    placeholder="Escreva aqui sua justificativa…"
                    value={ans.justification || ''}
                    onChange={e =>
                      onAnswerChange(q.id, 'justification', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

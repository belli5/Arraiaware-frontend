import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Question, Answer } from '../../types/evaluation'

interface PeerQuestionListProps {
  questions: Question[]
  answers: Record<string, Answer>
  onAnswerChange: (
    questionId: string,
    field: 'scale' | 'justification',
    value: string
  ) => void
}

export default function PeerQuestionList({
  questions,
  answers,
  onAnswerChange,
}: PeerQuestionListProps) {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null)
  const handleToggle = (id: string) =>
    setOpenQuestionId(prev => (prev === id ? null : id))

  return (
    <div className="space-y-4">
      {questions.map(q => {
        const isOpen = openQuestionId === q.id
        const current = answers[q.id] || {}

        return (
          <div
            key={q.id}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => handleToggle(q.id)}
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
                {/* pq1: 4 opções de rádio customizadas */}
                {q.id === 'pq1' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 justify-items-center gap-6">
                      {[
                        'Discordo totalmente',
                        'Discordo parcialmente',
                        'Concordo parcialmente',
                        'Concordo totalmente',
                      ].map((label, i) => {
                        const val = (i + 1).toString()
                        const checked = current.scale === val
                        return (
                          <label
                            key={val}
                            className="flex flex-col items-center text-sm text-gray-800"
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={val}
                              checked={checked}
                              onChange={() =>
                                onAnswerChange(q.id, 'scale', val)
                              }
                              className={`appearance-none w-6 h-6 rounded-full border-2 border-orange-500 relative cursor-pointer before:content-[''] before:absolute before:rounded-full before:bg-orange-500 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 transition-all duration-200 ${
                                checked
                                  ? 'before:w-3 before:h-3'
                                  : 'before:w-0 before:h-0'
                              }`}
                            />
                            <span className="mt-1 text-xs text-center">
                              {label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* pq2: input numérico float entre 1.0 e 5.0 */}
                {q.id === 'pq2' && (
                  <div>
                    <label
                      htmlFor={`score-${q.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nota (1.0–5.0)
                    </label>
                    <input
                      id={`score-${q.id}`}
                      type="number"
                      min={1}
                      max={5}
                      step={0.1}
                      value={current.scale ?? ''}
                      onChange={e =>
                        onAnswerChange(q.id, 'scale', e.target.value)
                      }
                      className="w-24 border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
                      placeholder="ex: 3.5"
                    />
                  </div>
                )}

                {/* pq3 e pq4: só justificativa */}
                {q.id !== 'pq1' && q.id !== 'pq2' && (
                <div className="pt-4 border-t border-gray-200/60">
                    <label
                    htmlFor={`justification-${q.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                    >
                    Justificativa (obrigatório)
                    </label>
                    <textarea
                    id={`justification-${q.id}`}
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-orange-300 focus:border-orange-300"
                    placeholder="Justifique sua resposta..."
                    value={current.justification || ''}
                    onChange={e =>
                        onAnswerChange(q.id, 'justification', e.target.value)
                    }
                    />
                </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

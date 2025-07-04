// src/components/ManagerEvaluation/ManagerEvaluation.tsx
import { useState, useEffect } from 'react'
import PeerEvaluationPanel from '../PeerEvaluationPanel/PeerEvaluationPanel'
import ManagerQuestionList from '../ManagerQuestionList/ManagerQuestionList'
import type { Colleague, Answer, Question } from '../../types/evaluation'
import { useNavigate } from 'react-router-dom'

interface ManagerEvaluationProps {
  managerId: string
  cycleId:   string
  questions: Question[]       
}

export default function ManagerEvaluation({
  managerId, cycleId, questions
}: ManagerEvaluationProps) {
  const navigate = useNavigate()
  const [team, setTeam] = useState<Colleague[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, Record<string, Answer>>>({})
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null)

  // busca seus liderados
  useEffect(() => {
    fetch(`http://localhost:3000/api/teams/manager/${managerId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...localStorage.token && { Authorization: `Bearer ${localStorage.token}` }
      },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((projects: Array<{
        projectName: string;
        collaborators: Array<{id:string,name:string,email?:string}>;
        }>) => {
        // para cada projeto, extraio os colaboradores e monto um array único
        const flattened = projects
        .map(proj =>
            proj.collaborators.map(col => ({
            id:          col.id,
            nome:        col.name,
            cargo:       'Colaborador',
            projectName: proj.projectName,
            area:        proj.projectName,
            tempo:       '—',
            }))
        )
        .flat();  // <- isto achata o Array<Array<…>> para Array<…>
        setTeam(flattened);
        })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [managerId])

  const handleAnswerChange = (
    userId: string,
    questionId: string,
    field: 'scale'|'justification',
    value: string
  ) => {
    setAnswers(a => ({
      ...a,
      [userId]: {
        ...a[userId],
        [questionId]: {
          ...a[userId]?.[questionId],
          [field]: value
        }
      }
    }))
  }

  const handleSubmit = async () => {
    if (!evaluatingId) return
    const items = Object.entries(answers[evaluatingId]||{}).map(
      ([criterionId, ans]) => ({
        criterionId,
        score: Number(ans.scale),
        justification: ans.justification
      })
    )
    const payload = {
      leaderId:       managerId,
      collaboratorId: evaluatingId,
      cycleId,
      evaluations:    items
    }
    const res = await fetch('/api/evaluations/leader', {
      method:  'POST',
      headers: {
        'Content-Type':'application/json',
        ...localStorage.token && { Authorization: `Bearer ${localStorage.token}` }
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await res.text())
    alert('Avaliação enviada!')
    setEvaluatingId(null)
    navigate('/manager/evaluation')
  }

  if (loading) return <div>Carregando sua equipe…</div>
  if (error)   return <div className="text-red-600">Erro: {error}</div>

  return (
    <div className="space-y-6">
      {evaluatingId ? (
        <>
          <div className="flex justify-end mb-4">
                <button
                onClick={() => setEvaluatingId(null)}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 inline-flex items-center gap-1"
                >
                ← Voltar à lista
                </button>
            </div>
          <h2 className="text-xl font-bold">
            Avaliando: {team.find(u => u.id === evaluatingId)!.nome}
          </h2>
          <ManagerQuestionList
            questions={questions}
            answers={answers[evaluatingId]||{}}
            onAnswerChange={(qid, f, v) =>
              handleAnswerChange(evaluatingId, qid, f, v)
            }
          />
          <div className="mt-4 text-right">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Enviar
            </button>
          </div>
        </>
      ) : (
        <PeerEvaluationPanel
          colleagues={team.map(u => ({
            ...u,
            // usa questions.length e questions para progresso
            progresso:
              questions.filter(q => !!answers[u.id]?.[q.id]?.scale).length /
              questions.length *
              100
          }))}
          onEvaluate={setEvaluatingId}
          sectionKey="leader"  // ou "manager"
        />
      )}
    </div>
  )
}

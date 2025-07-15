import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import Progress from './Progress'
import Spinner from './Spinner'

interface EvolutionEntry {
  cycleName: string
  averages: Record<string, number>
  finalEqualizationScore: number | null
}

export default function EvolutionOverview() {
  const { user, token } = useContext(AuthContext)!

  // ←––––– AQUI ––––––←
  // efeito só para depuração: veja o que está vindo no `user`
  useEffect(() => {
    console.log("AuthContext user:", user)
  }, [user])

  const [evolution, setEvolution] = useState<EvolutionEntry[] | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  // seu efeito de fetch:
  useEffect(() => {
    const userId = user?.id
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/api/dashboard/user-evolution/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json() as Promise<EvolutionEntry[]>
      })
      .then(data => setEvolution(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user?.id, token])

  if (loading) return <Spinner />
  if (error)   return <p className="text-red-600 text-center">Erro: {error}</p>
  if (!evolution || evolution.length === 0) {
    return <p className="text-gray-500 text-center">Nenhuma avaliação encontrada.</p>
  }

  const last = evolution[evolution.length - 1]

  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-4">
        Visão Geral ({last.cycleName})
      </h2>
      {Object.entries(last.averages).map(([pillar, score]) => (
        <Progress key={pillar} title={pillar} value={score} />
      ))}
      {last.finalEqualizationScore != null && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Score Final: {last.finalEqualizationScore}
        </div>
      )}
    </div>
  )
}
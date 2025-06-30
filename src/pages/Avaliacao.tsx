import { useState, useEffect, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaStar,
  FaUsers,
  FaChartLine,
  FaCrown,
} from 'react-icons/fa';
import { ArrowLeft, Check } from 'lucide-react';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import EvaluationTabs from '../components/EvaluationTabs/EvaluationTabs';
import QuestionList from '../components/QuestionList/QuestionList';
import PeerEvaluationPanel from '../components/PeerEvaluationPanel/PeerEvaluationPanel';
import ProgressSidebar from '../components/ProgressSideBar/ProgressSideBar';
import type { Section, Colleague, Answer, Question } from '../types/evaluation';
type Cycle = { id: string; name: string; status: string };


const peerQuestions: Question[] = [
  { id: 'pq1', type: 'scale', text: 'Você ficaria motivado em trabalhar novamente com este colaborador?' },
  { id: 'pq2', type: 'scale', text: 'Dê uma nota geral para o colaborador' },
  { id: 'pq3', type: 'scale', text: 'Pontos que deve melhorar' },
  { id: 'pq4', type: 'scale', text: 'Pontos que faz bem e deve explorar' },
];

const leaderQuestions: Question[] = [
  { id: 'lq1', type: 'scale', text: 'Visão estratégica e direção clara' },
  { id: 'lq2', type: 'scale', text: 'Capacidade de inspirar e motivar' },
  { id: 'lq3', type: 'scale', text: 'Apoio no desenvolvimento da equipe' },
  { id: 'lq4', type: 'scale', text: 'Feedback construtivo e transparente' },
];

const predefinedSections: Record<string, { key: string; title: string; icon: JSX.Element }> = {
  comportamento: {
    key: 'comportamento',
    title: 'Comportamento',
    icon: <FaStar />,
  },
  execução: {
    key: 'execução',
    title: 'Execução',
    icon: <FaUsers />,
  },
  'gestão e liderança': {
    key: 'gestão-e-liderança',
    title: 'Gestão e Liderança',
    icon: <FaChartLine />,
  },
};

const peerColleagues: Colleague[] = [
  { id: '1', nome: 'João Santos', cargo: 'Desenvolvedor Pleno', area: 'Tecnologia', tempo: '3 meses' },
  { id: '2', nome: 'Ana Rodrigues', cargo: 'Analista de Sistemas', area: 'Tecnologia', tempo: '6 meses' },
  { id: '3', nome: 'Pedro Oliveira', cargo: 'UX Designer', area: 'Design', tempo: '2 meses' },
  { id: '4', nome: 'Carla Lima', cargo: 'Product Manager', area: 'Produto', tempo: '5 meses' },
];

const leaderColleagues: Colleague[] = [
  { id: '5', nome: 'Marcos Ferreira', cargo: 'Tech Lead', area: 'Tecnologia', tempo: '12 meses' },
  { id: '6', nome: 'Luciana Azevedo', cargo: 'Head de Produto', area: 'Produto', tempo: '18 meses' },
  { id: '7', nome: 'Roberto Cunha', cargo: 'Gerente de Design', area: 'Design', tempo: '15 meses' },
];



export default function Avaliacao() {
  const navigate = useNavigate();
  const { section } = useParams();

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cycleId, setCycleId] = useState<string>('');
  
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const raw = localStorage.getItem('token');
    if (!raw) return;

    try {
      const base64Payload = raw.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64Payload)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { sub } = JSON.parse(json);
      setUserId(sub);            
    } catch (e) {
      console.error('Não conseguiu decodificar token:', e);
    }
  }, []);

  useEffect(() => {
    async function fetchCycles() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3000/api/cycles', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const cycles: Cycle[] = await res.json();
        const open = cycles.find(c => c.status.toLowerCase() === 'aberto');
        if (open) setCycleId(open.id);
      } catch (err) {
        console.error('Erro ao buscar ciclos:', err);
      }
    }
    fetchCycles();
  }, []);

  useEffect(() => {
    async function fetchCriteria() {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Você não está autenticado.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/criteria', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar critérios.');
      }

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (!Array.isArray(data)) {
        throw new Error('A resposta da API não é um array');
      }

      const groupedByPillar: Record<string, Question[]> = {};

      data.forEach((c: any) => {
        const pillarKey = c.pillar?.toLowerCase().trim() || 'comportamento';

        if (!groupedByPillar[pillarKey]) {
          groupedByPillar[pillarKey] = [];
        }

        groupedByPillar[pillarKey].push({
          id: c.id,
          type: 'scale',
          text: c.criterionName,
        });
      });

      const mapped: Section[] = Object.entries(groupedByPillar).map(([pillarKey, questions]) => {
        const predefined = predefinedSections[pillarKey] || {
          key: pillarKey.replace(/\s/g, '-'),
          title: pillarKey.charAt(0).toUpperCase() + pillarKey.slice(1),
          icon: <FaUsers />,
        };

        return {
          ...predefined,
          questions,
        };
      });

      // Adiciona seções de pares e líderes no fim
      mapped.push(
        { key: 'peer', title: 'Avaliação de Pares', icon: <FaUsers />, questions: peerQuestions },
        { key: 'leader', title: 'Avaliação de Líderes', icon: <FaCrown />, questions: leaderQuestions }
      );

      setSections(mapped);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar os critérios.');
    } finally {
      setLoading(false);
    }
  }
  fetchCriteria(); 
  }, []);

  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [peerAnswers, setPeerAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [leaderAnswers, setLeaderAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [avaliandoId, setAvaliandoId] = useState<string | null>(null);

  const currentSectionIndex = sections.findIndex(s => s.key === section);
  const currentSectionData = currentSectionIndex >= 0 ? sections[currentSectionIndex] : null;

  if (!currentSectionData) {
    return (
      <div className="p-6 text-red-600">
        Seção inválida ou ainda não carregada.
      </div>
    );
  }

  

  async function handleSubmitSelfEvaluation() {
    if (!userId) {
      alert('Ainda não carregou seu usuário, aguarde um instante')
      return
    }
    const payload = {
      userId,
      cycleId,
      evaluations: Object.entries(answers).map(([criterionId, ans]) => ({
        criterionId,
        score: Number(ans.scale),
        justification: ans.justification,
        scoreDescription: '',
      })),
    };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/evaluations/self', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      alert('Autoavaliação enviada!');
    } catch (err: any) {
      console.error(err);
      alert('Falha ao enviar autoavaliação: ' + err.message);
    }
  }


  const handleAnswerChange = (
    questionId: string,
    field: 'scale' | 'justification',
    value: string
  ) => {
    if (currentSectionData.key === 'peer' && avaliandoId) {
      setPeerAnswers(prev => ({
        ...prev,
        [avaliandoId]: {
          ...prev[avaliandoId],
          [questionId]: {
            ...prev[avaliandoId]?.[questionId],
            [field]: value,
          },
        },
      }));
    } else if (currentSectionData.key === 'leader' && avaliandoId) {
      setLeaderAnswers(prev => ({
        ...prev,
        [avaliandoId]: {
          ...prev[avaliandoId],
          [questionId]: {
            ...prev[avaliandoId]?.[questionId],
            [field]: value,
          },
        },
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [field]: value,
        },
      }));
    }
  };

  const handleEvaluate = (id: string) => {
    setAvaliandoId(id);
    window.scrollTo(0, 0);
  };
  
  const isAnswerComplete = (answer?: Answer) => 
    !!answer && !!answer.scale && !!answer.justification && answer.justification.trim() !== '';

  const getSectionProgress = (answersMap: Record<string, Record<string, Answer>>, questions: Question[]) => (id: string) => {
    const personAnswers = answersMap[id] || {};
    const doneCount = questions.filter(q => isAnswerComplete(personAnswers[q.id])).length;
    if (questions.length === 0) return 0;
    return Math.round((doneCount / questions.length) * 100);
  };

  let totalProgressItems = 0;
  let completedProgressItems = 0;
  const is360Section = currentSectionData.key === 'peer' || currentSectionData.key === 'leader';

  if (is360Section) {
    const colleaguesList = currentSectionData.key === 'peer' ? peerColleagues : leaderColleagues;
    const answersSource = currentSectionData.key === 'peer' ? peerAnswers : leaderAnswers;

    if (avaliandoId) {
      //  UMA pessoa
      totalProgressItems = currentSectionData.questions.length;
      const personAnswers = answersSource[avaliandoId] || {};
      completedProgressItems = currentSectionData.questions.filter(q => isAnswerComplete(personAnswers[q.id])).length;
    } else {
      //LISTA de pessoas
      totalProgressItems = colleaguesList.length;
      completedProgressItems = colleaguesList.filter(person => {
        const personAnswers = answersSource[person.id] || {};
        const answeredCount = currentSectionData.questions.filter(q => isAnswerComplete(personAnswers[q.id])).length;
        return answeredCount === currentSectionData.questions.length;
      }).length;
    }
  } else {
    // AUTOAVALIAÇÃO
    totalProgressItems = currentSectionData.questions.length;
    completedProgressItems = currentSectionData.questions.filter(q => isAnswerComplete(answers[q.id])).length;
  }

  const overallProgressPercentage = totalProgressItems > 0 
    ? (completedProgressItems / totalProgressItems) * 100 
    : 0;

  const currentColleagues = currentSectionData.key === 'peer' ? peerColleagues : currentSectionData.key === 'leader' ? leaderColleagues : [];
  const colegaSelecionado = currentColleagues.find(c => c.id === avaliandoId);
  if (loading) return <div className="p-6">Carregando critérios...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (sections.length === 0) return <div className="p-6">Nenhum critério encontrado.</div>;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50"><Header /></div>
      <main className="flex-1 pt-32 px-6 lg:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {currentSectionData.key === 'peer'
                ? 'Avaliação de Pares Q4 2024'
                : currentSectionData.key === 'leader'
                ? 'Avaliação de Líderes Q4 2024'
                : `Autoavaliação Q4 2024`}
            </h1>
            <div className="relative bg-gray-200 h-2 rounded-full">
              <div
                className="absolute h-2 bg-orange-500 transition-all duration-500"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
          </header>

          <EvaluationTabs
            sections={sections}
            currentSectionIndex={currentSectionIndex}
            answers={answers}
            peerAnswers={peerAnswers}
            leaderAnswers={leaderAnswers}
            peerColleagues={peerColleagues}
            leaderColleagues={leaderColleagues}
          />

          <div className="flex gap-6">
            <section className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                  <span className="text-orange-500">{currentSectionData.icon}</span>
                  {currentSectionData.title}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Seção {currentSectionIndex + 1} de {sections.length}
                </p>

                {(currentSectionData.key === 'peer' || currentSectionData.key === 'leader') ? (
                  avaliandoId && colegaSelecionado ? (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold text-orange-800">
                          {colegaSelecionado.nome.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            Avaliando: {colegaSelecionado.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {colegaSelecionado.cargo} • {colegaSelecionado.area} • Trabalhando juntos há {colegaSelecionado.tempo}
                          </p>
                        </div>
                        <button
                          onClick={() => setAvaliandoId(null)}
                          className="flex items-center gap-1 text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          <ArrowLeft size={16} /> Voltar
                        </button>
                      </div>
                      <QuestionList
                        questions={currentSectionData.questions}
                        answers={currentSectionData.key === 'peer' ? peerAnswers[avaliandoId] || {} : leaderAnswers[avaliandoId] || {}}
                        onAnswerChange={handleAnswerChange}
                      />
                      {(() => {
                        const pct = getSectionProgress(
                          currentSectionData.key === 'peer' ? peerAnswers : leaderAnswers,
                          currentSectionData.questions
                        )(avaliandoId);
                        return (
                          <div className="mt-8 pt-4 border-t flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-40 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div style={{ width: `${pct}%` }} className="h-2 bg-orange-500" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{pct}% completo</span>
                            </div>
                            {pct === 100 && (
                              <span className="flex items-center gap-1 text-green-600 font-medium">
                                <Check size={18} /> Avaliação completa
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <PeerEvaluationPanel
                        colleagues={currentColleagues.map(col => ({
                            ...col,
                            progresso: getSectionProgress(
                                currentSectionData.key === 'peer' ? peerAnswers : leaderAnswers,
                                currentSectionData.questions
                            )(col.id),
                        }))}
                        onEvaluate={handleEvaluate}
                        sectionKey={currentSectionData.key}
                    />
                  )
                ) : (
                  // AUTOAVALIAÇÃO: QuestionList + botão de envio
                  <>
                    <QuestionList
                      questions={currentSectionData.questions}
                      answers={answers}
                      onAnswerChange={handleAnswerChange}
                    />
                    <div className="mt-8 pt-6 border-t flex justify-end">
                      <button
                        onClick={handleSubmitSelfEvaluation}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Enviar Autoavaliação
                      </button>
                    </div>
                  </>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const prev = Math.max(0, currentSectionIndex - 1);
                      if (prev !== currentSectionIndex) navigate(`/avaliacao/${sections[prev].key}`);
                    }}
                    disabled={currentSectionIndex === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                  >
                    ← Seção Anterior
                  </button>
                  <button
                    onClick={() => {
                      const next = currentSectionIndex < sections.length - 1 ? currentSectionIndex + 1 : currentSectionIndex;
                      if (next !== currentSectionIndex) navigate(`/avaliacao/${sections[next].key}`);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    {currentSectionIndex < sections.length - 1 ? 'Próxima Seção →' : 'Finalizar e Enviar'}
                  </button>
                </div>
              </div>
            </section>

            <ProgressSidebar
              sections={sections}
              answers={answers}
              peerAnswers={peerAnswers}
              leaderAnswers={leaderAnswers}
              colleagues={peerColleagues}
              leaders={leaderColleagues}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
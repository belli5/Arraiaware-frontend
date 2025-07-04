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
import PeerQuestionList from '../components/PeerQuestionList/PeerQuestionList';
import LeaderQuestionList from '../components/LeadQuestionList/LeadQuestionList';
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




interface ApiTeamInfo {
  projectId:   string;
  projectName: string;
  managerId:   string;
  managerName: string;
  cycleId:     string;
  collaborators: Array<{
    id:    string;
    name:  string;
    email: string;
  }>;
}



export default function Avaliacao() {
  const navigate = useNavigate();
  const { section } = useParams();
  const [teamMates, setTeamMates] = useState<Colleague[]>([]);
  const [loadingTeam, setLoadingTeam] = useState<boolean>(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [leaderColleagues, setLeaderColleagues] = useState<Colleague[]>([]);
  const [projectName, setProjectName] = useState<string>('—');
  const [projectId, setProjectId] = useState<string>('');

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

  // 1) Busca colegas de equipe dinâmicos assim que souber o userId
  useEffect(() => {
    if (!userId) return;
    setLoadingTeam(true);

    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/teams/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((info: ApiTeamInfo) => {
        // guarda tudo de uma vez
        setProjectId(info.projectId);
        setProjectName(info.projectName);
        setCycleId(info.cycleId);

        // transforma collaborators em Colleague[]
        setTeamMates(info.collaborators.map(c => ({
        id:          c.id,
        nome:        c.name,
        cargo:       'Colaborador',
        area:        info.projectName,        // opcional, se você quiser manter
        tempo:       '—',
        projectName: info.projectName,        // ← aqui!
      })));

        // mapeia o gestor
        setLeaderColleagues([{
        id:          info.managerId,
        nome:        info.managerName,
        cargo:       'Gestor',
        area:        info.projectName,        // opcional
        tempo:       '—',
        projectName: info.projectName,        // ← e aqui!
      }]);
      })
      .catch(err => setTeamError(String(err)))
      .finally(() => setLoadingTeam(false));
  }, [userId]);


  async function handleSubmitPeer() {
  if (!userId || !cycleId) {
    alert('Usuário ou ciclo não carregados ainda.');
    return;
  }

  const entries = Object.entries(peerAnswers);
  if (entries.length === 0) {
    alert('Não há avaliações de pares preenchidas.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    for (const [evaluatedUserId, answersMap] of entries) {
    // 1) extrai a resposta bruta
    const motivatedToWorkAgain = answersMap['pq1']?.scale
    const raw = answersMap['pq2']?.scale;

    // 2) converte em inteiro e valida intervalo [1,5]
    const generalScore = raw ? parseInt(raw, 10) : NaN;
    if (isNaN(generalScore) || generalScore < 1 || generalScore > 5) {
      alert('Por favor, dê uma nota geral entre 1 e 5.');
      return;
    }

    // 3) extrai os outros campos
    const pointsToImprove = answersMap['pq3']?.justification?.trim();
    const pointsToExplore = answersMap['pq4']?.justification?.trim();

    // 4) agora monta o payload sabendo que generalScore está válido
    const payload = {
    evaluatorUserId: userId,
    evaluatedUserId,
    cycleId,
    projectId,
    motivatedToWorkAgain,   
    generalScore,
    pointsToImprove,
    pointsToExplore,
  }

      const res = await fetch('http://localhost:3000/api/evaluations/peer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Erro ao enviar avaliação de ${evaluatedUserId}: ${await res.text()}`);
      }
    }

    alert('Todas as avaliações de pares foram enviadas com sucesso!');
    navigate(`/avaliacao/${sections[currentSectionIndex + 1]?.key}`);
  } catch (err: any) {
    console.error(err);
    alert('Falha ao enviar avaliações: ' + err.message);
    }
  }


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

  async function handleSubmitLeader() {
  // 1) checa se já temos todo mundo
  if (!userId || !cycleId) return
  if (leaderColleagues.length === 0) return

  // 2) pega o ID do gestor a partir do array que veio da API
  const leaderId = leaderColleagues[0].id

  // 3) busca as respostas daquele gestor
  const answersMap = leaderAnswers[leaderId] || {}

  // 4) converte cada escala em número (1–5)
  const deliveryScore    = parseInt(answersMap['lq1']?.scale  || '0', 10)
  const proactivityScore = parseInt(answersMap['lq2']?.scale  || '0', 10)
  const collaborationScore = parseInt(answersMap['lq3']?.scale || '0', 10)
  const skillScore       = parseInt(answersMap['lq4']?.scale  || '0', 10)

  // 5) valida que todas as notas estão no intervalo válido
  if ([deliveryScore, proactivityScore, collaborationScore, skillScore]
      .some(n => isNaN(n) || n < 1 || n > 5)) {
    alert('Por favor, dê uma nota inteira de 1 a 5 para todas as perguntas.')
    return
  }

  // 6) monta o payload exatamente com os nomes que o DTO espera
  const payload = {
    collaboratorId:  userId,
    leaderId,
    cycleId,
    deliveryScore,
    proactivityScore,
    collaborationScore,
    skillScore,
  }

  // 7) envia
  const token = localStorage.getItem('token')
  const res = await fetch('http://localhost:3000/api/evaluations/leader', {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  alert('Avaliação de líder enviada com sucesso!')
  navigate(`/avaliacao/${sections[currentSectionIndex + 1]?.key}`)
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
  
  const isAnswerComplete = (answer?: Answer, questionId?: string) => {
  if (currentSectionData.key === 'peer') {
    // pq1 e pq2: basta ter scale
    if (questionId === 'pq1' || questionId === 'pq2') {
      return !!answer?.scale;
    }
    // pq3 e pq4: precisa só de justificativa
    return !!answer?.justification?.trim();
  }
  // auto e líderes continuam pedindo scale + justificativa
  return !!answer?.scale && !!answer?.justification?.trim();
  };

  const getSectionProgress = (
    answersMap: Record<string, Record<string, Answer>>,
    questions: Question[]
    ) => (id: string) => {
    const personAnswers = answersMap[id] || {};
    const doneCount = questions.filter(q =>
    // passa também o q.id
    isAnswerComplete(personAnswers[q.id], q.id)
    ).length;
    if (questions.length === 0) return 0;
    return Math.round((doneCount / questions.length) * 100);
  };

  let totalProgressItems = 0;
  let completedProgressItems = 0;
  const is360Section = currentSectionData.key === 'peer' || currentSectionData.key === 'leader';

  if (is360Section) {
    const colleaguesList = currentSectionData.key === 'peer' ? teamMates : leaderColleagues;
    const answersSource = currentSectionData.key === 'peer' ? peerAnswers : leaderAnswers;

    if (avaliandoId) {
      //  UMA pessoa
      totalProgressItems = currentSectionData.questions.length;
      const personAnswers = answersSource[avaliandoId] || {};
      completedProgressItems = currentSectionData.questions.filter(q =>
        isAnswerComplete(personAnswers[q.id], q.id)
        ).length;
    } else {
      //LISTA de pessoas
      totalProgressItems = colleaguesList.length;
      completedProgressItems = colleaguesList.filter(person => {
      const personAnswers = answersSource[person.id] || {};
      const answeredCount = currentSectionData.questions.filter(q =>
      isAnswerComplete(personAnswers[q.id], q.id)
      ).length;
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

  const currentColleagues = 
  currentSectionData.key === 'peer'
    ? teamMates
    : currentSectionData.key === 'leader'
    ? leaderColleagues
    : [];
  const colegaSelecionado = currentColleagues.find(c => c.id === avaliandoId);
  if (loading) return <div className="p-6">Carregando critérios...</div>;
  if (loadingTeam) return <div className="p-6">Carregando equipe...</div>;
  if (teamError) return <div className="p-6 text-red-600">Erro: {teamError}</div>;
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
            peerColleagues={teamMates}
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
                      {currentSectionData.key === 'peer' ? (
                     <PeerQuestionList
                       questions={currentSectionData.questions}
                       answers={peerAnswers[avaliandoId] || {}}
                       onAnswerChange={handleAnswerChange}
                     />
                   ) : (
                   <LeaderQuestionList
                       questions={currentSectionData.questions}
                       answers={leaderAnswers[avaliandoId] || {}}
                       onAnswerChange={handleAnswerChange}
                     />
                   )}
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
                    <>
                    {currentSectionData.key === 'peer' && (
                      <>
                        <PeerEvaluationPanel
                          colleagues={teamMates.map(col => ({
                            ...col,
                            progresso: getSectionProgress(peerAnswers, currentSectionData.questions)(col.id),
                          }))}
                          onEvaluate={handleEvaluate}
                          sectionKey="peer"
                        />
                        <div className="mt-6 flex justify-end">
                          <button onClick={handleSubmitPeer} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Enviar Avaliações de Pares
                          </button>
                        </div>
                      </>
                    )}
                    {currentSectionData.key === 'leader' && (
                      <>
                        <PeerEvaluationPanel
                          colleagues={leaderColleagues.map(col => ({
                            ...col,
                            progresso: getSectionProgress(leaderAnswers, currentSectionData.questions)(col.id),
                          }))}
                          onEvaluate={handleEvaluate}
                          sectionKey="leader"
                        />
                        <div className="mt-6 flex justify-end">
                          <button onClick={handleSubmitLeader} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Enviar Avaliação de Líder
                          </button>
                        </div>
                      </>
                    )}
                      </>
                    
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
              colleagues={teamMates}
              leaders={leaderColleagues}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
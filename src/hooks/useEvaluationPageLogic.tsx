// src/hooks/useEvaluationPageLogic.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type JSX } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaUsers, FaChartLine, FaCrown } from 'react-icons/fa';
import { UserCheck } from 'lucide-react';

import type { Section, Colleague, Answer, Question, ReferenceIndication, Cycle, ApiTeamInfo, CriterionDto } from '../types/evaluation';
import type { ManagedTeamDto } from '../types/manager'; // Certifique-se que este tipo existe em 'types/manager.ts'

const peerQuestions: Question[] = [
  { id: 'pq1', type: 'scale', text: 'Você ficaria motivado em trabalhar novamente com este colaborador?' },
  { id: 'pq2', type: 'scale', text: 'Dê uma nota geral para o colaborador' },
  { id: 'pq3', type: 'text', text: 'Pontos que deve melhorar' },
  { id: 'pq4', type: 'text', text: 'Pontos que faz bem e deve explorar' },
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

const getStorageKey = (userId?: string, cycleId?: string, key?: string) => {
    if (!userId || !cycleId || !key) return null;
    return `evaluationState:${userId}:${cycleId}:${key}`;
};

export const useAvaliacaoLogic = () => {
  const { section } = useParams();
  const [teamMates, setTeamMates] = useState<Colleague[]>([]);
  const [loadingTeam, setLoadingTeam] = useState<boolean>(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [leaderColleagues, setLeaderColleagues] = useState<Colleague[]>([]);
  const [projectName, setProjectName] = useState<string>('—');
  const [projectId, setProjectId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [peerAnswers, setPeerAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [leaderAnswers, setLeaderAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [avaliandoId, setAvaliandoId] = useState<string | null>(null);
  const [currentCycleId,setCurrentCycleId] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cycleId, setCycleId] = useState<string>('');
  const [cycleName, setCycleName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userType, setUserType] = useState<string | null>(null);

  const [referencesData, setReferencesData] = useState<ReferenceIndication[]>([]);
  const [isReferenceSectionComplete, setIsReferenceSectionComplete] = useState<boolean>(false);

  const [allUsers, setAllUsers] = useState<Colleague[]>([]);

  const [trilhaId, setTrilhaId] = useState<string>('');



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
        const { sub, userType: type } = JSON.parse(json);
        setUserId(sub);
        setUserType(type);
      } catch (e) {
        console.error('Não conseguiu decodificar token:', e);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Não foi possível buscar usuário');
        const user = await res.json() as { roles: { id: string; type: string }[] };
        const trilhaRole = user.roles.find(r => r.type === 'TRILHA');
        if (!trilhaRole) {
          throw new Error('Usuário não possui trilha atribuída');
        }
        setTrilhaId(trilhaRole.id);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [userId]);


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
        if (open) {
          setCurrentCycleId(open.id);
          setCycleName(open.name);
        }
      } catch (e) {
        console.error('Erro ao buscar ciclos:', e);
      }
    }
    fetchCycles();
  }, []);

  useEffect(() => {
    if (!userId || !userType) return;
    setLoadingTeam(true);
    const token = localStorage.getItem('token');

    const fetchTeamData = async () => {
        try {
            if (userType === 'GESTOR') {
                const res = await fetch(`http://localhost:3000/api/teams/manager/${userId}/projects`, {
                    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {})},
                });
                if (!res.ok) throw new Error(await res.text() || 'Falha ao buscar times gerenciados.');

                const managedTeams: ManagedTeamDto[] = await res.json();
                if (managedTeams.length > 0) {
                    const allTeamMates = managedTeams.flatMap(team =>
                        (team.collaborators ?? []).map(c => ({
                            id: c.id,
                            nome: c.name,
                            cargo: 'Colaborador',
                            area: team.projectName,
                            tempo: '—',
                            projectName: team.projectName,
                        }))
                    );
                    const uniqueTeamMates = Array.from(new Map(allTeamMates.map(item => [item.id, item])).values());
                    setTeamMates(uniqueTeamMates);

                    const firstTeam = managedTeams[0];
                    setProjectId(firstTeam.projectId);
                    setProjectName(firstTeam.projectName);
                    setCycleId(firstTeam.cycleId);
                }
                setLeaderColleagues([]);
            } else {
                const res = await fetch(`http://localhost:3000/api/teams/user/${userId}/projects`, {
                    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {})},
                });
                if (!res.ok) throw new Error(await res.text() || 'Falha ao buscar dados do time.');

                const infos = await res.json() as ApiTeamInfo[];
            console.log('🔸 /api/teams/user[] response:', infos);

            if (!infos.length) {
              throw new Error('Nenhum projeto retornado para este usuário');
            }

            const info = infos[0];    // <— pega o objeto dentro do array

            setProjectId(info.projectId);
            setProjectName(info.projectName);  // (opcional, mas eu recomendaria manter o nome do projeto também)
            setCycleId(info.cycleId);

            console.log('🔸 usando o primeiro elemento:', info);

            const collaborators = info.collaborators ?? [];
            setTeamMates(
              collaborators.map(c => ({
                id: c.id,
                nome: c.name,
                cargo: 'Colaborador',
                area: info.projectName,
                tempo: '—',
                projectName: info.projectName,
              }))
            );
            setLeaderColleagues([{
              id: info.managerId,
              nome: info.managerName,
              cargo: 'Gestor',
              area: info.projectName,
              tempo: '—',
              projectName: info.projectName,
            }]);
            }
        } catch (err: any) {
            setTeamError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setLoadingTeam(false);
        }
    };

    fetchTeamData();
  }, [userId, userType]);

    useEffect(() => {
      if (!userId || !cycleId) return;

      const loadState = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, defaultValue: T) => {
        const storageKey = getStorageKey(userId, cycleId, key);
        if (!storageKey) return;

        const savedStateJSON = localStorage.getItem(storageKey);
        if (savedStateJSON) {
          try {
            setter(JSON.parse(savedStateJSON));
          } catch (e) {
            console.error(`Falha ao carregar estado para a chave "${key}":`, e);
            setter(defaultValue);
          }
        }
  };

  loadState('answers', setAnswers, {});
  loadState('peerAnswers', setPeerAnswers, {});
  loadState('leaderAnswers', setLeaderAnswers, {});
  loadState('referencesData', setReferencesData, [] as ReferenceIndication[]);
  loadState<boolean>('isReferenceSectionComplete', setIsReferenceSectionComplete, false);

}, [userId, cycleId]);

useEffect(() => {
  const saveData = (key: string, data: unknown) => {
    const storageKey = getStorageKey(userId, cycleId, key);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  };

  saveData('answers', answers);
  saveData('peerAnswers', peerAnswers);
  saveData('leaderAnswers', leaderAnswers);
  saveData('referencesData', referencesData);
  saveData('isReferenceSectionComplete', isReferenceSectionComplete);

}, [answers, peerAnswers, leaderAnswers, referencesData, isReferenceSectionComplete, userId, cycleId]);

  useEffect(() => {
    // só roda quando tivermos trilha e tipo de usuário definidos
    if (!trilhaId || userType === null) return;
    setLoading(true);

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `http://localhost:3000/api/roles/trilhas/${trilhaId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Não conseguiu buscar critérios da trilha');

        const criteria = (await res.json()) as CriterionDto[];

        // agrupa critérios por pilar
        const grouped = criteria.reduce<Record<string, Question[]>>((acc, c) => {
          const key = (c.pillar || 'comportamento').toLowerCase().trim();
          if (!acc[key]) acc[key] = [];
          acc[key].push({
            id:   c.id,
            type: 'scale',
            text: c.criterionName,
          });
          return acc;
        }, {});

        // mapeia para Sections já com ícones e títulos
        const mapped: Section[] = Object.entries(grouped).map(
          ([pillarKey, questions]) => {
            const pre = predefinedSections[pillarKey] ?? {
              key:   pillarKey.replace(/\s/g, '-'),
              title: pillarKey[0].toUpperCase() + pillarKey.slice(1),
              icon:  <FaUsers />,
            };
            return { ...pre, questions };
          }
        );

        // adiciona seções fixas de pares, líder e referência
        mapped.push(
          { key: 'peer',      title: 'Avaliação de Pares',   icon: <FaUsers />,   questions: peerQuestions },
          { key: 'leader',    title: 'Avaliação de Líderes',  icon: <FaCrown />,   questions: leaderQuestions },
          { key: 'reference', title: 'Indicação de Referências', icon: <UserCheck />, questions: [] },
        );

        // agora filtra:
      let filtered = mapped;

      // 1) Se for gestor, removemos a seção de líderes (eles não avaliam líderes)
      if (userType === 'GESTOR') {
        filtered = filtered.filter(s => s.key !== 'leader');
      }
      // 2) Se for colaborador, já tiramos o pilar de gestão e liderança
      else {
        filtered = filtered.filter(s => s.key !== 'gestão-e-liderança');
      }

      setSections(filtered);

      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Erro ao carregar critérios da trilha');
      } finally {
        setLoading(false);
      }
    })();
  }, [trilhaId, userType]);

  useEffect(() => {
    async function fetchAllUsers() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Falha ao buscar usuários');
        const users: ApiTeamInfo['collaborators'] = await res.json();
        setAllUsers(users.map(u => ({
          id: u.id,
          nome: u.name,
          cargo: 'Colaborador',
          area: '—',
          tempo: '—',
          projectName: '—',
        })));
      } catch (err) {
        console.error(err);
      }
    }
    fetchAllUsers();
  }, []);

const currentSectionIndex = sections.findIndex(s => s.key === section);
const currentSectionData = currentSectionIndex >= 0 ? sections[currentSectionIndex] : null;

async function handleSubmitPeer() {
  if (!userId || !currentCycleId) {
  alert('Dados de Usuário e Ciclos ainda não foram carregados');
  return Promise.reject(new Error());
  }

  const entries = Object.entries(peerAnswers);
  if (entries.length === 0) {
    const err = new Error('Não há avaliações de pares para serem respondidas');
      alert(err.message);
      return Promise.reject(err);
  }

  try {
    const token = localStorage.getItem('token');
    for (const [evaluatedUserId, answersMap] of entries) {
    const motivatedToWorkAgain = answersMap['pq1']?.scale
    const raw = answersMap['pq2']?.scale;

    const generalScore = raw ? parseInt(raw, 10) : NaN;
    if (isNaN(generalScore) || generalScore < 1 || generalScore > 5) {
      const err = new Error('Por favor, dê uma nota geral entre 1 e 5');
      alert(err.message);
      return Promise.reject(err);
    }

    const pointsToImprove = answersMap['pq3']?.justification?.trim();
    const pointsToExplore = answersMap['pq4']?.justification?.trim();

    const payload = {
    evaluatorUserId: userId,
    evaluatedUserId,
    cycleId: currentCycleId,
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
    const storageKey = getStorageKey(userId, cycleId, 'peerAnswers');
    if (storageKey) localStorage.removeItem(storageKey);

    alert('Todas as avaliações de pares foram enviadas com sucesso!');
    return Promise.resolve();

  }catch (err: any) {
        console.error(err);
        alert('Falha ao enviar: ' + err.message);
        return Promise.reject(err);
    }
  }

  const handleSubmitReferences = async (references: ReferenceIndication[]) => {
    if (!userId || !cycleId) throw new Error('Dados não carregados');
    if (references.length === 0) {
      alert('Adicione pelo menos uma referência');
      return Promise.reject();
    }

    const token = localStorage.getItem('token');
    try {
      for (const ref of references) {
        const payload = {
          indicatorUserId: userId,
          indicatedUserId: ref.indicatedUserId,
          cycleId,
          justification: ref.justification,
        };
        const res = await fetch('http://localhost:3000/api/evaluations/reference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`Erro ao salvar referência de ${ref.indicatedUserId}: ${await res.text()}`);
        }
      }

      setReferencesData([]);
      setIsReferenceSectionComplete(true);

      const refKey = getStorageKey(userId, cycleId, 'referencesData');
      if (refKey) localStorage.removeItem(refKey);

      const completeKey = getStorageKey(userId, cycleId, 'isReferenceSectionComplete');
      if (completeKey) localStorage.removeItem(completeKey);

      return Promise.resolve();
    } catch (err: any) {
      console.error(err);
      alert('Falha ao enviar: ' + err.message);
      return Promise.reject(err);
    }
  };

  async function handleSubmitSelfEvaluation() {
    if (!userId) {
      const err = new Error('Usuário não carregado');
      alert(err.message);
      return Promise.reject(err);
    }
    const payload = {
      userId,
      cycleId: currentCycleId, 
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
      const storageKey = getStorageKey(userId, cycleId, 'answers');
      if (storageKey) localStorage.removeItem(storageKey);
      return Promise.resolve();
    } catch (err: any) {
        console.error(err);
        alert('Falha ao enviar: ' + err.message);
        return Promise.reject(err);
    }
  }

  async function handleSubmitLeader() {
    if (!userId || !cycleId || leaderColleagues.length === 0){
        const err = new Error('Dados essenciais (usuário, ciclo, líder) não estão disponíveis.');
        alert(err.message);
        return Promise.reject(err);
    }

    const leaderId = leaderColleagues[0].id;
    const answersMap = leaderAnswers[leaderId] || {};

    const visionScore      = parseInt(answersMap['lq1']?.scale  || '0', 10);
    const inspirationScore = parseInt(answersMap['lq2']?.scale  || '0', 10);
    const developmentScore = parseInt(answersMap['lq3']?.scale  || '0', 10);
    const feedbackScore    = parseInt(answersMap['lq4']?.scale  || '0', 10);

    if (
      [visionScore, inspirationScore, developmentScore, feedbackScore]
        .some(n => isNaN(n) || n < 1 || n > 5)
    ) {
      const err = new Error('Por favor, dê uma nota inteira de 1 a 5 em todas as perguntas.');
      alert(err.message);
      return Promise.reject(err);
    }

    try{
        const payload = {
            collaboratorId:  userId,
            leaderId,
            cycleId,
            visionScore,
            inspirationScore,
            developmentScore,
            feedbackScore,
        };

        const token = localStorage.getItem('token');
        const res = await fetch(
            'http://localhost:3000/api/evaluations/leader-feedback',
            {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        const storageKey = getStorageKey(userId, cycleId, 'leaderAnswers');
        if (storageKey) localStorage.removeItem(storageKey);

        alert('Avaliação de líder enviada com sucesso!');
        return Promise.resolve();
    }
    catch (err: any) {
        console.error(err);
        alert('Falha ao enviar: ' + err.message);
        return Promise.reject(err);
    }
  }

  const handleAnswerChange = (
    questionId: string,
    field: 'scale' | 'justification',
    value: string
  ) => {
    if (currentSectionData && currentSectionData.key === 'peer' && avaliandoId) {
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
    } else if (currentSectionData && currentSectionData.key === 'leader' && avaliandoId) {
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
  if (currentSectionData && currentSectionData.key === 'peer') {
    if (questionId === 'pq1' || questionId === 'pq2') {
      return !!answer?.scale;
    }
    return !!answer?.justification?.trim();
  }
  return !!answer?.scale && !!answer?.justification?.trim();
  };

  const getSectionProgress = (
    answersMap: Record<string, Record<string, Answer>>,
    questions: Question[]
    ) => (id: string) => {
    const personAnswers = answersMap[id] || {};
    const doneCount = questions.filter(q =>
    isAnswerComplete(personAnswers[q.id], q.id)
    ).length;
    if (questions.length === 0) return 0;
    return Math.round((doneCount / questions.length) * 100);
  };

  let totalOverallSectionsToCount = 0;
  let completedOverallSectionsToCount = 0;

  sections.forEach(s => {
    if (s.key === 'reference') {
      totalOverallSectionsToCount += 1;
      if (isReferenceSectionComplete) {
        completedOverallSectionsToCount += 1;
      }
    } else if (s.key === 'peer' || s.key === 'leader') {
      const colleaguesList = s.key === 'peer' ? teamMates : leaderColleagues;
      const answersSource = s.key === 'peer' ? peerAnswers : leaderAnswers;
      totalOverallSectionsToCount += colleaguesList.length;
      completedOverallSectionsToCount += colleaguesList.filter(person => {
        const personAnswers = answersSource[person.id] || {};
        const answeredCount = s.questions.filter(q => isAnswerComplete(personAnswers[q.id], q.id)).length;
        return answeredCount === s.questions.length && s.questions.length > 0;
      }).length;
    } else {
      totalOverallSectionsToCount += 1;
      const answeredCount = s.questions.filter(q => isAnswerComplete(answers[q.id])).length;
      if (answeredCount === s.questions.length && s.questions.length > 0) {
        completedOverallSectionsToCount += 1;
      }
    }
  });

  const currentColleagues =
        currentSectionData?.key === 'peer'
        ? teamMates
        : currentSectionData?.key === 'leader'
        ? leaderColleagues
        : [];
    const colegaSelecionado = currentColleagues.find(c => c.id === avaliandoId);

  const overallProgressPercentage = totalOverallSectionsToCount > 0
    ? (completedOverallSectionsToCount / totalOverallSectionsToCount) * 100
    : 0;

    return {
        // Status de carregamento e erro
        loading,
        error,
        loadingTeam,
        teamError,

        // Dados principais
        sections,
        currentSectionIndex,
        currentSectionData,
        teamMates,
        leaderColleagues,
        allUsers,

        // Estado das respostas
        answers,
        peerAnswers,
        leaderAnswers,
        referencesData,
        isReferenceSectionComplete,

        // Estado da UI
        avaliandoId,
        setAvaliandoId,
        colegaSelecionado,
        projectName,
        currentCycleId,
        cycleName,

        // Funções de manipulação de eventos
        handleAnswerChange,
        handleEvaluate,
        handleSubmitPeer,
        handleSubmitReferences,
        handleSubmitSelfEvaluation,
        handleSubmitLeader,

        // Funções de cálculo
        getSectionProgress,
        overallProgressPercentage,
    };
};
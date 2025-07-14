/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect,type JSX } from 'react';
import {useParams } from 'react-router-dom';
import { FaStar, FaUsers, FaChartLine, FaCrown } from 'react-icons/fa';
import { UserCheck } from 'lucide-react';

import type { Section, Colleague, Answer, Question, Reference, Cycle, ApiTeamInfo } from '../types/evaluation';

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
  const [userId, setUserId] = useState<string>('');
  
  const [referencesData, setReferencesData] = useState<Reference[]>([]);
  const [isReferenceSectionComplete, setIsReferenceSectionComplete] = useState<boolean>(false);
  
  
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
        if(open)
            setCurrentCycleId(open.id);

      } catch (err) {
        console.error('Erro ao buscar ciclos:', err);
      }
    }
    fetchCycles();
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
          id:           c.id,
          nome:         c.name,
          cargo:        'Colaborador',
          area:         info.projectName,        
          tempo:        '—',
          projectName: info.projectName,        
        })));
        
        // mapeia o gestor
        setLeaderColleagues([{
          id:           info.managerId,
          nome:         info.managerName,
          cargo:        'Gestor',
          area:         info.projectName,        
          tempo:        '—',
          projectName: info.projectName,        
        }]);
      })
      .catch(err => setTeamError(String(err)))
      .finally(() => setLoadingTeam(false));
    }, [userId]);
    
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
  loadState('referencesData', setReferencesData, [] as Reference[]);
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
      
      // Adiciona seções de pares, líderes e indicação de referências no fim
      mapped.push(
        { key: 'peer', title: 'Avaliação de Pares', icon: <FaUsers />, questions: peerQuestions },
        { key: 'leader', title: 'Avaliação de Líderes', icon: <FaCrown />, questions: leaderQuestions },
        { key: 'reference', title: 'Indicação de Referências', icon: <UserCheck />, questions: [] }
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

const currentSectionIndex = sections.findIndex(s => s.key === section);
const currentSectionData = currentSectionIndex >= 0 ? sections[currentSectionIndex] : null;

async function handleSubmitPeer() {
  if (!userId || !cycleId) {
    const err = new Error('Dados de Usuário e Ciclos ainda não foram carregados');
      alert(err.message);
      return Promise.reject(err);
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
    // 1) extrai a resposta bruta
    const motivatedToWorkAgain = answersMap['pq1']?.scale
    const raw = answersMap['pq2']?.scale;

    // 2) converte em inteiro e valida intervalo [1,5]
    const generalScore = raw ? parseInt(raw, 10) : NaN;
    if (isNaN(generalScore) || generalScore < 1 || generalScore > 5) {
      const err = new Error('Por favor, dê uma nota geral entre 1 e 5');
      alert(err.message);
      return Promise.reject(err);
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
    const storageKey = getStorageKey(userId, cycleId, 'peerAnswers');
    if (storageKey) localStorage.removeItem(storageKey);

    alert('Todas as avaliações de pares foram enviadas com sucesso!');
    return Promise.resolve(); 

  }catch (err: any) {
        console.error(err);
        alert('Falha ao enviar: ' + err.message);
        return Promise.reject(err); // <-- ESSENCIAL para notificar o componente
    }
  }

  const handleSubmitReferences = async (references: Reference[]) => {
    if (!userId || !cycleId) {
      const err = new Error('Usuários não carregados ainda');
      alert(err.message);
      return Promise.reject(err);
    }

    if (references.length === 0) {
      const err = new Error('Adicione pelo menos uma referência antes de salvar');
      alert(err.message);
      return Promise.reject(err);
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        userId,
        cycleId,
        references,
      };
      const res = await fetch('http://localhost:3000/api/references', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar referências: ${await res.text()}`);
      }

      alert('Referências salvas com sucesso!');
      const dataKey = getStorageKey(userId, cycleId, 'referencesData');
      if (dataKey) localStorage.removeItem(dataKey);

      const completeKey = getStorageKey(userId, cycleId, 'isReferenceSectionComplete');
      if (completeKey) localStorage.removeItem(completeKey);

      setReferencesData([]);
      setIsReferenceSectionComplete(false);
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
    // garanta que já tenha userId, cycleId e o array leaderColleagues
    if (!userId || !cycleId || leaderColleagues.length === 0){
        const err = new Error('Dados essenciais (usuário, ciclo, líder) não estão disponíveis.');
        alert(err.message);
        return Promise.reject(err);
    }

    const leaderId = leaderColleagues[0].id;
    const answersMap = leaderAnswers[leaderId] || {};

    // converte cada escala (lq1…lq4) para o nome do DTO
    const visionScore      = parseInt(answersMap['lq1']?.scale  || '0', 10);
    const inspirationScore = parseInt(answersMap['lq2']?.scale  || '0', 10);
    const developmentScore = parseInt(answersMap['lq3']?.scale  || '0', 10);
    const feedbackScore    = parseInt(answersMap['lq4']?.scale  || '0', 10);

    // valida 1–5
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
        // navega para a próxima aba
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

  let totalOverallSectionsToCount = 0;
  let completedOverallSectionsToCount = 0;

  sections.forEach(s => {
    if (s.key === 'reference') {
      // Para a seção de referência, contamos como 1 item total
      totalOverallSectionsToCount += 1;
      // E ela está completa se o estado isReferenceSectionComplete for true
      if (isReferenceSectionComplete) {
        completedOverallSectionsToCount += 1;
      }
    } else if (s.key === 'peer' || s.key === 'leader') {
      // Para pares e líderes, cada pessoa é um item a ser avaliado
      const colleaguesList = s.key === 'peer' ? teamMates : leaderColleagues;
      const answersSource = s.key === 'peer' ? peerAnswers : leaderAnswers;
      totalOverallSectionsToCount += colleaguesList.length; // Cada pessoa avaliada é um item
      completedOverallSectionsToCount += colleaguesList.filter(person => {
        const personAnswers = answersSource[person.id] || {};
        const answeredCount = s.questions.filter(q => isAnswerComplete(personAnswers[q.id], q.id)).length;
        // Considera completo se todas as perguntas para aquela pessoa foram respondidas
        return answeredCount === s.questions.length && s.questions.length > 0;
      }).length;
    } else { // Autoavaliação (Comportamento, Execução, Gestão e Liderança)
      totalOverallSectionsToCount += 1; // Cada seção de autoavaliação é 1 item
      const answeredCount = s.questions.filter(q => isAnswerComplete(answers[q.id])).length;
      // Considera completo se todas as perguntas da seção foram respondidas
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
        
        // Estado das respostas
        answers,
        peerAnswers,
        leaderAnswers,
        referencesData,
        isReferenceSectionComplete,
        
        // Estado da UI
        avaliandoId,
        setAvaliandoId, // Expondo o setter para o botão de "Voltar"
        colegaSelecionado,
        projectName,
        currentCycleId,
        
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
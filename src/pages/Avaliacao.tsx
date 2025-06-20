import { useState, useEffect } from 'react';
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

const peerQuestions: Question[] = [
  { id: 'pq1', type: 'scale', text: 'Comunicação e clareza' },
  { id: 'pq2', type: 'scale', text: 'Colaboração e trabalho em equipe' },
  { id: 'pq3', type: 'scale', text: 'Qualidade técnica' },
  { id: 'pq4', type: 'scale', text: 'Proatividade e iniciativa' },
];

const leaderQuestions: Question[] = [
  { id: 'lq1', type: 'scale', text: 'Visão estratégica e direção clara' },
  { id: 'lq2', type: 'scale', text: 'Capacidade de inspirar e motivar' },
  { id: 'lq3', type: 'scale', text: 'Apoio no desenvolvimento da equipe' },
  { id: 'lq4', type: 'scale', text: 'Feedback construtivo e transparente' },
];

const sections: Section[] = [
  {
    key: 'behavior',
    title: 'Comportamento',
    icon: <FaStar />,
    questions: [
      { id: 'q1', type: 'scale', text: '1. Você possui Sentimento de Dono?' },
      { id: 'q2', type: 'scale', text: '2. Você possui Resiliência nas adversidades?' },
      { id: 'q3', type: 'scale', text: '3. Você é organizado em relação ao seu trabalho?' },
      { id: 'q4', type: 'scale', text: '4. Você acredita que tem uma boa capacidade de aprendizado?' },
      { id: 'q5', type: 'scale', text: '5. Você é "team player"?' },
    ],
  },
  {
    key: 'execution',
    title: 'Execução',
    icon: <FaUsers />,
    questions: [
      { id: 'q7', type: 'scale', text: '1. Como você avalia suas entregas?' },
      { id: 'q8', type: 'scale', text: '2. Como você considera seu comprometimento com prazos?' },
      { id: 'q9', type: 'scale', text: '3. Você acredita que consegue tirar leite de pedra?' },
      { id: 'q10', type: 'scale', text: '4. Você acha que consegue pensar fora da caixa?' },
    ],
  },
  {
    key: 'management',
    title: 'Gestão e Liderança',
    icon: <FaChartLine />,
    questions: [
      { id: 'q12', type: 'scale', text: '1. Como você avalia sua interação com os colegas?' },
      { id: 'q13', type: 'scale', text: '2. Como você avalia os resultados do seu grupo?' },
      { id: 'q14', type: 'scale', text: '3. Como você avalia a evolução da empresa?' },
    ],
  },
  { key: 'peer', title: 'Avaliação de Pares', icon: <FaUsers />, questions: peerQuestions },
  { key: 'leader', title: 'Avaliação de Líderes', icon: <FaCrown />, questions: leaderQuestions },
];

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

  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [peerAnswers, setPeerAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [leaderAnswers, setLeaderAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [avaliandoId, setAvaliandoId] = useState<string | null>(null);

  const currentSectionIndex = Math.max(sections.findIndex(s => s.key === section), 0);
  const currentSectionData = sections[currentSectionIndex];
  useEffect(() => { window.scrollTo(0, 0); }, [section]);

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

  const getSectionProgress = (answersMap: Record<string, Record<string, Answer>>, questions: Question[]) => (id: string) => {
    const ans = answersMap[id] || {};
    const done = questions.filter(q => ans[q.id]?.scale && ans[q.id]?.justification?.trim()).length;
    return Math.round((done / questions.length) * 100);
  };

  const totalQs = currentSectionData.questions.length;
  const answeredQs = currentSectionData.questions.filter(q => {
    const src = currentSectionData.key === 'peer' && avaliandoId
      ? peerAnswers[avaliandoId]!
      : currentSectionData.key === 'leader' && avaliandoId
      ? leaderAnswers[avaliandoId]!
      : answers;
    return src?.[q.id]?.scale && src?.[q.id]?.justification?.trim();
  }).length;

  const currentColleagues = currentSectionData.key === 'peer' ? peerColleagues : currentSectionData.key === 'leader' ? leaderColleagues : [];
  const colegaSelecionado = currentColleagues.find(c => c.id === avaliandoId);

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50"><Header /></div>
      <main className="flex-1 pt-32 px-6 lg:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Autoavaliação Q4 2024
            </h1>
            <div className="relative bg-gray-200 h-2 rounded-full">
              <div
                className="absolute h-2 bg-orange-500 transition-all duration-500"
                style={{ width: `${totalQs ? (answeredQs / totalQs) * 100 : 0}%` }}
              />
            </div>
          </header>

          <EvaluationTabs
            sections={sections}
            answers={answers}
            currentSectionIndex={currentSectionIndex}
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
                  <QuestionList
                    questions={currentSectionData.questions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
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
              colleagues={[...peerColleagues, ...leaderColleagues]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

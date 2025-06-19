import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaStar,
  FaUsers,
  FaChartLine,
  FaCrown,
  FaCheckCircle,
  FaRegLightbulb,
} from 'react-icons/fa';

import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import PeerEvaluationPanel from '../components/PeerEvaluationPanel/PeerEvaluationPanel';
import type { Section, Question, Colleague } from '../types/evaluation';

// Dados da aplicação
const sections: Section[] = [
  {
    key: 'behavior',
    title: 'Comportamento',
    icon: <FaStar />,
    questions: [
      { id: 'q1', type: 'scale', text: '1. Você possui Sentimento de Dono?' },
      { id: 'q2', type: 'scale', text: '2. Você possui Resiliencia nas adversidades ?' },
      { id: 'q3', type: 'scale', text: '3. Você é organizado em relação ao seu trabalho ?' },
      { id: 'q4', type: 'scale', text: '4. Você acredita que tem uma boa capacidade de aprendizado ?' },
      { id: 'q5', type: 'scale', text: '5. Você é "team player"?' },
      { id: 'q6', type: 'text',  text: '6. Justifique suas notas' },
    ],
  },
  {
    key: 'execution',
    title: 'Execução',
    icon: <FaUsers />,
    questions: [
      { id: 'q7', type: 'scale', text: '1. Como você avalia suas entregas?' },
      { id: 'q8', type: 'scale', text: '2. Como você considera seu comprometimento com prazos?' },
      { id: 'q9', type: 'scale', text: '3. Você acredita que consegue tirar leite de pedra ?' },
      { id: 'q10', type: 'scale', text: '4. Você acha que consegue pensar fora da caixa ?' },
      { id: 'q11',type: 'text', text:  '5.Justifique suas notas'}
    ],
  },
  {
    key: 'management',
    title: 'Gestão e Liderança',
    icon: <FaChartLine />,
    questions: [
      { id: 'q12', type: 'scale', text: '1. Como você avalia sua interação com seus colegas de trabalho?' },
      { id: 'q13', type: 'scale', text: '2. Como você avalia os resultados do seu grupo?' },
      { id: 'q14', type: 'scale', text: '3. Como você avalia a evolução da empresa?' },
      { id: 'q15',type: 'text', text:  '4. Justifique suas notas'}
    ],
  },
  {
    key: 'peer',
    title: 'Avaliação de Pares',
    icon: <FaUsers />,
    questions: [],
  },
  {
    key: 'leader',
    title: 'Avaliação de Líderes',
    icon: <FaCrown />,
    questions: [],
  },
];

const colleagues: Colleague[] = [
  { id: '1', nome: 'João Santos', cargo: 'Desenvolvedor Pleno', area: 'Tecnologia', tempo: '3 meses' },
  { id: '2', nome: 'Ana Rodrigues', cargo: 'Analista de Sistemas', area: 'Tecnologia', tempo: '6 meses' },
  { id: '3', nome: 'Pedro Oliveira', cargo: 'UX Designer', area: 'Design', tempo: '2 meses' },
  { id: '4', nome: 'Carla Lima', cargo: 'Product Manager', area: 'Produto', tempo: '5 meses' },
];

export default function Avaliacao() {
  const navigate = useNavigate();
  const { section } = useParams();

  const [answers, setAnswers] = useState<Record<string, string>>({});

   useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  const currentSectionIndex = Math.max(
    sections.findIndex((s) => s.key === section),
    0
  );

  const currentSectionData = sections[currentSectionIndex];
  const totalQs = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQs = Object.keys(answers).length;

  const handleScale = (qid: string, val: number) => setAnswers((a) => ({ ...a, [qid]: val.toString() }));
  const handleText = (qid: string, val: string) => setAnswers((a) => ({ ...a, [qid]: val }));


  const handlePeerEvaluate = (peerId: string) => {
    navigate(`/avaliarpar/${peerId}`);
  };

  const isLastQuestion = (idx: number, arr: Question[]) => idx === arr.length - 1;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="flex-1 pt-24 px-6 lg:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <header className="mb-6">
            <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">Autoavaliação Q4 2024</h1>
            <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="absolute h-2 bg-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${totalQs > 0 ? (answeredQs / totalQs) * 100 : 0}%` }}
              />
            </div>
          </header>

          {/* 4. Navegação das abas foi unificada */}
          <nav className="flex gap-2 mb-6 flex-wrap">
            {sections.map((s, idx) => {
              const hasQuestions = s.questions.length > 0;
              const doneCount = hasQuestions ? s.questions.filter((q) => answers[q.id]).length : 0;
              const completed = hasQuestions ? doneCount === s.questions.length : false;
              const isActive = idx === currentSectionIndex;
              const base = 'flex items-center gap-1 px-4 py-1 rounded-lg border';
              const activeCls = 'bg-orange-500 text-white border-orange-500';
              const doneCls = 'bg-green-100 text-green-700 border-green-200';
              const defaultCls = 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100';

              return (
                  <button
                    key={s.key}
                    onClick={() => navigate(`/avaliacao/${s.key}`)}
                    className={`${base} ${isActive ? activeCls : completed ? doneCls : defaultCls}`}
                  >
                    {completed && !isActive ? <FaCheckCircle className="text-green-700" /> : s.icon}
                    <span className="whitespace-nowrap">{s.title}</span>
                  </button>
                );
              })}
          </nav>

          <div className="flex gap-6">
            <section className="flex-1">
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                {/* Cabeçalho da Seção (é o mesmo para todas as abas) */}
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                  <span className="text-orange-500">{currentSectionData.icon}</span>
                  {currentSectionData.title}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Seção {currentSectionIndex + 1} de {sections.length}
                </p>

                {/* --- Seção principal --- */}
                {currentSectionData.key === 'peer' ? (
                  <PeerEvaluationPanel colleagues={colleagues} onEvaluate={handlePeerEvaluate} />

                ) : currentSectionData.key === 'leader' ? (
                  <div>Painel de Avaliação de Líderes (Em breve)</div>
                ) : (
                  <>
                    {currentSectionData.questions.map((q, idx, arr) => (
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
                                      onChange={() => handleScale(q.id, val)}
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
                            onChange={(e) => handleText(q.id, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </>
                )}
                <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const prev = Math.max(0, currentSectionIndex - 1);
                      if (prev !== currentSectionIndex) navigate(`/avaliacao/${sections[prev].key}`);
                    }}
                    disabled={currentSectionIndex === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 transition-colors hover:bg-gray-300"
                  >
                    &larr; Seção Anterior
                  </button>
                  <button
                    onClick={() => {
                      const next = currentSectionIndex < sections.length - 1 ? currentSectionIndex + 1 : currentSectionIndex;
                      if (next !== currentSectionIndex) navigate(`/avaliacao/${sections[next].key}`);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg transition-colors hover:bg-orange-600"
                  >
                    {currentSectionIndex < sections.length - 1 ? 'Próxima Seção →' : 'Finalizar e Enviar'}
                  </button>
                </div>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow p-4 text-left">
              <div className="flex items-center gap-2 mb-5 text-lg font-semibold">
                <FaRegLightbulb className="text-orange-500" /> Dicas
              </div>
              <ul className="list-disc list-outside pl-7 space-y-2">
                <li>Seja honesto e específico em suas respostas</li>
                <li>Use exemplos concretos quando possível</li>
                <li>Considere feedback recebido anteriormente</li>
                <li>Pense em seu crescimento ao longo do período</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Progresso por Seção</h3>
              <div className="space-y-4">
                {sections.map((s) => {
                  const done = s.questions.filter((q) => answers[q.id]).length;
                  return (
                    <div key={s.key}>
                      <div className="flex justify-between mb-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-orange-500">{s.icon}</span>
                          <span>{s.title}</span>
                        </div>
                        <span>{done}/{s.questions.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-orange-500 transition-all duration-500 ease-out"
                          style={{
                            width: `${s.questions.length === 0 ? 0 : (done / s.questions.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


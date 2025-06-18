// pages/SelfEvaluation.tsx

import { useState } from 'react';
import {
  FaStar,
  FaBullseye,
  FaUsers,
  FaChartLine,
  FaRegLightbulb,
  FaCheckCircle
} from 'react-icons/fa';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';

type Question =
  | { id: string; type: 'scale'; text: string }
  | { id: string; type: 'text'; text: string };

interface Section {
  key: string;
  title: string;
  icon: React.ReactNode;
  questions: Question[];
}

const sections: Section[] = [
  {
    key: 'tech',
    title: 'Competências Técnicas',
    icon: <FaStar />,
    questions: [
      {
        id: 'q1',
        type: 'scale',
        text: '1. Como você avalia seu domínio das ferramentas e tecnologias necessárias para sua função?'
      },
      {
        id: 'q2',
        type: 'scale',
        text: '2. Qual seu nível de conhecimento sobre os processos da empresa?'
      },
      {
        id: 'q3',
        type: 'text',
        text: '3. Descreva uma situação onde você aplicou seus conhecimentos técnicos para resolver um problema complexo.'
      }
    ]
  },
  {
    key: 'goals',
    title: 'Objetivos e Resultados',
    icon: <FaBullseye />,
    questions: [
      { id: 'q4', type: 'scale', text: '1. Você atingiu as metas definidas para o período?' },
      { id: 'q5', type: 'scale', text: '2. Qual a sua satisfação com os resultados entregues?' },
      { id: 'q6', type: 'text', text: '3. Cite um resultado específico do qual você se orgulha.' }
    ]
  },
  {
    key: 'collab',
    title: 'Colaboração e Comunicação',
    icon: <FaUsers />,
    questions: [
      { id: 'q7', type: 'scale', text: '1. Como você avalia sua capacidade de trabalhar em equipe?' },
      { id: 'q8', type: 'scale', text: '2. Como você considera sua comunicação com colegas e líderes?' },
      { id: 'q9', type: 'text', text: '3. Dê um exemplo de feedback construtivo que você deu ou recebeu.' }
    ]
  },
  {
    key: 'growth',
    title: 'Desenvolvimento Pessoal',
    icon: <FaChartLine />,
    questions: [
      { id: 'q10', type: 'scale', text: '1. Quão comprometido você está com seu próprio desenvolvimento?' },
      { id: 'q11', type: 'scale', text: '2. Você busca feedback ativamente?' },
      { id: 'q12', type: 'text', text: '3. Quais são seus próximos passos de aprendizado?' }
    ]
  }
];

export default function SelfEvaluation() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalQs = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQs = Object.keys(answers).length;

  const handleScale = (qid: string, val: number) => {
    setAnswers(a => ({ ...a, [qid]: val.toString() }));
  };
  const handleText = (qid: string, val: string) => {
    setAnswers(a => ({ ...a, [qid]: val }));
  };

  const isLastQuestion = (idx: number, arr: Question[]) => idx === arr.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header fixa */}
      <div className="fixed top-0 left-0 w-full z-50"><Header /></div>

      <main className="flex-1 pt-24 px-8 lg:px-20">
        {/* Título + Progresso Global */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">Autoavaliação Q4 2024</h1>
          <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="absolute h-2 bg-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${(answeredQs / totalQs) * 100}%` }}
            />
          </div>
        </header>

        {/* Abas de navegação */}
        <nav className="flex gap-2 mb-6 flex-wrap">
          {sections.map((section, idx) => {
            const doneCount = section.questions.filter(q => answers[q.id]).length;
            const completed = doneCount === section.questions.length;
            const isActive = idx === currentSection;
            const base = 'flex items-center gap-1 px-4 py-1 rounded-lg border';
            const activeCls = 'bg-orange-500 text-white border-orange-500';
            const doneCls = 'bg-green-100 text-green-700 border-green-200';
            const defaultCls = 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100';
            return (
              <button
                key={section.key}
                onClick={() => setCurrentSection(idx)}
                className={`${base} ${isActive ? activeCls : completed ? doneCls : defaultCls}`}
              >
                {completed && !isActive
                  ? <FaCheckCircle className="text-green-700" />
                  : section.icon
                }
                <span className="whitespace-nowrap">{section.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex gap-6">
          {/* Seção principal */}
          <section className="flex-1">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <span className="text-orange-500">{sections[currentSection].icon}</span>
                {sections[currentSection].title}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                Seção {currentSection + 1} de {sections.length}
              </p>

              {sections[currentSection].questions.map((q, idx, arr) => (
                <div
                  key={q.id}
                  className={`text-left ${!isLastQuestion(idx, arr) ? 'pb-6 mb-6 border-b border-gray-200' : ''}`}
                >
                  <label className="block font-medium mb-3">{q.text}</label>

                  {q.type === 'scale' ? (
                    <div>
                      {/* GRID de bolinhas */}
                      <div className="grid grid-cols-10 justify-items-center gap-4">
                        {[...Array(10)].map((_, i) => {
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
                                className={`
                                  appearance-none w-6 h-6 rounded-full border-2 border-orange-500
                                  relative cursor-pointer
                                  before:content-[''] before:absolute before:rounded-full before:bg-orange-500
                                  before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                                  transition-all duration-200
                                  ${checked ? 'before:w-3 before:h-3' : 'before:w-0 before:h-0'}
                                `}
                              />
                            </label>
                          );
                        })}
                      </div>

                      {/* GRID de números abaixo */}
                      <div className="grid grid-cols-10 justify-items-center gap-4 mt-1 text-xs text-gray-900">
                        {[...Array(10)].map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>

                      {/* Labels extremidades */}
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
                      onChange={e => handleText(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {/* Navegação */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setCurrentSection(i => Math.max(0, i - 1))}
                  disabled={currentSection === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  &larr; Seção Anterior
                </button>
                <button
                  onClick={() => setCurrentSection(i => (i < sections.length - 1 ? i + 1 : i))}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                  {currentSection < sections.length - 1 ? 'Próxima Seção →' : 'Enviar'}
                </button>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="w-1/3 space-y-6">
            {/* Dicas */}
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

            {/* Progresso por Seção */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Progresso por Seção</h3>
              <div className="space-y-4">
                {sections.map(s => {
                  const done = s.questions.filter(q => answers[q.id]).length;
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
                          style={{ width: `${(done / s.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

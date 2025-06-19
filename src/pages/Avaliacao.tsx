import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaStar,
  FaUsers,
  FaChartLine,
  FaCrown,
} from 'react-icons/fa';

import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import EvaluationTabs from '../components/EvaluationTabs/EvaluationTabs';
import QuestionList from '../components/QuestionList/QuestionList';
import PeerEvaluationPanel from '../components/PeerEvaluationPanel/PeerEvaluationPanel';
import ProgressSidebar from '../components/ProgressSideBar/ProgressSideBar';
import type { Section,Colleague,Answer } from '../types/evaluation';

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
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const handleAnswerChange = (
    questionId: string,
    field: 'scale' | 'justification',
    value: string
  ) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [field]: value,
      },
    }));
  };

  // Efeito para rolar a página para o topo ao mudar de seção
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  // Lógica para encontrar a seção ativa
  const currentSectionIndex = Math.max(
    sections.findIndex((s) => s.key === section),
    0
  );
  const currentSectionData = sections[currentSectionIndex];

  // Lógica para a barra de progresso geral
  const totalQs = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQs = Object.values(answers).filter(
    (answer) => answer && answer.scale && answer.justification?.trim()
  ).length;

  const handlePeerEvaluate = (peerId: string) => navigate(`/avaliarpar/${peerId}`);

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="flex-1 pt-32 px-6 lg:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Autoavaliação Q4 2024</h1>
            <div className="relative bg-gray-200 h-2 rounded-full">
              <div
                className="absolute h-2 bg-orange-500 transition-all duration-500"
                style={{ width: `${totalQs > 0 ? (answeredQs / totalQs) * 100 : 0}%` }}
              />
            </div>
          </header>

          <EvaluationTabs sections={sections} answers={answers} currentSectionIndex={currentSectionIndex} />
          
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

                {/* Renderização Condicional do Conteúdo Principal */}
                {currentSectionData.key === 'peer' ? (
                  <PeerEvaluationPanel colleagues={colleagues} onEvaluate={handlePeerEvaluate} />
                ) : currentSectionData.key === 'leader' ? (
                  <div>Painel de Avaliação de Líderes (Em breve)</div>
                ) : (
                  <QuestionList 
                    questions={currentSectionData.questions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                )}
                
                {/* Botões de Navegação */}
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
            <ProgressSidebar sections={sections} answers={answers} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useNavigate, useParams } from 'react-router-dom';
import { FaUsers, FaStar, FaBullseye, FaChartLine, FaCrown, FaCheckCircle } from 'react-icons/fa';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import type { Colleague, Section } from '../types/evaluation';
import ColleagueCard from '../components/ColleagueCard/ColleagueCard';
import Sidebar from '../components/Sidebar/Sidebar';
import InfoBox from '../components/InfoBox/InfoBox';

const colegas: Colleague[] = [
  { id: '1', nome: 'João Santos', cargo: 'Desenvolvedor Pleno', area: 'Tecnologia', tempo: '3 meses' },
  { id: '2', nome: 'Ana Rodrigues', cargo: 'Analista de Sistemas', area: 'Tecnologia', tempo: '6 meses' },
  { id: '3', nome: 'Pedro Oliveira', cargo: 'UX Designer', area: 'Design', tempo: '2 meses' },
  { id: '4', nome: 'Carla Lima', cargo: 'Product Manager', area: 'Produto', tempo: '5 meses' },
];

const sections: Section[] = [
  { key: 'tech', title: 'Competências Técnicas', icon: <FaStar />, total: 3, done: 0 },
  { key: 'goals', title: 'Objetivos e Resultados', icon: <FaBullseye />, total: 3, done: 0 },
  { key: 'collab', title: 'Colaboração e Comunicação', icon: <FaUsers />, total: 3, done: 0 },
  { key: 'growth', title: 'Desenvolvimento Pessoal', icon: <FaChartLine />, total: 3, done: 0 },
  { key: 'peer', title: 'Avaliação de Pares', icon: <FaUsers />, total: 0, done: 0 },
  { key: 'leader', title: 'Avaliação de Líderes', icon: <FaCrown />, total: 0, done: 0 },
];

export default function AvaliacaoPares() {
  const navigate = useNavigate();
  const { section } = useParams();

  const handleAvaliar = (id: string) => {
    navigate(`/avaliarpar/${id}`);
  };

  const currentSectionIndex = Math.max(
    sections.findIndex((s) => s.key === section), 0
  );

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="flex-1 pt-24 px-6 lg:px-10">
        <header className="mb-6">
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">Avaliação 360°</h1>
          <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="absolute h-2 bg-orange-500 transition-all duration-500 ease-out w-[0%]" />
          </div>
        </header>

        <nav className="flex gap-2 mb-6 flex-wrap">
          {sections.map((s) => {
            const isActive = s.key === 'peer';
            const completed = s.total > 0 && s.done === s.total;

            const base = 'flex items-center gap-1 px-4 py-1 rounded-lg border';
            const activeCls = 'bg-orange-500 text-white border-orange-500';
            const doneCls = 'bg-green-100 text-green-700 border-green-200';
            const defaultCls = 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100';

            return (
              <button
                key={s.key}
                onClick={() => {
                  if (s.key === 'peer') navigate('/avaliacaoPares');
                  else if (s.key === 'leader') navigate('/avaliacaoLideres');
                  else navigate(`/avaliacao/${s.key}`);
                }}
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
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <span className="text-orange-500"><FaUsers /></span>
                Avaliação de Pares
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                Seção {currentSectionIndex + 5} de {sections.length}
              </p>

              {/* ...Caixa azul de informação... */}
              <InfoBox icon={<FaUsers />} title="Avaliação de Pares" text="Avalie colegas que trabalharam com você por mais de 1 mês"/>
              {/* Lista de Colegas*/}
              <div className="space-y-4 mt-6">
                {colegas.map(colega => (
                  <ColleagueCard
                    key={colega.id}
                    colleague={colega}
                    onEvaluate={handleAvaliar}
                  />
                ))}
              </div>
            </div>
          </section>

          {/*BARRA LATERAL*/}
          <Sidebar sections={sections} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

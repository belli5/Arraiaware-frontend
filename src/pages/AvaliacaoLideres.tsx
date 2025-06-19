import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaStar,
  FaBullseye,
  FaChartLine,
  FaCrown,
  FaCheckCircle,
  FaRegLightbulb,
} from 'react-icons/fa';
import { useState } from 'react';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';

// Simulação dos líderes
const lideres = [
  { id: '1', nome: 'Fernanda Costa', cargo: 'Tech Lead', area: 'Tecnologia', tempo: '8 meses' },
  { id: '2', nome: 'Marcos Silva', cargo: 'Gerente de Produto', area: 'Produto', tempo: '1 ano' },
  { id: '3', nome: 'Juliana Lima', cargo: 'UX Lead', area: 'Design', tempo: '10 meses' },
];

// Abas superiores
const sections = [
  { key: 'tech', title: 'Competências Técnicas', icon: <FaStar />, total: 3, done: 0 },
  { key: 'goals', title: 'Objetivos e Resultados', icon: <FaBullseye />, total: 3, done: 0 },
  { key: 'collab', title: 'Colaboração e Comunicação', icon: <FaUsers />, total: 3, done: 0 },
  { key: 'growth', title: 'Desenvolvimento Pessoal', icon: <FaChartLine />, total: 3, done: 0 },
  { key: 'peer', title: 'Avaliação de Pares', icon: <FaUsers />, total: 0, done: 0 },
  { key: 'leader', title: 'Avaliação de Líderes', icon: <FaCrown />, total: 0, done: 0 },
];

export default function AvaliacaoLideres() {
  const navigate = useNavigate();
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const handleSelecionar = (id: string) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContinuar = (id: string) => {
    navigate(`/avaliarlider/${id}`); // Rota para avaliação individual do líder
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="flex-1 pt-24 px-6 lg:px-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">Autoavaliação Q4 2024</h1>
          <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="absolute h-2 bg-orange-500 transition-all duration-500 ease-out w-[0%]" />
          </div>
        </header>

        {/* Abas */}
        <nav className="flex gap-2 mb-6 flex-wrap">
          {sections.map((s) => {
            const isActive = s.key === 'leader';
            const hasQuestions = s.total > 0;
            const completed = hasQuestions ? s.done === s.total : false;

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
                {completed && !isActive ? (
                  <FaCheckCircle className="text-green-700" />
                ) : (
                  s.icon
                )}
                <span className="whitespace-nowrap">{s.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex gap-6">
          {/* Seção Principal */}
          <section className="flex-1">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <span className="text-orange-500"><FaCrown /></span>
                Avaliação de Líderes
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                Seção 6 de 6
              </p>

              {/* Caixa Azul */}
              <div className="bg-blue-50 p-6 rounded-lg mb-6 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <FaCrown className="text-blue-600 text-xl" />
                  <p className="font-medium text-blue-700">Avaliação de Líderes</p>
                </div>
                <p className="text-sm text-blue-600 text-center">
                  Selecione os líderes com quem você trabalhou para avaliar sua liderança e gestão.
                </p>
              </div>

              {/* Lista de Líderes */}
              <div className="space-y-4">
                {lideres.map(l => {
                  const isSelecionado = selecionados.includes(l.id);

                  return (
                    <div
                      key={l.id}
                      className={`flex justify-between items-center rounded-xl p-4
                        border ${isSelecionado ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}
                        hover:shadow-lg hover:-translate-y-1 transition transform`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelecionado}
                          onChange={() => handleSelecionar(l.id)}
                          className="w-5 h-5 accent-orange-500"
                        />
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-semibold">
                          {l.nome.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{l.nome}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span>{l.cargo}</span>
                            <span className="text-gray-400">•</span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                              {l.area}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>Trabalhando juntos há {l.tempo}</span>
                          </div>
                        </div>
                      </div>

                      {isSelecionado && (
                        <button
                          onClick={() => handleContinuar(l.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                        >
                          Avaliar →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Rodapé de Seleção */}
              <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg mt-6 px-4 py-3 flex justify-between items-center">
                <span>{selecionados.length} líder(es) selecionado(s)</span>
                <span>{selecionados.length} de {selecionados.length} avaliações completas</span>
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
                <li>Considere situações recentes de trabalho</li>
                <li>Pense no impacto da liderança no seu desenvolvimento</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Progresso por Seção</h3>
              <div className="space-y-4">
                {sections.map(s => (
                  <div key={s.key}>
                    <div className="flex justify-between mb-1 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-orange-500">{s.icon}</span>
                        <span>{s.title}</span>
                      </div>
                      <span>{s.done}/{s.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-orange-500 transition-all duration-500 ease-out"
                        style={{ width: `${s.total === 0 ? 0 : (s.done / s.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

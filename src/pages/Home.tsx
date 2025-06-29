import React, { useContext } from 'react';
import { FaRegFileAlt, FaChartLine, FaBullseye, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext)!;
  const user = auth.user;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="flex-1 pt-24 px-6 lg:px-10">
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-2">
            Olá, {user?.name || 'visitante'}! <span className="wave">👋</span>
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            Bem-vinda ao seu painel de autoavaliação, {user?.name || ''}. Seu cargo é <strong>{user?.userType || '—'}</strong>
          </p>
        </section>

        <section className="flex flex-wrap gap-6 justify-center pb-6">
          <Card
            title="Avaliações Completas"
            value="12"
            icon={<FaRegFileAlt className="text-orange-500" />}
            bgIcon="bg-orange-100"
          />
          <Card
            title="Pontuação Média"
            value="8.5"
            icon={<FaChartLine className="text-green-600" />}
            bgIcon="bg-green-100"
          />
          <Card
            title="Metas Atingidas"
            value="7/10"
            icon={<FaBullseye className="text-blue-600" />}
            bgIcon="bg-blue-100"
          />
          <Card
            title="Próxima Avaliação"
            value="15 dias"
            icon={<FaClock className="text-purple-600" />}
            bgIcon="bg-purple-100"
          />
        </section>

        <section className="flex flex-row gap-4 justify-center mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 w-[65%]">
            <div className="flex items-center mb-4 gap-2">
              <FaRegFileAlt className="text-orange-500 text-2xl" />
              <h2 className="text-xl font-semibold">Avaliação em Andamento</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Complete sua autoavaliação trimestral até <strong>30 de dezembro</strong>.
            </p>
            <p className="text-sm font-medium mb-1">Progresso</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge text="Competências" checked onClick={() => navigate('/avaliacao/tech')} />
              <Badge text="Objetivos" checked onClick={() => navigate('/avaliacao/goals')} />
              <Badge text="Desenvolvimento" onClick={() => navigate('/avaliacao/growth')} />
              <Badge text="Feedback" onClick={() => navigate('/avaliacao/collab')} />
            </div>
            <button
              onClick={() => navigate('/avaliacao/tech')}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Continuar Avaliação
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 w-[35%]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Visão Geral
            </h2>
            <Progress title="Liderança" value={8.5} />
            <Progress title="Comunicação" value={9.0} />
            <Progress title="Inovação" value={7.5} />
            <Progress title="Colaboração" value={8.8} />
          </div>
        </section>

        <section className="flex flex-row gap-4 justify-center mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 w-[65%]">
            <div className="flex items-center mb-3 gap-2">
              <FaChartLine className="text-orange-500 text-xl" />
              <h3 className="text-lg font-semibold">Avaliações Passadas</h3>
            </div>
            <ul className="space-y-2">
              <li className="bg-gray-50 p-3 rounded">
                Avaliação Q4 2024 iniciada —{' '}
                <span className="text-gray-500">há 2 dias</span>
              </li>
              <li className="bg-gray-50 p-3 rounded">
                Meta de produtividade atingida —{' '}
                <span className="text-gray-500">há 1 semana</span>
              </li>
              <li className="bg-gray-50 p-3 rounded">
                Feedback do gestor recebido —{' '}
                <span className="text-gray-500">há 2 semanas</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 w-[35%]">
            <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <div
                className="flex items-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate('/avaliacao/tech')}
              >
                <FaRegFileAlt className="text-gray-600" />
                <span className="ml-3 text-gray-800">Nova Avaliação</span>
              </div>
              <div
                className="flex items-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate('/avaliacao/goals')}
              >
                <FaChartLine className="text-gray-600" />
                <span className="ml-3 text-gray-800">Ver Resultados</span>
              </div>
              <div
                className="flex items-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate('/avaliacao/collab')}
              >
                <FaBullseye className="text-gray-600" />
                <span className="ml-3 text-gray-800">Definir Metas</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

//////////////////// COMPONENTES AUXILIARES ////////////////////

const Card = ({
  title,
  value,
  icon,
  bgIcon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgIcon: string;
}) => (
  <div
    className="bg-white rounded-xl shadow-md p-6  w-[23%] flex justify-between items-center
               hover:shadow-lg hover:-translate-y-1 transform transition duration-300"
  >
    <div className="flex flex-col items-start">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-5 rounded-lg ${bgIcon}`}>{icon}</div>
  </div>
);

const Badge = ({
  text,
  checked,
  onClick,
}: {
  text: string;
  checked?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
      checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    } hover:brightness-95 transition`}
  >{text} {checked && '✓'}</div>
);

const Progress = ({ title, value }: { title: string; value: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span>{title}</span>
      <span className="text-sm">{value}/10</span>
    </div>
    <div className="w-full bg-gray-200 h-2 rounded-full">
      <div
        className="bg-orange-500 h-2 rounded-full"
        style={{ width: `${(value / 10) * 100}%` }}
      />
    </div>
  </div>
);

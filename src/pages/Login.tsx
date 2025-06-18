import HeaderLogin from '../components/Header/Header_login';
import { FaRegSmile, FaChartLine, FaTrophy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate(); // Iniciando a navegação

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    navigate('/Home'); // Redireciona para a página inicial
  };

  return (
    <div className="min-h-screen bg-orange-100 flex flex-col"> {/* Flexbox no container principal */}
      {/* Header */}
      <HeaderLogin />

      {/* Corpo da Página */}
      <div className="flex flex-1 justify-center items-center overflow-hidden">
        {/* Coluna da esquerda */}
        <div className="w-full lg:w-2/3 flex flex-col justify-center text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Autoavaliação <span className="text-orange-500">Inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Desenvolva seu potencial profissional com nossa plataforma moderna de autoavaliação. Acompanhe seu crescimento e identifique oportunidades de melhoria.
          </p>

          {/* Cards de funcionalidades */}
          <div className="flex justify-center gap-16 mb-20">
            <div className="text-center flex flex-col items-center">
              <div className="mb-2 text-orange-500">
                <FaRegSmile size={40} />
              </div>
              <h3 className="font-semibold text-gray-800">Fácil de Usar</h3>
              <p className="text-gray-600">Interface intuitiva e moderna</p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="mb-2 text-orange-500">
                <FaChartLine size={40} />
              </div>
              <h3 className="font-semibold text-gray-800">Acompanhamento</h3>
              <p className="text-gray-600">Monitore seu progresso</p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="mb-2 text-orange-500">
                <FaTrophy size={40} />
              </div>
              <h3 className="font-semibold text-gray-800">Resultados</h3>
              <p className="text-gray-600">Insights personalizados</p>
            </div>
          </div>
        </div>

        {/* Coluna da direita (formulário de login) */}
        <div className="w-full lg:w-1/5 bg-white p-8 shadow-md rounded-lg mx-4 lg:mx-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Acesse sua conta</h2>
          <form onSubmit={handleLogin}> {/* Adicionando onSubmit para chamar handleLogin */}
            <div className="mb-2">
              <label htmlFor="email" className="block text-gray-700">E-mail</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="seu.email@empresa.com"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="senha" className="block text-gray-700">Senha</label>
              <input
                type="password"
                id="senha"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Sua senha"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-600">Lembrar-me</span>
              </div>
              <a href="#" className="text-sm text-orange-500">Esqueceu a senha?</a>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Entrar
            </button>
            <p className="text-center mt-4 text-gray-600">
              Não tem uma conta? <a href="#" className="text-orange-500">Fale com RH</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

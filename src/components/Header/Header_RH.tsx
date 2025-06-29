import { Bell, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../imagens/logo_arraiware.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 bg-gradient-to-br from-white to-orange-300 shadow-md z-50">
      <div className="w-full flex items-center justify-between px-6 py-4">
        {/* LOGO + NAVEGAÇÃO */}
        <div className="flex items-center space-x-8">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <img
              src={logo}
              alt="ArraiaWare logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-semibold text-gray-800">
              ArraiaWare
            </span>
          </div>

          <nav>
            <ul className="flex space-x-6 text-gray-900">
              <li>
                <button
                  onClick={() => navigate('/home')}
                  className="hover:text-orange-500 hover:opacity-90"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/avaliacao/tech')}
                  className="hover:text-orange-500"
                >
                  Avaliação
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/avaliacao/goals')}
                  className="hover:text-orange-500"
                >
                  Resultados
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/avaliacao/growth')}
                  className="hover:text-orange-500"
                >
                  Metas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/home')}
                  className="hover:text-orange-500 hover:opacity-90"
                >
                  Painel RH
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* ÍCONES + PERFIL */}
        <div className="flex items-center space-x-6">
          <Bell
            className="h-6 w-6 text-gray-600 hover:text-orange-500 transition cursor-pointer"
            onClick={() => alert('Você clicou nas notificações!')}
          />
          <Settings
            className="h-6 w-6 text-gray-600 hover:text-orange-500 transition cursor-pointer"
            onClick={() => alert('Configurações futuras!')}
          />
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-orange-200 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-gray-800 font-medium">Maria Silva</span>
          </div>
        </div>
      </div>
    </header>
  );
}

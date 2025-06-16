import { Bell, Settings, User } from "lucide-react";
import logo from "../../imagens/logo_arraiware.png";

export default function HeaderDashboard() {
  return (
    <header className="fixed inset-x-0 top-0 bg-white shadow-md z-50">
      <div className="w-full flex items-center justify-between px-6 py-4">
        {/* LOGO + NAVEGAÇÃO */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
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
            <ul className="flex space-x-6 text-gray-600">
              <li>
                <a
                  href="/Home"
                  className="hover:text-orange-500 font-medium hover:opacity-90"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/avaliacao"
                  className="hover:text-orange-500"
                >
                  Avaliação
                </a>
              </li>
              <li>
                <a
                  href="/resultados"
                  className="hover:text-orange-500"
                >
                  Resultados
                </a>
              </li>
              <li>
                <a
                  href="/metas"
                  className="hover:text-orange-500"
                >
                  Metas
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* ÍCONES + PERFIL */}
        <div className="flex items-center space-x-6">
          <Bell className="h-6 w-6 text-gray-600 hover:text-brand-orange transition" />
          <Settings className="h-6 w-6 text-gray-600 hover:text-brand-orange transition" />
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-brand-orange rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-800 font-medium">Maria Silva</span>
          </div>
        </div>
      </div>
    </header>
  );
}

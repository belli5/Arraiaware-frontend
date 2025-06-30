import { Bell, Settings, User } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../imagens/logo_arraiware.png";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const linkClass = (isActive: boolean) =>
    `px-2 py-1 rounded font-medium ${
      isActive
        ? "text-orange-500"
        : "text-gray-900 hover:text-orange-500"
    }`;

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
            <ul className="flex space-x-6">
              <li>
                <NavLink to="/home" end className={({ isActive }) => linkClass(isActive)}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/avaliacao/comportamento" className={({ isActive }) => linkClass(isActive)}>
                  Avaliação
                </NavLink>
              </li>
              <li>
                <NavLink to="/avaliacao/goals" className={({ isActive }) => linkClass(isActive)}>
                  Resultados
                </NavLink>
              </li>
              <li>
                <NavLink to="/avaliacao/growth" className={({ isActive }) => linkClass(isActive)}>
                  Metas
                </NavLink>
              </li>

              {user?.userType?.toLowerCase() === 'admin' && (
                <li>
                  <NavLink to="/RH" className={({ isActive }) => linkClass(isActive)}>
                    Painel RH
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="/gestor" className={({ isActive }) => linkClass(isActive)}>
                  Painel Gestor
                </NavLink>
              </li>

              {user?.userType?.toLowerCase() === 'admin' && (
                <li>
                  <NavLink to="/comite" className={({ isActive }) => linkClass(isActive)}>
                    Painel Comitê
                  </NavLink>
                </li>
              )}
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
            <span className="text-gray-800 font-medium">
              {user?.name || 'Usuário'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

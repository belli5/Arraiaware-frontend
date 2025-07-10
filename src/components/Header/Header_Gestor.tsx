// src/components/Header/Header_Gestor.tsx
import { useEffect, useState } from "react";
import { Bell, Settings, User, X } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../../../imagens/logo_arraiware.png";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    localStorage.clear();
    setShowConfig(false);
    navigate("/login");
  }

  const linkClass = (isActive: boolean) =>
    `px-2 py-1 rounded font-medium ${
      isActive ? "text-orange-500" : "text-gray-900 hover:text-orange-500"
    }`;

  return (
    <>
      {/* Header fixo */}
      <header className="fixed inset-x-0 top-0 bg-gradient-to-br from-white to-orange-300 shadow-md z-50">
        <div className="w-full flex items-center justify-between px-6 py-4">
          {/* LOGO + NAVEGAÇÃO */}
          <div className="flex items-center space-x-8">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate("/home")}
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
                  <NavLink
                    to="/avaliacao/comportamento"
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    Avaliação
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/avaliacao/growth"
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    Metas
                  </NavLink>
                </li>
                {user?.userType?.toLowerCase() === "admin" && (
                  <li>
                    <NavLink
                      to="/rh"
                      className={({ isActive }) => linkClass(isActive)}
                    >
                      Painel RH
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/gestor"
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    Painel Gestor
                  </NavLink>
                </li>
                {user?.userType?.toLowerCase() === "admin" && (
                  <li>
                    <NavLink
                      to="/comite"
                      className={({ isActive }) => linkClass(isActive)}
                    >
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
              onClick={() => alert("Você clicou nas notificações!")}
            />
            <Settings
              className="h-6 w-6 text-gray-600 hover:text-orange-500 transition cursor-pointer"
              onClick={() => setShowConfig(true)}
            />
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-orange-200 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-gray-800 font-medium">
                {user?.name || "Usuário"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`
          fixed inset-0  bg-opacity-30 z-40 transition-opacity duration-300
          ${showConfig ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setShowConfig(false)}
      />

      {/* Sidebar de Configurações com animação */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-64 bg-orange-50 shadow-lg z-50 p-6 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${showConfig ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <X
            className="h-6 w-6 cursor-pointer text-gray-600"
            onClick={() => setShowConfig(false)}
          />
        </div>

        {/* Avatar e informações do usuário */}
        {user && (
          <div className="flex flex-col items-center mb-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar do usuário"
                className="h-16 w-16 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="p-4 bg-orange-100 rounded-full mb-2">
                <User className="h-8 w-8 text-gray-600" />
              </div>
            )}
            <p className="text-gray-800 font-medium text-center">
              {user.name}
            </p>
            {user.email && (
              <p className="text-sm text-gray-500 text-center truncate">
                {user.email}
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-auto bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Logout
        </button>
      </aside>
    </>
  );
}

// src/components/Header/Header_geral.tsx
import React, { useEffect, useState } from "react";
import { Bell, Settings, User, X } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../../../imagens/logo_arraiware.png";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // controla se a sidebar de configurações está aberta
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // função de logout
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
      <header className="fixed inset-x-0 top-0 bg-gradient-to-br from-white to-orange-300 shadow-md z-50">
        <div className="w-full flex items-center justify-between px-6 py-4">
          {/* LOGO + NAVEGAÇÃO */}
          <div className="flex items-center space-x-8">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <img src={logo} alt="ArraiaWare logo" className="h-10 w-auto" />
              <span className="text-2xl font-semibold text-gray-800">
                ArraiaWare
              </span>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <NavLink to="/home" className={({ isActive }) => linkClass(isActive)}>
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
                  <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
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
                {(user?.userType === "RH" || user?.userType === "ADMIN") && (
                  <li>
                    <NavLink to="/rh" className={({ isActive }) => linkClass(isActive)}>
                      Painel RH
                    </NavLink>
                  </li>
                )}
                {(user?.userType === "GESTOR" || user?.userType === "ADMIN") && (
                  <li>
                    <NavLink
                      to="/gestor"
                      className={({ isActive }) => linkClass(isActive)}
                    >
                      Painel Gestor
                    </NavLink>
                  </li>
                )}
                {user?.userType === "ADMIN" && (
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
              className="h-6 w-6 text-gray-600 hover:text-orange-500 cursor-pointer"
              onClick={() => alert("Você clicou nas notificações!")}
            />
            <Settings
              className="h-6 w-6 text-gray-600 hover:text-orange-500 cursor-pointer"
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

      {/* SIDEBAR DE CONFIGURAÇÕES */}
      {showConfig && (
        <>
          {/* backdrop semi-transparente */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setShowConfig(false)}
          />
          {/* painel lateral */}
          <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Configurações</h2>
              <X
                className="h-6 w-6 cursor-pointer text-gray-600"
                onClick={() => setShowConfig(false)}
              />
            </div>
            <button
              onClick={handleLogout}
              className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </aside>
        </>
      )}
    </>
  );
}

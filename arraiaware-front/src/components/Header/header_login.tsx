import logo from "../../../imagens/logo_arraiware.png";

export default function HeaderLogin() {
  return (
    <header className="fixed inset-x-0 top-0 bg-white shadow-md z-50">
      <div className="w-full flex items-center justify-between px-8 py-5">
        {/* LOGO + NOME */}
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

        {/* NAVEGAÇÃO */}
        <nav>
          <ul className="flex space-x-8 text-gray-600 text-lg">
            <li>
              <a
                href="#sobre"
                className="hover:text-orange-500 transition-colors"
              >
                Sobre
              </a>
            </li>
            <li>
              <a
                href="#recursos"
                className="hover:text-orange-500 transition-colors"
              >
                Recursos
              </a>
            </li>
            <li>
              <a
                href="#suporte"
                className="hover:text-orange-500 transition-colors"
              >
                Suporte
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

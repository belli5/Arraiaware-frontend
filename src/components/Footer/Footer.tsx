// components/Footer.tsx
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center">
        {/* Esquerda: copyright */}
        <span className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ArraiaWare. Todos os direitos reservados.
        </span>

        {/* Centro: links */}
        <nav className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">Sobre</a>
          <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">Contato</a>
          <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">Política de Privacidade</a>
        </nav>

        {/* Direita: redes sociais */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

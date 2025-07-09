import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string; // Para controlar a largura (ex: 'w-[95%]', 'max-w-4xl')
  height?: string; // Para controlar a altura (ex: 'h-[90vh]', 'max-h-[85vh]')
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = 'w-full max-w-2xl', 
  height = ''                  
}: ModalProps) {
  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      
      <div 
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div 
        className={`relative bg-white rounded-lg shadow-xl ${width} ${height} flex flex-col`}
        onClick={(e) => e.stopPropagation()} // Impede que cliques dentro do modal o fechem.
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination, DOTS } from '../../hooks/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string; 
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const paginationRange = usePagination({ currentPage, totalPages });
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3 sm:px-6">
      <div>
        <p className="text-sm text-gray-700">
          Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {/* Botão Anterior */}
          <button
            onClick={onPrevious}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* --- 👇 LÓGICA PARA RENDERIZAR OS NÚMEROS DAS PÁGINAS 👇 --- */}
          {paginationRange.map((pageNumber, index) => {
            // Se o item for "...", renderiza as reticências
            if (pageNumber === DOTS) {
              return <span key={`dots-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
            }

            // Define o estilo do botão de página atual
            const isActive = pageNumber === currentPage;
            const activeClasses = 'z-10 bg-orange-50 border-orange-500 text-orange-600';
            const defaultClasses = 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50';

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber as number)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${isActive ? activeClasses : defaultClasses}`}
              >
                {pageNumber}
              </button>
            );
          })}
          
          {/* Botão Próxima */}
          <button
            onClick={onNext}
            disabled={currentPage === lastPage}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
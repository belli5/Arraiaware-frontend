export default function TrackCriteriaSkeleton() {
  return (
    // O contêiner principal imita o do TrackCriteria, com a mesma borda e padding
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      {/* Placeholder para o Cabeçalho da Trilha */}
      <div className="flex justify-between items-start">
        <div>
          {/* Placeholder para o nome da trilha (texto grande) */}
          <div className="h-6 bg-gray-300 rounded-md w-48 mb-2"></div>
          {/* Placeholder para o departamento (texto pequeno) */}
          <div className="h-4 bg-gray-200 rounded-md w-32"></div>
        </div>
        {/* Placeholder para o contador de critérios */}
        <div className="h-6 bg-gray-200 rounded-md w-24"></div>
      </div>

      {/* Placeholder para a linha de Ações da Trilha */}
      <div className="flex justify-end mt-4">
        <div className="h-8 bg-gray-300 rounded-md w-40"></div>
      </div>

      {/* Placeholder para a Lista de Critérios */}
      <div className="mt-4 space-y-3">
        {/* Placeholder para o título "Critérios Configurados:" */}
        <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>

        {/* Repetimos um critério falso algumas vezes para dar volume */}
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="p-3 bg-gray-100 rounded-md">
            {/* Placeholder para o nome do critério e o badge */}
            <div className="flex items-center gap-3">
              <div className="h-5 bg-gray-300 rounded-md w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            </div>
            {/* Placeholder para a descrição */}
            <div className="h-4 bg-gray-300 rounded-md w-full mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
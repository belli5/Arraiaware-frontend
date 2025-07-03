export default function CommitteeEvaluationsTableSkeleton() {
  const skeletonRows = Array.from({ length: 10 }); // Cria 10 linhas de skeleton

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      {/* Skeleton do Header e Busca */}
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="relative mb-6" style={{ maxWidth: '400px' }}>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>

      {/* Skeleton da Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Cabeçalhos da tabela podem ser reais ou skeletons */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autoav.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pares</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Líderes</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Final</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {skeletonRows.map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Skeleton da Paginação */}
      <div className="flex justify-between items-center mt-6">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}
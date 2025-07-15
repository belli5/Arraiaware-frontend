export default function HistoryPanelSkeleton() {
  const skeletonRows = Array.from({ length: 4 }); // Mostra 4 linhas "fantasma"

  return (
    <div className="border border-gray-200 rounded-lg animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Placeholders para os cabeçalhos */}
              <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-24"></div></th>
              <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-32"></div></th>
              <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-20"></div></th>
              <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-28"></div></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {skeletonRows.map((_, index) => (
              <tr key={index}>
                {/* Placeholders para as células de cada linha */}
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-300 rounded-full"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
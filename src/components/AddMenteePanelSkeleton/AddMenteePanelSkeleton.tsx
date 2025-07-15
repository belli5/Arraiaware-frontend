// components/AddMenteePanel/AddMenteePanelSkeleton.tsx

import React from 'react';

// Skeleton para uma única linha da tabela de usuários
const TableRowSkeleton: React.FC = () => (
  <tr className="animate-pulse">
    {/* Avatar e Nome */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="ml-4 space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
        </div>
      </div>
    </td>
    {/* Tipo de Usuário */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </td>
    {/* Ação */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex justify-center">
        <div className="h-8 w-24 bg-gray-200 rounded-md" />
      </div>
    </td>
  </tr>
);

const AddMenteePanelSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
      {/* Skeleton para o cabeçalho */}
      <div className="animate-pulse">
        <div className="h-7 w-1/3 bg-gray-200 rounded-md" />
        <div className="h-5 w-1/2 bg-gray-200 rounded-md mt-2" />
      </div>

      {/* Skeleton para os filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 mt-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>

      {/* Skeleton para a tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Usuário</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Renderiza 5 linhas de skeleton para preencher a tabela */}
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddMenteePanelSkeleton;
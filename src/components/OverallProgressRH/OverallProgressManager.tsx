import type { ManagerDashboardData } from "../../types/manager"; 

interface OverallProgressManagerProps {
  summary: ManagerDashboardData['summary'];
}

export default function OverallProgressManager({ summary }: OverallProgressManagerProps) {
  const progressPercentage = Math.round(summary?.overallProgress || 0);

  return (
    <div className="text-left bg-white p-6 rounded-lg shadow-sm mt-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Progresso Geral das Avaliações</h2>
        <p className="text-sm text-gray-500 font-semibold">Acompanhe o andamento das avaliações dos seus liderados</p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-gray-600">Progresso Geral</span>
          <span className="text-sm font-bold text-gray-800">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
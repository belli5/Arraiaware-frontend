// src/components/OverallProgress/OverallProgress.tsx

export default function OverallProgress() {
  const completed = 89;
  const pending = 61;
  const overdue = 12;
  const total = completed + pending + overdue;
  const progressPercentage = Math.round((completed / total) * 100);

  return (
    <div className="text-left bg-white p-6 rounded-lg shadow-sm mt-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Progresso Geral das Avaliações</h2>
        <p className="text-sm text-gray-500 font-semibold">Acompanhe o andamento das avaliações em tempo real</p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-gray-600">Progresso Geral</span>
          <span className="text-sm font-bold text-gray-800">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center space-x-6 md:space-x-10 mt-4 text-base font-medium text-gray-600 flex-wrap">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span>Concluídas ({completed})</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
          <span>Pendentes ({pending})</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span>Em Atraso ({overdue})</span>
        </div>
      </div>
    </div>
  );
}
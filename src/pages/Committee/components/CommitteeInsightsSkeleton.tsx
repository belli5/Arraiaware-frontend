import React from 'react';

// Skeleton para um único card de KPI
const KpiCardSkeleton: React.FC = () => (
  <div className="bg-gray-200 p-6 rounded-xl h-28" />
);

// Skeleton para um único gráfico
const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    {/* Placeholder para o título do gráfico */}
    <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-6" />
    {/* Placeholder para a área do gráfico */}
    <div className="h-[300px] bg-gray-200 rounded-md" />
  </div>
);

const CommitteeInsightsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 1. Skeleton para a seção de KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>

      {/* 2. Skeleton para a seção de gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <ChartSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CommitteeInsightsSkeleton;
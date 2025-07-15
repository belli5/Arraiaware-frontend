import React from 'react';
import {
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { useCommitteeInsightsLogic } from '../../hooks/useCommiteeInsightsLogic';
import CommitteeInsightsSkeleton from '../CommitteeInsightsSkeleton/CommitteeInsightsSkeleton';

const KpiCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-4xl font-bold text-orange-500 mt-1">{value}</p>
  </div>
);

const ChartWrapper: React.FC<{ title: string; children: React.ReactElement }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </div>
);

const CommitteeInsightsPanel: React.FC = () => {
  const { insightsData, isLoading, notification } = useCommitteeInsightsLogic();

  if (isLoading) {
    return <CommitteeInsightsSkeleton />;
  }

  if (notification) {
    return <div className="text-center p-10 text-red-600">Erro: {notification.message}</div>;
  }

  if (!insightsData) {
    return <div className="text-center p-10">Nenhum dado de insight encontrado.</div>;
  }

  const evaluationData = insightsData.cycles.map(cycle => ({
  ...cycle,
  totalEvaluations: cycle.readyEvaluations + cycle.pendingEvaluations,
  completionRate: ((cycle.readyEvaluations / (cycle.readyEvaluations + cycle.pendingEvaluations)) * 100).toFixed(0) + '%',
}));

  return (
    <div className="space-y-8">
      {/* 1. SEÇÃO DE DADOS GERAIS (KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <KpiCard title="Nota Média Geral" value={insightsData.score.toFixed(1)} />
        <KpiCard title="Total de Ciclos" value={insightsData.cyclesAmount} />
        <KpiCard title="Total de Colaboradores Ativos" value={insightsData.activeCollaborators} />
        <KpiCard title="Total de Projetos" value={insightsData.projectsAmount} />
      </div>

      {/* 2. SEÇÃO DOS GRÁFICOS DE EVOLUÇÃO */}
       <div className="grid grid-cols-2 gap-8">
        
        <ChartWrapper title="Nota Média por Ciclo">
          <LineChart data={insightsData.cycles} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycleName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="overallAverage" name="Nota Média" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ChartWrapper>

        <ChartWrapper title="Avaliações Completas por Ciclo">
          <BarChart data={evaluationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycleName" />
            <YAxis />
            <Tooltip formatter={(value, name) => [name === "Taxa de Conclusão" ? `${value}%` : value, name]}/>
            <Legend />
            <Bar dataKey="readyEvaluations" name="Avaliações Concluídas" fill="#fb923c" />
            <Bar dataKey="totalEvaluations" name="Total de Avaliações" fill="#8884d8" />
          </BarChart>
        </ChartWrapper>

        <ChartWrapper title="Colaboradores Ativos por Ciclo">
           <LineChart data={insightsData.cycles} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycleName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalCollaborators" name="Colaboradores" stroke="#10b981" strokeWidth={2}/>
          </LineChart>
        </ChartWrapper>

        <ChartWrapper title="Projetos Ativos por Ciclo">
           <LineChart data={insightsData.cycles} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycleName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="projectsInCycle" name="Projetos" stroke="#3b82f6" strokeWidth={2}/>
          </LineChart>
        </ChartWrapper>

      </div>
    </div>
  );
};

export default CommitteeInsightsPanel;
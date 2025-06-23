import StatCard from '../StatCard/StatCard';
import { Users, BarChart2, FileText, Loader2 } from 'lucide-react';


const stats = {
  prontas: 6,            // puxa da api
  mediaGeral: 8.7,
  totalAvaliados: 6,
  pendentes: 1,
};

const CommitteeStatsGrid = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
            title="Avaliações Prontas para Equalização"
            value={stats.prontas.toString()}
            subtitle="Colaboradores completos"
            Icon={FileText} 
        />
        <StatCard
            title="Média Geral de Performance"
            value={stats.mediaGeral.toFixed(1)}
            subtitle="Média das avaliações concluídas"
            Icon={BarChart2}
            borderColor="border-indigo-500"
            valueColor="text-indigo-500"
            iconColor="text-indigo-500"
        />
            <StatCard
            title="Total de Avaliados"
            value={stats.totalAvaliados.toString()}
            subtitle="Colaboradores no ciclo atual"
            Icon={Users}
            borderColor="border-orange-500"
            valueColor="text-orange-500"
            iconColor="text-orange-500"
        />
            <StatCard
            title="Avaliações Pendentes"
            value={stats.pendentes.toString()}
            subtitle="Aguardando conclusão"
            Icon={Loader2}
            borderColor="border-yellow-500"
            valueColor="text-yellow-500"
            iconColor="text-yellow-500"
        />
    </div>
  );
};

export default CommitteeStatsGrid;
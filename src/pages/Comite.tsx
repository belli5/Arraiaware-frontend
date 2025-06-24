import { useState, useRef } from 'react';
import Header from '../components/Header/Header_comite';
import Footer from '../components/Footer/Footer';
import CommitteeStatsGrid from '../components/CommitteeStatsGrid/CommitteeStatsGrid';
import DataExportPanel from '../components/DataExportPanel/DataExportPanel'
import CommitteeInsightsPanel from '../components/CommitteeInsightsPanel/CommitteeInsightsPanel';
import type { CommitteeTab, ColaboradorAvaliacao } from '../types/committee';
import Tabs from '../components/Tabs/Tabs';
import type { Tab } from '../types/tabs';
import { DownloadCloud, BarChart2, CheckCircle2 } from 'lucide-react';

const committeeTabOptions: Tab[] = [
  { id: 'equalizacao', label: 'Equalização por Colaborador', icon: <CheckCircle2 size={18} /> },
  { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> },
  { id: 'exportacao', label: 'Exportar Dados', icon: <DownloadCloud size={18} /> },
];

const mockColaboradores: ColaboradorAvaliacao[] = [
  { id: 'emp001', nome: 'Ana Costa', cargo: 'Dev Frontend Jr.', status: 'Completo', autoavaliacaoMedia: 8.5, paresMedia: 7.8, lideresMedia: 8.2 },
  { id: 'emp002', nome: 'Bruno Silva', cargo: 'Dev Backend Pl.', status: 'Completo', autoavaliacaoMedia: 9.0, paresMedia: 8.5, lideresMedia: 8.7 },
  { id: 'emp003', nome: 'Carla Souza', cargo: 'UX Designer', status: 'Parcial', autoavaliacaoMedia: 7.2, paresMedia: 6.9, lideresMedia: 0 },
  { id: 'emp004', nome: 'Daniel Lima', cargo: 'Scrum Master', status: 'Completo', autoavaliacaoMedia: 8.8, paresMedia: 8.9, lideresMedia: 9.1 },
  { id: 'emp005', nome: 'Eduarda Alves', cargo: 'Dev Fullstack Sr.', status: 'Completo', autoavaliacaoMedia: 9.5, paresMedia: 9.2, lideresMedia: 9.3 },
  { id: 'emp006', nome: 'Felipe Dias', cargo: 'DevOps Eng.', status: 'Pendente', autoavaliacaoMedia: 0, paresMedia: 0, lideresMedia: 0 },
];

// Componente para a Tabela de Equalização (simplificada)
const EqualizationTable: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Status de Avaliação dos Colaboradores</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Colaborador
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cargo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Autoav. Média
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pares Média
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Líderes Média
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockColaboradores.map((colaborador) => (
            <tr key={colaborador.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {colaborador.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {colaborador.cargo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${colaborador.status === 'Completo' ? 'bg-green-100 text-green-800' :
                    colaborador.status === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`
                }>
                  {colaborador.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {colaborador.autoavaliacaoMedia > 0 ? colaborador.autoavaliacaoMedia.toFixed(1) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {colaborador.paresMedia > 0 ? colaborador.paresMedia.toFixed(1) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {colaborador.lideresMedia > 0 ? colaborador.lideresMedia.toFixed(1) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-orange-600 hover:text-orange-900">Ver Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-4 text-sm text-gray-500">
      *Status de avaliação indica se todas as autoavaliações, de pares e de líderes foram preenchidas.
    </p>
  </div>
);

export default function Comite() {
  const [activeTab, setActiveTab] = useState<CommitteeTab>('equalizacao');
  const contentPanelRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as CommitteeTab);
    setTimeout(() => {
      if (contentPanelRef.current) {
        contentPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-24 px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          {/* Cards de Estatísticas para o Comitê */}
          <CommitteeStatsGrid /> 

          {/* Abas de Navegação do Comitê */}
          <Tabs
            tabs={committeeTabOptions}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            className="mb-4"
          />

          {/* Conteúdo das Abas */}
          <div ref={contentPanelRef} className="mt-[-1px]">
            {activeTab === 'equalizacao' && <EqualizationTable />}
            {activeTab === 'insights' && <CommitteeInsightsPanel />}
            {activeTab === 'exportacao' && <DataExportPanel />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
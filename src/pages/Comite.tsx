import { useState, useRef } from 'react';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import StatCard from '../components/StatCard/StatCard'; // Reutilizando StatCard do RH
import { DownloadCloud, Loader2, Users, BarChart2, FileText, CheckCircle2 } from 'lucide-react'; // Novos ícones

// Mock de dados para simular as abas do comitê
type CommitteeTab = 'equalizacao' | 'insights' | 'exportacao';

// Componente simples para as abas do comitê (você pode reutilizar o Tabs.tsx do RH e adaptar)
interface CommitteeTabsProps {
  activeTab: CommitteeTab;
  setActiveTab: (tab: CommitteeTab) => void;
  className?: string;
}

const CommitteeTabs: React.FC<CommitteeTabsProps> = ({ activeTab, setActiveTab, className }) => {
  const tabs: { id: CommitteeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'equalizacao', label: 'Equalização por Colaborador', icon: <CheckCircle2 size={18} /> },
    { id: 'insights', label: 'Insights Comparativos', icon: <BarChart2 size={18} /> },
    { id: 'exportacao', label: 'Exportar Dados', icon: <DownloadCloud size={18} /> },
  ];

  return (
    <nav className={`flex border-b border-gray-200 mt-8 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            py-3 px-6 text-sm font-medium flex items-center gap-2
            ${activeTab === tab.id
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            transition-colors duration-200
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
};


// Mock de dados para a tabela de equalização
interface ColaboradorAvaliacao {
  id: string;
  nome: string;
  cargo: string;
  status: 'Completo' | 'Parcial' | 'Pendente';
  autoavaliacaoMedia: number;
  paresMedia: number;
  lideresMedia: number;
}

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


// Componente para a seção de Insights (placeholder)
const CommitteeInsightsPanel: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Insights Comparativos</h3>
    <p className="text-gray-600 mb-4">
      Esta seção será desenvolvida em futuras iterações para fornecer gráficos e análises avançadas sobre o desempenho dos colaboradores e da organização.
    </p>
    <p className="text-sm text-gray-500">
      *Funcionalidade em desenvolvimento.*
    </p>
  </div>
);


export default function Comite() {
  const [activeTab, setActiveTab] = useState<CommitteeTab>('equalizacao');
  const contentPanelRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: CommitteeTab) => {
    setActiveTab(tab);
    setTimeout(() => {
      if (contentPanelRef.current) {
        contentPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage('Preparando a exportação... Isso pode levar alguns segundos.');

    try {
      // Simula uma chamada de API ao backend para exportar as avaliações
      // Em um cenário real, você faria uma requisição HTTP para um endpoint de exportação:
      // const response = await fetch('/api/committee/export-full-evaluations', { method: 'GET' });
      // if (!response.ok) throw new Error('Falha na exportação');
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `avaliacoes_consolidadas_RPE_${new Date().toISOString().slice(0, 10)}.xlsx`; // Nome do arquivo com data e formato Excel
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // window.URL.revokeObjectURL(url);

      // Simulação de delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 3000));

      setExportMessage('Exportação concluída com sucesso! O download deve ter iniciado.');

    } catch (error) {
      console.error('Erro ao exportar avaliações:', error);
      setExportMessage('Erro ao realizar a exportação. Tente novamente mais tarde.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMessage(''), 5000); // Limpa a mensagem após 5 segundos
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-24 px-8 lg:px-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          {/* Cards de Estatísticas para o Comitê */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Avaliações Prontas para Equalização"
              value="5"
              subtitle="Colaboradores completos"
              Icon={FileText} // Ícone de documento
            />
            <StatCard
              title="Média Geral de Performance"
              value="8.7"
              subtitle="Média das avaliações concluídas"
              Icon={BarChart2}
              borderColor="border-indigo-500"
              valueColor="text-indigo-500"
              iconColor="text-indigo-500"
            />
             <StatCard
              title="Total de Avaliados"
              value="6"
              subtitle="Colaboradores no ciclo atual"
              Icon={Users}
              borderColor="border-orange-500"
              valueColor="text-orange-500"
              iconColor="text-orange-500"
            />
             <StatCard
              title="Avaliações Pendentes"
              value="1"
              subtitle="Aguardando conclusão"
              Icon={Loader2}
              borderColor="border-yellow-500"
              valueColor="text-yellow-500"
              iconColor="text-yellow-500"
            />
          </div>

          {/* Abas de Navegação do Comitê */}
          <CommitteeTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            className="mb-8"
          />

          {/* Conteúdo das Abas */}
          <div ref={contentPanelRef} className="mt-[-1px]">
            {activeTab === 'equalizacao' && <EqualizationTable />}
            {activeTab === 'insights' && <CommitteeInsightsPanel />}
            {activeTab === 'exportacao' && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                    <DownloadCloud className="text-orange-500" size={28} />
                    Exportar Avaliações Completas
                  </h2>
                </div>

                <p className="text-gray-600 mb-6">
                  Esta funcionalidade permite que você baixe um arquivo contendo todas as autoavaliações, avaliações de pares e avaliações de líderes, incluindo notas e justificativas, para análise offline em formatos como CSV ou Excel.
                </p>

                <div className="flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`
                      px-8 py-3 rounded-lg text-white font-semibold flex items-center gap-3 transition-all duration-300
                      ${isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}
                    `}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <DownloadCloud size={20} />
                        Baixar Avaliações
                      </>
                    )}
                  </button>
                  {exportMessage && (
                    <p className={`mt-2 text-sm ${exportMessage.startsWith('Erro') ? 'text-red-500' : 'text-gray-600'}`}>
                      {exportMessage}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
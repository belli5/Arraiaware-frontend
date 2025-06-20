import { useState } from 'react';
import Header from '../components/Header/Header_geral';
import Footer from '../components/Footer/Footer';
import { DownloadCloud, Loader2 } from 'lucide-react';

export default function Comite() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage('Preparando a exportação... Isso pode levar alguns segundos.');

    try {
      // Simula uma chamada de API ao backend para exportar as avaliações
      // Em um cenário real, você faria uma requisição HTTP para um endpoint de exportação:
      // const response = await fetch('/api/evaluations/export', { method: 'GET' });
      // const blob = await response.blob(); // Receber o arquivo como Blob
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'avaliacoes_completas_RPE.csv'; // Nome do arquivo
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // window.URL.revokeObjectURL(url);

      // Simulação de delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 3000));

      setExportMessage('Exportação concluída com sucesso! O download deve ter iniciado.');
      // Opcional: Aqui você pode ter um link ou um evento que realmente inicie o download
      // Para fins de demonstração, vamos apenas mudar a mensagem e desativar o carregamento.

    } catch (error) {
      console.error('Erro ao exportar avaliações:', error);
      setExportMessage('Erro ao realizar a exportação. Tente novamente mais tarde.');
    } finally {
      setIsExporting(false);
      // A mensagem pode desaparecer após um tempo ou ser um modal
      setTimeout(() => setExportMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-24 px-8 lg:px-20">
        <div className="max-w-[1200px] mx-auto py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Painel do Comitê de Equalização</h1>
            <p className="text-lg text-gray-600">
              Acompanhe e exporte os dados consolidados das avaliações para análise.
            </p>
          </header>

          <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
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

          {/* Você pode adicionar outras seções aqui no futuro, como:
              - Gráficos de Equalização
              - Status de Equalização por colaborador
              - Ferramentas de comparação
          */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
import { useState } from 'react';
import { DownloadCloud, Loader2 } from 'lucide-react';

const DataExportPanel = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage('Preparando a exportação... Isso pode levar alguns segundos.');

    try {
      // --- Lógica de Exportação Real ---
      // Em um cenário real, a chamada à API seria descomentada:
      //
      // const response = await fetch('/api/committee/export-full-evaluations', { method: 'GET' });
      // if (!response.ok) {
      //   throw new Error(`Falha na exportação: ${response.statusText}`);
      // }
      //
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `avaliacoes_consolidadas_${new Date().toISOString().slice(0, 10)}.xlsx`;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // window.URL.revokeObjectURL(url);
      // ------------------------------------

      // simulaçao
      await new Promise(resolve => setTimeout(resolve, 3000));

      setExportMessage('Exportação concluída com sucesso! O download deve ter iniciado.');

    } catch (error) {
      console.error('Erro ao exportar avaliações:', error);
      setExportMessage('Ocorreu um erro ao realizar a exportação. Tente novamente mais tarde.');
    } finally {
      setIsExporting(false);
      // Limpa a mensagem de feedback após 5 segundos
      setTimeout(() => setExportMessage(''), 5000);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-3">
          <DownloadCloud className="text-orange-500" size={28} />
          Exportar Avaliações Completas
        </h2>
      </div>

      <p className="text-gray-600 mb-8 max-w-3xl">
        Esta funcionalidade permite que você baixe um arquivo (`.xlsx` ou `.csv`) contendo todas as autoavaliações, avaliações de pares e de líderes, incluindo notas e justificativas, para análise offline e arquivamento.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`
            px-8 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-3 
            transition-all duration-300 w-full max-w-xs
            ${isExporting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            }
          `}
        >
          {isExporting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Exportando...</span>
            </>
          ) : (
            <>
              <DownloadCloud size={20} />
              <span>Baixar Avaliações</span>
            </>
          )}
        </button>

        {exportMessage && (
          <p className={`mt-2 text-sm transition-opacity duration-300 ${exportMessage.startsWith('Ocorreu') ? 'text-red-600' : 'text-gray-600'}`}>
            {exportMessage}
          </p>
        )}
      </div>
    </section>
  );
};

export default DataExportPanel;
import { FileDown, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useExportPanelLogic } from '../../hooks/useCommitteeExportPanelLogic';

export default function CommitteeExportPanel() {
  const {
    cycles,
    selectedCycle,
    isLoadingCycles,
    isDownloading,
    error,
    setSelectedCycle,
    handleExport,
  } = useExportPanelLogic();

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Exportar Avaliações</h2>
            <p className="text-gray-500 mt-1">Selecione o ciclo para baixar o relatório completo em formato Excel.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 items-start">
            <div className="space-y-4 w-full">
                <label className="block text-sm font-bold text-gray-700">Ciclo de Avaliação</label>
                <CustomSelect
                    options={cycles}
                    selected={selectedCycle}
                    onChange={setSelectedCycle}
                    placeholder={isLoadingCycles ? "Carregando ciclos..." : "Selecione um ciclo"}
                />
                <p className="text-sm text-gray-500 pt-2">
                    Apenas os dados de avaliações concluídas serão incluídos no arquivo final.
                </p>
            </div>
            <div className={`border-2 ${selectedCycle ? 'border-orange-500' : 'border-gray-300'} border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all h-full`}>
                <FileDown className={`h-12 w-12 mb-4 ${selectedCycle ? 'text-orange-500' : 'text-gray-400'}`} />
                <h3 className="text-lg font-semibold text-gray-800">Relatório Consolidado</h3>
                <p className="mt-1 text-sm text-gray-500">
                    O arquivo será gerado no formato .xlsx e incluirá todos os dados.
                </p>
                <button
                    onClick={handleExport}
                    disabled={!selectedCycle || isDownloading || isLoadingCycles}
                    className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            Exportando...
                        </>
                    ) : (
                        'Baixar Relatório'
                    )}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm text-center lg:col-span-2">{error}</p>}
        </div>
    </div>
  );
}
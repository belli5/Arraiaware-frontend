import { Download } from 'lucide-react';
import ImportHistoryTable from '../ImportHistoryTable/ImportHistoryTable';
import FileUploadZone from '../FileUploadZone/FileUploadZone';
import GuidelinesBox from '../GuidelinesBox/GuidelinesBox';

const importHistory = [
    { id: 1, file: 'avaliacoes_2023_q4.xlsx', date: '15/01/2024, 10:30:00', status: 'Concluído', progress: 150, total: 150, valid: 145, invalid: 5 },
    { id: 2, file: 'historico_colaboradores.csv', date: '14/01/2024, 14:20:00', status: 'Concluído', progress: 89, total: 89, valid: 89, invalid: 0 },
    { id: 3, file: 'avaliacoes_pendentes.xlsx', date: '13/01/2024, 09:15:00', status: 'Processando', progress: 45, total: 75, valid: 42, invalid: 3 },
];

export default function HistoryPanel() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md space-y-12">
      {/* Seção 1: Upload de Arquivos */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Importação de Históricos - Arraiware</h2>
        <p className="text-base text-gray-500 mt-1">Faça upload de arquivos Excel ou CSV com históricos de avaliações para utilização imediata</p>
        <FileUploadZone />
      </div>

      {/* Seção 2: Diretrizes para Importação */}
      <GuidelinesBox />

      {/* Seção 3: Histórico de Importações */}
      <div>
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Histórico de Importações</h2>
                <p className="text-base text-gray-500 mt-1">Acompanhe o status das importações realizadas</p>
            </div>
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-semibold">
                <Download className="h-4 w-4" />
                <span>Exportar Log</span>
            </button>
        </div>
        <div className="mt-6">
          <ImportHistoryTable history={importHistory} />
        </div>
      </div>
    </div>
  );
}
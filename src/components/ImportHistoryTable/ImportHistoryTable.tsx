import { FileText, Download, Trash2,Loader2 } from 'lucide-react';
import FormattedDate from '../FormattedDate/FormattedDate';


interface ImportHistoryEntry {
  id: string;
  file: string;
  date: string;
  status: string;
}

interface ImportHistoryTableProps {
  history: ImportHistoryEntry[];
  onDelete: (id:string) => void;
  onDownload: (entry: ImportHistoryEntry) => void;
  downloadingId: string | null;
}

const ImportStatusBadge = ({ status }: { status: string }) => {
  const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center";
  let colorStyle = "";

  switch (status) {
    case 'Sucesso':
      colorStyle = "bg-green-100 text-green-700";
      break;
    case 'Processando':
      colorStyle = "bg-blue-100 text-blue-700";
      break;
    case 'Falha':
      colorStyle = "bg-red-100 text-red-700";
      break;
    default:
      colorStyle = "bg-gray-100 text-gray-700";
  }
  return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
}

export default function ImportHistoryTable({ history,onDelete,onDownload,downloadingId }: ImportHistoryTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Importação</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((item) => (
            <tr key={item.id}>
              {/* Coluna 1: Arquivo */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="truncate" title={item.file}>{item.file}</span>
              </td>
              {/* Coluna 2: Data */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <FormattedDate 
                  isoDate={item.date} 
                  options={{
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Sao_Paulo'
                  }} 
                />
              </td>
              {/* Coluna 3: Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <ImportStatusBadge status={item.status} />
              </td>
              {/* Coluna 4: Ações */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={() => onDownload(item)}
                    className="text-gray-500 hover:text-green-600 disabled:text-gray-300 disabled:cursor-wait"
                    title="Baixar Relatório"
                    disabled={downloadingId === item.id}
                  >
                    {downloadingId === item.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-gray-500 hover:text-red-600" 
                    title="Excluir Registro"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
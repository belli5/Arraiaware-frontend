import { FileText, Download, Eye, Trash2 } from 'lucide-react';

// Tipos para os dados da tabela ( nao sabemos ainda)
interface ImportHistoryItem {
    id: number;
    file: string;
    date: string;
    status: string;
    progress: number;
    total: number;
    valid: number;
    invalid: number;
}

interface ImportHistoryTableProps {
    history: ImportHistoryItem[];
}

const ImportStatusBadge = ({ status }: { status: string }) => {
    const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5";
    let colorStyle = "";

    switch (status) {
        case 'Concluído': colorStyle = "bg-green-100 text-green-700"; break;
        case 'Processando': colorStyle = "bg-blue-100 text-blue-700"; break;
        default: colorStyle = "bg-gray-100 text-gray-700";
    }
    return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
}

export default function ImportHistoryTable({ history }: ImportHistoryTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registros</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Válidos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inválidos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <span>{item.file}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap"><ImportStatusBadge status={item.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(item.progress / item.total) * 100}%` }}></div>
                    </div>
                    <span>{item.progress}/{item.total}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{item.total}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{item.valid}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{item.invalid}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-blue-600"><Eye size={18} /></button>
                    <button className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                    <button className="text-gray-500 hover:text-green-600"><Download size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { UploadCloud } from 'lucide-react';

export default function FileUploadZone() {
  return (
    <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-lg font-semibold text-gray-700">Arraste e solte seus arquivos aqui</p>
      <p className="mt-1 text-sm text-gray-500">ou clique para selecionar arquivos</p>
      <p className="mt-2 text-xs text-gray-400">Formatos suportados: .xlsx, .csv (máx. 10MB)</p>
      <button className="mt-6 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
        Selecionar Arquivos
      </button>
    </div>
  );
}
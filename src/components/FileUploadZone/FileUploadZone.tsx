import { UploadCloud, File, X } from 'lucide-react';
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import { useFileUploadLogic } from '../../hooks/useFileUploadLogic'; 

interface FileUploadZoneProps {
  onUploadSuccess?: () => void;
}
export default function FileUploadZone({ onUploadSuccess }: FileUploadZoneProps) {
  const {
    files,
    isUploading,
    uploadResult,
    setUploadResult,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
    handleUpload,
  } = useFileUploadLogic({ onUploadSuccess });

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-orange-500 bg-orange-100' : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'}`}>
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-4 text-lg font-semibold text-orange-600">Solte os arquivos aqui...</p>
        ) : (
          <>
            <p className="mt-4 text-lg font-semibold text-gray-700">Arraste e solte seus arquivos aqui</p>
            <p className="mt-1 text-sm text-gray-500">ou clique para selecionar arquivos</p>
          </>
        )}
        <p className="mt-2 text-xs text-gray-400">Formatos suportados: .xlsx e .csv</p>
      </div>
      
      {files.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Arquivos Selecionados:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <File size={16} />
                  <span>{file.name}</span>
                  <span className="text-gray-500 text-xs">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700">
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Enviando...' : `Enviar ${files.length} Arquivo(s)`}
            </button>
          </div>
        </div>
      )}
      {uploadResult && (
        <NotificationMessages
          status={uploadResult.status}
          title={uploadResult.title}
          message={uploadResult.message}
          onClose={() => setUploadResult(null)} 
        />
      )}
    </div>
  );
}
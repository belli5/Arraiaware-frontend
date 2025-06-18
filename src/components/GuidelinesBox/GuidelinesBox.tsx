export default function GuidelinesBox() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
      <h4 className="font-bold text-amber-800">Diretrizes para Importação:</h4>
      <ul className="list-disc list-inside mt-2 text-sm text-amber-700 space-y-1">
          <li>Os arquivos devem conter colunas: Nome, Email, Departamento, Trilha, Nota, Data</li>
          <li>Certifique-se de que os dados estão validados antes do upload</li>
          <li>Históricos duplicados serão automaticamente identificados</li>
          <li>O processamento pode levar alguns minutos para arquivos grandes</li>
      </ul>
    </div>
  );
}
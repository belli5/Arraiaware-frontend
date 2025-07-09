export default function GuidelinesBox() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
      <h4 className="font-bold text-amber-800">Diretrizes para Importação:</h4>
      <ul className="list-disc list-inside mt-2 text-sm text-amber-700 space-y-1">
          <li>Certifique-se de que os arquivos possuem dados do Usuário e de suas avaliações</li>
          <li>Certifique-se de que os dados estão validados antes do upload</li>
          <li>Históricos duplicados serão automaticamente identificados</li>
          <li>O processamento pode levar alguns minutos muitos arquivos</li>
      </ul>
    </div>
  );
}
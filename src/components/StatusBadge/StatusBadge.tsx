interface StatusBadgeProps {
  status: 'Concluída' | 'Pendente' | 'Em Atraso' | 'Equalizada' | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full inline-block whitespace-nowrap";
  let colorStyle = "";

  switch (status) {
    case 'Concluída':
    case 'Completo': 
      colorStyle = "bg-green-100 text-green-800";
      break;
    
    case 'Equalizada': 
      colorStyle = "bg-blue-100 text-blue-800";
      break;
      
    case 'Pendente': 
      colorStyle = "bg-amber-100 text-amber-700";
      break;
      
    case 'Em Atraso':
    case 'Parcial': 
      colorStyle = "bg-red-100 text-red-800";
      break;
      
    default:
      colorStyle = "bg-gray-100 text-gray-800";
  }

  return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
}
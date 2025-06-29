interface FormattedDateProps {
  isoDate: string | null | undefined; 
  options?: Intl.DateTimeFormatOptions; 
}

export default function FormattedDate({ isoDate, options }: FormattedDateProps) {
  if (!isoDate) {
    return null;
  }

  try {
    const date = new Date(isoDate);

    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo', 
    };

    const formattingOptions = options || defaultOptions;
    const formattedDate = date.toLocaleDateString('pt-BR', formattingOptions);

    return <span>{formattedDate}</span>;

  } catch (error) {
    console.error("Erro ao formatar a data:", isoDate, error);
    return <span>Data inválida</span>; 
  }
}
import { Check } from 'lucide-react';
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import { useCreateCycleLogic } from '../../hooks/useCreateCycleLogic';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const datePickerStyles = `
  .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after {
    border-bottom-color: #f97316; /* corresponde a 'orange-500' */
  }

  .react-datepicker__header {
    background-color: #f97316;
    color: #ffffff;
    border-bottom: none;
    border-top-left-radius: 0.375rem; /* rounded-t-md */
    border-top-right-radius: 0.375rem; /* rounded-t-md */
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    font-weight: 700;
    color: #ffffff;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #ffffff;
    border-width: 2px 2px 0 0;
  }
  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #fed7aa; /* orange-200 */
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #f97316;
    color: #ffffff;
    border-radius: 0.375rem;
  }
  .react-datepicker__day--selected:hover {
    background-color: #ea580c; /* orange-600 */
  }

  .react-datepicker__day:hover {
    background-color: #fed7aa; /* orange-200 */
    border-radius: 0.375rem;
  }
  
  .react-datepicker__day--outside-month {
    color: #9ca3af;
  }
`;

export default function CreateCyclePanel() {
  const {
    name,
    setName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSubmitting,
    notification,
    setNotification,
    handleSubmit,
  } = useCreateCycleLogic();

  const inputStyles = `mt-1 block w-full rounded-md shadow-sm border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100`;

  return (
    <div className="relative">
         <style>{datePickerStyles}</style>
      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Criar Novo Ciclo de Avaliação</h2>
          <p className="text-base text-gray-500 mt-1">Configure um novo período para as avaliações de desempenho.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="cycle-name" className="block text-sm font-medium text-gray-700">Nome do Ciclo</label>
            <input
              id="cycle-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputStyles}
              placeholder="Ex: Avaliação Semestral 2025.1"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Data de Início</label>
                <DatePicker
                id="start-date"
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/AAAA"
                
                wrapperClassName="w-full" 
                className={inputStyles}    
                
                disabled={isSubmitting}
                autoComplete="off"
                />
            </div>
            <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Data de Término</label>
                <DatePicker
                id="end-date"
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/AAAA"
                
                wrapperClassName="w-full" 
                className={inputStyles}     
                
                disabled={isSubmitting}
                autoComplete="off"
                />
            </div>
        </div>
          
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
            >
              <Check size={18} />
              {isSubmitting ? 'Criando Ciclo...' : 'Criar Ciclo'}
            </button>
          </div>
        </form>
      </div>

      {notification && (
        <NotificationMessages
          status={notification.status}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
}
import { Briefcase } from 'lucide-react';
import NotificationMessages from '../../../components/NotificationMessages/NotificationMessages';
import { useCreateRoleLogic } from '../../../hooks/useCreateRoleLogic';

export default function CreateRolePanel() {
  const {
    name,
    setName,
    description,
    setDescription,
    isSubmitting,
    notification,
    setNotification,
    handleSubmit,
  } = useCreateRoleLogic();

  const inputStyles = `mt-1 block w-full rounded-md shadow-sm border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`;

  return (
    <div className="relative">
      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Criar Novo Cargo</h2>
          <p className="text-base text-gray-500 mt-1">Defina um novo cargo que poderá ser associado aos usuários.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">Nome do Cargo</label>
            <input
              id="role-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)} 
              className={inputStyles}
              placeholder="Ex: Designer de Produto"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="role-description"
              value={description}
              onChange={e => setDescription(e.target.value)} 
              rows={4}
              className={inputStyles}
              placeholder="Descreva as responsabilidades principais deste cargo."
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
            >
              <Briefcase size={18} />
              {isSubmitting ? 'Criando...' : 'Criar Cargo'}
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
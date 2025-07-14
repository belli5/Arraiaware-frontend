import { Search, UserPlus } from 'lucide-react';
import { useAddMenteeLogic } from '../../hooks/useAddMenteeLogic';
import Pagination from '../Pagination/Pagination';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useEffect,useRef,useState} from 'react'
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import { ConfirmationMessage } from '../ConfirmationMessage/ConfirmationMessage';
import type { MenteeUser } from '../../types/committee';

export default function AddMenteePanel() {
  const {
    users,
    isLoading,
    notification,
    currentPage,
    totalPages,
    setCurrentPage,
    searchTerm,
    handleSearchChange,
    handleUserTypeChange,
    userTypeOptions,
    userTypeFilter,
    associateMentor,
    associatingUserId,
    setNotification
  } = useAddMenteeLogic();

  const panelRef = useRef<HTMLDivElement>(null);
  const [userToConfirm, setUserToConfirm] = useState<MenteeUser | null>(null);

  useEffect(() => {
    if (currentPage && panelRef.current) {
        const elementTop = panelRef.current.getBoundingClientRect().top + window.scrollY;
        const offset = 150;
        window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
        });
    }
}, [currentPage]);
  
  const handleConfirmAssociation = () => {
    if (userToConfirm) {
      associateMentor(userToConfirm.id);
      setUserToConfirm(null); 
    }
  };

  const handleCancelAssociation = () => {
    setUserToConfirm(null); 
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
      {/* SEÇÃO DE NOTIFICAÇÃO */}
      {notification && (
        <NotificationMessages
            status={notification.status}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
        />
        )}

        <h2 ref={panelRef} className="text-xl font-bold text-gray-800">
                Gestão de Mentorados
        </h2>
        <p className="text-base text-gray-500 mt-1">
            Selecione o o usuário que deseja mentorar
        </p>
      {/* SEÇÃO DE FILTROS */}
       <div className="grid grid-cols-2 gap-4 mb-3 mt-2">
        <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
            type="text"
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            />
        </div>

        <div className="relative">
            <CustomSelect
                placeholder="Filtrar por tipo..."
                options={userTypeOptions}
                selected={userTypeFilter}
                onChange={handleUserTypeChange}
            />
        </div>
      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Usuário</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-10">
                  <p className="text-gray-500">Carregando...</p>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userType}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setUserToConfirm(user)}
                            disabled={associatingUserId === user.id} 
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-800 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-wait"
                        >
                            {associatingUserId === user.id ? 'Adicionando...' : (
                            <>
                                <UserPlus size={16} />
                                Adicionar
                            </>
                            )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-10">
                  <p className="text-gray-500">Nenhum usuário encontrado.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* SEÇÃO DE PAGINAÇÃO */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ConfirmationMessage
        isOpen={!!userToConfirm}
        message={`Você tem certeza que deseja adicionar "${userToConfirm?.name}" como seu mentorado?`}
        onConfirm={handleConfirmAssociation}
        onCancel={handleCancelAssociation}
      />
    </div>
  );
}
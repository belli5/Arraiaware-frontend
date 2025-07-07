import { useEditUserPanelLogic } from '../../hooks/useEditUserPanelLogic'
import EditUserTable from '../EditUserTable/EditUserTable'
import NotificationMessages from '../NotificationMessages/NotificationMessages'
import UserTableSkeleton from '../UserTableSkeleton/UserTableSkeleton'
import Modal from '../Modal/Modal'
import EditUserForm from '../EditUserForm/EditUserForm'
import Pagination from '../Pagination/Pagination'
import CustomSelect from '../CustomSelect/CustomSelect'
import { Search } from 'lucide-react'
import { useEffect,useRef } from 'react'

export default function EditUserPanel() {
    const { 
        users, isLoading, notification, setNotification,
        isEditModalOpen, editingUser, isSubmitting,
        handleOpenEditModal, handleCloseEditModal, handleUpdateUser,
        currentPage, totalPages, setCurrentPage,
        searchTerm, handleSearchChange, 
        userTypeFilter, handleUserTypeChange, userTypeOptions
    } = useEditUserPanelLogic();

    const panelRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {notification && (
                <NotificationMessages
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            
            <h3 ref={panelRef} className="text-xl font-semibold text-gray-700 mb-4">Gerenciamento de Usuários</h3>
            
            {/* --- SEÇÃO DE FILTROS --- */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="relative col-span-2 mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                {/* Filtro de Tipo de Usuário */}
                <div className="relative col-span-1">
                    <CustomSelect
                    placeholder="Filtrar por tipo..."
                    options={userTypeOptions}
                    selected={userTypeFilter}
                    onChange={handleUserTypeChange}
                    />
                </div>
            </div>

            <div className="mt-6">
                {isLoading ? (
                    <UserTableSkeleton /> 
                ) : (
                    <>
                        <EditUserTable users={users} onEdit={handleOpenEditModal} />
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title={`Editando Usuário: ${editingUser?.name || ''}`}
            >
                <EditUserForm
                    initialData={editingUser}
                    onSubmit={handleUpdateUser}
                    onCancel={handleCloseEditModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </div>
    );
};
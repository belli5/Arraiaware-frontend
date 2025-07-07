import { useEditUserPanelLogic } from '../../hooks/useEditUserPanelLogic'
import EditUserTable from '../EditUserTable/EditUserTable'
import NotificationMessages from '../NotificationMessages/NotificationMessages'
import UserTableSkeleton from '../UserTableSkeleton/UserTableSkeleton'
import Modal from '../Modal/Modal'
import EditUserForm from '../EditUserForm/EditUserForm'

export default function EditUserPanel() {
    const { 
        users, isLoading, notification, setNotification,
        isEditModalOpen, editingUser, isSubmitting,
        handleOpenEditModal, handleCloseEditModal, handleUpdateUser
    } = useEditUserPanelLogic();

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
            
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Gerenciamento de Usuários</h3>
            
            <div className="mt-6">
                {isLoading ? (
                    <UserTableSkeleton /> 
                ) : (
                    <EditUserTable users={users} onEdit={handleOpenEditModal} />
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
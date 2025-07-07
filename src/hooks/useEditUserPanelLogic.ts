import { useState, useEffect } from 'react';
import type { User, ApiUserResponse } from '../types/RH'

interface NotificationProps {
  status: 'success' | 'error';
  title: string;
  message: string;
}

export const useEditUserPanelLogic = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationProps | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingUser(null);
        setIsEditModalOpen(false);
    };


    const handleUpdateUser = async (userData: { id: string; name: string; email: string; unidade: string; userType: string; }) => {
        setIsSubmitting(true);
        setNotification(null);

        const token = localStorage.getItem('token');
            if (!token) {
                setNotification({ status: 'error', title: 'Autenticação Falhou', message: 'Token não encontrado.' });
                setIsLoading(false);
                return;
            }

        try {
            const payload = {
                name: userData.name,
                email: userData.email,
                unidade: userData.unidade,
                userType: userData.userType,
            };

            const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao atualizar o usuário.');
            }
            
            setNotification({ status: 'success', title: 'Sucesso!', message: 'Usuário atualizado com sucesso.' });
            handleCloseEditModal();
            
            setUsers(currentUsers =>
                currentUsers.map(u => 
                    u.id === userData.id ? { ...u, ...userData } : u
                )
            );

        } catch (err) {
            if (err instanceof Error) {
                console.log("erro haha")
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setNotification({ status: 'error', title: 'Autenticação Falhou', message: 'Token não encontrado.' });
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar a lista de usuários.');
                }

                const data: ApiUserResponse[] = await response.json();
                
                const formattedUsers: User[] = data.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    unidade: user.unidade,
                    userType: user.userType,
                    roles: Array.isArray(user.roles) ? user.roles : [],
                }));

                setUsers(formattedUsers);

            } catch (err) {
                if (err instanceof Error) {
                    setNotification({ status: 'error', title: 'Erro de Rede', message: err.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []); 

    return {
        users,
        isLoading,
        notification,
        setNotification,
        isEditModalOpen,
        editingUser,
        isSubmitting,
        handleOpenEditModal,
        handleCloseEditModal,
        handleUpdateUser,
    };
};
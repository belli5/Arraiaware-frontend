import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import type { NotificationState } from '../../types/global';
import NotificationMessages from '../NotificationMessages/NotificationMessages';

export default function CreateRolePanel() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!name.trim() || !description.trim()) {
      setNotification({ status: 'error', title: 'Campos Inválidos', message: 'Por favor, preencha todos os campos.' });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ status: 'error', title: 'Erro de Autenticação', message: 'Por favor, faça login novamente.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const requestBody = {
        name,
        type: 'CARGO', 
        description,
      };

      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Não foi possível criar o cargo.`);
      }

      setNotification({ status: 'success', title: 'Sucesso!', message: `O cargo "${name}" foi criado.` });
      setName('');
      setDescription('');

    } catch (error) {
      setNotification({ status: 'error', title: 'Falha na Criação', message: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

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
import { useState } from 'react';
import { UserPlus,ChevronDown } from 'lucide-react';
import type { Role } from '../../types/RH';
import type { NotificationState } from '../../types/global';
import NotificationMessages from '../NotificationMessages/NotificationMessages';

const roles: Role[] = ['Colaborador', 'Gestor', 'RH'];
export default function SignUpPanel() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    unit: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    role: '',
    unit: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors = { name: '', email: '', role: '', unit: '' };

    if (!formData.name.trim()) { newErrors.name = 'Nome é obrigatório.'; isValid = false; }
    if (!formData.email.trim()) { newErrors.email = 'Email é obrigatório.'; isValid = false; }
    if (!formData.role) { newErrors.role = 'Vínculo é obrigatório.'; isValid = false; }
    if (!formData.unit.trim()) { newErrors.unit = 'Unidade é obrigatória.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token de autenticação não encontrado. Redirecionando para o login.");
      // navigate('/login'); 
      return; 
    }
    console.log(token);
    if (!validate()) return;

    setIsSubmitting(true);
    setNotification(null); 

    try {
      const requestBody = {
        name: formData.name,
        email: formData.email,
        userType: formData.role.toUpperCase(),
        unidade: formData.unit,
      };
      console.log(requestBody);
      
      const response = await fetch('http://localhost:3000/api/users', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 201) {
        setNotification({
          status: 'success',
          title: 'Cadastro Realizado!',
          message: `O usuário ${formData.name} foi criado com sucesso.`
        });
        setFormData({ name: '', email: '', role: '', unit: '' });
        setErrors({ name: '', email: '', role: '', unit: '' });
      
      } else if (response.status === 400) {
        throw new Error('Parâmetros inválidos. Verifique os dados e tente novamente.');
      
      } else {
        throw new Error(`Ocorreu um erro no servidor (Status: ${response.status}).`);
      }

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setNotification({
        status: 'error',
        title: 'Falha no Cadastro',
        message: (error as Error).message || 'Não foi possível completar a operação.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cadastrar Novo Usuário</h2>
          <p className="text-base text-gray-500 mt-1">Preencha os dados abaixo para criar um novo usuário no sistema RPE.</p>
        </div>

        <div className="mt-8 mx-auto ">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              
              {/* Nome */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">Nome Completo</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Vínculo */}
              <div className="md:col-span-2">
                <label htmlFor="role" className="block text-sm font-bold text-gray-700">Vínculo</label>
                <div className="relative mt-1">
                  <select 
                    name="role" 
                    id="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    className={`block w-full appearance-none rounded-md border py-2 px-3 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-base 
                      ${errors.role ? 'border-red-500' : 'border-gray-300'}
                      ${formData.role ? 'text-gray-900' : 'text-gray-500'}` 
                    }
                  >
                    <option value="" disabled>Selecione um vínculo</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={20} />
                  </div>
                </div>
                {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
              </div>

              {/* Unidade */}
              <div className="md:col-span-2">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade/Departamento</label>
                <input type="text" name="unit" id="unit" value={formData.unit} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.unit ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.unit && <p className="mt-1 text-xs text-red-600">{errors.unit}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                <UserPlus size={18} />
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Usuário'}
              </button>
            </div>
          </form>
        </div>
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
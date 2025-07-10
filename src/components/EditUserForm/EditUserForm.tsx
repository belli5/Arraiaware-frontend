import { useState, useEffect } from 'react';
import type { User } from '../../types/RH';
import CustomSelect from '../CustomSelect/CustomSelect'; 
import type{ SelectOption } from '../CustomSelect/CustomSelect'; 

const userTypes = ['ADMIN', 'RH', 'GESTOR', 'COLABORADOR'];
const userTypeOptions: SelectOption[] = userTypes.map(type => ({ id: type, name: type }));

type UserFormData = {
  name: string;
  email: string;
  unidade: string;
  userType: SelectOption | null;
};

interface EditUserFormProps {
  initialData: User | null;
  onSubmit: (data: { id: string; name: string; email: string; unidade: string; userType: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EditUserForm({ initialData, onSubmit, onCancel, isSubmitting }: EditUserFormProps) {
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    unidade: '',
    userType: null,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    unidade: '',
}); 

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        unidade: initialData.unidade,
        userType: { id: initialData.userType, name: initialData.userType },
      });
    }
    setErrors({ name: '', email: '', unidade: '' });
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors = { name: '', email: '', unidade: '' };
    let isValid = true;

    // Validação do Nome
    if (!formData.name.trim()) {
      newErrors.name = 'O nome do usuário é obrigatório.';
      isValid = false;
    }

    // Validação da Unidade
    if (!formData.unidade.trim()) {
      newErrors.unidade = 'A unidade é obrigatória.';
      isValid = false;
    }
    
    const emailRegex = /\S+@\S+\.\S+/; 
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, insira um formato de email válido.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof Omit<UserFormData, 'userType'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (option: SelectOption) => {
    setFormData(prev => ({ ...prev, userType: option }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      return; 
    }
    
    if (!initialData || !formData.userType) return;

    const dataToSubmit = {
      id: initialData.id,
      name: formData.name,
      email: formData.email,
      unidade: formData.unidade,
      userType: formData.userType.id,
    };
    onSubmit(dataToSubmit);
  };

  if (!initialData) return null;

  return (
    <div className="p-4 space-y-4">
      {/* Campo Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
        <input type="text" id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      {/* Campo Email  */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      {/* Campo Unidade */}
      <div>
        <label htmlFor="unidade" className="block text-sm font-medium text-gray-700">Unidade</label>
        <input type="text" id="unidade" value={formData.unidade} onChange={(e) => handleChange('unidade', e.target.value)}
          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.unidade ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.unidade && <p className="mt-1 text-xs text-red-600">{errors.unidade}</p>}
      </div>

      {/* usertype */}
      <div>
        <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Tipo de Usuário</label>
        <CustomSelect
          placeholder="Selecione um tipo"
          options={userTypeOptions}
          selected={formData.userType}
          onChange={handleSelectChange}
        />
      </div>
      {/* Rodapé com botões de Ação */}
      <div className="pt-5 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold bg-gray-200 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="button" onClick={handleSubmit} disabled={isSubmitting}
          className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}
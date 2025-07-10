import { useState, useEffect } from 'react';
import type { User } from '../../types/RH';
import CustomSelect from '../CustomSelect/CustomSelect'; 
import type{ SelectOption } from '../CustomSelect/CustomSelect'; 

type UserFormData = {
  name: string;
  email: string;
  unidade: string;
  userType: SelectOption | null;
};

interface EditUserFormProps {
  initialData: User | null;
  onSubmit: (data: { id: string; name: string; email: string; unidade: string; userType: string, roles: string[]}) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  allTracks: SelectOption[];
  userTypeOptions: SelectOption[];
}

export default function EditUserForm({ initialData, onSubmit, onCancel, isSubmitting, allTracks,userTypeOptions }: EditUserFormProps) {
  
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

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        unidade: initialData.unidade,
        userType: { id: initialData.userType, name: initialData.userType },
      });
      const initialIds = (initialData.roles || []).map(role => role.id);
      setSelectedRoleIds(initialIds);
        
      setErrors({ name: '', email: '', unidade: '' });
    }
  }, [initialData,allTracks]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleIds(prevSelectedIds =>
      prevSelectedIds.includes(roleId)
        ? prevSelectedIds.filter(id => id !== roleId) 
        : [...prevSelectedIds, roleId] 
    );
  };

  const validate = (): boolean => {
    const newErrors = { name: '', email: '', unidade: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'O nome do usuário é obrigatório.';
      isValid = false;
    }

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
      roles: selectedRoleIds,
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Trilhas de Atuação</label>
        <div className="mt-2 p-3 border border-gray-200 rounded-md max-h-40 overflow-y-auto space-y-2">
          {allTracks.length > 0 ? (
            allTracks.map(track => (
              <div key={track.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`track-${track.id}`}
                  name={track.name}
                  checked={selectedRoleIds.includes(track.id)}
                  onChange={() => handleRoleChange(track.id)}
                  className="h-4 w-4 accent-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor={`track-${track.id}`} className="ml-2 block text-sm text-gray-900">
                  {track.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma trilha encontrada.</p>
          )}
        </div>
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
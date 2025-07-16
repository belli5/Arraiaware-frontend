import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface CreateTrackFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  isSubmitting: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
}

export default function CreateTrackForm({ onSubmit, isSubmitting }: CreateTrackFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = 'O nome da trilha é obrigatório.';
    }
    if (!description.trim()) {
      newErrors.description = 'A descrição da trilha é obrigatória.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; 
    }
    setErrors({});
    await onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  const baseInputStyles = `
    mt-1 block w-full rounded-md shadow-sm 
    border border-gray-300
    py-2 px-3
    focus:outline-none 
    focus:ring-2 
    focus:ring-orange-500 
    focus:border-transparent
  `;
  
  const nameInputClassName = `${baseInputStyles} ${errors.name ? 'border-red-500' : 'border-gray-300'}`;
  const descriptionInputClassName = `${baseInputStyles} ${errors.description ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="relative">
      <div className="mx-auto">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Criar Nova Trilha</h3>
          <p className="text-base text-gray-500 mt-1">Defina uma nova trilha de desenvolvimento para sua organização.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="track-name" className="block text-sm font-medium text-gray-700">Nome da Trilha</label>
            <input
              id="track-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={nameInputClassName}
              placeholder="Ex: Desenvolvimento Fullstack"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="track-description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="track-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className={descriptionInputClassName}
              placeholder="Uma breve descrição do propósito desta trilha."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
            >
              <PlusCircle size={18} />
              {isSubmitting ? 'Criando...' : 'Criar Trilha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

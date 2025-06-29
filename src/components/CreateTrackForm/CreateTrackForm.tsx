import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface CreateTrackFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function CreateTrackForm({ onSubmit, isSubmitting }: CreateTrackFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    await onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  const inputStyles = `
    mt-1 block w-full rounded-md shadow-sm 
    border border-gray-300
    py-2 px-3
    focus:outline-none 
    focus:ring-2 
    focus:ring-orange-500 
    focus:border-transparent
  `;

  return (
    <div className="relative">
      <div className="mx-auto">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Criar Nova Trilha</h3>
          <p className="text-base text-gray-500 mt-1">Defina uma nova trilha de desenvolvimento para sua organização.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="track-name" className="block text-sm font-medium text-gray-700">Nome da Trilha</label>
            <input
              id="track-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputStyles} 
              placeholder="Ex: Desenvolvimento Fullstack"
            />
          </div>
          
          <div>
            <label htmlFor="track-description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="track-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className={inputStyles} 
              placeholder="Uma breve descrição do propósito desta trilha."
            />
          </div>
          
          <div className="flex justify-end">
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
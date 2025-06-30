import { useState,useEffect } from 'react';
import { UserPlus} from 'lucide-react';
import type { NotificationState } from '../../types/global';
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import CustomSelect from '../CustomSelect/CustomSelect';
import type { SelectOption } from '../CustomSelect/CustomSelect';

const rolesOptions: SelectOption[] = [
  { id: 'COLABORADOR', name: 'Colaborador' },
  { id: 'GESTOR', name: 'Gestor' },
  { id: 'RH', name: 'RH' },
];

interface Track {
  id: string; 
  name: string; 
}

export default function SignUpPanel() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<SelectOption | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<SelectOption | null>(null);
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoadingTracks(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ status: 'error', title: 'Autenticação', message: 'Não foi possível buscar as trilhas.' });
        setIsLoadingTracks(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/roles/trilhas', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar trilhas');
        const tracksFromApi: { id: string; nome_da_trilha: string }[] = await response.json();
        setTracks(tracksFromApi.map(track => ({
          id: track.id,
          name: track.nome_da_trilha,
        })));

      } catch (error) {
        console.error("Erro ao buscar trilhas:", error);
      } finally {
        setIsLoadingTracks(false);
      }
    };

    fetchTracks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!name.trim() || !email.trim() || !selectedRole || !selectedTrack) {
      setNotification({ status: 'error', title: 'Campos Inválidos', message: 'Por favor, preencha todos os campos.' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token de autenticação não encontrado. Redirecionando para o login.");
      // navigate('/login'); 
      return; 
    }
    console.log(token);
    setIsSubmitting(true);
    setNotification(null); 

    try {
      const requestBody = {
        name,
        email,
        userType: selectedRole.id, 
        trackID: selectedTrack.id, 
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
          message: `O usuário ${name} foi criado com sucesso.`
        });
        setName('');
        setEmail('');
        setSelectedRole(null);
        setSelectedTrack(null);
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
              
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">Nome Completo</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500`} />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500`} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Vínculo</label>
                <CustomSelect
                  options={rolesOptions}
                  selected={selectedRole}
                  onChange={setSelectedRole}
                  placeholder="Selecione um vínculo"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Trilha</label>
                <CustomSelect
                  options={tracks}
                  selected={selectedTrack}
                  onChange={setSelectedTrack}
                  placeholder={isLoadingTracks ? "Carregando trilhas..." : "Selecione uma trilha"}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting || isLoadingTracks}
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
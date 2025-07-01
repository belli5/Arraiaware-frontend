import { UserPlus,User,Mail } from 'lucide-react';
import NotificationMessages from '../NotificationMessages/NotificationMessages';
import CustomSelect from '../CustomSelect/CustomSelect';
import { useSignUpPanelLogic } from '../../hooks/useSignUpPanelLogic'; // 👈 Nosso hook

export default function SignUpPanel() {
  const {
    name, email, selectedRole, selectedTrack, cargos, selectedCargo, tracks, isSubmitting, notification, isLoading,
    setName, setEmail, setSelectedRole, setSelectedTrack, setSelectedCargo, setNotification,
    handleSubmit,
    rolesOptions,
  } = useSignUpPanelLogic();

  return (
    <div className="relative">
      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cadastrar Novo Usuário</h2>
          <p className="text-base text-gray-500 mt-1">Preencha os dados abaixo para criar um novo usuário no sistema.</p>
        </div>
        <div className="mt-8 mx-auto ">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative md:col-span-3">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">Nome Completo</label>
                <User className="absolute bottom-2.5 left-3 h-5 w-5 text-gray-400" />
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500" disabled={isSubmitting} />
              </div>
              <div className="relative md:col-span-3">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
                <Mail className="absolute bottom-2.5 left-3 h-5 w-5 text-gray-400" />
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500" disabled={isSubmitting} />
              </div>
               <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700">Vínculo</label>
                  <CustomSelect options={rolesOptions} selected={selectedRole} onChange={setSelectedRole} placeholder="Selecione..."/>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-gray-700">Cargo</label>
                  <CustomSelect options={cargos} selected={selectedCargo} onChange={setSelectedCargo} placeholder={isLoading ? "Carregando..." : "Selecione..."}/>
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-gray-700">Trilha</label>
                <CustomSelect options={tracks} selected={selectedTrack} onChange={setSelectedTrack} placeholder={isLoading ? "Carregando..." : "Selecione..."}/>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSubmitting || isLoading} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed">
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
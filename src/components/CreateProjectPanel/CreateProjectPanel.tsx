// src/components/CreateProject/CreateProjectPanel.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  roles: { name: string }[];
}

interface CreateProjectPanelProps {
  managerId: string;
  cycleId?: string;
}

export default function CreateProjectPanel({
  managerId,
  cycleId: propCycleId,
}: CreateProjectPanelProps) {
  const [name, setName] = useState('');
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([]);
  const [allCollaborators, setAllCollaborators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCycleId, setActiveCycleId] = useState<string | undefined>(
    propCycleId
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 1) Buscar todos os usuários
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao buscar usuários');
        const users: User[] = await res.json();
        setAllCollaborators(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Buscar ciclo ativo caso não receba por prop
  useEffect(() => {
    if (propCycleId) return;
    (async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch('http://localhost:3000/api/cycles', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao buscar ciclos');
        const cycles: { id: string; startDate: string }[] = await res.json();
        const ativo = cycles.sort((a, b) =>
          b.startDate.localeCompare(a.startDate)
        )[0];
        setActiveCycleId(ativo.id);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [propCycleId]);

  const toggleCollaborator = (id: string) =>
    setCollaboratorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!activeCycleId) {
      setError('Ciclo ainda não carregado.');
      return;
    }
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          managerId,
          cycleId: activeCycleId,
          collaboratorIds,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Erro ao criar projeto');
      }
      setSuccess(true);
      setName('');
      setCollaboratorIds([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full px-4 lg:px-1 mx-auto mt-8">
      {/* HEADER LARANJA */}
      <div className="bg-orange-500 rounded-t-lg px-6 py-4 text-white">
        <h2 className="text-2xl font-bold">Criar Novo Projeto</h2>
      </div>

      {/* CORPO BRANCO */}
      <div className="bg-white p-8 rounded-b-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 mb-4">Projeto criado com sucesso!</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Projeto */}
          <div>
            <label className="block text-lg font-medium mb-1">
              Nome do Projeto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Contador de selecionados */}
          <div className="flex items-center space-x-2">
            <span className="font-medium">Selecionados:</span>
            <span className="bg-orange-500 text-white px-6 py-1 rounded-full">
              {collaboratorIds.length}
            </span>
          </div>

          {/* Lista de Colaboradores em cards */}
          <div>
            <label className="block text-lg font-medium mb-2">
              Colaboradores
            </label>
            {loading ? (
              <p className="text-gray-500">Buscando colaboradores…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {allCollaborators.map((u) => {
                  const selected = collaboratorIds.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleCollaborator(u.id)}
                      className={`
                        flex items-center p-4 border rounded-lg shadow-sm cursor-pointer transition
                        ${
                          selected
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Avatar */}
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-200 text-orange-700 font-bold
                        flex items-center justify-center mr-4"
                      >
                        {u.name
                          .split(' ')
                          .map((n) => n[0]?.toUpperCase())
                          .slice(0, 2)
                          .join('')}
                      </div>

                      {/* Nome */}
                      <div className="flex-grow">
                        <p className="font-medium truncate">{u.name}</p>
                      </div>

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selected}
                        readOnly
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Criar Projeto
          </button>
        </form>
      </div>
    </div>
  );
}

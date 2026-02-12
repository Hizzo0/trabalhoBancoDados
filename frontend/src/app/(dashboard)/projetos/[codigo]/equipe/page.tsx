'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';

// 1. Definição da Interface para remover o "any"
interface Participante {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  departamento?: string; // Específico Docente
  matricula?: string;    // Específico Discente
  cargo?: string;        // Específico Técnico
}

export default function GestaoEquipePage() {
  const { codigo } = useParams();
  const router = useRouter();
  
  // 2. Tipagem explícita dos estados para corrigir "@typescript-eslint/no-explicit-any"
  const [equipe, setEquipe] = useState<Participante[]>([]);
  const [participantesDisponiveis, setParticipantesDisponiveis] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [vincularData, setVincularData] = useState({
    cpf: '',
    funcao: 'Bolsista'
  });

  const carregarDados = useCallback(async () => {
    try {
      // UC10 - Consulta de participantes e listagem geral
      const [equipeRes, todosRes] = await Promise.all([
        api.listarParticipantesDoProjeto(codigo as string),
        api.listarTodosParticipantes()
      ]);
      setEquipe(equipeRes);
      setParticipantesDisponiveis(todosRes);
    } catch (error) {
      console.error("Erro ao carregar dados da equipa:", error);
    }
  }, [codigo]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleVincular = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // UC06 - Realizar vínculo
      const res = await api.vincularParticipante(codigo as string, vincularData.cpf, vincularData.funcao);
      if (res.ok) {
        alert("Participante vinculado com sucesso!");
        carregarDados();
        setVincularData({ ...vincularData, cpf: '' });
      } else {
        const msg = await res.text();
        alert(`Erro: ${msg}`);
      }
    } catch {
      // 3. Removida a variável 'error' não utilizada para corrigir "@typescript-eslint/no-unused-vars"
      alert("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDesvincular = async (cpf: string) => {
    if (!confirm("Remover este participante do projeto?")) return;
    try {
      // UC06 - Remover vínculo
      const res = await api.desvincularParticipante(codigo as string, cpf);
      if (res.ok) {
        carregarDados();
      }
    } catch {
      // 3. Removida a variável 'error' não utilizada para corrigir "@typescript-eslint/no-unused-vars"
      alert("Erro ao remover vínculo.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-all text-gray-500 shadow-sm">
          <span className="material-icons">arrow_back</span>
        </button>
        <h2 className="text-2xl font-bold text-[#2c3e50]">Gestão de Equipa: {codigo}</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Vínculo (UC06) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Adicionar Membro</h3>
          <form onSubmit={handleVincular} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Participante</label>
              <select 
                required
                value={vincularData.cpf}
                onChange={(e) => setVincularData({...vincularData, cpf: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#3498db] bg-white"
              >
                <option value="">Selecionar...</option>
                {participantesDisponiveis.map(p => (
                  <option key={p.cpf} value={p.cpf}>{p.nome} ({p.cpf})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Função (RN01)</label>
              <select 
                value={vincularData.funcao}
                onChange={(e) => setVincularData({...vincularData, funcao: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#3498db] bg-white"
              >
                <option value="Coordenador">Coordenador</option>
                <option value="Vice-Coordenador">Vice-Coordenador</option>
                <option value="Bolsista">Bolsista</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Voluntário">Voluntário</option>
                <option value="Técnico de Apoio">Técnico de Apoio</option>
              </select>
            </div>
            <button 
              disabled={loading}
              className="w-full py-3 bg-[#3498db] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-[#2980b9] disabled:opacity-50 transition-all"
            >
              {loading ? 'VINCULANDO...' : 'CONFIRMAR VÍNCULO'}
            </button>
          </form>
        </div>

        {/* Lista da Equipa Atual (UC10) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Membros Vinculados</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">E-mail</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipe.map((membro) => (
                <tr key={membro.cpf} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <p className="text-sm font-bold text-[#2c3e50]">{membro.nome}</p>
                    <p className="text-[10px] text-gray-400">{membro.cpf}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{membro.email}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDesvincular(membro.cpf)}
                      className="p-2 text-red-300 hover:text-red-500 transition-colors"
                    >
                      <span className="material-icons">person_remove</span>
                    </button>
                  </td>
                </tr>
              ))}
              {equipe.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-400 italic text-sm">
                    Nenhum participante vinculado a este projeto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ProjetoDTO } from '@/services/api'; 

export default function NovoProjetoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // CORREÇÃO: Adicionado o campo 'descricao' ao estado inicial
  const [formData, setFormData] = useState({
    codigoUnico: '',
    titulo: '',
    descricao: '', 
    dataInicio: '',
    situacao: 'ANDAMENTO' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 1. Recupera a string do storage
  const usuarioSalvo = sessionStorage.getItem('usuarioLogado');
  
  // 2. Converte para objeto
  const dadosSessao = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  // 3. CORREÇÃO: O CPF está dentro de dadosSessao.usuario
  const usuarioInterno = dadosSessao?.usuario;

  if (!usuarioInterno?.cpf) {
    alert("Erro: Usuário não identificado. Faça login novamente.");
    setLoading(false);
    return;
  }

  // 4. Monta o objeto para o backend
  const projetoParaEnviar: ProjetoDTO = {
    ...formData,
    cpfCoordenador: usuarioInterno.cpf 
  };

  try {
    const res = await api.cadastrarProjeto(projetoParaEnviar);
    if (res.ok) {
      alert("Projeto cadastrado com sucesso!");
      router.push('/projetos');
    } else {
      const msg = await res.text();
      alert(`Erro: ${msg}`);
    }
  } catch {
    alert("Erro de conexão com o servidor.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <span className="material-icons">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Cadastrar Projeto</h2>
          <p className="text-sm text-gray-500">Preencha os dados básicos da pesquisa acadêmica</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Código do Projeto (Ex: PJ001) *
            </label>
            <input
              required
              name="codigoUnico"
              value={formData.codigoUnico}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#3498db] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Situação Atual
            </label>
            <select
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:border-[#3498db] outline-none"
            >
              <option value="ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Título Completo do Projeto *
          </label>
          <input
            required
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#3498db] outline-none"
          />
        </div>

        {/* CORREÇÃO: Adicionado campo de descrição no formulário */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Descrição do Projeto *
          </label>
          <textarea
            required
            name="descricao"
            rows={4}
            value={formData.descricao}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#3498db] outline-none resize-none"
            placeholder="Descreva os objetivos e a fundamentação da pesquisa..."
          />
        </div>

        <div className="md:w-1/2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Data de Início *
          </label>
          <input
            required
            type="date"
            name="dataInicio"
            value={formData.dataInicio}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#3498db] outline-none"
          />
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#3498db] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-[#2980b9] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? (
              <span className="material-icons animate-spin text-sm">sync</span>
            ) : (
              <span className="material-icons text-sm">save</span>
            )}
            Cadastrar Projeto
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, ProjetoDTO } from '@/services/api';

interface ProjetoBackend {
  codigoUnico: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  situacao: string;
  coordenador: {
    cpf: string;
    nome?: string;
  };
  financiamento?: {
    agenciaFinanciador: string;
  };
}

export default function EditarProjetoPage() {
  const { codigo } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<ProjetoDTO>({
    codigoUnico: '',
    titulo: '',
    descricao: '',
    dataInicio: '',
    situacao: 'ANDAMENTO',
    cpfCoordenador: '',
    agenciaFinanciador: '' 
  });

  useEffect(() => {
    api.obterProjeto(codigo as string)
  .then((dados: ProjetoBackend) => {
    const dataLimpa = dados.dataInicio ? dados.dataInicio.split('T')[0] : '';

    setFormData({
      ...formData,
      codigoUnico: dados.codigoUnico,
      titulo: dados.titulo,
      descricao: dados.descricao || '',
      dataInicio: dataLimpa, 
      situacao: dados.situacao,
      cpfCoordenador: dados.coordenador.cpf,
      agenciaFinanciador: dados.financiamento?.agenciaFinanciador || ''
    });
    setLoading(false);
  })
      .catch((err) => {
        console.error("Erro ao carregar projeto:", err);
        alert("Erro ao carregar dados do projeto.");
        router.push('/projetos');
      });
  }, [codigo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.atualizarProjeto(codigo as string, formData);
      
      if (res.ok) {
        alert("Projeto atualizado com sucesso!");
        router.push('/projetos');
      } else {
        const erroMsg = await res.text();
        alert(`Erro ao salvar: ${erroMsg}`);
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Carregando dados da pesquisa...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <span className="material-icons">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Editar Projeto: {codigo}</h2>
          <p className="text-sm text-gray-500">Atualize as informações da pesquisa acadêmica [UC03]</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Código Único</label>
            <input
              disabled
              value={formData.codigoUnico}
              className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Situação Atual</label>
            <select
              value={formData.situacao}
              onChange={(e) => setFormData({...formData, situacao: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#3498db]"
            >
              <option value="ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Título da Pesquisa *</label>
          <input
            required
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Resumo/Descrição *</label>
          <textarea
            required
            rows={4}
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Data de Início *</label>
            <input
              required
              type="date"
              value={formData.dataInicio}
              onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">CPF do Coordenador</label>
            <input
              name="cpfCoordenador"
              value={formData.cpfCoordenador}
              onChange={(e) => setFormData({...formData, cpfCoordenador: e.target.value})}
              placeholder="Digite o CPF do Docente"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db] bg-gray-50/50"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#3498db] text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#2980b9] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {saving ? <span className="material-icons animate-spin text-sm">sync</span> : <span className="material-icons text-sm">save</span>}
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
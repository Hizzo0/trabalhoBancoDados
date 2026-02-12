'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/services/api';
import { FinanciamentoDTO } from '@/types';

export default function EditarFinanciamentoPage() {
  // ✅ A pasta deve se chamar [codigoProjeto] para este useParams funcionar
  const { codigoProjeto } = useParams<{ codigoProjeto: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FinanciamentoDTO>({
    agenciaFinanciador: '',
    tipoFomento: 'Auxílio Pesquisa',
    valorTotal: 0,
    periodoVigenciaInicio: '',
    periodoVigenciaFim: ''
  });

  useEffect(() => {
    if (!codigoProjeto) return;

    // ✅ Agora o backend retorna codigoProjeto em cada item,
    //    então conseguimos filtrar corretamente
    api.listarFinanciamentos()
      .then(lista => {
        const atual = lista.find(f => f.codigoProjeto === codigoProjeto);
        if (atual) {
          setFormData(atual);
        } else {
          alert("Nenhum financiamento encontrado para este projeto.");
        }
        setLoading(false);
      })
      .catch(() => {
        alert("Erro ao carregar financiamento.");
        setLoading(false);
      });
  }, [codigoProjeto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigoProjeto) {
      alert("Código do projeto não encontrado na URL.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.atualizarFinanciamentoPorProjeto(codigoProjeto, formData);
      if (res.ok) {
        alert("Financiamento atualizado com sucesso!");
        router.push('/financiamentos');
      } else {
        const msg = await res.text();
        alert(`Erro ao atualizar: ${msg}`);
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'valorTotal') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <span className="material-icons">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Editar Financiamento</h2>
          <p className="text-sm text-gray-500">Projeto Vinculado: {codigoProjeto}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Agência Financiadora *</label>
            <input
              required
              name="agenciaFinanciador"
              value={formData.agenciaFinanciador}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Tipo de Fomento</label>
            <select
              name="tipoFomento"
              value={formData.tipoFomento}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-500"
            >
              <option value="Auxílio Pesquisa">Auxílio Pesquisa</option>
              <option value="Bolsa">Bolsa</option>
              <option value="Equipamentos">Equipamentos</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Valor Total (R$) *</label>
            <input
              required
              type="number"
              step="0.01"
              name="valorTotal"
              value={formData.valorTotal}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Início da Vigência</label>
            <input
              required
              type="date"
              name="periodoVigenciaInicio"
              value={formData.periodoVigenciaInicio}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Fim da Vigência</label>
            <input
              required
              type="date"
              name="periodoVigenciaFim"
              value={formData.periodoVigenciaFim}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm font-bold text-gray-400">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-green-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <span className="material-icons animate-spin text-sm">sync</span> : <span className="material-icons text-sm">save</span>}
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
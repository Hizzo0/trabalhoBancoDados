'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Projeto, FinanciamentoDTO } from '@/types';

export default function NovoFinanciamentoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  const [projetoSelecionado, setProjetoSelecionado] = useState<string>('');

  const [formData, setFormData] = useState<FinanciamentoDTO>({
    agenciaFinanciador: '',
    tipoFomento: 'Auxílio Pesquisa',
    valorTotal: 0,
    periodoVigenciaInicio: '', // Nome corrigido para coincidir com o DTO
    periodoVigenciaFim: ''
  });

  useEffect(() => {
    // UC04 - Carrega projetos para o select de vínculo
    api.listarProjetos().then(setProjetos).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resFinan = await api.cadastrarFinanciamento(formData);
      
      if (resFinan.ok) {
        const novoFinanciamento = await resFinan.json();

        // Se houver um projeto selecionado, realiza o vínculo (UC07)
        if (projetoSelecionado) {
          await api.vincularFinanciamento(novoFinanciamento.id, Number(projetoSelecionado));
        }

        alert("Financiamento cadastrado com sucesso!");
        router.push('/financiamentos');
      } else {
        const errorMsg = await resFinan.text();
        alert(`Erro ao cadastrar: ${errorMsg}`);
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // CORREÇÃO: Evita o erro de NaN no input de valor
    if (name === 'valorTotal') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <span className="material-icons">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Novo Financiamento</h2>
          <p className="text-sm text-gray-500">Registe recursos financeiros e vincule a projetos ativos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Agência Financiadora *</label>
            <input
              required
              name="agenciaFinanciador"
              value={formData.agenciaFinanciador}
              onChange={handleChange}
              placeholder="Ex: CNPq, FAPES, Capes"
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
              <option value="Evento Científico">Evento Científico</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Valor Total (R$) *</label>
            <input
              required
              type="number"
              step="0.01"
              name="valorTotal"
              // CORREÇÃO: Garante que o valor nunca seja NaN no atributo value
              value={isNaN(formData.valorTotal) ? '' : formData.valorTotal}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Vincular ao Projeto</label>
            <select
              value={projetoSelecionado}
              onChange={(e) => setProjetoSelecionado(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 font-bold text-blue-600"
            >
              <option value="">Nenhum vínculo inicial</option>
              {projetos.map(p => (
                <option key={p.id} value={p.id}>{p.codigoUnico} - {p.titulo}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Início da Vigência *</label>
            <input
              required
              type="date"
              // CORREÇÃO: name alterado para coincidir com a chave do estado
              name="periodoVigenciaInicio" 
              value={formData.periodoVigenciaInicio}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Fim da Vigência *</label>
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

        <div className="pt-6 flex justify-end gap-3">
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
            className="px-8 py-3 bg-green-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? (
              <span className="material-icons animate-spin text-sm">sync</span>
            ) : (
              <span className="material-icons text-sm">check_circle</span>
            )}
            Salvar Financiamento
          </button>
        </div>
      </form>
    </div>
  );
}
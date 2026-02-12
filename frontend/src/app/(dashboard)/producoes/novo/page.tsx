'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Projeto, ProducaoDTO } from '@/types';

export default function NovaProducaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  // Estado para o vínculo com o projeto (UC08)
  const [projetoCodigo, setProjetoCodigo] = useState<string>('');

  // Estado inicial baseado nos atributos da classe Produção Científica
  const [formData, setFormData] = useState<ProducaoDTO>({
    titulo: '',
    tipoProducao: 'Artigo',
    anoPublicacao: 0,
    meioDivulgacao: ''
  });

  // Carrega projetos para permitir a associação (UC08)
  useEffect(() => {
    api.listarProjetos().then(setProjetos).catch(console.error);
  }, []);

  // Dentro do handleSubmit em NovaProducaoPage
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 1. Pega o CPF do docente logado (sessionStorage)
  const userJson = sessionStorage.getItem('usuarioLogado');
  const user = userJson ? JSON.parse(userJson) : null;
  const cpfLogado = user?.usuario?.cpf;

  if (!cpfLogado) {
    alert("Sessão expirada. Faça login novamente.");
    return;
  }

  try {
  // Cria uma cópia dos dados convertendo o ano para número
  const dadosFormatados = {
    ...formData,
    anoPublicacao: parseInt(formData.anoPublicacao.toString())
  };

  const res = await api.cadastrarProducao(
    dadosFormatados, 
    cpfLogado, 
    projetoCodigo // Usa o estado projetoCodigo que está no seu select
  );

  if (res.ok) {
    alert("Produção científica registada com sucesso!");
    router.push('/producoes');
  } else {
    const msg = await res.text();
    alert(`Erro do Servidor: ${msg}`);
  }
} catch (err) {
  alert("Erro de conexão.");
}
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <span className="material-icons">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Nova Produção Científica</h2>
          <p className="text-sm text-gray-500">Registe publicações, artigos ou livros vinculados à sua pesquisa</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Título da Produção */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Título da Produção *</label>
          <input
            required
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Análise de Dados em Sistemas de Informação"
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Produção (UC05) */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Tipo de Produção</label>
            <select
              name="tipoProducao"
              value={formData.tipoProducao}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#3498db]"
            >
              <option value="Artigo">Artigo</option>
              <option value="Livro">Livro</option>
              <option value="Capítulo de Livro">Capítulo de Livro</option>
              <option value="Resumo em Evento">Resumo em Evento</option>
              <option value="Relatório Técnico">Relatório Técnico</option>
            </select>
          </div>

          {/* Vínculo com Projeto (UC08) */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Projeto de Origem *</label>
            <select
              required
              value={projetoCodigo}
              onChange={(e) => setProjetoCodigo(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#3498db] font-bold text-[#3498db]"
            >
              <option value="">Selecionar projeto...</option>
              {projetos.map(p => (
                <option key={p.codigoUnico} value={p.codigoUnico}>{p.titulo}</option>
              ))}
            </select>
          </div>

          {/* Ano de Publicação */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Ano de Publicação *</label>
            <input
              required
              type="number"
              min="1900"
              max="2099"
              name="anoPublicacao"
              value={formData.anoPublicacao}
              onChange={handleChange}
              placeholder="AAAA"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]"
            />
          </div>

          {/* Meio de Divulgação */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Meio de Divulgação *</label>
            <input
              required
              name="meioDivulgacao"
              value={formData.meioDivulgacao}
              onChange={handleChange}
              placeholder="Ex: Revista IEEE, Conferência de BD"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#3498db] text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#2980b9] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <span className="material-icons animate-spin text-sm">sync</span> : <span className="material-icons text-sm">cloud_upload</span>}
            Finalizar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
}
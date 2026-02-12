'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Projeto } from '@/types';
import Link from 'next/link';

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTodosOsProjetos = async () => {
      try {
        // CORREÇÃO: Voltando para a listagem global do banco de dados
        const dados = await api.listarProjetos();
        setProjetos(dados);
      } catch (error) {
        console.error("Erro ao carregar a lista global de projetos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTodosOsProjetos();
  }, []);

  const handleExcluir = async (codigo: string) => {
    if (!confirm("Tem a certeza que deseja excluir este projeto?")) return;
    
    try {
      const res = await api.excluirProjeto(codigo);
      if (res.ok) {
        setProjetos(projetos.filter(p => p.codigoUnico !== codigo));
      } else {
        alert("Erro ao excluir. Verifique se existem vínculos ativos no banco.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="material-icons animate-spin text-4xl text-[#3498db]">sync</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Todos os Projetos</h2>
          <p className="text-sm text-gray-500">Listagem completa de pesquisas cadastradas no SIGPesq</p>
        </div>
        <Link 
          href="/projetos/novo"
          className="flex items-center gap-2 bg-[#3498db] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#2980b9] transition-all"
        >
          <span className="material-icons text-sm">add</span>
          NOVO PROJETO
        </Link>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Título</th>
              <th className="p-4">Data Início</th>
              <th className="p-4">Situação</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projetos.map((projeto) => (
              <tr key={projeto.codigoUnico} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-bold text-[#3498db]">{projeto.codigoUnico}</td>
                <td className="p-4 text-sm font-medium text-[#2c3e50] max-w-xs truncate">
                  {projeto.titulo}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {projeto.dataInicio ? new Date(projeto.dataInicio).toLocaleDateString('pt-BR') : '---'}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    projeto.situacao === 'ANDAMENTO' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {projeto.situacao}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <Link href={`/projetos/${projeto.codigoUnico}/equipe`} className="p-2 text-gray-400 hover:text-[#3498db]">
                    <span className="material-icons">groups</span>
                  </Link>
                  <button onClick={() => handleExcluir(projeto.codigoUnico)} className="p-2 text-gray-400 hover:text-red-500">
                    <span className="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projetos.length === 0 && (
          <div className="p-10 text-center text-gray-400 italic">
            Nenhum projeto registrado no sistema.
          </div>
        )}
      </div>
    </div>
  );
}
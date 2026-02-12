'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api'; // Importando seu serviço central

// 1. Definição da interface conforme os dados do backend
interface Financiamento {
  id: number;
  valorTotal: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    projetos: 0,
    financiamento: 0,
    producoes: 0
  });

  // CORREÇÃO: Mesma lógica usada na Sidebar para evitar Hydration Mismatch
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchStats() {
      try {
        // Utilizando o método listarProjetos da sua api.ts
        const [projetos, resFinan] = await Promise.all([
          api.listarProjetos(),
          fetch('http://localhost:8080/api/financiamentos').then(res => res.json())
        ]);
        const [producao, resProd] = await Promise.all([
          api.listarProducoes(),
          fetch('http://localhost:8080/api/producoes').then(res => res.json())
        ]);

        const financiamentos: Financiamento[] = resFinan;
        const totalFinan = financiamentos.reduce((acc, f) => acc + f.valorTotal, 0);

        setStats({
          projetos: projetos.length,
          financiamento: totalFinan,
          producoes: producao.length
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    }

    fetchStats();
  }, [mounted]);

  // Define permissões (Coordenador/Docente possui departamento conforme sua Sidebar)
  const isCoordenador = user?.departamento !== undefined;

  // Enquanto não montado no cliente, não renderiza para evitar erro de hidratação
  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mensagem de Boas-vindas */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-[#2c3e50]">
          Olá, {user?.nome?.split(' ')[0] || 'Usuário'}!
        </h2>
        <p className="text-gray-500 mt-2">Bem-vindo ao SIGPesq. Aqui está o resumo das atividades.</p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-[#3498db] hover:shadow-md transition-shadow">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Projetos Ativos</h3>
          <p className="text-4xl font-bold text-[#2c3e50] mt-4">{stats.projetos}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-green-500 hover:shadow-md transition-shadow">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Financiamentos</h3>
          <p className="text-4xl font-bold text-[#2c3e50] mt-4">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL', 
              notation: 'compact' 
            }).format(stats.financiamento)}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-red-500 hover:shadow-md transition-shadow">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Produções (2025)</h3>
          <p className="text-4xl font-bold text-[#2c3e50] mt-4">{stats.producoes}</p>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold text-[#2c3e50] mb-4">Ações Recentes</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
              <span className="material-icons text-blue-500 text-base">info</span>
              Consultar projetos vinculados (UC14)
            </li>
            {isCoordenador && (
              <li className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <span className="material-icons text-green-500 text-base">add_circle</span>
                Cadastrar novo projeto de pesquisa (UC03)
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
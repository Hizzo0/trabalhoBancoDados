'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  // IDENTIFICAÇÃO DOS ATORES (Baseada nos requisitos RN01 de cada UC)
  const isDocente = user?.departamento !== undefined; // 
  const isTecnico = user?.cargo !== undefined;       // 
  const isDiscente = user?.matricula !== undefined;   // 

  // Apenas Docentes podem ser Coordenadores (AT01/AT04) 
  const canManageResources = isDocente;

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/participantes/logout', { method: 'POST' });
      sessionStorage.removeItem('usuarioLogado');
      router.push('/login');
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', show: true },
    { name: 'Meus Projetos', icon: 'list', path: '/projetos', show: true },
    // Financiamentos e Produções são restritos ao Coordenador (Docente) [cite: 16]
    { name: 'Financiamentos', icon: 'attach_money', path: '/financiamentos', show: canManageResources },
    { name: 'Produções', icon: 'description', path: '/producoes', show: canManageResources },
  ];

  if (!mounted) return null;

  return (
    <aside className="fixed left-0 top-0 flex h-full w-[260px] flex-col bg-[#2c3e50] p-6 text-white z-50 shadow-xl transition-all max-md:w-20 max-md:p-4">
      <div className="mb-10 flex items-center gap-3 border-b border-white/10 pb-5">
        <span className="material-icons text-3xl text-[#3498db]">science</span>
        <h2 className="text-xl font-bold tracking-tight max-md:hidden">SIGPesq</h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.filter(item => item.show).map(item => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  pathname === item.path ? 'bg-[#3498db] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                <span className="font-medium max-md:hidden">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <div className="mb-4 flex items-center gap-3 px-2 max-md:hidden">
          <div className="h-10 w-10 rounded-full bg-[#3498db]/20 flex items-center justify-center text-[#3498db]">
            <span className="material-icons">account_circle</span>
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold">{user?.nome || 'Usuário'}</p>
            {/* RÓTULO DINÂMICO DE PERFIL  */}
            <p className="text-[10px] uppercase text-gray-500 font-bold">
              {isDocente ? 'Docente' : isTecnico ? 'Técnico ADM' : 'Discente'}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all">
          <span className="material-icons text-lg">logout</span>
          <span className="max-md:hidden text-[11px] uppercase">Sair</span>
        </button>
      </div>
    </aside>
  );
}
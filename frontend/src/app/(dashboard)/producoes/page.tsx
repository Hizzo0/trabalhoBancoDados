'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import {ProducaoDTO} from '../../../types'
import Link from 'next/link';

export default function ProducoesPage() {
  const [producoes, setProducoes] = useState<ProducaoDTO[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    api.listarProducoes().then(setProducoes).catch(console.error);
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Produções Científicas</h2>
          <p className="text-sm text-gray-500">Artigos, livros e relatórios técnicos gerados</p>
        </div>
        <Link 
          href="/producoes/novo" 
          className="bg-[#3498db] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#2980b9] transition-all flex items-center gap-2"
        >
          <span className="material-icons text-sm">publish</span> NOVA PRODUÇÃO
        </Link>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Ano</th>
              <th className="p-4">Meio de Divulgação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {producoes.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-bold text-[#2c3e50]">{p.titulo}</td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {p.tipoProducao}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">{p.anoPublicacao}</td>
                <td className="p-4 text-sm text-gray-400 italic">{p.meioDivulgacao}</td>
              </tr>
            ))}
            {producoes.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                  Nenhuma produção científica registada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
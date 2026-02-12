'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api'; 
import Link from 'next/link';
import { FinanciamentoDTO } from '@/types';

export default function FinanciamentosPage() {
  const [financiamentos, setFinanciamentos] = useState<FinanciamentoDTO[]>([]);
  const [mounted, setMounted] = useState(false);

  const carregarDados = () => {
    // UC04 - Listar financiamentos conforme requisitos
    api.listarFinanciamentos()
      .then(setFinanciamentos)
      .catch(err => console.error("Erro ao carregar financiamentos:", err));
  };

  useEffect(() => {
    // CORREÇÃO: Usando requestAnimationFrame para evitar cascading renders síncronos
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });

    carregarDados();

    return () => cancelAnimationFrame(handle);
  }, []);

  // UC10 - Excluir Financiamento
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Deseja realmente excluir este financiamento? Isso removerá o vínculo com o projeto.")) {
      try {
        const res = await api.excluirFinanciamento(id);
        if (res.ok) {
          alert("Financiamento removido com sucesso!");
          carregarDados();
        } else {
          alert("Não foi possível excluir. Verifique se existem restrições no servidor.");
        }
      } catch (error) {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  // Função de segurança para formatação de datas
  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "N/A";
    const data = new Date(dataStr);
    
    // Ajuste para evitar o problema de fuso horário que "atrasa" a data em um dia
    const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    
    return isNaN(dataAjustada.getTime()) ? "Data Inválida" : dataAjustada.toLocaleDateString('pt-BR');
  };

  // Evita Hydration Mismatch
  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#2c3e50]">Financiamentos</h2>
          <p className="text-sm text-gray-500">Gestão de recursos e agências financiadoras do sistema</p>
        </div>
        <Link 
          href="/financiamentos/novo" 
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <span className="material-icons">add_card</span> NOVO RECURSO
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financiamentos.map((f: FinanciamentoDTO) => (
          <div key={f.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                {f.tipoFomento}
              </span>
              <button 
                onClick={() => handleDelete(f.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
                title="Excluir financiamento"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-[#2c3e50]">{f.agenciaFinanciador}</h3>
            
            <p className="text-2xl font-black text-green-600 mt-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.valorTotal)}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-50 text-[11px] text-gray-400 flex justify-between font-medium">
              <div className="flex items-center gap-1">
                <span className="material-icons text-[12px]">calendar_today</span>
                <span>INÍCIO: {formatarData(f.periodoVigenciaInicio)}</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <span className="material-icons text-[12px]">event_busy</span>
                <span>FIM: {formatarData(f.periodoVigenciaFim)}</span>
              </div>
            </div>
          </div>
        ))}

        {financiamentos.length === 0 && (
          <div className="col-span-full p-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            <span className="material-icons text-4xl mb-2">account_balance_wallet</span>
            <p className="font-medium">Nenhum financiamento registado para as pesquisas atuais.</p>
          </div>
        )}
      </div>
    </div>
  );
}
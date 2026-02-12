'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TipoUsuario = 'DISCENTE' | 'DOCENTE' | 'TECNICO';
//teste
export default function CadastroPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tipo, setTipo] = useState<TipoUsuario>('DISCENTE');
  const [loading, setLoading] = useState(false);

  // Estado com todos os campos necessários conforme RN01 e Diagrama de Classes
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    lattes: '',
    cpf: '',         // Atributo da classe Participante [cite: 620]
    matricula: '',   // Atributo da classe Discente [cite: 610]
    departamento: '',// Atributo da classe Docente [cite: 607]
    cargo: ''        // Atributo da classe Técnico [cite: 608]
  });

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = tipo === 'DISCENTE' ? '/participantes/discentes' : 
                       tipo === 'DOCENTE' ? '/participantes/docentes' : 
                       '/participantes/tecnicos';

      const res = await fetch(`http://localhost:8080/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        router.push('/login');
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

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2c3e50] to-[#34495e] p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl">
        <header className="mb-8 text-center">
          <span className="material-icons text-4xl text-[#3498db]">person_add</span>
          <h1 className="text-2xl font-bold text-[#2c3e50]">Cadastro SIGPesq</h1>
          <p className="text-sm text-gray-500">Crie sua conta institucional</p>
        </header>

        {/* Seleção de Tipo */}
        <div className="mb-8 flex p-1 bg-gray-100 rounded-xl">
          {(['DISCENTE', 'DOCENTE', 'TECNICO'] as TipoUsuario[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tipo === t ? 'bg-white text-[#3498db] shadow-sm' : 'text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleCadastro} className="space-y-4">
          {/* Campos Comuns (Participante) */}
          <input required name="nome" placeholder="Nome Completo" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          <input required name="cpf" placeholder="CPF (apenas números)" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          <input required name="email" type="email" placeholder="E-mail Institucional" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          <input required name="senha" type="password" placeholder="Senha" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          <input required name="lattes" placeholder="Link Currículo Lattes" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />

          {/* Campos Específicos por Ator */}
          {tipo === 'DISCENTE' && (
            <input required name="matricula" placeholder="Matrícula" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          )}

          {tipo === 'DOCENTE' && (
            <input required name="departamento" placeholder="Departamento" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          )}

          {tipo === 'TECNICO' && (
            <input required name="cargo" placeholder="Cargo" onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#3498db]" />
          )}

          <button
            disabled={loading}
            className="w-full py-4 bg-[#3498db] text-white rounded-xl font-bold shadow-lg hover:bg-[#2980b9] transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESSANDO...' : 'FINALIZAR CADASTRO'}
          </button>
        </form>
      </div>
    </div>
  );
}
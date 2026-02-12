'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:8080/api/participantes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }), // Baseado no LoginDTO
      });

      if (response.ok) {
        const usuario = await response.json();
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario)); // Mantendo a lógica do seu script
        router.push('/dashboard');
      } else {
        const mensagem = await response.text();
        setErro(mensagem || 'Falha na autenticação'); // Resposta do ParticipanteController
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    // Fundo com gradiente institucional baseado no seu CSS original
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2c3e50] to-[#1a252f] p-4 font-sans">
      <div className="w-full max-w-md transform transition-all">
        <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
          {/* Header do Card */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <span className="material-icons text-4xl text-[#3498db]">science</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#2c3e50]">Acesso SIGPesq</h2>
            <p className="mt-2 text-sm text-gray-500">Universidade Federal do Espírito Santo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo CPF */}
            <div className="space-y-1 text-left">
              <label htmlFor="login-cpf" className="text-sm font-semibold text-gray-700">
                CPF
              </label>
              <input
                type="text"
                id="login-cpf"
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-[#3498db] focus:ring-2 focus:ring-[#3498db]/20"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-1 text-left">
              <label htmlFor="login-senha" className="text-sm font-semibold text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="login-senha"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-[#3498db] focus:ring-2 focus:ring-[#3498db]/20"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="rounded-md bg-red-50 p-3 ring-1 ring-red-200">
                <p className="text-center text-xs font-medium text-[#e74c3c]">{erro}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-[#3498db] py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-[#2980b9] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
            >
              {carregando ? 'Verificando...' : 'ENTRAR'}
            </button>
          </form>

          {/* Footer do Login */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm">
            <a href="#" className="font-medium text-[#3498db] hover:text-[#2980b9] hover:underline">
              Esqueci minha senha
            </a>
            <div className="mt-2">
              <span className="text-gray-500 text-xs">Primeiro acesso? </span>
              <a href="/cadastro" className="font-semibold text-[#2c3e50] hover:underline">
                Cadastre-se aqui
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
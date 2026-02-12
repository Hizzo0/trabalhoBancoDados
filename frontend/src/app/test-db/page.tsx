import { getProjetos } from '@/services/api';
import { Projeto } from '@/types';

export default async function TestConnectionPage() {
  // 1. Tenta buscar os dados do Spring Boot (porta 8080)
  const projetos = await getProjetos().catch(() => null);

  // 2. Se a busca falhar (retornar null), renderiza a interface de erro
  if (projetos === null) {
    return (
      <main style={{ padding: '2rem', color: 'red', fontFamily: 'sans-serif' }}>
        <h1>Erro na Conexão</h1>
        <p>Não foi possível buscar os dados do backend.</p>
        <p>Verifique se o Spring Boot está rodando na porta 8080 e se o MySQL (db_sigpesq) está ativo.</p>
      </main>
    );
  }

  // 3. Se funcionar, renderiza a interface principal com os dados do banco
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Teste de Conexão: SIGPesq</h1>
      <p style={{ color: 'green' }}>✓ Conexão com Spring Boot estabelecida!</p>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Projetos no Banco (db_sigpesq):</h2>
        {projetos.length === 0 ? (
          <p>Nenhum projeto encontrado. Verifique se você populou as tabelas com os comandos INSERT.</p>
        ) : (
          <ul>
            {projetos.map((proj: Projeto) => (
              <li key={proj.id} style={{ marginBottom: '10px' }}>
                <strong>{proj.id}</strong> - {proj.titulo} 
                <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#666' }}>
                  ({proj.situacao === 1 ? 'Em andamento' : 'Inativo'})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
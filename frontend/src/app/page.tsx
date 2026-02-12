import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Bem-vindo ao SIGPesq</h1>
      <Link href="/login">
        <button>Ir para o Login</button>
      </Link>
    </main>
  );
}
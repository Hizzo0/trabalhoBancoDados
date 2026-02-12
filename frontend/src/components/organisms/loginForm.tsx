'use client';
import { useState } from 'react';
import { authService } from '@/services/authService';

export const LoginForm = () => {
  const [formData, setFormData] = useState({ cpf: '', senha: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.login(formData);
      alert(`Bem-vindo, ${data.user.nome}!`);
      // Aqui você redirecionaria para /dashboard
    } catch (err) {
      alert('Falha no login. Verifique os dados.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input 
        type="text" 
        placeholder="CPF" 
        onChange={(e) => setFormData({...formData, cpf: e.target.value})} 
      />
      <input 
        type="password" 
        placeholder="Senha" 
        onChange={(e) => setFormData({...formData, senha: e.target.value})} 
      />
      <button type="submit">Entrar no SIGPesq</button>
    </form>
  );
};
import { AuthResponse } from './../types/auth';
import { Participante } from './../types/auth';
const BASE_URL = 'http://localhost:8080/api';

export const authService = {
  async login(credentials: { cpf: string; senha: string }): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('CPF ou senha inválidos');
    return response.json();
  },

  async register(data: Partial<Participante> & { senha: string }) {
    const response = await fetch(`${BASE_URL}/participantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
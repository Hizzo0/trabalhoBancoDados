export interface Participante {
  cpf: string;
  nome: string;
  email: string;
  link_lattes?: string; // Opcional, conforme o erro do banco
  ativo: boolean;
}

export interface AuthResponse {
  user: Participante;
  token?: string; // Caso use JWT no futuro
}
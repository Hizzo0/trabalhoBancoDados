// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export interface Usuario {
  nome: string;
  email: string;
  cpf: string;
  departamento?: string;
  matricula?: string;
  cargo?: string;
  isDocente: boolean;
  isDiscente: boolean;
  isTecnico: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(() => {
    const savedUser = typeof window !== 'undefined' ? sessionStorage.getItem('usuarioLogado') : null;
    if (!savedUser) return null;

    try {
      const parsed = JSON.parse(savedUser);
      
      // AJUSTE AQUI: O seu backend envia "usuario", não "user"
      const userData = parsed.usuario ? parsed.usuario : parsed;

      return {
        ...userData,
        // Usamos a "autoridade" enviada pelo backend para maior precisão
        isDocente: parsed.autoridade === 'DOCENTE' || !!userData.departamento,
        isDiscente: parsed.autoridade === 'DISCENTE' || !!userData.matricula,
        isTecnico: parsed.autoridade === 'TECNICO' || !!userData.cargo
      };
    } catch {
      return null;
    }
  });

  return { 
    user, 
    isAdmin: !!user?.isDocente,
    isAuthenticated: !!user 
  };
}
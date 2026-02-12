// Baseado em Participante.java e LoginDTO.java
export interface LoginDTO {
  cpf: string;
  senha: string;
}

// Baseado em ProjetoDTO.java
export interface ProjetoDTO {
  codigoUnico: string;
  titulo: string;
  descricao: string;
  situacao: string;
  dataInicio: string; // ISO string para LocalDate
  dataFim?: string;
  cpfCoordenador: string;
  agenciaFinanciador?: string;
}

// Interface para exibição (Baseado em Projeto.java)
export interface Projeto {
  id: number;
  codigoUnico: string;
  titulo: string;
  situacao: string;
  dataInicio: string;
}

export interface FinanciamentoDTO {
  id?: number;
  agenciaFinanciador: string;
  tipoFomento: string;
  valorTotal: number;
  periodoVigenciaInicio: string; 
  periodoVigenciaFim: string;
}

export interface ProducaoDTO {
  id?: number;
  titulo: string;
  tipoProducao: string; // Ex: Artigo, Resumo, Livro
  anoPublicacao: number;
  meioDivulgacao: string;
  projetoCodigo?: string; // Para o vínculo (UC08)
}
import { Projeto, LoginDTO, FinanciamentoDTO, ProducaoDTO } from '../types';

// --- INTERFACES DE PARTICIPANTES (Baseadas no Diagrama de Classes) ---

export interface ParticipanteDTO {
  nome: string;
  email: string;
  cpf: string;
  senha?: string; 
  lattes: string;
}

export interface DocenteDTO extends ParticipanteDTO {
  departamento: string;
}

export interface DiscenteDTO extends ParticipanteDTO {
  matricula: string;
}

export interface TecnicoDTO extends ParticipanteDTO {
  cargo: string;
}

// Interface para envio de dados de projeto
export interface ProjetoDTO {
  codigoUnico: string;
  titulo: string;
  descricao: string;
  situacao: string;
  dataInicio: string; 
  dataFim?: string;
  cpfCoordenador: string;
  agenciaFinanciador?: string;
}

const API_BASE = "http://localhost:8080/api";

export const api = {
  // --- AUTENTICAÇÃO (UC16) ---
  login: (dados: LoginDTO) => 
    fetch(`${API_BASE}/participantes/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  logout: () => 
    fetch(`${API_BASE}/participantes/logout`, { method: 'POST' }),

  // --- PROJETOS (UC03) ---
  listarProjetos: (): Promise<Projeto[]> => 
    fetch(`${API_BASE}/projetos`).then(res => res.json()),

  obterProjeto: (codigo: string): Promise<ProjetoDTO> =>
  fetch(`${API_BASE}/projetos/codigo/${codigo}`).then(res => res.json()),

  cadastrarProjeto: (projeto: ProjetoDTO) => 
    fetch(`${API_BASE}/projetos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projeto)
    }),

  atualizarProjeto: (codigo: string, projeto: ProjetoDTO) =>
    fetch(`${API_BASE}/projetos/codigo/${codigo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projeto)
    }),

  excluirProjeto: (codigo: string) => 
    fetch(`${API_BASE}/projetos/codigo/${codigo}`, { method: 'DELETE' }),

  // --- PARTICIPANTES (UC01, UC02, UC15) ---
  listarTodosParticipantes: () =>
    fetch(`${API_BASE}/participantes`).then(res => res.json()),

  // Cadastro por tipo - Removido 'any'
  cadastrarDiscente: (dados: DiscenteDTO) => 
    fetch(`${API_BASE}/participantes/discentes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  cadastrarDocente: (dados: DocenteDTO) => 
    fetch(`${API_BASE}/participantes/docentes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  cadastrarTecnico: (dados: TecnicoDTO) => 
    fetch(`${API_BASE}/participantes/tecnicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  // Atualização por tipo - Removido 'any'
  atualizarDiscente: (cpf: string, dados: DiscenteDTO) =>
    fetch(`${API_BASE}/participantes/discentes/cpf/${cpf}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  atualizarDocente: (cpf: string, dados: DocenteDTO) =>
    fetch(`${API_BASE}/participantes/docentes/cpf/${cpf}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  atualizarTecnico: (cpf: string, dados: TecnicoDTO) =>
    fetch(`${API_BASE}/participantes/tecnicos/cpf/${cpf}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  excluirParticipante: (cpf: string) =>
    fetch(`${API_BASE}/participantes/cpf/${cpf}`, { method: 'DELETE' }),

  // --- FINANCIAMENTOS (UC04, UC07) ---
  listarFinanciamentos: (): Promise<FinanciamentoDTO[]> => 
    fetch(`${API_BASE}/financiamentos`).then(res => res.json()),

  cadastrarFinanciamento: (dados: FinanciamentoDTO) => 
    fetch(`${API_BASE}/financiamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),

  vincularFinanciamento: (idFinanciamento: number, idProjeto: number) =>
    fetch(`${API_BASE}/financiamentos/${idFinanciamento}/vincular/${idProjeto}`, {
      method: 'POST'
    }),
  excluirFinanciamento: (id: number) => 
    fetch(`${API_BASE}/financiamentos/${id}`, { method: 'DELETE' }),

  // --- VÍNCULOS (UC06, UC10) ---
  vincularParticipante: (codigoProjeto: string, cpfParticipante: string, funcao: string) => 
    fetch(`${API_BASE}/vinculos/vincular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        codigoProjeto,      // Verifique se no Java o campo é 'codigoProjeto' ou 'projetoCodigo'
        cpfParticipante,    // Verifique se no Java o campo é 'cpfParticipante' ou 'participanteCpf'
        funcao              // Deve coincidir exatamente com os valores do ENUM no Java (ex: "BOLSISTA", "VOLUNTARIO")
      })
    }),

  desvincularParticipante: (codigoProjeto: string, cpfParticipante: string) =>
    fetch(`${API_BASE}/vinculos/desvincular?codigoProjeto=${codigoProjeto}&cpfParticipante=${cpfParticipante}`, {
      method: 'DELETE'
    }),

  listarParticipantesDoProjeto: (codigoProjeto: string) =>
    fetch(`${API_BASE}/vinculos/projeto/${codigoProjeto}/participantes`).then(res => res.json()),

  listarProducoes: (): Promise<ProducaoDTO[]> =>
    fetch(`${API_BASE}/producoes`).then(res => res.json()),

  cadastrarProducao: (dados: ProducaoDTO, cpfParticipante: string, codigoProjeto: string) => {
  // Constrói a URL com os parâmetros exigidos pelo @RequestParam do Java
  const url = new URL(`${API_BASE}/producoes`);
  url.searchParams.append('cpfParticipante', cpfParticipante);
  url.searchParams.append('codigoProjeto', codigoProjeto);

  return fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
},

  vincularProducaoAProjeto: (producaoId: number, projetoCodigo: string) =>
    fetch(`${API_BASE}/vinculos/producao/${producaoId}/projeto/${projetoCodigo}`, {
      method: 'POST'
    }),

    listarMeusProjetos: (cpf: string): Promise<Projeto[]> => 
    fetch(`${API_BASE}/projetos/meus/${cpf}`).then(res => res.json()),
};
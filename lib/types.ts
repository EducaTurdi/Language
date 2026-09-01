export type TipoUsuario = "aluno" | "professor" | "colaborador" | "admin";

export interface Profile {
  id: string;
  nome: string;
  tipo: TipoUsuario;
  turma: string | null;
  escola_id: string | null;
  cargo: string | null;
  primeiro_acesso: boolean;
  created_at: string;
}

export interface Escola {
  id: string;
  nome: string;
  cidade: string | null;
  criado_em: string;
}

export interface Turma {
  id: string;
  nome: string;
  nivel: string;
  periodo: string;
  sala: string | null;
  responsavel: string | null;
  escola_id: string | null;
  nivel_ingles: string | null;
  created_at: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  disciplina: string | null;
  professor_id: string | null;
  turmas: string[];
  prazo: string;
  pontos: number;
  grau: "importante" | "normal" | "opcional";
  created_at: string;
}

export interface Entrega {
  id: string;
  tarefa_id: string;
  aluno_id: string;
  status: "pendente" | "entregue" | "atrasado" | "recusada";
  entregue_em: string | null;
  resposta: string | null;
  arquivo_url: string | null;
  nota_obtida: number | null;
  motivo_recusa: string | null;
}

export interface Apostila {
  id: string;
  titulo: string;
  descricao: string | null;
  disciplina: string | null;
  professor_id: string | null;
  turmas: string[];
  emoji: string;
  arquivo_url: string | null;
  created_at: string;
}

export interface Resumo {
  id: string;
  titulo: string;
  descricao: string | null;
  disciplina: string | null;
  professor_id: string | null;
  turmas: string[];
  tipo_arquivo: string | null;
  arquivo_url: string | null;
  created_at: string;
}

export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  prioridade: "alta" | "normal" | "baixa";
  autor_id: string | null;
  created_at: string;
}

export interface Notificacao {
  id: string;
  destinatario_id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
}

export interface DesempenhoMensal {
  aluno_id: string;
  turma_id: string;
  ano: number;
  mes: number;
  pontos_obtidos: number;
  meta_pontos: number;
  status: "em_dia" | "alerta" | "reprovado";
}

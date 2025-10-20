export enum LawType {
  DECRETO = 'Decreto',
  LEI = 'Lei',
  NORMA = 'Norma'
}

export enum Jurisdiction {
  UNIAO = 'União',
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal'
}

export enum AssociatedProcess {
  CADASTRO_CONFIGURACOES = 'Cadastro de configurações',
  CADASTRO_TOMBAMENTO = 'Cadastro e tombamento de bens',
  INVENTARIOS = 'Inventários',
  TRANSFERENCIA_INTERNA = 'Transferência interna',
  TRANSFERENCIA_EXTERNA = 'Transferência externa',
  DOACAO = 'Doação',
  VENDA = 'Venda',
  PERMUTA = 'Permuta',
  REAVALIACAO = 'Reavaliação',
  BAIXA_DESCARTE = 'Baixa e descarte de bens',
  CESSAO_EMPRESTIMO = 'Cessão e empréstimo de bens'
}

export interface Law {
  id: number;
  name: string;
  number: string;
  type: LawType;
  jurisdiction: Jurisdiction;
  associated_process: AssociatedProcess;
  publication_date: string;
  description: string;
  link: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLawInput {
  name: string;
  number: string;
  type: LawType;
  jurisdiction: Jurisdiction;
  associated_process: AssociatedProcess;
  publication_date: string;
  description: string;
  link: string;
}

export interface UpdateLawInput extends Partial<CreateLawInput> {
  id: number;
}

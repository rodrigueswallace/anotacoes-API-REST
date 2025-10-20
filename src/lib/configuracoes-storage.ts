// Sistema de armazenamento centralizado para configurações
// Permite vinculação dinâmica entre Órgão, Área, Unidade e Setor

export interface Orgao {
  id: string;
  nome: string;
  sigla: string;
  cnpj: string;
  poder: 'executivo' | 'legislativo' | 'judiciario' | 'ministerio-publico' | 'defensoria-publica';
  telefone?: string;
  email?: string;
  uf: string;
  municipio: string;
  cep?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  area?: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
}

export interface Area {
  id: string;
  nome: string;
  sigla?: string;
  orgao_vinculado?: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
}

export interface Unidade {
  id: string;
  nome: string;
  sigla: string;
  areaVinculada: string;
  status: string;
}

export interface Setor {
  id: string;
  nome: string;
  orgaoId: string;
  unidadeId: string;
  descricao: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
}

export interface EstadoConservacao {
  id: string;
  nome: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
}

export interface LeiAplicavel {
  id: string;
  nome: string;
  numero: string;
  tipo_norma: 'lei' | 'decreto' | 'portaria' | 'resolucao' | 'instrucao-normativa';
  esfera: 'federal' | 'estadual' | 'municipal';
  termo_associado?: 'licitacoes' | 'orcamento' | 'patrimonio' | 'contratos' | 'financeiro';
  data_publicacao: string;
  resumo: string;
  link_norma?: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  documents?: any[];
}

export interface MetodoAquisicao {
  id: string;
  nome: string;
  codigo_interno: string;
  exige_documento: boolean;
  descricao: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  anexos_obrigatorios?: string[];
}

export interface FornecedorTerceiro {
  id: string;
  nome: string;
  tipo_documento: string;
  cpf_cnpj: string;
  email: string;
  telefone?: string;
  representante_legal?: string;
  cep: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
}

export interface TipoInventario {
  id: string;
  nome: string;
  codigo_referencia?: string;
  frequencia: string;
  exige_comissao: boolean;
  descricao: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
}

export interface Convenio {
  id: string;
  codigo: string;
  nome: string;
  cnpj: string;
  entidade_concedente: string;
  objeto: string;
  data_inicio: string;
  data_fim: string;
  valor_total: string;
  fonte_recursos: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
}

export interface FonteRecurso {
  id: string;
  nome: string;
  descricao: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
}

export interface EntidadeCredenciada {
  id: string;
  nome_entidade: string;
  cnpj: string;
  tipo_entidade: string;
  esfera_administrativa: string;
  unidade_gestora_vinculada?: string;
  status_credencial: string;
  email_responsavel: string;
  telefone_responsavel?: string;
  observacoes_gerais?: string;
  // Campos de endereço
  cep?: string;
  uf?: string;
  municipio?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
  documents?: any[];
}


export interface GrupoBem {
  id: string;
  nome: string;
  codigo_contabil: string;
  depreciacao_aplicavel: boolean;
  veiculo_licenciavel: boolean;
  etiqueta_qrcode: boolean;
  percentual_depreciacao_anual: string;
  percentual_depreciacao_mensal: string;
  vida_util_anos: string;
  valor_residual: string;
  tipo_veiculo: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
}

export interface SubgrupoBem {
  id: string;
  nome: string;
  grupo: string;
  grupo_vinculado: string;
  percentual_depreciacao_anual?: number;
  percentual_depreciacao_mensal?: number;
  valor_residual?: number;
  tombo_manual: boolean;
  depreciacao_configuravel: boolean;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  data_alteracao?: string;
}

// Mock data para leis aplicáveis
const mockLeisAplicaveis: LeiAplicavel[] = [
  { 
    id: '1', 
    nome: 'Lei de Licitações e Contratos Administrativos', 
    numero: '8666/1993',
    tipo_norma: 'lei',
    esfera: 'federal',
    termo_associado: 'licitacoes',
    data_publicacao: '21/06/1993',
    resumo: 'Regulamenta o art. 37, inciso XXI, da Constituição Federal, institui normas para licitações e contratos da Administração Pública.',
    link_norma: 'http://www.planalto.gov.br/ccivil_03/leis/l8666cons.htm',
    status: 'ativo', 
    data_criacao: '15/01/2024' 
  },
  { 
    id: '2', 
    nome: 'Estatui normas gerais de direito financeiro', 
    numero: '4320/1964',
    tipo_norma: 'lei',
    esfera: 'federal',
    termo_associado: 'orcamento',
    data_publicacao: '17/03/1964',
    resumo: 'Estatui Normas Gerais de Direito Financeiro para elaboração e controle dos orçamentos e balanços da União, dos Estados, dos Municípios e do Distrito Federal.',
    link_norma: 'http://www.planalto.gov.br/ccivil_03/leis/l4320.htm',
    status: 'ativo', 
    data_criacao: '20/02/2024' 
  },
  { 
    id: '3', 
    nome: 'Nova Lei de Licitações e Contratos Administrativos', 
    numero: '14133/2021',
    tipo_norma: 'lei',
    esfera: 'federal',
    termo_associado: 'licitacoes',
    data_publicacao: '01/04/2021',
    resumo: 'Lei de Licitações e Contratos Administrativos.',
    link_norma: 'http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm',
    status: 'ativo', 
    data_criacao: '05/03/2024' 
  },
];

// Mock data para órgãos (baseado em ConfiguracaoOrgaos)
const mockOrgaos: Orgao[] = [
  {
    id: '1',
    nome: 'Prefeitura Municipal de São Paulo',
    sigla: 'PMSP',
    cnpj: '46.395.000/0001-39',
    poder: 'executivo',
    telefone: '(11) 3113-9999',
    email: 'contato@prefeitura.sp.gov.br',
    uf: 'SP',
    municipio: 'sao-paulo',
    cep: '01013-001',
    bairro: 'Centro',
    logradouro: 'Viaduto do Chá',
    numero: '15',
    area: 'administracao-geral',
    status: 'ativo',
    data_criacao: '15/01/2024'
  },
  {
    id: '2',
    nome: 'Governo do Estado de São Paulo',
    sigla: 'GESP',
    cnpj: '46.374.500/0001-12',
    poder: 'executivo',
    telefone: '(11) 2193-8000',
    email: 'contato@sp.gov.br',
    uf: 'SP',
    municipio: 'sao-paulo',
    cep: '05650-000',
    bairro: 'Morumbi',
    logradouro: 'Av. Morumbi',
    numero: '4500',
    area: 'administracao-geral',
    status: 'ativo',
    data_criacao: '20/02/2024'
  },
  {
    id: '3',
    nome: 'Câmara Municipal de São Paulo',
    sigla: 'CMSP',
    cnpj: '59.770.001/0001-76',
    poder: 'legislativo',
    telefone: '(11) 3396-4000',
    email: 'contato@camara.sp.gov.br',
    uf: 'SP',
    municipio: 'sao-paulo',
    cep: '01013-001',
    bairro: 'Centro',
    logradouro: 'Palácio Anchieta - Pátio do Colégio',
    numero: '148',
    area: 'legislativo',
    status: 'ativo',
    data_criacao: '05/03/2024'
  },
  {
    id: '4',
    nome: 'Tribunal de Justiça de São Paulo',
    sigla: 'TJSP',
    cnpj: '51.174.001/0001-90',
    poder: 'judiciario',
    telefone: '(11) 3295-2000',
    email: 'contato@tjsp.jus.br',
    uf: 'SP',
    municipio: 'sao-paulo',
    cep: '01001-000',
    bairro: 'Centro',
    logradouro: 'Praça da Sé',
    numero: 's/n',
    area: 'judiciario',
    status: 'ativo',
    data_criacao: '12/01/2024'
  },
  {
    id: '5',
    nome: 'Ministério Público do Estado de São Paulo',
    sigla: 'MPSP',
    cnpj: '51.018.000/0001-15',
    poder: 'ministerio-publico',
    telefone: '(11) 3119-9000',
    email: 'contato@mpsp.mp.br',
    uf: 'SP',
    municipio: 'sao-paulo',
    cep: '01007-000',
    bairro: 'Centro',
    logradouro: 'Rua Riachuelo',
    numero: '115',
    area: 'ministerio-publico',
    status: 'ativo',
    data_criacao: '08/04/2024'
  }
];

// Mock data para áreas (baseado em ConfiguracaoAreas)
const mockAreas: Area[] = [
  {
    id: '1',
    nome: 'Área de Educação',
    sigla: 'AE',
    orgao_vinculado: '1', // Prefeitura SP
    descricao: 'Responsável pela gestão da educação municipal',
    status: 'ativo',
    data_criacao: '15/01/2024'
  },
  {
    id: '2',
    nome: 'Área de Saúde',
    sigla: 'AS',
    orgao_vinculado: '1', // Prefeitura SP
    descricao: 'Gestão do sistema de saúde municipal',
    status: 'ativo',
    data_criacao: '20/02/2024'
  },
  {
    id: '3',
    nome: 'Área de Obras Públicas',
    sigla: 'AOP',
    orgao_vinculado: '1', // Prefeitura SP
    descricao: 'Responsável pelas obras públicas municipais',
    status: 'ativo',
    data_criacao: '05/03/2024'
  },
  {
    id: '4',
    nome: 'Área de Administração',
    sigla: 'AA',
    orgao_vinculado: '2', // Governo SP
    descricao: 'Gestão administrativa estadual',
    status: 'inativo',
    data_criacao: '12/01/2024'
  },
  {
    id: '5',
    nome: 'Área de Fazenda',
    sigla: 'AF',
    orgao_vinculado: '2', // Governo SP
    descricao: 'Gestão financeira e tributária estadual',
    status: 'ativo',
    data_criacao: '08/04/2024'
  }
];

// Mock data para unidades (baseado em ConfiguracaoUnidades)
const mockUnidades: Unidade[] = [
  {
    id: '1',
    nome: 'Unidade Central de Educação',
    sigla: 'UCE',
    areaVinculada: '1', // SME
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Unidade Norte de Educação',
    sigla: 'UNE',
    areaVinculada: '1', // SME
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Unidade Central de Saúde',
    sigla: 'UCS',
    areaVinculada: '2', // SMS
    status: 'ativo'
  },
  {
    id: '4',
    nome: 'Unidade Sul de Saúde',
    sigla: 'USS',
    areaVinculada: '2', // SMS
    status: 'ativo'
  },
  {
    id: '5',
    nome: 'Unidade de Obras Centro',
    sigla: 'UOC',
    areaVinculada: '3', // SMO
    status: 'ativo'
  },
  {
    id: '6',
    nome: 'Unidade Administrativa Central',
    sigla: 'UAC',
    areaVinculada: '4', // SA
    status: 'ativo'
  }
];

// Mock data para setores (baseado em ConfiguracaoSetores)
const mockSetores: Setor[] = [
  {
    id: '1',
    nome: 'Departamento de Ensino Fundamental',
    orgaoId: '1', // Prefeitura SP
    unidadeId: '1', // Unidade Central de Educação
    descricao: 'Responsável pelo ensino fundamental municipal',
    status: 'ativo',
    data_criacao: '15/01/2024'
  },
  {
    id: '2',
    nome: 'Departamento de Ensino Médio',
    orgaoId: '1', // Prefeitura SP
    unidadeId: '2', // Unidade Norte de Educação
    descricao: 'Responsável pelo ensino médio municipal',
    status: 'ativo',
    data_criacao: '20/02/2024'
  },
  {
    id: '3',
    nome: 'Departamento de Atenção Básica',
    orgaoId: '1', // Prefeitura SP
    unidadeId: '3', // Unidade Central de Saúde
    descricao: 'Responsável pela atenção básica de saúde',
    status: 'ativo',
    data_criacao: '05/03/2024'
  },
  {
    id: '4',
    nome: 'Departamento de Emergência',
    orgaoId: '1', // Prefeitura SP
    unidadeId: '4', // Unidade Sul de Saúde
    descricao: 'Responsável pelos serviços de emergência',
    status: 'ativo',
    data_criacao: '12/01/2024'
  },
  {
    id: '5',
    nome: 'Departamento de Infraestrutura',
    orgaoId: '1', // Prefeitura SP
    unidadeId: '5', // Unidade de Obras Centro
    descricao: 'Responsável pela infraestrutura urbana',
    status: 'ativo',
    data_criacao: '08/04/2024'
  },
  {
    id: '6',
    nome: 'Departamento de Planejamento Urbano',
    orgaoId: '2', // Governo SP
    unidadeId: '6', // Unidade Administrativa Central
    descricao: 'Responsável pelo planejamento urbano',
    status: 'ativo',
    data_criacao: '25/02/2024'
  }
];

// Mock data para estados de conservação
const mockEstadosConservacao: EstadoConservacao[] = [
  {
    id: '1',
    nome: 'Excelente',
    descricao: 'Bem em perfeito estado de conservação, sem sinais de desgaste ou avarias.',
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Bom',
    descricao: 'Bem em bom estado, com pequenos sinais de uso normal, mas totalmente funcional.',
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Regular',
    descricao: 'Bem com sinais moderados de desgaste, necessita de pequenos reparos ou manutenção.',
    status: 'ativo'
  },
  {
    id: '4',
    nome: 'Ruim',
    descricao: 'Bem com desgaste significativo, necessita de reparos importantes para funcionamento adequado.',
    status: 'inativo'
  },
  {
    id: '5',
    nome: 'Péssimo',
    descricao: 'Bem em estado crítico, não funcional ou com sérios problemas estruturais.',
    status: 'inativo'
  }
];

// Mock data para métodos de aquisição
const mockMetodosAquisicao: MetodoAquisicao[] = [
  { 
    id: '1', 
    nome: 'Compra Direta', 
    codigo_interno: 'CD001',
    exige_documento: true,
    descricao: 'Aquisição através de compra direta do fornecedor', 
    status: 'ativo', 
    data_criacao: '15/01/2024',
    anexos_obrigatorios: ['Nota Fiscal', 'Comprovante de Pagamento']
  },
  { 
    id: '2', 
    nome: 'Licitação', 
    codigo_interno: 'LIC002',
    exige_documento: true,
    descricao: 'Aquisição através de processo licitatório público', 
    status: 'ativo', 
    data_criacao: '20/02/2024',
    anexos_obrigatorios: ['Edital', 'Ata de Julgamento', 'Contrato']
  },
  { 
    id: '3', 
    nome: 'Doação', 
    codigo_interno: 'DOA003',
    exige_documento: false,
    descricao: 'Recebimento através de doação de terceiros', 
    status: 'ativo', 
    data_criacao: '05/03/2024'
  },
  { 
    id: '4', 
    nome: 'Cessão', 
    codigo_interno: 'CES004',
    exige_documento: true,
    descricao: 'Recebimento através de cessão de outro órgão público', 
    status: 'inativo', 
    data_criacao: '12/01/2024',
    anexos_obrigatorios: ['Termo de Cessão']
  },
];

// Mock data para fornecedores e terceiros
const mockFornecedoresTerceiros: FornecedorTerceiro[] = [
  { 
    id: '1', 
    nome: 'Fornecedor A Ltda', 
    tipo_documento: 'CNPJ', 
    cpf_cnpj: '12.345.678/0001-90', 
    email: 'contato@fornecedora.com.br', 
    telefone: '(11) 9 8765-4321', 
    cep: '01310-100',
    uf: 'SP',
    municipio: 'São Paulo', 
    bairro: 'Centro',
    logradouro: 'Rua das Empresas',
    numero: '123',
    status: 'ativo', 
    data_criacao: '15/01/2024' 
  },
  { 
    id: '2', 
    nome: 'João Silva', 
    tipo_documento: 'CPF', 
    cpf_cnpj: '123.456.789-00', 
    email: 'joao.silva@email.com', 
    telefone: '(11) 9 1234-5678', 
    cep: '22071-900',
    uf: 'RJ', 
    municipio: 'Rio de Janeiro',
    bairro: 'Copacabana',
    logradouro: 'Av. Atlântica',
    numero: '456',
    status: 'ativo', 
    data_criacao: '20/02/2024' 
  },
  { 
    id: '3', 
    nome: 'TechCorp Equipamentos', 
    tipo_documento: 'CNPJ', 
    cpf_cnpj: '98.765.432/0001-10', 
    email: 'vendas@techcorp.com.br', 
    telefone: '(11) 9 9876-5432', 
    cep: '13025-320',
    uf: 'SP', 
    municipio: 'Campinas',
    bairro: 'Cambuí',
    logradouro: 'Rua da Tecnologia',
    numero: '789',
    status: 'inativo', 
    data_criacao: '05/03/2024' 
  },
];

// Mock data para tipos de inventário
const mockTiposInventario: TipoInventario[] = [
  { 
    id: '1', 
    nome: 'Inventário Anual', 
    codigo_referencia: 'INV-ANUAL-001',
    frequencia: 'Anual',
    exige_comissao: true,
    descricao: 'Inventário realizado anualmente conforme legislação', 
    status: 'ativo', 
    data_criacao: '15/01/2024' 
  },
  { 
    id: '2', 
    nome: 'Inventário Extraordinário', 
    codigo_referencia: 'INV-EXTRA-002',
    frequencia: 'Extraordinário',
    exige_comissao: false,
    descricao: 'Inventário realizado em situações especiais', 
    status: 'ativo', 
    data_criacao: '20/02/2024' 
  },
  { 
    id: '3', 
    nome: 'Inventário de Transferência', 
    codigo_referencia: 'INV-TRANS-003',
    frequencia: 'Por Demanda',
    exige_comissao: true,
    descricao: 'Inventário para transferência de bens entre setores', 
    status: 'ativo', 
    data_criacao: '05/03/2024' 
  },
  { 
    id: '4', 
    nome: 'Inventário Mensal', 
    codigo_referencia: 'INV-MENSAL-004',
    frequencia: 'Mensal',
    exige_comissao: false,
    descricao: 'Inventário realizado mensalmente para controle', 
    status: 'inativo', 
    data_criacao: '12/01/2024' 
  },
];

// Mock data para convênios
const mockConvenios: Convenio[] = [
  {
    id: '1',
    codigo: 'CNV-2024-001',
    nome: 'Convênio Educação 2024',
    cnpj: '12.345.678/0001-90',
    entidade_concedente: 'ministerio-educacao',
    objeto: 'Convênio para aquisição de equipamentos educacionais',
    data_inicio: '01/01/2024',
    data_fim: '31/12/2024',
    valor_total: 'R$ 500.000,00',
    fonte_recursos: 'federal',
    descricao: 'Convênio para aquisição de equipamentos educacionais para escolas municipais',
    status: 'ativo',
    data_criacao: '01/01/2024',
    data_alteracao: '15/03/2024'
  },
  {
    id: '2',
    codigo: 'CNV-2024-002',
    nome: 'Convênio Saúde Municipal',
    cnpj: '98.765.432/0001-10',
    entidade_concedente: 'ministerio-saude',
    objeto: 'Convênio para modernização de unidades de saúde',
    data_inicio: '01/02/2024',
    data_fim: '31/01/2025',
    valor_total: 'R$ 750.000,00',
    fonte_recursos: 'federal',
    descricao: 'Convênio para modernização de unidades de saúde básica',
    status: 'ativo',
    data_criacao: '01/02/2024'
  },
  {
    id: '3',
    codigo: 'CNV-2024-003',
    nome: 'Convênio Infraestrutura Escolar',
    cnpj: '11.222.333/0001-44',
    entidade_concedente: 'secretaria-estadual-educacao',
    objeto: 'Melhorias na infraestrutura de escolas estaduais',
    data_inicio: '15/03/2024',
    data_fim: '14/03/2025',
    valor_total: 'R$ 1.200.000,00',
    fonte_recursos: 'estadual',
    descricao: 'Reforma e ampliação de escolas estaduais',
    status: 'inativo',
    data_criacao: '15/03/2024'
  }
];

// Mock data para fontes de recurso
const mockFontesRecurso: FonteRecurso[] = [
  {
    id: '1',
    nome: 'Orçamento Municipal 2024',
    descricao: 'Recurso principal para aquisições do exercício 2024',
    status: 'ativo',
    data_criacao: '01/01/2024'
  },
  {
    id: '2',
    nome: 'Convênio Federal Educação',
    descricao: 'Recursos destinados à aquisição de equipamentos educacionais',
    status: 'ativo',
    data_criacao: '15/02/2024'
  },
  {
    id: '3',
    nome: 'Doação Empresarial',
    descricao: 'Doação de equipamentos de informática',
    status: 'ativo',
    data_criacao: '10/03/2024'
  },
  {
    id: '4',
    nome: 'Financiamento Estadual',
    descricao: 'Financiamento para aquisição de veículos - finalizado',
    status: 'inativo',
    data_criacao: '05/01/2024',
    data_alteracao: '30/06/2024'
  },
  {
    id: '5',
    nome: 'Convênio Internacional',
    descricao: 'Recursos internacionais para projetos sustentáveis',
    status: 'ativo',
    data_criacao: '20/04/2024'
  }
];

// Mock data para entidades credenciadas
const mockEntidadesCredenciadas: EntidadeCredenciada[] = [
  { 
    id: '1', 
    nome_entidade: 'Instituto de Avaliação Patrimonial Ltda', 
    cnpj: '12.345.678/0001-90',
    tipo_entidade: 'empresa-privada',
    esfera_administrativa: 'federal',
    unidade_gestora_vinculada: 'Secretaria da Fazenda',
    status_credencial: 'Ativo',
    email_responsavel: 'contato@institutoaval.com.br',
    telefone_responsavel: '(11) 3456-7890',
    cep: '01310-100',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Bela Vista',
    logradouro: 'Avenida Paulista',
    numero: '1578',
    complemento: 'Sala 1201',
    status: 'ativo',
    data_criacao: '15/01/2024'
  },
  { 
    id: '2', 
    nome_entidade: 'Leiloeira Central S/A', 
    cnpj: '98.765.432/0001-10',
    tipo_entidade: 'sociedade-anonima',
    esfera_administrativa: 'estadual',
    unidade_gestora_vinculada: 'Departamento de Patrimônio',
    status_credencial: 'Ativo',
    email_responsavel: 'admin@leiloeira.com.br',
    telefone_responsavel: '(21) 2345-6789',
    cep: '22071-900',
    uf: 'RJ',
    municipio: 'Rio de Janeiro',
    bairro: 'Copacabana',
    logradouro: 'Avenida Atlântica',
    numero: '1702',
    status: 'ativo',
    data_criacao: '20/02/2024'
  },
  { 
    id: '3', 
    nome_entidade: 'Avaliações & Perícias ME', 
    cnpj: '11.222.333/0001-44',
    tipo_entidade: 'microempresa',
    esfera_administrativa: 'municipal',
    unidade_gestora_vinculada: 'Secretaria de Administração',
    status_credencial: 'Inativo',
    email_responsavel: 'contato@avalpericias.com.br',
    telefone_responsavel: '(31) 9876-5432',
    cep: '30112-000',
    uf: 'MG',
    municipio: 'Belo Horizonte',
    bairro: 'Centro',
    logradouro: 'Rua da Bahia',
    numero: '1148',
    status: 'inativo',
    data_criacao: '05/03/2024'
  },
  {
    id: '4',
    nome_entidade: 'Consultoria Técnica Especializada Ltda',
    cnpj: '45.678.901/0001-23',
    tipo_entidade: 'empresa-privada',
    esfera_administrativa: 'federal',
    unidade_gestora_vinculada: 'Ministério da Economia',
    status_credencial: 'Ativo',
    email_responsavel: 'contato@consultoriatecnica.com.br',
    telefone_responsavel: '(11) 4567-8901',
    observacoes_gerais: 'Especializada em avaliação de equipamentos de informática',
    cep: '04038-001',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Vila Olímpia',
    logradouro: 'Rua Funchal',
    numero: '375',
    complemento: '10º andar',
    status: 'ativo',
    data_criacao: '12/01/2024'
  }
];




// Mock data para grupos de bem
const mockGruposBem: GrupoBem[] = [
  {
    id: '1',
    nome: 'Equipamentos de Informática',
    codigo_contabil: '123001001',
    depreciacao_aplicavel: true,
    veiculo_licenciavel: false,
    etiqueta_qrcode: true,
    percentual_depreciacao_anual: '10.0',
    percentual_depreciacao_mensal: '0.83',
    vida_util_anos: '10',
    valor_residual: '5.0',
    tipo_veiculo: '',
    status: 'ativo',
    data_criacao: '15/01/2024',
  },
  {
    id: '2',
    nome: 'Móveis e Utensílios',
    codigo_contabil: '123002001',
    depreciacao_aplicavel: true,
    veiculo_licenciavel: false,
    etiqueta_qrcode: true,
    percentual_depreciacao_anual: '12.0',
    percentual_depreciacao_mensal: '1.0',
    vida_util_anos: '8',
    valor_residual: '10.0',
    tipo_veiculo: '',
    status: 'ativo',
    data_criacao: '20/02/2024',
  },
  {
    id: '3',
    nome: 'Veículos',
    codigo_contabil: '123003001',
    depreciacao_aplicavel: true,
    veiculo_licenciavel: true,
    etiqueta_qrcode: true,
    percentual_depreciacao_anual: '20.0',
    percentual_depreciacao_mensal: '1.67',
    vida_util_anos: '5',
    valor_residual: '15.0',
    tipo_veiculo: 'Automóvel',
    status: 'ativo',
    data_criacao: '05/03/2024',
  },
  {
    id: '4',
    nome: 'Equipamentos Diversos',
    codigo_contabil: '123004001',
    depreciacao_aplicavel: false,
    veiculo_licenciavel: false,
    etiqueta_qrcode: false,
    percentual_depreciacao_anual: '',
    percentual_depreciacao_mensal: '',
    vida_util_anos: '',
    valor_residual: '',
    tipo_veiculo: '',
    status: 'inativo',
    data_criacao: '12/01/2024',
  },
  {
    id: '5',
    nome: 'Máquinas e Equipamentos',
    codigo_contabil: '123005001',
    depreciacao_aplicavel: true,
    veiculo_licenciavel: false,
    etiqueta_qrcode: true,
    percentual_depreciacao_anual: '15.0',
    percentual_depreciacao_mensal: '1.25',
    vida_util_anos: '7',
    valor_residual: '8.0',
    tipo_veiculo: '',
    status: 'ativo',
    data_criacao: '08/04/2024',
  }
];

// Mock data para subgrupos de bem
const mockSubgruposBem: SubgrupoBem[] = [
  {
    id: '1',
    nome: 'Móveis e Equipamentos',
    grupo: 'Ativo Não Circulante',
    grupo_vinculado: 'grupo-1',
    percentual_depreciacao_anual: 10.00,
    percentual_depreciacao_mensal: 0.83,
    valor_residual: 1000.00,
    tombo_manual: true,
    depreciacao_configuravel: true,
    status: 'ativo',
    data_criacao: '01/01/2024',
  },
  {
    id: '2',
    nome: 'Veículos',
    grupo: 'Ativo Não Circulante',
    grupo_vinculado: 'grupo-1',
    percentual_depreciacao_anual: 20.00,
    percentual_depreciacao_mensal: 1.67,
    valor_residual: 5000.00,
    tombo_manual: false,
    depreciacao_configuravel: true,
    status: 'ativo',
    data_criacao: '01/01/2024',
  },
  {
    id: '3',
    nome: 'Equipamentos de Informática',
    grupo: 'Ativo Não Circulante',
    grupo_vinculado: 'grupo-1',
    percentual_depreciacao_anual: 33.33,
    percentual_depreciacao_mensal: 2.78,
    valor_residual: 500.00,
    tombo_manual: true,
    depreciacao_configuravel: true,
    status: 'ativo',
    data_criacao: '01/01/2024',
  },
  {
    id: '4',
    nome: 'Material de Consumo',
    grupo: 'Ativo Circulante',
    grupo_vinculado: 'grupo-2',
    tombo_manual: false,
    depreciacao_configuravel: false,
    status: 'inativo',
    data_criacao: '01/01/2024',
  },
  {
    id: '5',
    nome: 'Equipamentos Médicos',
    grupo: 'Ativo Não Circulante',
    grupo_vinculado: 'grupo-1',
    percentual_depreciacao_anual: 12.50,
    percentual_depreciacao_mensal: 1.04,
    valor_residual: 2000.00,
    tombo_manual: true,
    depreciacao_configuravel: true,
    status: 'ativo',
    data_criacao: '01/01/2024',
  }
];

export const configuracaoStorage = {
  // Buscar órgãos ativos
  getOrgaosAtivos: (): Array<{ value: string; label: string }> => {
    return mockOrgaos
      .filter(orgao => orgao.status === 'ativo')
      .map(orgao => ({
        value: orgao.id,
        label: `${orgao.nome} (${orgao.sigla})`
      }));
  },

  // CRUD functions para órgãos
  getAllOrgaos: (): Orgao[] => {
    return [...mockOrgaos];
  },

  createOrgao: (data: Omit<Orgao, 'id' | 'data_criacao'>): Orgao => {
    const newOrgao: Orgao = {
      ...data,
      id: String(Math.max(...mockOrgaos.map(o => parseInt(o.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockOrgaos.push(newOrgao);
    return newOrgao;
  },

  updateOrgao: (id: string, data: Partial<Omit<Orgao, 'id' | 'data_criacao'>>): Orgao | null => {
    const index = mockOrgaos.findIndex(orgao => orgao.id === id);
    if (index === -1) return null;
    
    mockOrgaos[index] = {
      ...mockOrgaos[index],
      ...data,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockOrgaos[index];
  },

  deleteOrgao: (id: string): boolean => {
    const index = mockOrgaos.findIndex(orgao => orgao.id === id);
    if (index === -1) return false;
    
    mockOrgaos.splice(index, 1);
    return true;
  },

  toggleOrgaoStatus: (id: string): Orgao | null => {
    const orgao = mockOrgaos.find(o => o.id === id);
    if (!orgao) return null;
    
    orgao.status = orgao.status === 'ativo' ? 'inativo' : 'ativo';
    orgao.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return orgao;
  },

  // Buscar áreas por órgão
  getAreasByOrgao: (orgaoId: string): Array<{ value: string; label: string }> => {
    return mockAreas
      .filter(area => area.orgao_vinculado === orgaoId && area.status === 'ativo')
      .map(area => ({
        value: area.id,
        label: `${area.nome} (${area.sigla || area.nome})`
      }));
  },

  // Buscar unidades por área
  getUnidadesByArea: (areaId: string): Array<{ value: string; label: string }> => {
    return mockUnidades
      .filter(unidade => unidade.areaVinculada === areaId && unidade.status === 'ativo')
      .map(unidade => ({
        value: unidade.id,
        label: `${unidade.nome} (${unidade.sigla})`
      }));
  },

  // Buscar unidades por órgão
  getUnidadesByOrgao: (orgaoId: string): Array<{ value: string; label: string }> => {
    // Primeiro buscar áreas do órgão
    const areasDoOrgao = mockAreas
      .filter(area => area.orgao_vinculado === orgaoId)
      .map(area => area.id);
    
    // Depois buscar unidades dessas áreas
    return mockUnidades
      .filter(unidade => areasDoOrgao.includes(unidade.areaVinculada) && unidade.status === 'ativo')
      .map(unidade => ({
        value: unidade.id,
        label: `${unidade.nome} (${unidade.sigla})`
      }));
  },

  // Buscar setores por órgão
  getSetoresByOrgao: (orgaoId: string): Array<{ value: string; label: string }> => {
    return mockSetores
      .filter(setor => setor.orgaoId === orgaoId && setor.status === 'ativo')
      .map(setor => ({
        value: setor.id,
        label: setor.nome
      }));
  },

  // Buscar todas as unidades ativas (para casos específicos)
  getAllUnidadesAtivas: (): Array<{ value: string; label: string }> => {
    return mockUnidades
      .filter(unidade => unidade.status === 'ativo')
      .map(unidade => ({
        value: unidade.id,
        label: `${unidade.nome} (${unidade.sigla})`
      }));
  },

  // Buscar área de uma unidade específica
  getAreaByUnidade: (unidadeId: string): string | null => {
    const unidade = mockUnidades.find(u => u.id === unidadeId);
    return unidade ? unidade.areaVinculada : null;
  },

  // Buscar órgão de uma área específica
  getOrgaoByArea: (areaId: string): string | null => {
    const area = mockAreas.find(a => a.id === areaId);
    return area ? area.orgao_vinculado : null;
  },

  // Função utilitária para obter o caminho completo: órgão → área → unidade
  getHierarchyPath: (unidadeId: string): { orgaoId: string | null; areaId: string | null } => {
    const areaId = configuracaoStorage.getAreaByUnidade(unidadeId);
    const orgaoId = areaId ? configuracaoStorage.getOrgaoByArea(areaId) : null;
    
    return { orgaoId, areaId };
  },

  // Estados de conservação
  getEstadosConservacaoAtivos: (): Array<{ value: string; label: string }> => {
    return mockEstadosConservacao
      .filter(estado => estado.status === 'ativo')
      .map(estado => ({
        value: estado.id,
        label: estado.nome
      }));
  },

  getAllEstadosConservacao: (): EstadoConservacao[] => {
    return [...mockEstadosConservacao];
  },

  createEstadoConservacao: (data: Omit<EstadoConservacao, 'id'>): EstadoConservacao => {
    const newEstado: EstadoConservacao = {
      id: String(Math.max(...mockEstadosConservacao.map(e => parseInt(e.id)), 0) + 1),
      ...data,
      status: 'ativo'
    };
    mockEstadosConservacao.push(newEstado);
    return newEstado;
  },

  updateEstadoConservacao: (id: string, data: Partial<Omit<EstadoConservacao, 'id'>>): EstadoConservacao | null => {
    const index = mockEstadosConservacao.findIndex(estado => estado.id === id);
    if (index === -1) return null;
    
    mockEstadosConservacao[index] = { ...mockEstadosConservacao[index], ...data };
    return mockEstadosConservacao[index];
  },

  deleteEstadoConservacao: (id: string): boolean => {
    const index = mockEstadosConservacao.findIndex(estado => estado.id === id);
    if (index === -1) return false;
    
    mockEstadosConservacao.splice(index, 1);
    return true;
  },

  toggleEstadoConservacaoStatus: (id: string): EstadoConservacao | null => {
    const index = mockEstadosConservacao.findIndex(estado => estado.id === id);
    if (index === -1) return null;
    
    const currentStatus = mockEstadosConservacao[index].status;
    mockEstadosConservacao[index].status = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    return mockEstadosConservacao[index];
  },

  // Fornecedores e terceiros
  getFornecedoresTerceirosAtivos: (): Array<{ value: string; label: string }> => {
    return mockFornecedoresTerceiros
      .filter(item => item.status === 'ativo')
      .map(item => ({ value: item.id, label: item.nome }));
  },

  getAllFornecedoresTerceiros: (): FornecedorTerceiro[] => {
    return [...mockFornecedoresTerceiros];
  },

  // Leis aplicáveis  
  getLeisAplicaveisAtivas: (): Array<{ value: string; label: string }> => {
    return mockLeisAplicaveis
      .filter(item => item.status === 'ativo')
      .map(item => ({ value: item.id, label: item.nome }));
  },

  getAllLeisAplicaveis: (): LeiAplicavel[] => {
    return [...mockLeisAplicaveis];
  },

  // Métodos de Aquisição
  getMetodosAquisicaoAtivos: (): Array<{ value: string; label: string }> => {
    return mockMetodosAquisicao
      .filter(metodo => metodo.status === 'ativo')
      .map(metodo => ({ value: metodo.id, label: metodo.nome }));
  },

  getAllMetodosAquisicao: (): MetodoAquisicao[] => {
    return [...mockMetodosAquisicao];
  },

  // Tipos de Inventário
  getTiposInventarioAtivos: (): Array<{ value: string; label: string }> => {
    return mockTiposInventario
      .filter(tipo => tipo.status === 'ativo')
      .map(tipo => ({
        value: tipo.id,
        label: tipo.nome
      }));
  },

  getAllTiposInventario: (): TipoInventario[] => {
    return [...mockTiposInventario];
  },

  createTipoInventario: (data: Omit<TipoInventario, 'id' | 'data_criacao'>): TipoInventario => {
    const newTipo: TipoInventario = {
      id: String(Math.max(...mockTiposInventario.map(t => parseInt(t.id)), 0) + 1),
      ...data,
      data_criacao: new Date().toLocaleDateString('pt-BR')
    };
    mockTiposInventario.push(newTipo);
    return newTipo;
  },

  updateTipoInventario: (id: string, data: Partial<Omit<TipoInventario, 'id' | 'data_criacao'>>): TipoInventario | null => {
    const index = mockTiposInventario.findIndex(tipo => tipo.id === id);
    if (index === -1) return null;
    
    mockTiposInventario[index] = { ...mockTiposInventario[index], ...data };
    return mockTiposInventario[index];
  },

  deleteTipoInventario: (id: string): boolean => {
    const index = mockTiposInventario.findIndex(tipo => tipo.id === id);
    if (index === -1) return false;
    
    mockTiposInventario.splice(index, 1);
    return true;
  },

  toggleTipoInventarioStatus: (id: string): TipoInventario | null => {
    const tipo = mockTiposInventario.find(t => t.id === id);
    if (!tipo) return null;
    
    tipo.status = tipo.status === 'ativo' ? 'inativo' : 'ativo';
    return tipo;
  },

  // Convenio functions
  getConveniosAtivos: (): { value: string; label: string }[] => {
    return mockConvenios
      .filter(convenio => convenio.status === 'ativo')
      .map(convenio => ({
        value: convenio.id,
        label: `${convenio.nome} (${convenio.codigo})`
      }));
  },

  getAllConvenios: (): Convenio[] => {
    return [...mockConvenios];
  },

  createConvenio: (convenio: Omit<Convenio, 'id' | 'data_criacao'>): Convenio => {
    const newConvenio: Convenio = {
      ...convenio,
      id: Date.now().toString(),
      data_criacao: new Date().toLocaleDateString('pt-BR')
    };
    mockConvenios.push(newConvenio);
    return newConvenio;
  },

  updateConvenio: (id: string, updates: Partial<Convenio>): Convenio | null => {
    const index = mockConvenios.findIndex(convenio => convenio.id === id);
    if (index === -1) return null;
    
    mockConvenios[index] = {
      ...mockConvenios[index],
      ...updates,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockConvenios[index];
  },

  deleteConvenio: (id: string): boolean => {
    const index = mockConvenios.findIndex(convenio => convenio.id === id);
    if (index === -1) return false;
    mockConvenios.splice(index, 1);
    return true;
  },

  toggleConvenioStatus: (id: string): Convenio | null => {
    const convenio = mockConvenios.find(convenio => convenio.id === id);
    if (!convenio) return null;
    
    convenio.status = convenio.status === 'ativo' ? 'inativo' : 'ativo';
    convenio.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return convenio;
  },

  // Funções para fontes de recurso
  getFontesRecursoAtivas: () => {
    return mockFontesRecurso
      .filter(fonte => fonte.status === 'ativo')
      .map(fonte => ({ value: fonte.id, label: fonte.nome }));
  },

  getAllFontesRecurso: () => {
    return [...mockFontesRecurso];
  },

  createFonteRecurso: (data: Omit<FonteRecurso, 'id' | 'data_criacao'>) => {
    const newId = String(Math.max(...mockFontesRecurso.map(f => parseInt(f.id)), 0) + 1);
    const newFonte: FonteRecurso = {
      ...data,
      id: newId,
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockFontesRecurso.push(newFonte);
    return newFonte;
  },

  updateFonteRecurso: (id: string, data: Partial<Omit<FonteRecurso, 'id' | 'data_criacao'>>) => {
    const index = mockFontesRecurso.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    mockFontesRecurso[index] = {
      ...mockFontesRecurso[index],
      ...data,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockFontesRecurso[index];
  },

  deleteFonteRecurso: (id: string) => {
    const index = mockFontesRecurso.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    mockFontesRecurso.splice(index, 1);
    return true;
  },

  toggleFonteRecursoStatus: (id: string) => {
    const fonte = mockFontesRecurso.find(f => f.id === id);
    if (!fonte) return null;
    
    fonte.status = fonte.status === 'ativo' ? 'inativo' : 'ativo';
    fonte.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return fonte;
  },

  // Áreas CRUD functions
  getAllAreas: (): Area[] => {
    return mockAreas;
  },

  getAreasAtivas: (): Array<{ value: string; label: string }> => {
    return mockAreas
      .filter(area => area.status === 'ativo')
      .map(area => ({
        value: area.id,
        label: area.nome
      }));
  },

  createArea: (data: Omit<Area, 'id' | 'data_criacao'>): Area => {
    const newArea: Area = {
      ...data,
      id: String(Math.max(...mockAreas.map(a => parseInt(a.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockAreas.push(newArea);
    return newArea;
  },

  updateArea: (id: string, data: Partial<Omit<Area, 'id' | 'data_criacao'>>): Area | null => {
    const index = mockAreas.findIndex(area => area.id === id);
    if (index === -1) return null;
    
    mockAreas[index] = {
      ...mockAreas[index],
      ...data,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockAreas[index];
  },

  deleteArea: (id: string): boolean => {
    const index = mockAreas.findIndex(area => area.id === id);
    if (index === -1) return false;
    
    mockAreas.splice(index, 1);
    return true;
  },

  toggleAreaStatus: (id: string): Area | null => {
    const area = mockAreas.find(a => a.id === id);
    if (!area) return null;
    
    area.status = area.status === 'ativo' ? 'inativo' : 'ativo';
    area.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return area;
  },

  // Entidades Credenciadas CRUD functions
  getAllEntidadesCredenciadas: (): EntidadeCredenciada[] => {
    return [...mockEntidadesCredenciadas];
  },

  getEntidadesCredenciadasAtivas: (): Array<{ value: string; label: string }> => {
    return mockEntidadesCredenciadas
      .filter(entidade => entidade.status === 'ativo')
      .map(entidade => ({
        value: entidade.id,
        label: entidade.nome_entidade
      }));
  },

  createEntidadeCredenciada: (data: Omit<EntidadeCredenciada, 'id' | 'data_criacao' | 'status'>): EntidadeCredenciada => {
    const newEntidade: EntidadeCredenciada = {
      ...data,
      id: String(Math.max(...mockEntidadesCredenciadas.map(e => parseInt(e.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockEntidadesCredenciadas.push(newEntidade);
    return newEntidade;
  },

  updateEntidadeCredenciada: (id: string, data: Partial<Omit<EntidadeCredenciada, 'id' | 'data_criacao'>>): EntidadeCredenciada | null => {
    const index = mockEntidadesCredenciadas.findIndex(entidade => entidade.id === id);
    if (index === -1) return null;
    
    mockEntidadesCredenciadas[index] = {
      ...mockEntidadesCredenciadas[index],
      ...data,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockEntidadesCredenciadas[index];
  },

  deleteEntidadeCredenciada: (id: string): boolean => {
    const index = mockEntidadesCredenciadas.findIndex(entidade => entidade.id === id);
    if (index === -1) return false;
    
    mockEntidadesCredenciadas.splice(index, 1);
    return true;
  },

  toggleEntidadeCredenciadaStatus: (id: string): EntidadeCredenciada | null => {
    const entidade = mockEntidadesCredenciadas.find(e => e.id === id);
    if (!entidade) return null;
    
    entidade.status = entidade.status === 'ativo' ? 'inativo' : 'ativo';
    entidade.status_credencial = entidade.status === 'ativo' ? 'Ativo' : 'Inativo';
    entidade.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return entidade;
  },

  // Fornecedores e Terceiros CRUD functions
  createFornecedorTerceiro: (data: Omit<FornecedorTerceiro, 'id' | 'data_criacao' | 'status'>): FornecedorTerceiro => {
    const newFornecedor: FornecedorTerceiro = {
      ...data,
      id: String(Math.max(...mockFornecedoresTerceiros.map(f => parseInt(f.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockFornecedoresTerceiros.push(newFornecedor);
    return newFornecedor;
  },

  updateFornecedorTerceiro: (id: string, data: Partial<Omit<FornecedorTerceiro, 'id' | 'data_criacao'>>): FornecedorTerceiro | null => {
    const index = mockFornecedoresTerceiros.findIndex(fornecedor => fornecedor.id === id);
    if (index === -1) return null;
    
    mockFornecedoresTerceiros[index] = {
      ...mockFornecedoresTerceiros[index],
      ...data
    };
    return mockFornecedoresTerceiros[index];
  },

  deleteFornecedorTerceiro: (id: string): boolean => {
    const index = mockFornecedoresTerceiros.findIndex(fornecedor => fornecedor.id === id);
    if (index === -1) return false;
    
    mockFornecedoresTerceiros.splice(index, 1);
    return true;
  },

  toggleFornecedorTerceiroStatus: (id: string): FornecedorTerceiro | null => {
    const fornecedor = mockFornecedoresTerceiros.find(f => f.id === id);
    if (!fornecedor) return null;
    
    fornecedor.status = fornecedor.status === 'ativo' ? 'inativo' : 'ativo';
    return fornecedor;
  },


  // Leis Aplicáveis CRUD functions
  createLeiAplicavel: (data: Omit<LeiAplicavel, 'id' | 'data_criacao' | 'status'>): LeiAplicavel => {
    const newLei: LeiAplicavel = {
      ...data,
      id: String(Math.max(...mockLeisAplicaveis.map(l => parseInt(l.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockLeisAplicaveis.push(newLei);
    return newLei;
  },

  updateLeiAplicavel: (id: string, data: Partial<Omit<LeiAplicavel, 'id' | 'data_criacao'>>): LeiAplicavel | null => {
    const index = mockLeisAplicaveis.findIndex(lei => lei.id === id);
    if (index === -1) return null;
    
    mockLeisAplicaveis[index] = {
      ...mockLeisAplicaveis[index],
      ...data
    };
    return mockLeisAplicaveis[index];
  },

  deleteLeiAplicavel: (id: string): boolean => {
    const index = mockLeisAplicaveis.findIndex(lei => lei.id === id);
    if (index === -1) return false;
    
    mockLeisAplicaveis.splice(index, 1);
    return true;
  },

  toggleLeiAplicavelStatus: (id: string): LeiAplicavel | null => {
    const lei = mockLeisAplicaveis.find(l => l.id === id);
    if (!lei) return null;
    
    lei.status = lei.status === 'ativo' ? 'inativo' : 'ativo';
    return lei;
  },



  // Setor CRUD functions
  getAllSetores: (): Setor[] => {
    return [...mockSetores];
  },

  createSetor: (data: Pick<Setor, 'nome' | 'orgaoId' | 'unidadeId'>): Setor => {
    const newSetor: Setor = {
      ...data,
      id: String(Math.max(...mockSetores.map(s => parseInt(s.id)), 0) + 1),
      status: 'ativo',
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      descricao: `Setor cadastrado em ${new Date().toLocaleDateString('pt-BR')}`
    };
    mockSetores.push(newSetor);
    return newSetor;
  },

  updateSetor: (id: string, data: Partial<Omit<Setor, 'id'>>): Setor | null => {
    const index = mockSetores.findIndex(setor => setor.id === id);
    if (index === -1) return null;
    
    mockSetores[index] = {
      ...mockSetores[index],
      ...data
    };
    return mockSetores[index];
  },

  deleteSetor: (id: string): boolean => {
    const index = mockSetores.findIndex(setor => setor.id === id);
    if (index === -1) return false;
    
    mockSetores.splice(index, 1);
    return true;
  },

  toggleSetorStatus: (id: string): Setor | null => {
    const setor = mockSetores.find(s => s.id === id);
    if (!setor) return null;
    
    setor.status = setor.status === 'ativo' ? 'inativo' : 'ativo';
    return setor;
  },

  // Grupos de Bem CRUD functions
  getAllGruposBem: (): GrupoBem[] => {
    return [...mockGruposBem];
  },

  getGruposBemAtivos: (): Array<{ value: string; label: string }> => {
    return mockGruposBem
      .filter(grupo => grupo.status === 'ativo')
      .map(grupo => ({
        value: grupo.id,
        label: grupo.nome
      }));
  },

  createGrupoBem: (data: Omit<GrupoBem, 'id' | 'data_criacao' | 'status'>): GrupoBem => {
    const newGrupo: GrupoBem = {
      ...data,
      id: String(Math.max(...mockGruposBem.map(g => parseInt(g.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      status: 'ativo'
    };
    mockGruposBem.push(newGrupo);
    return newGrupo;
  },

  updateGrupoBem: (id: string, data: Partial<Omit<GrupoBem, 'id' | 'data_criacao'>>): GrupoBem | null => {
    const index = mockGruposBem.findIndex(grupo => grupo.id === id);
    if (index === -1) return null;
    
    mockGruposBem[index] = {
      ...mockGruposBem[index],
      ...data,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockGruposBem[index];
  },

  deleteGrupoBem: (id: string): boolean => {
    const index = mockGruposBem.findIndex(grupo => grupo.id === id);
    if (index === -1) return false;
    
    mockGruposBem.splice(index, 1);
    return true;
  },

  toggleGrupoBemStatus: (id: string): GrupoBem | null => {
    const grupo = mockGruposBem.find(g => g.id === id);
    if (!grupo) return null;
    
    grupo.status = grupo.status === 'ativo' ? 'inativo' : 'ativo';
    grupo.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return grupo;
  },

  // Subgrupos de Bem
  getAllSubgruposBem: (): SubgrupoBem[] => {
    return [...mockSubgruposBem];
  },

  getActiveSubgruposBem: (): SubgrupoBem[] => {
    return mockSubgruposBem.filter(subgrupo => subgrupo.status === 'ativo');
  },

  getSubgrupoBemById: (id: string): SubgrupoBem | null => {
    return mockSubgruposBem.find(subgrupo => subgrupo.id === id) || null;
  },

  createSubgrupoBem: (data: Omit<SubgrupoBem, 'id' | 'data_criacao'>): SubgrupoBem => {
    const newSubgrupo: SubgrupoBem = {
      ...data,
      id: String(Math.max(...mockSubgruposBem.map(s => parseInt(s.id)), 0) + 1),
      data_criacao: new Date().toLocaleDateString('pt-BR')
    };
    mockSubgruposBem.push(newSubgrupo);
    return newSubgrupo;
  },

  updateSubgrupoBem: (id: string, data: Partial<SubgrupoBem>): SubgrupoBem | null => {
    const index = mockSubgruposBem.findIndex(subgrupo => subgrupo.id === id);
    if (index === -1) return null;
    
    mockSubgruposBem[index] = {
      ...mockSubgruposBem[index],
      ...data,
      data_alteracao: new Date().toLocaleDateString('pt-BR')
    };
    return mockSubgruposBem[index];
  },

  deleteSubgrupoBem: (id: string): boolean => {
    const index = mockSubgruposBem.findIndex(subgrupo => subgrupo.id === id);
    if (index === -1) return false;
    
    mockSubgruposBem.splice(index, 1);
    return true;
  },

  toggleSubgrupoBemStatus: (id: string): SubgrupoBem | null => {
    const subgrupo = mockSubgruposBem.find(s => s.id === id);
    if (!subgrupo) return null;
    
    subgrupo.status = subgrupo.status === 'ativo' ? 'inativo' : 'ativo';
    subgrupo.data_alteracao = new Date().toLocaleDateString('pt-BR');
    return subgrupo;
  }
};
export interface PatrimonioData {
  id: string;
  type: 'nfe' | 'xml' | 'tombo-direto';
  chaveNfe?: string;
  xmlFile?: File;
  grupoContabil: string;
  tipoAquisicao: string;
  almoxarifado: string;
  empenhos: Array<{ numero: string; convenio: string }>;
  dataProcessamento: string;
  status: 'processando' | 'processado' | 'aguardando-recebimento' | 'Recebimento' | 'Tombo' | 'Etiquetagem' | 'Concluído';
  // NF-e specific fields
  numeroNf?: string;
  razaoSocial?: string;
  cnpj?: string;
  numeroEmpenho?: string;
  convenio?: string;
  // Campos adicionais necessários para a DataGallery
  numeroItens?: number;
  elementoDespesa?: string;
  dataAquisicao?: string;
  fornecedor?: string;
  valorTotal?: number;
  numeroDocumento?: string;
  chaveAcesso?: string;
  dataEmissao?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'patrimonios-processados';

export const patrimonioStorage = {
  // Salvar patrimônio processado
  save: (data: PatrimonioData): void => {
    const existing = patrimonioStorage.getAll();
    const updated = [...existing, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // Buscar patrimônio por ID
  getById: (id: string): PatrimonioData | null => {
    const patrimonios = patrimonioStorage.getAll();
    return patrimonios.find(p => p.id === id) || null;
  },

  // Buscar todos os patrimônios
  getAll: (): PatrimonioData[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Atualizar patrimônio
  update: (id: string, updates: Partial<PatrimonioData>): void => {
    const patrimonios = patrimonioStorage.getAll();
    const index = patrimonios.findIndex(p => p.id === id);
    if (index !== -1) {
      patrimonios[index] = { ...patrimonios[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patrimonios));
    }
  },

  // Remover patrimônio
  remove: (id: string): void => {
    const patrimonios = patrimonioStorage.getAll();
    const filtered = patrimonios.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Gerar ID único
  generateId: (): string => {
    return `patrimonio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Inicializar dados mock para desenvolvimento
  initializeMockData: (): void => {
    const existing = patrimonioStorage.getAll();
    if (existing.length === 0) {
      const mockData: PatrimonioData[] = [
        {
          id: '1',
          type: 'nfe',
          chaveNfe: '35200814200166000196550010000000101123456789',
          grupoContabil: 'Material de Consumo',
          tipoAquisicao: 'Compra Direta',
          almoxarifado: 'Almoxarifado Central',
          empenhos: [
            { numero: '2024NE000123', convenio: 'Convênio FNDE' },
            { numero: '2024NE000124', convenio: 'Recursos Próprios' }
          ],
          dataProcessamento: new Date().toLocaleDateString('pt-BR'),
          status: 'Recebimento',
          numeroItens: 5,
          elementoDespesa: 'Equipamentos de informática',
          dataAquisicao: '15/05/2024',
          fornecedor: 'Dell LTDA',
          valorTotal: 15000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'xml',
          xmlFile: new File([''], 'nota_fiscal_456.xml', { type: 'text/xml' }),
          grupoContabil: 'Material Permanente',
          tipoAquisicao: 'Licitação',
          almoxarifado: 'Almoxarifado Setor Norte',
          empenhos: [
            { numero: '2024NE000125', convenio: 'Recursos Próprios' }
          ],
          dataProcessamento: new Date(Date.now() - 86400000).toLocaleDateString('pt-BR'),
          status: 'Etiquetagem',
          numeroItens: 8,
          elementoDespesa: 'Material de escritório',
          dataAquisicao: '20/05/2024',
          fornecedor: 'HP Brasil LTDA',
          valorTotal: 8500,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          type: 'tombo-direto',
          grupoContabil: 'Software e licenças',
          tipoAquisicao: 'Dispensa',
          almoxarifado: 'Almoxarifado Central',
          empenhos: [
            { numero: '2024NE000126', convenio: 'Recursos Próprios' }
          ],
          dataProcessamento: new Date(Date.now() - 172800000).toLocaleDateString('pt-BR'),
          status: 'Concluído',
          numeroItens: 12,
          elementoDespesa: 'Software e licenças',
          dataAquisicao: '25/05/2024',
          fornecedor: 'Microsoft Corp',
          valorTotal: 25000,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  },

  // Função para mapear PatrimonioData para formato da DataGallery
  mapToDataGalleryFormat: (patrimonio: PatrimonioData) => {
    const getNfValue = () => {
      if (patrimonio.type === 'nfe' && patrimonio.chaveNfe) {
        return patrimonio.chaveNfe.slice(-12); // Últimos 12 dígitos da chave
      }
      if (patrimonio.type === 'xml' && patrimonio.numeroDocumento) {
        return patrimonio.numeroDocumento;
      }
      return '-';
    };

    return {
      id: patrimonio.id,
      nf: getNfValue(),
      empenho: patrimonio.fornecedor || patrimonio.empenhos[0]?.numero || '',
      elemento_despesa: patrimonio.elementoDespesa || patrimonio.grupoContabil,
      numero_itens: patrimonio.numeroItens?.toString() || '1',
      data_aquisicao: patrimonio.dataAquisicao || patrimonio.dataProcessamento,
      tipo_aquisicao: patrimonio.tipoAquisicao,
      status: patrimonio.status,
      type: patrimonio.type
    };
  },

  // Função para avançar status do patrimônio
  advanceStatus: (id: string): boolean => {
    const patrimonio = patrimonioStorage.getById(id);
    if (!patrimonio) return false;

    const statusFlow = {
      'processando': 'Recebimento',
      'processado': 'Recebimento', 
      'aguardando-recebimento': 'Recebimento',
      'Recebimento': 'Tombo',
      'Tombo': 'Etiquetagem',
      'Etiquetagem': 'Concluído',
      'Concluído': 'Concluído' // Não avança mais
    };

    const nextStatus = statusFlow[patrimonio.status as keyof typeof statusFlow];
    if (nextStatus && nextStatus !== patrimonio.status) {
      patrimonioStorage.update(id, { 
        status: nextStatus as PatrimonioData['status'],
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  }
};
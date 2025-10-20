import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormSelectField } from '@/components/ui/form-select-field';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormLabel } from '@/components/ui/form-label';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DocumentUpload, DocumentFile } from '@/components/ui/document-upload';
import { Plus, Trash2 } from 'lucide-react';
import { patrimonioStorage } from '@/lib/patrimonio-storage';
import { ProcessingModal } from './ProcessingModal';
import { SuccessModal } from './SuccessModal';

interface CadastroManualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmpenhoRow {
  id: string;
  numero: string;
  convenio: string;
}

export const CadastroManualModal: React.FC<CadastroManualModalProps> = ({
  open,
  onOpenChange,
}) => {
  // Estados do formulário
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>(undefined);
  const [fornecedorRazao, setFornecedorRazao] = useState('');
  const [fornecedorCNPJ, setFornecedorCNPJ] = useState('');
  const [numeroItens, setNumeroItens] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [elementoDespesa, setElementoDespesa] = useState('');
  const [grupoContabil, setGrupoContabil] = useState('');
  const [tipoAquisicao, setTipoAquisicao] = useState('');
  const [almoxarifadoDestino, setAlmoxarifadoDestino] = useState('');

  // Estados para Empenho - usando linhas dinâmicas
  const [empenhoRows, setEmpenhoRows] = useState<EmpenhoRow[]>([
    { id: '1', numero: '', convenio: '' }
  ]);
  const [empenhos, setEmpenhos] = useState<{ numero: string; convenio: string }[]>([]);

  // Estado para documentos - inicializando com documentos padrão
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      id: '1',
      name: 'Nota fiscal',
      comment: 'Nota emitida 12/05/2025',
      status: 'Criado',
    },
    {
      id: '2',
      name: 'Outros',
      comment: '',
      status: 'Criado',
    }
  ]);

  // Estados para modals de processo
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Opções dos selects
  const fornecedorOptions = [
    { value: 'dell', label: 'Dell Computadores do Brasil LTDA' },
    { value: 'hp', label: 'HP Brasil LTDA' },
    { value: 'lenovo', label: 'Lenovo Brasil LTDA' },
  ];

  const cnpjOptions = [
    { value: '72.381.189/0001-02', label: '72.381.189/0001-02' },
    { value: '61.797.985/0001-60', label: '61.797.985/0001-60' },
    { value: '51.687.495/0001-45', label: '51.687.495/0001-45' },
  ];

  const numeroItensOptions = [
    { value: '1', label: '1 item' },
    { value: '2', label: '2 itens' },
    { value: '5', label: '5 itens' },
    { value: '10', label: '10 itens' },
  ];

  const elementoDespesaOptions = [
    { value: 'equipamentos', label: 'Equipamentos de informática' },
    { value: 'mobiliario', label: 'Mobiliário em geral' },
    { value: 'veiculos', label: 'Veículos em geral' },
  ];

  const grupoContabilOptions = [
    { value: 'permanente', label: 'Bens móveis permanentes' },
    { value: 'consumo', label: 'Material de consumo' },
    { value: 'servicos', label: 'Serviços' },
  ];

  const tipoAquisicaoOptions = [
    { value: 'licitacao', label: 'Licitação' },
    { value: 'dispensa', label: 'Dispensa de licitação' },
    { value: 'inexigibilidade', label: 'Inexigibilidade' },
  ];

  const convenioOptions = [
    { value: 'conv001', label: 'Convênio 001/2024' },
    { value: 'conv002', label: 'Convênio 002/2024' },
    { value: 'conv003', label: 'Convênio 003/2024' },
  ];

  // Handlers para Empenho
  const handleAddEmpenhoRow = () => {
    const newRow: EmpenhoRow = {
      id: Date.now().toString(),
      numero: '',
      convenio: ''
    };
    setEmpenhoRows([...empenhoRows, newRow]);
  };

  const handleEmpenhoRowChange = (id: string, field: 'numero' | 'convenio', value: string) => {
    setEmpenhoRows(rows => 
      rows.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleRemoveEmpenhoRow = (id: string) => {
    if (empenhoRows.length > 1) {
      setEmpenhoRows(rows => rows.filter(row => row.id !== id));
    }
  };

  const handleAddEmpenho = () => {
    const validRows = empenhoRows.filter(row => row.numero && row.convenio);
    const newEmpenhos = validRows.map(row => ({ numero: row.numero, convenio: row.convenio }));
    setEmpenhos([...empenhos, ...newEmpenhos]);
    setEmpenhoRows([{ id: Date.now().toString(), numero: '', convenio: '' }]);
  };

  const handleRemoveEmpenho = (index: number) => {
    setEmpenhos(empenhos.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // Validação básica
      if (!numeroDocumento || !grupoContabil || !tipoAquisicao || !almoxarifadoDestino) {
        console.log('Campos obrigatórios não preenchidos');
        return;
      }

      // Mostrar modal de processamento
      setShowProcessingModal(true);

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Preparar dados para salvar
      const allEmpenhos = [...empenhos, ...empenhoRows.filter(row => row.numero && row.convenio)];
      
      const patrimonio = {
        id: patrimonioStorage.generateId(),
        type: 'tombo-direto' as const,
        grupoContabil,
        tipoAquisicao,
        almoxarifado: almoxarifadoDestino,
        empenhos: allEmpenhos,
        dataProcessamento: new Date().toLocaleDateString('pt-BR'),
        status: 'Recebimento' as const,
        numeroItens: parseInt(numeroItens) || 1,
        elementoDespesa,
        dataAquisicao: dataEmissao?.toLocaleDateString('pt-BR') || new Date().toLocaleDateString('pt-BR'),
        fornecedor: fornecedorRazao,
        valorTotal: parseFloat(valorTotal.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
        numeroDocumento,
        chaveAcesso,
        dataEmissao: dataEmissao?.toLocaleDateString('pt-BR'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Salvar no storage
      patrimonioStorage.save(patrimonio);

      // Fechar modal de processamento e mostrar sucesso
      setShowProcessingModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Erro ao salvar patrimônio:', error);
      setShowProcessingModal(false);
    }
  };

  // Função para confirmar sucesso e fechar
  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    handleCancel(); // Limpar formulário e fechar modal principal
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Limpar todos os estados
    setChaveAcesso('');
    setNumeroDocumento('');
    setDataEmissao(undefined);
    setFornecedorRazao('');
    setFornecedorCNPJ('');
    setNumeroItens('');
    setValorTotal('');
    setElementoDespesa('');
    setGrupoContabil('');
    setTipoAquisicao('');
    setAlmoxarifadoDestino('');
    setEmpenhoRows([{ id: '1', numero: '', convenio: '' }]);
    setEmpenhos([]);
    setDocuments([
      {
        id: '1',
        name: 'Nota fiscal',
        comment: 'Nota emitida 12/05/2025',
        status: 'Criado',
      },
      {
        id: '2',
        name: 'Outros',
        comment: '',
        status: 'Criado',
      }
    ]);
    onOpenChange(false);
  };

  const actions = (
    <>
      <PrimaryGhostButton onClick={handleCancel}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave}>
        Salvar
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cadastrar patrimônio"
      actions={actions}
      className="sm:max-w-4xl"
      maxHeight="calc(100vh - 4rem)"
    >
      <div className="space-y-6">
        {/* Seção: Formulário de Recepção de Nota Fiscal / Nota de Empenho */}
        <div className="space-y-4">
          <h3 className="font-sora font-medium text-sm text-second-dark border-b border-light-white pb-2">
            Formulário de Recepção de Nota Fiscal / Nota de Empenho
          </h3>
          
          {/* Linha 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="chave-acesso" required>
                Número da Chave de Acesso (NF-e)
              </FormLabel>
              <FormInput
                id="chave-acesso"
                value={chaveAcesso}
                onChange={(e) => setChaveAcesso(e.target.value)}
                placeholder="Digite o número da chave"
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="numero-documento" required>
                Número do documento
              </FormLabel>
              <FormInput
                id="numero-documento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Digite o número do documento"
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="data-emissao" required>
                Data da emissão
              </FormLabel>
              <FormDatePicker
                date={dataEmissao}
                onDateChange={setDataEmissao}
                placeholder="Selecione a data"
              />
            </div>
          </div>

          {/* Linha 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="fornecedor-razao" required>
                Fornecedor (Razão Social)
              </FormLabel>
              <FormSelectField
                value={fornecedorRazao}
                onValueChange={setFornecedorRazao}
                placeholder="Selecione o fornecedor"
                options={fornecedorOptions}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="fornecedor-cnpj" required>
                Fornecedor (CNPJ)
              </FormLabel>
              <FormSelectField
                value={fornecedorCNPJ}
                onValueChange={setFornecedorCNPJ}
                placeholder="Selecione o CNPJ"
                options={cnpjOptions}
              />
            </div>
          </div>

          {/* Linha 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="numero-itens" required>
                Número de itens
              </FormLabel>
              <FormSelectField
                value={numeroItens}
                onValueChange={setNumeroItens}
                placeholder="Selecione a quantidade"
                options={numeroItensOptions}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="valor-total" required>
                Valor total
              </FormLabel>
              <FormInput
                id="valor-total"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                placeholder="Digite o valor total"
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="elemento-despesa" required>
                Elemento de despesa
              </FormLabel>
              <FormSelectField
                value={elementoDespesa}
                onValueChange={setElementoDespesa}
                placeholder="Selecione o elemento"
                options={elementoDespesaOptions}
              />
            </div>
          </div>

          {/* Linha 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="grupo-contabil" required>
                Grupo contábil
              </FormLabel>
              <FormSelectField
                value={grupoContabil}
                onValueChange={setGrupoContabil}
                placeholder="Selecione o grupo"
                options={grupoContabilOptions}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="tipo-aquisicao" required>
                Tipo de aquisição
              </FormLabel>
              <FormSelectField
                value={tipoAquisicao}
                onValueChange={setTipoAquisicao}
                placeholder="Selecione o tipo"
                options={tipoAquisicaoOptions}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="almoxarifado-destino" required>
                Almoxarifado destino
              </FormLabel>
              <FormInput
                id="almoxarifado-destino"
                value={almoxarifadoDestino}
                onChange={(e) => setAlmoxarifadoDestino(e.target.value)}
                placeholder="Digite o almoxarifado"
              />
            </div>
          </div>
        </div>

        {/* Seção Empenho */}
        <div className="space-y-4">
          <h3 className="font-sora font-medium text-sm text-second-dark border-b border-light-white pb-2">
            Empenho
          </h3>
          
          <div className="space-y-3">
            {empenhos.length > 0 && (
              <div className="space-y-2">
                {empenhos.map((empenho, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-light-white rounded-lg border border-second-white">
                    <div className="flex-1 text-sm text-second-dark font-sora">
                      <span className="font-medium">Empenho:</span> {empenho.numero} | 
                      <span className="font-medium"> Convênio:</span> {empenho.convenio}
                    </div>
                    <button
                      onClick={() => handleRemoveEmpenho(index)}
                      className="w-6 h-6 rounded-full bg-main-danger/10 text-main-danger hover:bg-main-danger/20 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border border-second-white rounded-lg p-4 bg-light-white/30 space-y-3">
              {empenhoRows.map((row, index) => (
                <div key={row.id} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <FormLabel htmlFor={`numero-empenho-${row.id}`} className="text-xs">
                      Número do empenho
                    </FormLabel>
                    <FormInput
                      id={`numero-empenho-${row.id}`}
                      value={row.numero}
                      onChange={(e) => handleEmpenhoRowChange(row.id, 'numero', e.target.value)}
                      placeholder="Digite o número do empenho"
                      className="text-xs"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <FormLabel htmlFor={`convenio-${row.id}`} className="text-xs">
                      Convênio
                    </FormLabel>
                    <FormSelectField
                      value={row.convenio}
                      onValueChange={(value) => handleEmpenhoRowChange(row.id, 'convenio', value)}
                      placeholder="Selecione o convênio"
                      options={convenioOptions}
                      className="text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddEmpenhoRow}
                      className="w-8 h-8 rounded-full bg-second-primary text-main-white hover:bg-second-primary/90 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {empenhoRows.length > 1 && (
                      <button
                        onClick={() => handleRemoveEmpenhoRow(row.id)}
                        className="w-8 h-8 rounded-full bg-main-danger/10 text-main-danger hover:bg-main-danger/20 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {empenhoRows.some(row => row.numero && row.convenio) && (
                <div className="pt-2 border-t border-second-white/50">
                  <PrimaryButton onClick={handleAddEmpenho} className="w-full">
                    Adicionar empenhos
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção Anexar Documentos - Agora com funcionalidade real de upload */}
        <div className="space-y-4">
          <h3 className="font-sora font-medium text-sm text-second-dark border-b border-light-white pb-2">
            Anexar Documentos
          </h3>
          
          <DocumentUpload
            documents={documents}
            onDocumentsChange={setDocuments}
          />
        </div>
      </div>
    </Modal>
  );
};

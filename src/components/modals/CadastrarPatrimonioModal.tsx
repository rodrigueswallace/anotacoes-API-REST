
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormSelectField } from '@/components/ui/form-select-field';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormLabel } from '@/components/ui/form-label';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DocumentUpload, DocumentFile } from '@/components/ui/document-upload';
import { Plus, Trash2 } from 'lucide-react';
import { CadastroManualModal } from './CadastroManualModal';
import { ProcessingModal } from './ProcessingModal';
import { SuccessModal } from './SuccessModal';
import { patrimonioStorage, PatrimonioData } from '@/lib/patrimonio-storage';
import { toast } from '@/hooks/use-toast';

interface CadastrarPatrimonioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmpenhoRow {
  id: string;
  numero: string;
  convenio: string;
}

export const CadastrarPatrimonioModal: React.FC<CadastrarPatrimonioModalProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chave-nfe' | 'importar-xml' | 'tombo-direto'>('chave-nfe');
  
  // Estado para documentos no XML
  const [xmlDocuments, setXmlDocuments] = useState<DocumentFile[]>([]);
  
  // Estados para Empenho (Chave NF-e tab) - usando linhas dinâmicas
  const [empenhoRows, setEmpenhoRows] = useState<EmpenhoRow[]>([
    { id: '1', numero: '', convenio: '' }
  ]);
  const [empenhos, setEmpenhos] = useState<{ numero: string; convenio: string }[]>([]);
  
  // Estados para Empenho (XML tab) - usando linhas dinâmicas
  const [xmlEmpenhoRows, setXmlEmpenhoRows] = useState<EmpenhoRow[]>([
    { id: '1', numero: '', convenio: '' }
  ]);
  const [xmlEmpenhos, setXmlEmpenhos] = useState<{ numero: string; convenio: string }[]>([]);
  
  // Estados para outros campos (XML tab)
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlGrupoContabil, setXmlGrupoContabil] = useState('');
  const [xmlTipoAquisicao, setXmlTipoAquisicao] = useState('');
  const [xmlAlmoxarifado, setXmlAlmoxarifado] = useState('');
  
  // Estados para Tombo direto
  const [tomboDate, setTomboDate] = useState<Date | undefined>(undefined);
  
  // Estados para Chave NF-e (sem documentos)
  const [chaveNfe, setChaveNfe] = useState('');
  const [grupoContabil, setGrupoContabil] = useState('');
  const [tipoAquisicao, setTipoAquisicao] = useState('');
  const [almoxarifado, setAlmoxarifado] = useState('');

  // Estado para controlar o modal de cadastro manual
  const [cadastroManualModalOpen, setCadastroManualModalOpen] = useState(false);
  
  // Estados para fluxo de processamento
  const [processingModalOpen, setProcessingModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [processedPatrimonioId, setProcessedPatrimonioId] = useState<string>('');

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

  // Handlers para Chave NF-e tab
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

  // Handlers para XML tab
  const handleAddXmlEmpenhoRow = () => {
    const newRow: EmpenhoRow = {
      id: Date.now().toString(),
      numero: '',
      convenio: ''
    };
    setXmlEmpenhoRows([...xmlEmpenhoRows, newRow]);
  };

  const handleXmlEmpenhoRowChange = (id: string, field: 'numero' | 'convenio', value: string) => {
    setXmlEmpenhoRows(rows => 
      rows.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleRemoveXmlEmpenhoRow = (id: string) => {
    if (xmlEmpenhoRows.length > 1) {
      setXmlEmpenhoRows(rows => rows.filter(row => row.id !== id));
    }
  };

  const handleXmlAddEmpenho = () => {
    const validRows = xmlEmpenhoRows.filter(row => row.numero && row.convenio);
    const newEmpenhos = validRows.map(row => ({ numero: row.numero, convenio: row.convenio }));
    setXmlEmpenhos([...xmlEmpenhos, ...newEmpenhos]);
    setXmlEmpenhoRows([{ id: Date.now().toString(), numero: '', convenio: '' }]);
  };

  const handleXmlRemoveEmpenho = (index: number) => {
    setXmlEmpenhos(xmlEmpenhos.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setXmlFile(file);
    }
  };

  const handleCadastroManual = () => {
    setCadastroManualModalOpen(true);
  };

  const handleConsultarNfe = async () => {
    // Validar campos obrigatórios
    if (!chaveNfe.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a chave da NF-e",
        variant: "destructive"
      });
      return;
    }

    if (!grupoContabil || !tipoAquisicao || !almoxarifado) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Adicionar empenhos automaticamente
    const validRows = empenhoRows.filter(row => row.numero && row.convenio);
    const finalEmpenhos = [...empenhos, ...validRows.map(row => ({ numero: row.numero, convenio: row.convenio }))];

    // Iniciar processamento
    setProcessingModalOpen(true);
    onOpenChange(false);

    try {
      // Simular processamento (3 segundos)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Criar dados do patrimônio
      const patrimonioId = patrimonioStorage.generateId();
      const patrimonioData: PatrimonioData = {
        id: patrimonioId,
        type: 'nfe',
        chaveNfe: chaveNfe,
        grupoContabil,
        tipoAquisicao,
        almoxarifado,
        empenhos: finalEmpenhos,
        dataProcessamento: new Date().toLocaleDateString('pt-BR'),
        status: 'processado'
      };

      // Salvar dados
      patrimonioStorage.save(patrimonioData);
      setProcessedPatrimonioId(patrimonioId);

      // Fechar modal de processamento e abrir modal de sucesso
      setProcessingModalOpen(false);
      setSuccessModalOpen(true);

    } catch (error) {
      setProcessingModalOpen(false);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao consultar a NF-e. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleConsultarXml = async () => {
    // Validar campos obrigatórios
    if (!xmlFile) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione um arquivo XML",
        variant: "destructive"
      });
      return;
    }

    if (!xmlGrupoContabil || !xmlTipoAquisicao || !xmlAlmoxarifado) {
      toast({
        title: "Campos obrigatórios", 
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Adicionar empenhos automaticamente
    const validRows = xmlEmpenhoRows.filter(row => row.numero && row.convenio);
    const finalEmpenhos = [...xmlEmpenhos, ...validRows.map(row => ({ numero: row.numero, convenio: row.convenio }))];

    // Iniciar processamento
    setProcessingModalOpen(true);
    onOpenChange(false);

    try {
      // Simular processamento (3 segundos)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Criar dados do patrimônio
      const patrimonioId = patrimonioStorage.generateId();
      const patrimonioData: PatrimonioData = {
        id: patrimonioId,
        type: 'xml',
        xmlFile: xmlFile,
        grupoContabil: xmlGrupoContabil,
        tipoAquisicao: xmlTipoAquisicao,
        almoxarifado: xmlAlmoxarifado,
        empenhos: finalEmpenhos,
        dataProcessamento: new Date().toLocaleDateString('pt-BR'),
        status: 'processado'
      };

      // Salvar dados
      patrimonioStorage.save(patrimonioData);
      setProcessedPatrimonioId(patrimonioId);

      // Fechar modal de processamento e abrir modal de sucesso
      setProcessingModalOpen(false);
      setSuccessModalOpen(true);

    } catch (error) {
      setProcessingModalOpen(false);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o XML. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleIniciarTombo = async () => {
    // Validar data
    if (!tomboDate) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione uma data para o tombo direto",
        variant: "destructive"
      });
      return;
    }

    // Iniciar processamento
    setProcessingModalOpen(true);
    onOpenChange(false);

    try {
      // Simular processamento (2 segundos para tombo direto)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar dados do patrimônio
      const patrimonioId = patrimonioStorage.generateId();
      const patrimonioData: PatrimonioData = {
        id: patrimonioId,
        type: 'tombo-direto',
        grupoContabil: '',
        tipoAquisicao: '',
        almoxarifado: '',
        empenhos: [],
        dataProcessamento: tomboDate.toLocaleDateString('pt-BR'),
        status: 'processado'
      };

      // Salvar dados
      patrimonioStorage.save(patrimonioData);
      setProcessedPatrimonioId(patrimonioId);

      // Fechar modal de processamento e abrir modal de sucesso
      setProcessingModalOpen(false);
      setSuccessModalOpen(true);

    } catch (error) {
      setProcessingModalOpen(false);
      toast({
        title: "Erro no processamento", 
        description: "Ocorreu um erro ao criar o tombo direto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const renderChaveNfeTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormLabel htmlFor="chave-nfe" required>
          Chave da NF-e
        </FormLabel>
        <FormInput
          id="chave-nfe"
          value={chaveNfe}
          onChange={(e) => setChaveNfe(e.target.value)}
          placeholder="Digite a chave da nota fiscal eletrônica"
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="grupo-contabil" required>
          Grupo contábil
        </FormLabel>
        <FormSelectField
          value={grupoContabil}
          onValueChange={setGrupoContabil}
          placeholder="Selecione uma opção"
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
          placeholder="Selecione uma opção"
          options={tipoAquisicaoOptions}
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="almoxarifado" required>
          Almoxarifado
        </FormLabel>
        <FormSelectField
          value={almoxarifado}
          onValueChange={setAlmoxarifado}
          placeholder="Selecione uma opção"
          options={[
            { value: 'almox-1', label: 'Almoxarifado Central' },
            { value: 'almox-2', label: 'Almoxarifado Setorial' },
          ]}
        />
      </div>

      <div className="space-y-3">
        <FormLabel required>
          Empenho
        </FormLabel>
        
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
                {index === 0 && (
                  <FormLabel htmlFor={`numero-empenho-${row.id}`} className="text-xs">
                    Número do empenho
                  </FormLabel>
                )}
                <FormInput
                  id={`numero-empenho-${row.id}`}
                  value={row.numero}
                  onChange={(e) => handleEmpenhoRowChange(row.id, 'numero', e.target.value)}
                  placeholder="Digite um texto"
                  className="text-xs"
                />
              </div>
              <div className="flex-1 space-y-1">
                {index === 0 && (
                  <FormLabel htmlFor={`convenio-${row.id}`} className="text-xs">
                    Convênio
                  </FormLabel>
                )}
                <FormSelectField
                  value={row.convenio}
                  onValueChange={(value) => handleEmpenhoRowChange(row.id, 'convenio', value)}
                  placeholder="Selecione uma opção"
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
          
        </div>
      </div>
    </div>
  );

  const renderImportarXmlTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormLabel htmlFor="xml-file" required>
          Arquivo XML da NF-e
        </FormLabel>
        <div className="border-2 border-dashed border-second-white rounded-lg p-4 text-center hover:border-second-primary/30 transition-colors">
          <input
            type="file"
            id="xml-file"
            accept=".xml"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="xml-file" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-second-black/60">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span className="text-sm text-second-black/80 font-sora">
                {xmlFile ? xmlFile.name : 'Arraste o arquivo ou clique para enviar'}
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="xml-grupo-contabil" required>
          Grupo contábil
        </FormLabel>
        <FormSelectField
          value={xmlGrupoContabil}
          onValueChange={setXmlGrupoContabil}
          placeholder="Selecione uma opção"
          options={grupoContabilOptions}
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="xml-tipo-aquisicao" required>
          Tipo de aquisição
        </FormLabel>
        <FormSelectField
          value={xmlTipoAquisicao}
          onValueChange={setXmlTipoAquisicao}
          placeholder="Selecione uma opção"
          options={tipoAquisicaoOptions}
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="xml-almoxarifado" required>
          Almoxarifado
        </FormLabel>
        <FormSelectField
          value={xmlAlmoxarifado}
          onValueChange={setXmlAlmoxarifado}
          placeholder="Selecione uma opção"
          options={[
            { value: 'almox-1', label: 'Almoxarifado Central' },
            { value: 'almox-2', label: 'Almoxarifado Setorial' },
          ]}
        />
      </div>

      <div className="space-y-3">
        <FormLabel>
          Empenho
        </FormLabel>
        
        {xmlEmpenhos.length > 0 && (
          <div className="space-y-2">
            {xmlEmpenhos.map((empenho, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-light-white rounded-lg border border-second-white">
                <div className="flex-1 text-sm text-second-dark font-sora">
                  <span className="font-medium">Empenho:</span> {empenho.numero} | 
                  <span className="font-medium"> Convênio:</span> {empenho.convenio}
                </div>
                <button
                  onClick={() => handleXmlRemoveEmpenho(index)}
                  className="w-6 h-6 rounded-full bg-main-danger/10 text-main-danger hover:bg-main-danger/20 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="border border-second-white rounded-lg p-4 bg-light-white/30 space-y-3">
          {xmlEmpenhoRows.map((row, index) => (
            <div key={row.id} className="flex gap-3 items-end">
              <div className="flex-1 space-y-1">
                {index === 0 && (
                  <FormLabel htmlFor={`xml-numero-empenho-${row.id}`} className="text-xs">
                    Número do empenho
                  </FormLabel>
                )}
                <FormInput
                  id={`xml-numero-empenho-${row.id}`}
                  value={row.numero}
                  onChange={(e) => handleXmlEmpenhoRowChange(row.id, 'numero', e.target.value)}
                  placeholder="Digite um texto"
                  className="text-xs"
                />
              </div>
              <div className="flex-1 space-y-1">
                {index === 0 && (
                  <FormLabel htmlFor={`xml-convenio-${row.id}`} className="text-xs">
                    Convênio
                  </FormLabel>
                )}
                <FormSelectField
                  value={row.convenio}
                  onValueChange={(value) => handleXmlEmpenhoRowChange(row.id, 'convenio', value)}
                  placeholder="Selecione uma opção"
                  options={convenioOptions}
                  className="text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddXmlEmpenhoRow}
                  className="w-8 h-8 rounded-full bg-second-primary text-main-white hover:bg-second-primary/90 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {xmlEmpenhoRows.length > 1 && (
                  <button
                    onClick={() => handleRemoveXmlEmpenhoRow(row.id)}
                    className="w-8 h-8 rounded-full bg-main-danger/10 text-main-danger hover:bg-main-danger/20 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );

  const renderTomboiretoTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormLabel htmlFor="data-entrada" required>
          Data de entrada
        </FormLabel>
        <FormDatePicker
          date={tomboDate}
          onDateChange={setTomboDate}
          placeholder="Selecione a data"
        />
      </div>
    </div>
  );

  const getFooterActions = () => {
    switch (activeTab) {
      case 'chave-nfe':
        return (
          <>
            <PrimaryGhostButton onClick={handleCadastroManual}>
              Cadastro manual
            </PrimaryGhostButton>
            <PrimaryButton onClick={handleConsultarNfe}>
              Consultar NF-e
            </PrimaryButton>
          </>
        );
      case 'importar-xml':
        return (
          <>
            <PrimaryGhostButton onClick={handleCadastroManual}>
              Cadastro manual
            </PrimaryGhostButton>
            <PrimaryButton onClick={handleConsultarXml}>
              Consultar XML
            </PrimaryButton>
          </>
        );
      case 'tombo-direto':
        return (
          <>
            <PrimaryButton onClick={handleIniciarTombo}>
              Iniciar tombo
            </PrimaryButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Cadastrar patrimônio"
        actions={getFooterActions()}
        className="sm:max-w-lg"
      >
        <div className="space-y-4">
          {/* Tabs */}
          <div className="space-y-2">
            <FormLabel required>
              Tipo de entrada
            </FormLabel>
            <div className="flex bg-light-white rounded-lg p-1 gap-1">
              <button
                onClick={() => setActiveTab('chave-nfe')}
                className={`flex-1 px-3 py-1.5 text-xs font-sora font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
                  activeTab === 'chave-nfe'
                    ? 'bg-main-white text-second-dark shadow-sm border border-second-white/50'
                    : 'text-second-black/70 hover:text-second-dark hover:bg-main-white/50'
                }`}
              >
                Chave NF-e
              </button>
              <button
                onClick={() => setActiveTab('importar-xml')}
                className={`flex-1 px-3 py-1.5 text-xs font-sora font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
                  activeTab === 'importar-xml'
                    ? 'bg-main-white text-second-dark shadow-sm border border-second-white/50'
                    : 'text-second-black/70 hover:text-second-dark hover:bg-main-white/50'
                }`}
              >
                Importar XML
              </button>
              <button
                onClick={() => setActiveTab('tombo-direto')}
                className={`flex-1 px-3 py-1.5 text-xs font-sora font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
                  activeTab === 'tombo-direto'
                    ? 'bg-main-white text-second-dark shadow-sm border border-second-white/50'
                    : 'text-second-black/70 hover:text-second-dark hover:bg-main-white/50'
                }`}
              >
                Tombo direto
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'chave-nfe' && renderChaveNfeTab()}
          {activeTab === 'importar-xml' && renderImportarXmlTab()}
          {activeTab === 'tombo-direto' && renderTomboiretoTab()}
        </div>
      </Modal>

      {/* Modal de Cadastro Manual */}
      <CadastroManualModal
        open={cadastroManualModalOpen}
        onOpenChange={setCadastroManualModalOpen}
      />

      {/* Modal de Processamento */}
      <ProcessingModal
        open={processingModalOpen}
        title="Carregando"
        description={
          activeTab === 'chave-nfe' ? "Consultando NF-e no SEFAZ..." :
          activeTab === 'importar-xml' ? "Processando arquivo XML..." :
          "Criando tombo direto..."
        }
      />

      {/* Modal de Sucesso */}
      <SuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        title="Sucesso!"
        description={
          activeTab === 'chave-nfe' ? "NF-e consultada com sucesso!" :
          activeTab === 'importar-xml' ? "XML processado com sucesso!" :
          "Tombo direto criado com sucesso!"
        }
        buttonText="Visualizar detalhes"
        onConfirm={() => {
          setSuccessModalOpen(false);
          if (processedPatrimonioId) {
            navigate(`/recepcao-nota-fiscal/${processedPatrimonioId}`);
          }
        }}
      />
    </>
  );
};

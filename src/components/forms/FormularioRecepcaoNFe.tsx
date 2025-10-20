import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DisplayField } from '@/components/ui/display-field';
import { DocumentUpload } from '@/components/ui/document-upload';
import type { PatrimonioData } from '@/lib/patrimonio-storage';
import type { DocumentFile } from '@/components/ui/document-upload';
import { formatCNPJ } from '@/lib/formatters';

interface FormularioRecepcaoNFeProps {
  patrimonioData: PatrimonioData;
}

export function FormularioRecepcaoNFe({ patrimonioData }: FormularioRecepcaoNFeProps) {
  const [documents] = useState<DocumentFile[]>([
    {
      id: '1',
      name: 'Termo de recebimento.pdf',
      comment: 'Documento de confirmação de recebimento da mercadoria',
      status: 'Enviado',
      url: '#'
    }
  ]);

  // Formatting functions
  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return '—';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Extract NFe number from chave
  const numeroNf = patrimonioData.numeroNf || (patrimonioData.chaveNfe ? patrimonioData.chaveNfe.slice(-9, -1) : '');

  return (
    <div className="space-y-6">
      <Card className="bg-main-white border-second-white">
        <CardHeader>
          <CardTitle className="font-sora text-lg font-semibold text-main-black">
            Formulário de Recepção de Nota Fiscal / Nota de Empenho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* Linha 1: NF-e, Número NF, Data Emissão */}
            <DisplayField
              label="Número da Chave de Acesso (NF-e)"
              value={patrimonioData.chaveNfe || ''}
              required
            />
            
            <DisplayField
              label="Número da NF"
              value={numeroNf}
              required
            />
            
            <DisplayField
              label="Data da Emissão"
              value={formatDate(patrimonioData.dataEmissao)}
              required
            />

            {/* Linha 2: Razão Social (2 cols), CNPJ */}
            <DisplayField
              label="Fornecedor (Razão Social)"
              value={patrimonioData.razaoSocial || ''}
              required
              className="col-span-2"
            />
            
            <DisplayField
              label="Fornecedor (CNPJ)"
              value={patrimonioData.cnpj ? formatCNPJ(patrimonioData.cnpj) : ''}
              required
            />

            {/* Linha 3: Número de Itens, Valor Total, Elemento de Despesa */}
            <DisplayField
              label="Número de Itens"
              value={patrimonioData.numeroItens?.toString() || ''}
              required
            />
            
            <DisplayField
              label="Valor Total"
              value={formatCurrency(patrimonioData.valorTotal)}
              required
            />
            
            <DisplayField
              label="Elemento de Despesa"
              value={patrimonioData.elementoDespesa || ''}
              required
            />

            {/* Linha 4: Grupo Contábil, Tipo de Aquisição, Almoxarifado */}
            <DisplayField
              label="Grupo Contábil"
              value={patrimonioData.grupoContabil || ''}
              required
            />
            
            <DisplayField
              label="Tipo de Aquisição"
              value={patrimonioData.tipoAquisicao || ''}
              required
            />
            
            <DisplayField
              label="Almoxarifado"
              value={patrimonioData.almoxarifado || ''}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Seção Empenho */}
      <Card className="bg-main-white border-second-white">
        <CardHeader>
          <CardTitle className="font-sora text-lg font-semibold text-main-black">
            Empenho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DisplayField
              label="Número do Empenho"
              value={patrimonioData.numeroEmpenho || ''}
            />
            
            <DisplayField
              label="Convênio"
              value={patrimonioData.convenio || ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seção Anexos */}
      <Card className="bg-main-white border-second-white">
        <CardHeader>
          <CardTitle className="font-sora text-lg font-semibold text-main-black">
            Anexos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            documents={documents}
            onDocumentsChange={() => {}} // Read-only mode
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
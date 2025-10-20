import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form-label';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormTextarea } from '@/components/ui/form-textarea';
import { DocumentUpload, DocumentFile } from '@/components/ui/document-upload';
import type { PatrimonioData } from '@/lib/patrimonio-storage';

interface FormularioEntradaAlmoxarifadoProps {
  patrimonioData: PatrimonioData;
  onDataChange?: (data: any) => void;
}

export function FormularioEntradaAlmoxarifado({ 
  patrimonioData, 
  onDataChange 
}: FormularioEntradaAlmoxarifadoProps) {
  const [dataEntrada, setDataEntrada] = useState<Date>(new Date());
  const [observacoes, setObservacoes] = useState<string>('');
  const [anexosEntrada, setAnexosEntrada] = useState<DocumentFile[]>([
    {
      id: '1',
      name: 'Termo de recebimento',
      comment: 'Documento de entrada no almoxarifado',
      status: 'Criado',
      url: '#'
    }
  ]);

  const handleDataEntradaChange = (date: Date | undefined) => {
    if (date) {
      setDataEntrada(date);
      onDataChange?.({ dataEntrada: date, observacoes, anexosEntrada });
    }
  };

  const handleObservacoesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setObservacoes(value);
    onDataChange?.({ dataEntrada, observacoes: value, anexosEntrada });
  };

  const handleAnexosChange = (documents: DocumentFile[]) => {
    setAnexosEntrada(documents);
    onDataChange?.({ dataEntrada, observacoes, anexosEntrada: documents });
  };

  return (
    <div className="space-y-6">
      {/* Formulário Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Formulário de Entrada no Almoxarifado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data da entrada no almoxarifado */}
            <div className="space-y-2">
              <FormLabel required>Data da entrada no almoxarifado</FormLabel>
              <FormDatePicker
                date={dataEntrada}
                onDateChange={handleDataEntradaChange}
                placeholder="Data"
                className="w-full"
              />
            </div>

            {/* Observações */}
            <div className="space-y-2 md:col-span-2">
              <FormLabel>Observações</FormLabel>
              <FormTextarea
                value={observacoes}
                onChange={handleObservacoesChange}
                placeholder="Digite um texto"
                className="w-full min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anexos de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle>Anexos de entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            documents={anexosEntrada}
            onDocumentsChange={handleAnexosChange}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
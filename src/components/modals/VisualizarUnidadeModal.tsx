import React from 'react';
import { Modal } from '@/components/ui/modal';
import { DisplayField } from '@/components/ui/display-field';
import { Button } from '@/components/ui/button';

interface VisualizarUnidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidade: {
    nome: string;
    sigla: string;
    codigo: string;
    areaVinculada: string;
    responsavel: string;
    status: string;
    dataCriacao: string;
  };
}

export const VisualizarUnidadeModal: React.FC<VisualizarUnidadeModalProps> = ({
  open,
  onOpenChange,
  unidade
}) => {
  const formatStatus = (status: string) => {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Visualizar unidade"
      description="Informações detalhadas da unidade selecionada."
      actions={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      }
    >
      <div className="space-y-4">
        <DisplayField
          label="Nome da unidade"
          value={unidade.nome}
        />

        <div className="grid grid-cols-2 gap-4">
          <DisplayField
            label="Sigla"
            value={unidade.sigla}
          />

          <DisplayField
            label="Código"
            value={unidade.codigo}
          />
        </div>

        <DisplayField
          label="Área vinculada"
          value={unidade.areaVinculada}
        />

        <DisplayField
          label="Responsável"
          value={unidade.responsavel}
        />

        <div className="grid grid-cols-2 gap-4">
          <DisplayField
            label="Status"
            value={formatStatus(unidade.status)}
          />

          <DisplayField
            label="Data de criação"
            value={new Date(unidade.dataCriacao).toLocaleDateString('pt-BR')}
          />
        </div>
      </div>
    </Modal>
  );
};
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';

export interface VisualizarSubgrupoBemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subgrupo: any;
}

const VisualizarSubgrupoBemModal = ({ 
  open, 
  onOpenChange, 
  subgrupo 
}: VisualizarSubgrupoBemModalProps) => {

  if (!subgrupo) return null;

  // Função para obter estilos do status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'border-main-success text-main-success';
      case 'inativo':
        return 'border-main-danger text-main-danger';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Função para formatar status para exibição
  const formatStatusForDisplay = (status: string) => {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  };


  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Visualizar subgrupo do bem"
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Informações básicas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-second-dark mb-1">
              Nome
            </label>
            <div className="w-full px-3 py-2 bg-light-black/10 border border-light-black/20 rounded-lg text-sm text-second-dark">
              {subgrupo.nome}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-second-dark mb-1">
                Grupo
              </label>
              <div className="w-full px-3 py-2 bg-light-black/10 border border-light-black/20 rounded-lg text-sm text-second-dark">
                {subgrupo.grupo}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-second-dark mb-1">
                Status
              </label>
              <div className="flex items-center">
                <Badge 
                  variant="outline" 
                  className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getStatusStyles(subgrupo.status)}`}
                >
                  {formatStatusForDisplay(subgrupo.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export { VisualizarSubgrupoBemModal };
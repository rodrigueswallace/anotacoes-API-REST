
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { FormLabel } from '@/components/ui/form-label';
import { Badge } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-buttons';

interface VisualizarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: any; // Dados do usuário a ser visualizado
}

export const VisualizarUsuarioModal: React.FC<VisualizarUsuarioModalProps> = ({
  open,
  onOpenChange,
  usuario
}) => {
  if (!usuario) return null;

  // Mapeamento de perfil para estilos de badge
  const getPerfilStyles = (perfil: string) => {
    switch (perfil) {
      case 'Administrador':
        return 'border-main-danger text-main-danger';
      case 'Gestor':
        return 'border-main-warning text-main-warning';
      case 'Auditor':
        return 'border-main-info text-main-info';
      case 'Operador':
        return 'border-main-success text-main-success';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Mapeamento de status para estilos de badge
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'border-main-success text-main-success';
      case 'Inativo':
        return 'border-main-danger text-main-danger';
      default:
        return 'border-main-info text-main-info';
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Visualizar usuário"
      className="sm:max-w-lg w-full"
      actions={
        <PrimaryButton onClick={() => onOpenChange(false)}>
          Fechar
        </PrimaryButton>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel>Nome completo</FormLabel>
          <div className="p-3 bg-light-white border border-light-white rounded-md">
            <span className="text-main-dark font-sora text-sm">
              {usuario.nome || '-'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel>E-mail</FormLabel>
          <div className="p-3 bg-light-white border border-light-white rounded-md">
            <span className="text-main-dark font-sora text-sm">
              {usuario.email || '-'}
            </span>
          </div>
        </div>

        {/* CPF e Telefone na mesma linha - responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>CPF</FormLabel>
            <div className="p-3 bg-light-white border border-light-white rounded-md">
              <span className="text-main-dark font-sora text-sm">
                {usuario.cpf || '-'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Telefone</FormLabel>
            <div className="p-3 bg-light-white border border-light-white rounded-md">
              <span className="text-main-dark font-sora text-sm">
                {usuario.telefone || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Perfil de acesso</FormLabel>
            <div className="p-3 bg-light-white border border-light-white rounded-md">
              {usuario.perfil ? (
                <Badge 
                  variant="outline" 
                  className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getPerfilStyles(usuario.perfil)}`}
                >
                  {usuario.perfil}
                </Badge>
              ) : (
                <span className="text-main-dark font-sora text-sm">-</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Status</FormLabel>
            <div className="p-3 bg-light-white border border-light-white rounded-md">
              {usuario.status ? (
                <Badge 
                  variant="outline" 
                  className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getStatusStyles(usuario.status)}`}
                >
                  {usuario.status}
                </Badge>
              ) : (
                <span className="text-main-dark font-sora text-sm">-</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel>Departamento</FormLabel>
          <div className="p-3 bg-light-white border border-light-white rounded-md">
            <span className="text-main-dark font-sora text-sm">
              {usuario.departamento || '-'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Último acesso</FormLabel>
            <div className="p-3 bg-light-white border border-light-white rounded-md">
              <span className="text-main-dark font-sora text-sm">
                {usuario.ultimo_acesso || '-'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Data de criação</FormLabel>
            <div className="p-3 bg-light-white border border-light-white rounded-md">
              <span className="text-main-dark font-sora text-sm">
                {usuario.data_criacao || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

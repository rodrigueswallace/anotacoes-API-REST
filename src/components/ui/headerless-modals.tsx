import * as React from "react";
import { Dialog, DialogContent, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PrimaryButton, PrimaryGhostButton } from "@/components/ui/primary-buttons";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

// Tipos das props para os modais
interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfirmationModalProps extends BaseModalProps {
  title?: string;
  subtitle?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface LoadingModalProps extends BaseModalProps {
  title?: string;
  subtitle?: string;
  showOkButton?: boolean;
  onOk?: () => void;
  okText?: string;
}

interface SuccessModalProps extends BaseModalProps {
  title?: string;
  subtitle?: string;
  onOk?: () => void;
  okText?: string;
}

// Modal de Confirmação de Ação
export const ConfirmationModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  ConfirmationModalProps
>(({ 
  open, 
  onOpenChange, 
  title = "Deseja deletar o arquivo?",
  subtitle = "Você não poderá desfazer esta ação!",
  onConfirm,
  onCancel,
  confirmText = "Sim",
  cancelText = "Não"
}, ref) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent
          ref={ref}
          className="fixed left-1/2 top-1/2 z-50 w-[448px] h-[340px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center justify-between text-center overflow-hidden [&>button]:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </VisuallyHidden>
          
          {/* Ícone customizado */}
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/35ba7596-c617-4931-91ed-4f87ff22ff12.png" 
              alt="Ícone de confirmação" 
              className="w-[140px] h-[140px]"
            />
          </div>

          {/* Textos centralizados */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <h2 className="text-[22px] font-normal text-second-dark font-sora">
              {title}
            </h2>
            <p className="text-[16px] font-normal text-main-danger font-sora">
              {subtitle}
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2 flex-shrink-0">
            <PrimaryGhostButton
              onClick={handleCancel}
              className="w-16 h-8"
            >
              {cancelText}
            </PrimaryGhostButton>
            <PrimaryButton
              onClick={handleConfirm}
              className="w-16 h-8"
            >
              {confirmText}
            </PrimaryButton>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
});

ConfirmationModal.displayName = "ConfirmationModal";

// Modal de Carregamento
export const LoadingModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  LoadingModalProps
>(({ 
  open, 
  onOpenChange, 
  title = "Carregando!",
  subtitle = "O arquivo está sendo excluído",
  showOkButton = false,
  onOk,
  okText = "OK"
}, ref) => {
  const handleOk = () => {
    onOk?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent
          ref={ref}
          className="fixed left-1/2 top-1/2 z-50 w-[448px] h-[280px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center justify-between text-center overflow-hidden [&>button]:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </VisuallyHidden>
          
          {/* Spinner animado */}
          <div className="flex-shrink-0">
            <Loader2 className="w-[88px] h-[88px] text-main-primary animate-spin" />
          </div>

          {/* Textos centralizados */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <h2 className="text-[22px] font-normal text-second-dark font-sora">
              {title}
            </h2>
            <p className="text-[16px] font-normal text-main-danger font-sora">
              {subtitle}
            </p>
          </div>

          {/* Botão opcional */}
          <div className="flex-shrink-0">
            {showOkButton && (
              <PrimaryButton onClick={handleOk} className="h-8">
                {okText}
              </PrimaryButton>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
});

LoadingModal.displayName = "LoadingModal";

// Modal de Sucesso
export const SuccessModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  SuccessModalProps
>(({ 
  open, 
  onOpenChange, 
  title = "Deletado!",
  subtitle = "O arquivo foi excluído",
  onOk,
  okText = "OK"
}, ref) => {
  const handleOk = () => {
    onOk?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent
          ref={ref}
          className="fixed left-1/2 top-1/2 z-50 w-[448px] h-[280px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center justify-between text-center overflow-hidden [&>button]:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </VisuallyHidden>
          
          {/* Ícone de check */}
          <div className="flex-shrink-0">
            <div className="w-[88px] h-[88px] rounded-full border-4 border-green-100 flex items-center justify-center">
              <Check className="w-12 h-12 text-main-success" />
            </div>
          </div>

          {/* Textos centralizados */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <h2 className="text-[22px] font-normal text-second-dark font-sora">
              {title}
            </h2>
            <p className="text-[16px] font-normal text-main-danger font-sora">
              {subtitle}
            </p>
          </div>

          {/* Botão */}
          <div className="flex-shrink-0">
            <PrimaryButton onClick={handleOk} className="h-8">
              {okText}
            </PrimaryButton>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
});

SuccessModal.displayName = "SuccessModal";
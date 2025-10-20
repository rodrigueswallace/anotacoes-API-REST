import { StandardInactivateConfirmationModal } from "./StandardInactivateConfirmationModal";
import { ProcessingModal } from "./ProcessingModal";
import { SuccessModal } from "./SuccessModal";
import { StandardModalStates } from "@/hooks/use-standard-modals";

interface StandardModalsWrapperProps {
  modalStates: StandardModalStates;
  onInactivateConfirm: () => void;
  onInactivateCancel: () => void;
  onReactivateConfirm?: () => void;
  onReactivateCancel?: () => void;
  onSuccessConfirm: () => void;
}

export const StandardModalsWrapper = ({
  modalStates,
  onInactivateConfirm,
  onInactivateCancel,
  onReactivateConfirm,
  onReactivateCancel,
  onSuccessConfirm
}: StandardModalsWrapperProps) => {
  const isReactivateModal = modalStates.confirmationTitle?.includes('reativar');
  
  // Lógica de prioridade: apenas um modal visível por vez
  // Prioridade: Success > Processing > Confirmation
  const showSuccess = modalStates.showSuccess;
  const showProcessing = !showSuccess && modalStates.showProcessing;
  const showConfirmation = !showSuccess && !showProcessing && modalStates.showInactivateConfirmation;
  
  return (
    <>
      {showConfirmation && (
        <StandardInactivateConfirmationModal
          open={true}
          onOpenChange={(open) => !open && (isReactivateModal && onReactivateCancel ? onReactivateCancel() : onInactivateCancel())}
          onConfirm={isReactivateModal && onReactivateConfirm ? onReactivateConfirm : onInactivateConfirm}
          title={modalStates.confirmationTitle}
          description={modalStates.confirmationDescription}
        />
      )}

      {showProcessing && (
        <ProcessingModal
          open={true}
          title="Carregando"
          description={modalStates.processingMessage}
        />
      )}

      {showSuccess && (
        <SuccessModal
          open={true}
          onOpenChange={(open) => !open && onSuccessConfirm()}
          title="Finalizado!"
          description={modalStates.successMessage}
          buttonText="OK"
          onConfirm={onSuccessConfirm}
        />
      )}
    </>
  );
};
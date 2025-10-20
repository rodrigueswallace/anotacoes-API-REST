import { useState } from 'react';

export interface StandardModalStates {
  // Confirmation modals
  showInactivateConfirmation: boolean;
  confirmationTitle: string;
  confirmationDescription: string;
  
  // Processing modals
  showProcessing: boolean;
  processingMessage: string;
  
  // Success modals
  showSuccess: boolean;
  successMessage: string;
}

export const useStandardModals = () => {
  const [modalStates, setModalStates] = useState<StandardModalStates>({
    showInactivateConfirmation: false,
    confirmationTitle: '',
    confirmationDescription: '',
    showProcessing: false,
    processingMessage: '',
    showSuccess: false,
    successMessage: '',
  });

  // Confirmation actions
  const showInactivateConfirmation = (title?: string, description?: string) => {
    setModalStates(prev => ({ 
      ...prev, 
      showInactivateConfirmation: true,
      confirmationTitle: title || 'Deseja inativar o item?',
      confirmationDescription: description || 'Ele não estará mais visível fora das configurações'
    }));
  };

  const showReactivateConfirmation = () => {
    setModalStates(prev => ({ 
      ...prev, 
      showInactivateConfirmation: true,
      confirmationTitle: 'Deseja reativar o item?',
      confirmationDescription: 'Ele voltará a ficar visível fora das configurações'
    }));
  };

  const hideInactivateConfirmation = () => {
    setModalStates(prev => ({ 
      ...prev, 
      showInactivateConfirmation: false,
      confirmationTitle: '',
      confirmationDescription: ''
    }));
  };

  // Processing actions
  const showProcessingModal = (message: string) => {
    setModalStates(prev => ({ 
      ...prev, 
      showProcessing: true, 
      processingMessage: message 
    }));
  };

  const hideProcessingModal = () => {
    setModalStates(prev => ({ ...prev, showProcessing: false, processingMessage: '' }));
  };

  // Success actions
  const showSuccessModal = (message: string) => {
    setModalStates(prev => ({ 
      ...prev, 
      showSuccess: true, 
      successMessage: message 
    }));
  };

  const hideSuccessModal = () => {
    setModalStates(prev => ({ ...prev, showSuccess: false, successMessage: '' }));
  };

  // Combined flow actions
  const startCreateFlow = () => {
    showProcessingModal('O item está sendo criado.');
  };

  const completeCreateFlow = () => {
    hideProcessingModal();
    showSuccessModal('O item foi criado.');
  };

  const startEditFlow = () => {
    showProcessingModal('O item está sendo editado.');
  };

  const completeEditFlow = () => {
    hideProcessingModal();
    showSuccessModal('O item foi editado.');
  };

  const startInactivateFlow = () => {
    hideInactivateConfirmation();
    showProcessingModal('O item está sendo inativado.');
  };

  const completeInactivateFlow = () => {
    hideProcessingModal();
    showSuccessModal('O item foi inativado.');
  };

  const startReactivateFlow = () => {
    hideInactivateConfirmation();
    showProcessingModal('O item está sendo reativado.');
  };

  const completeReactivateFlow = () => {
    hideProcessingModal();
    showSuccessModal('O item foi reativado.');
  };

  const hideAllModals = () => {
    setModalStates({
      showInactivateConfirmation: false,
      confirmationTitle: '',
      confirmationDescription: '',
      showProcessing: false,
      processingMessage: '',
      showSuccess: false,
      successMessage: '',
    });
  };

  return {
    modalStates,
    showInactivateConfirmation,
    showReactivateConfirmation,
    hideInactivateConfirmation,
    showProcessingModal,
    hideProcessingModal,
    showSuccessModal,
    hideSuccessModal,
    startCreateFlow,
    completeCreateFlow,
    startEditFlow,
    completeEditFlow,
    startInactivateFlow,
    completeInactivateFlow,
    startReactivateFlow,
    completeReactivateFlow,
    hideAllModals,
  };
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { Mail } from 'lucide-react';
import { ProcessingModal } from '@/components/modals/ProcessingModal';
import { SuccessModal } from '@/components/modals/SuccessModal';

const EsqueceuSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('E-mail é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    setIsLoading(true);
    setShowProcessing(true);

    try {
      // Simular envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowProcessing(false);
      setShowSuccess(true);
    } catch (error) {
      setShowProcessing(false);
      setError('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#197c5a] via-[#5fc19f] to-[#fdfffe] flex items-center justify-center p-4">
      {/* Header com logos */}
      <div className="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 sm:p-6">
        <img 
          src="/heridium-logo.png" 
          alt="Heridium" 
          className="h-12 sm:h-16 w-auto"
        />
        <img 
          src="/lovable-uploads/8bf7e0cd-b784-4347-899e-35f4f91e59aa.png" 
          alt="Governo do Estado do Amazonas" 
          className="w-[110px] h-[49px] sm:w-[165px] sm:h-[74px]"
          style={{ aspectRatio: '220/98' }}
        />
      </div>

      {/* Modal de Esqueceu Senha */}
      <div className="w-full max-w-md mx-auto">
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'hsl(var(--login-modal-bg))' }}
        >
          {/* Título e Subtítulo */}
          <div className="text-left mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2 font-sora">
              Logar sem senha
            </h1>
            <p className="text-gray-300 text-sm font-sora">
              Insira seu e-mail para logar sem senha
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div className="space-y-2">
              <FormLabel className="text-white font-sora">
                E-mail
              </FormLabel>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
                <FormInput
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Digite seu e-mail"
                  className="font-sora text-white placeholder:text-gray-400 border-gray-600 pl-10"
                  style={{ backgroundColor: 'hsl(var(--login-input-bg))' }}
                  error={!!error}
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs font-sora">{error}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex space-x-3">
              <PrimaryGhostButton
                onClick={handleCancel}
                className="flex-1 h-8"
              >
                Cancelar
              </PrimaryGhostButton>
              
              <PrimaryButton
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isLoading}
                className="flex-1 h-8"
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>

      {/* Rodapé */}
      <div className="fixed bottom-4 left-0 w-full z-10 text-left pl-4">
        <p className="text-white text-sm font-sora">
          www.heridium.com.br
        </p>
      </div>

      {/* Modais */}
      <ProcessingModal
        open={showProcessing}
        title="Enviando e-mail"
        description="Aguarde enquanto enviamos as instruções para seu e-mail..."
      />

      <SuccessModal
        open={showSuccess}
        onOpenChange={(open) => !open && handleSuccessConfirm()}
        title="E-mail enviado!"
        description="Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
        buttonText="Continuar"
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
};

export default EsqueceuSenha;
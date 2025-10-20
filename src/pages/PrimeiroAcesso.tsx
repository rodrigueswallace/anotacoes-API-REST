import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/ui/form-input';
import { FormLabel } from '../components/ui/form-label';
import { PasswordInput } from '../components/ui/password-input';
import { Button } from '../components/ui/button';
import { formatCPF } from '../lib/formatters';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/use-mobile';

interface FormErrors {
  email?: string;
  cpf?: string;
  password?: string;
  confirmPassword?: string;
}

const PrimeiroAcesso = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular sucesso no cadastro
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setFormData(prev => ({ ...prev, cpf: formattedCPF }));
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, confirmPassword: value }));
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#197c5a] via-[#5fc19f] to-[#fdfffe] flex items-center justify-center p-4" style={{ paddingTop: isMobile ? '100px' : '120px', paddingBottom: isMobile ? '80px' : '100px' }}>
      {/* Header com logos */}
      <div className="fixed top-0 left-0 w-full z-20 flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-[#197c5a]/80 via-[#5fc19f]/80 to-transparent backdrop-blur-sm">
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

      {/* Modal de Primeiro Acesso */}
      <div className="w-full max-w-md mx-auto">
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'hsl(var(--login-modal-bg))' }}
        >
          {/* Título e Subtítulo */}
          <div className="text-left mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2 font-sora">
              Primeiro acesso
            </h1>
            <p className="text-gray-300 text-sm font-sora">
              Crie sua conta
            </p>
            <p className="text-gray-300 text-sm font-sora">
              Preencha os dados abaixo.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div className="space-y-2">
              <FormLabel className="text-white font-sora">
                Email
              </FormLabel>
              <FormInput
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="Digite seu e-mail"
                className="font-sora text-white placeholder:text-gray-400 border-gray-600"
                style={{ backgroundColor: 'hsl(var(--login-input-bg))' }}
                error={!!errors.email}
              />
              {errors.email && (
                <p className="text-red-400 text-xs font-sora">{errors.email}</p>
              )}
            </div>

            {/* Campo CPF */}
            <div className="space-y-2">
              <FormLabel className="text-white font-sora">
                CPF
              </FormLabel>
              <FormInput
                value={formData.cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                placeholder="___.___.___-__"
                className="font-sora text-white placeholder:text-gray-400 border-gray-600"
                style={{ backgroundColor: 'hsl(var(--login-input-bg))' }}
                error={!!errors.cpf}
              />
              {errors.cpf && (
                <p className="text-red-400 text-xs font-sora">{errors.cpf}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <FormLabel className="text-white font-sora">
                Senha
              </FormLabel>
              <PasswordInput
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha"
                className="font-sora text-white placeholder:text-gray-400 border-gray-600"
                style={{ backgroundColor: 'hsl(var(--login-input-bg))' }}
              />
              {errors.password && (
                <p className="text-red-400 text-xs font-sora">{errors.password}</p>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div className="space-y-2">
              <FormLabel className="text-white font-sora">
                Confirmar senha
              </FormLabel>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirme sua senha"
                className="font-sora text-white placeholder:text-gray-400 border-gray-600"
                style={{ backgroundColor: 'hsl(var(--login-input-bg))' }}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs font-sora">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Link Voltar ao Login */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-white hover:text-gray-300 font-sora text-sm"
              >
                Voltar ao login
              </button>
            </div>

            {/* Botão Criar Conta */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-semibold font-sora text-base hover:opacity-90 transition-all duration-200"
              style={{ 
                backgroundColor: 'hsl(var(--login-button-bg))',
              }}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>
      </div>

      {/* Rodapé */}
      <div className="fixed bottom-4 left-0 w-full z-20 text-left pl-4">
        <p className="text-white text-sm font-sora">
          www.heridium.com.br
        </p>
      </div>
    </div>
  );
};

export default PrimeiroAcesso;
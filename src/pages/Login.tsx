import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormLabel } from '@/components/ui/form-label';
import { formatCPF } from '@/lib/formatters';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cpf: '',
    senha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
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
      // Simular autenticação - aqui você pode integrar com seu backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Armazenar estado de autenticação
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userCPF', formData.cpf);
      
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao realizar login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setFormData({ ...formData, cpf: formattedCPF });
    if (errors.cpf) {
      setErrors({ ...errors, cpf: '' });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, senha: e.target.value });
    if (errors.senha) {
      setErrors({ ...errors, senha: '' });
    }
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

      {/* Modal de Login */}
      <div className="w-full max-w-md mx-auto">
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'hsl(var(--login-modal-bg))' }}
        >
          {/* Título e Subtítulo */}
          <div className="text-left mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2 font-sora">
              Login
            </h1>
            <p className="text-gray-300 text-sm font-sora">
              Bem-vindo de volta!
            </p>
            <p className="text-gray-300 text-sm font-sora">
              Por favor, entre com seus dados.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.senha}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha"
                className="font-sora text-white placeholder:text-gray-400 border-gray-600"
                style={{ backgroundColor: 'hsl(var(--login-input-bg))' }}
              />
              {errors.senha && (
                <p className="text-red-400 text-xs font-sora">{errors.senha}</p>
              )}
            </div>

            {/* Links */}
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => navigate('/primeiro-acesso')}
                className="text-white hover:text-gray-300 font-sora"
              >
                Primeiro acesso
              </button>
              <button
                type="button"
                onClick={() => navigate('/esqueceu-senha')}
                className="text-white hover:text-gray-300 font-sora"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão Entrar */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-semibold font-sora text-base hover:opacity-90 transition-all duration-200"
              style={{ 
                backgroundColor: 'hsl(var(--login-button-bg))',
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>

      {/* Rodapé */}
      <div className="fixed bottom-4 left-0 w-full z-10 text-left pl-4">
        <p className="text-white text-sm font-sora">
          www.heridium.com.br
        </p>
      </div>
    </div>
  );
};

export default Login;
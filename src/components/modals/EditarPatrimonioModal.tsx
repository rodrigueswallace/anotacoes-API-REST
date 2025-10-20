import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormLabel } from '@/components/ui/form-label';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select-simple';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import type { PatrimonioItem } from '@/components/tables/TabelaPatrimonios';

interface EditarPatrimonioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<PatrimonioItem>) => void;
  patrimonio: PatrimonioItem | null;
}

export const EditarPatrimonioModal: React.FC<EditarPatrimonioModalProps> = ({
  open,
  onOpenChange,
  onSave,
  patrimonio
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    categoria: '',
    valor: ''
  });

  const [errors, setErrors] = useState({
    nome: false,
    quantidade: false,
    categoria: false,
    valor: false
  });

  // Opções de categoria
  const categoriaOptions = [
    { value: 'Equipamentos de TI', label: 'Equipamentos de TI' },
    { value: 'Mobiliário', label: 'Mobiliário' },
    { value: 'Veículos', label: 'Veículos' },
    { value: 'Equipamentos de Segurança', label: 'Equipamentos de Segurança' },
    { value: 'Material de Escritório', label: 'Material de Escritório' },
    { value: 'Outros', label: 'Outros' }
  ];

  // Carregar dados do patrimônio quando modal abrir
  useEffect(() => {
    if (open && patrimonio) {
      setFormData({
        nome: patrimonio.nome,
        quantidade: patrimonio.quantidade.toString(),
        categoria: patrimonio.categoria,
        valor: patrimonio.valor.toString()
      });
      setErrors({
        nome: false,
        quantidade: false,
        categoria: false,
        valor: false
      });
    }
  }, [open, patrimonio]);

  // Limpar formulário quando modal fechar
  useEffect(() => {
    if (!open) {
      setFormData({
        nome: '',
        quantidade: '',
        categoria: '',
        valor: ''
      });
      setErrors({
        nome: false,
        quantidade: false,
        categoria: false,
        valor: false
      });
    }
  }, [open]);

  // Validar formulário
  const validateForm = () => {
    const newErrors = {
      nome: !formData.nome.trim(),
      quantidade: !formData.quantidade || parseFloat(formData.quantidade) <= 0,
      categoria: !formData.categoria,
      valor: !formData.valor || parseFloat(formData.valor) <= 0
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Lidar com mudanças nos campos
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro quando usuário digita
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  // Formatar valor monetário
  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Converte para centavos
    const valueInCents = parseInt(numericValue) / 100;
    
    // Formata como moeda brasileira
    return valueInCents.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Lidar com mudança no campo valor
  const handleValorChange = (value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange('valor', formatted);
  };

  // Lidar com mudança no campo quantidade
  const handleQuantidadeChange = (value: string) => {
    // Permite apenas números inteiros
    const numericValue = value.replace(/\D/g, '');
    handleInputChange('quantidade', numericValue);
  };

  // Salvar dados
  const handleSave = () => {
    if (validateForm()) {
      const savedData = {
        nome: formData.nome.trim(),
        quantidade: parseInt(formData.quantidade),
        categoria: formData.categoria,
        valor: parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'))
      };

      onSave(savedData);
    }
  };

  // Cancelar edição
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Patrimônio"
      description="Edite as informações do patrimônio abaixo"
      className="sm:max-w-lg w-full"
      maxHeight="600px"
      actions={
        <>
          <PrimaryGhostButton onClick={handleCancel}>
            Cancelar
          </PrimaryGhostButton>
          <PrimaryButton onClick={handleSave}>
            Salvar
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <FormLabel required>Nome</FormLabel>
          <FormInput
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Digite o nome do patrimônio"
            error={errors.nome}
            className="w-full"
          />
          {errors.nome && (
            <p className="text-sm text-main-danger">Nome é obrigatório</p>
          )}
        </div>

        {/* Quantidade */}
        <div className="space-y-2">
          <FormLabel required>Quantidade</FormLabel>
          <FormInput
            value={formData.quantidade}
            onChange={(e) => handleQuantidadeChange(e.target.value)}
            placeholder="Digite a quantidade"
            error={errors.quantidade}
            className="w-full"
          />
          {errors.quantidade && (
            <p className="text-sm text-main-danger">Quantidade deve ser maior que zero</p>
          )}
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <FormLabel required>Categoria</FormLabel>
          <FormSelect
            value={formData.categoria}
            onValueChange={(value) => handleInputChange('categoria', value)}
            placeholder="Selecione uma categoria"
            options={categoriaOptions}
            error={errors.categoria}
            className="w-full"
          />
          {errors.categoria && (
            <p className="text-sm text-main-danger">Categoria é obrigatória</p>
          )}
        </div>

        {/* Valor */}
        <div className="space-y-2">
          <FormLabel required>Valor (R$)</FormLabel>
          <FormInput
            value={formData.valor}
            onChange={(e) => handleValorChange(e.target.value)}
            placeholder="0,00"
            error={errors.valor}
            className="w-full"
          />
          {errors.valor && (
            <p className="text-sm text-main-danger">Valor deve ser maior que zero</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
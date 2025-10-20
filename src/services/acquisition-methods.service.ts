import { supabase } from '@/integrations/supabase/client';
import { AcquisitionMethod, AcquisitionMethodInsert, AcquisitionMethodUpdate } from '@/types/acquisition-method.types';
import { logAcquisitionMethodAction } from './acquisition-method-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const acquisitionMethodsService = {
  // Buscar todos os métodos de aquisição ativos
  getAllAcquisitionMethods: async (): Promise<AcquisitionMethod[]> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method')
      .select(`
        *,
        required_documents:m_ctr_t_acquisition_method_required_document!s_her_m_ctr_t_acquisition_method_c_id(*)
      `)
      .eq('m_ctr_t_acquisition_method_required_document.is_deleted', false)
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar métodos de aquisição:', error);
      throw error;
    }

    return data || [];
  },

  // Buscar método de aquisição por ID
  getAcquisitionMethodById: async (id: number): Promise<AcquisitionMethod | null> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method')
      .select(`
        *,
        required_documents:m_ctr_t_acquisition_method_required_document!s_her_m_ctr_t_acquisition_method_c_id(*)
      `)
      .eq('id', id)
      .eq('m_ctr_t_acquisition_method_required_document.is_deleted', false)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar método de aquisição:', error);
      throw error;
    }

    return data;
  },

  // Criar novo método de aquisição
  createAcquisitionMethod: async (method: AcquisitionMethodInsert): Promise<AcquisitionMethod> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method')
      .insert([method])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar método de aquisição:', error);
      throw error;
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAcquisitionMethodAction({
        acquisition_method_id: data.id,
        acquisition_method_name: data.name,
        action_type: 'create',
        action_label: 'Método de Aquisição Criado',
        action_description: `Método "${data.name}" foi criado com código ${data.code}.`,
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          code: data.code,
          requires_attachment: data.requires_attachment,
          description: data.description,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  // Atualizar método de aquisição
  updateAcquisitionMethod: async (id: number, method: AcquisitionMethodUpdate): Promise<AcquisitionMethod> => {
    // Buscar dados antigos para comparação
    const oldMethod = await acquisitionMethodsService.getAcquisitionMethodById(id);
    
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method')
      .update(method)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar método de aquisição:', error);
      throw error;
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldMethod) {
        if (method.name && method.name !== oldMethod.name) {
          changes.push('nome');
          oldValues.name = oldMethod.name;
          newValues.name = method.name;
        }
        if (method.code && method.code !== oldMethod.code) {
          changes.push('código');
          oldValues.code = oldMethod.code;
          newValues.code = method.code;
        }
        if (method.requires_attachment !== undefined && method.requires_attachment !== oldMethod.requires_attachment) {
          changes.push('exige anexo');
          oldValues.requires_attachment = oldMethod.requires_attachment;
          newValues.requires_attachment = method.requires_attachment;
        }
        if (method.description !== undefined && method.description !== oldMethod.description) {
          changes.push('descrição');
          oldValues.description = oldMethod.description;
          newValues.description = method.description;
        }
      }
      
      await logAcquisitionMethodAction({
        acquisition_method_id: data.id,
        acquisition_method_name: data.name,
        action_type: 'edit',
        action_label: 'editou o método de aquisição',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do método de aquisição foram atualizados.',
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          old_values: oldValues,
          new_values: newValues,
          changes,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  // Verificar se código já existe
  checkCodeExists: async (code: string, excludeId?: number): Promise<boolean> => {
    let query = (supabase as any)
      .from('m_ctr_t_acquisition_method')
      .select('id')
      .eq('code', code);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Erro ao verificar código:', error);
      throw error;
    }

    return !!data;
  },

  // Toggle status (soft delete)
  toggleAcquisitionMethodStatus: async (id: number): Promise<AcquisitionMethod> => {
    // Primeiro buscar o estado atual
    const current = await acquisitionMethodsService.getAcquisitionMethodById(id);
    
    if (!current) {
      throw new Error('Método de aquisição não encontrado');
    }

    const newStatus = !current.is_deleted;

    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method')
      .update({ 
        is_deleted: newStatus,
        deleted_at: newStatus ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status do método de aquisição:', error);
      throw error;
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o método de aquisição' : 'ativou o método de aquisição';
      const actionDescription = newStatus 
        ? `O método de aquisição foi inativado.`
        : `O método de aquisição foi ativado.`;
      
      await logAcquisitionMethodAction({
        acquisition_method_id: data.id,
        acquisition_method_name: data.name,
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !newStatus,
          new_status: newStatus,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },
};

import { supabase } from "@/integrations/supabase/client";
import type { 
  FundingSource, 
  FundingSourceInsert, 
  FundingSourceUpdate, 
  FundingSourceDatabase
} from "@/types/funding-source.types";
import { 
  toLocalFormat,
  toSupabaseFormat,
  toSupabaseUpdateFormat 
} from "@/types/funding-source.types";
import { logFundingSourceAction } from './funding-source-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const fundingSourcesService = {
  async getAllFundingSources(): Promise<FundingSource[]> {
    const { data, error } = await supabase
      .from('m_fin_t_funding_source')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching funding sources:', error);
      throw error;
    }

    return (data as FundingSourceDatabase[]).map((item) => toLocalFormat(item));
  },

  async getFundingSourceById(id: string): Promise<FundingSource | null> {
    const { data, error } = await supabase
      .from('m_fin_t_funding_source')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching funding source:', error);
      throw error;
    }

    if (!data) return null;

    return toLocalFormat(data as FundingSourceDatabase);
  },

  async createFundingSource(fundingSourceData: FundingSourceInsert): Promise<FundingSource> {
    const { data, error } = await supabase
      .from('m_fin_t_funding_source')
      .insert(fundingSourceData)
      .select()
      .single();

    if (error) {
      console.error('Error creating funding source:', error);
      if (error.code === '23505') {
        throw new Error('Já existe uma fonte de recurso com este nome.');
      }
      throw error;
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logFundingSourceAction({
        funding_source_id: parseInt(data.id),
        funding_source_name: data.name,
        action_type: 'create',
        action_label: 'Fonte de Recurso Criada',
        action_description: `Fonte de recurso "${data.name}" foi criada.`,
        item_id: parseInt(data.id),
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return toLocalFormat(data as FundingSourceDatabase);
  },

  async updateFundingSource(id: string, fundingSourceData: FundingSourceUpdate): Promise<FundingSource> {
    // Buscar dados antigos para comparação
    const oldFundingSource = await this.getFundingSourceById(id);
    
    const { data, error } = await supabase
      .from('m_fin_t_funding_source')
      .update(fundingSourceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating funding source:', error);
      if (error.code === '23505') {
        throw new Error('Já existe uma fonte de recurso com este nome.');
      }
      throw error;
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldFundingSource) {
        if (fundingSourceData.name !== undefined && fundingSourceData.name !== oldFundingSource.nome) {
          changes.push('nome');
          oldValues.name = oldFundingSource.nome;
          newValues.name = fundingSourceData.name;
        }
        if (fundingSourceData.description !== undefined && fundingSourceData.description !== oldFundingSource.descricao) {
          changes.push('descrição');
          oldValues.description = oldFundingSource.descricao;
          newValues.description = fundingSourceData.description;
        }
      }
      
      await logFundingSourceAction({
        funding_source_id: parseInt(data.id),
        funding_source_name: data.name,
        action_type: 'edit',
        action_label: 'editou a fonte de recurso',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados da fonte de recurso foram atualizados.',
        item_id: parseInt(data.id),
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

    return toLocalFormat(data as FundingSourceDatabase);
  },

  async toggleFundingSourceStatus(id: string, isDeleted: boolean): Promise<void> {
    const updateData: any = { is_deleted: isDeleted };
    
    if (isDeleted) {
      updateData.deleted_at = new Date().toISOString();
    } else {
      updateData.deleted_at = null;
    }

    const { error } = await supabase
      .from('m_fin_t_funding_source')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error toggling funding source status:', error);
      throw error;
    }

    // Buscar dados da fonte de recurso para o log
    const { data: fundingSourceData } = await supabase
      .from('m_fin_t_funding_source')
      .select('id, name')
      .eq('id', id)
      .single();

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = isDeleted ? 'deactivate' : 'activate';
      const actionLabel = isDeleted ? 'inativou a fonte de recurso' : 'ativou a fonte de recurso';
      const actionDescription = isDeleted 
        ? `A fonte de recurso foi inativada.`
        : `A fonte de recurso foi ativada.`;
      
      await logFundingSourceAction({
        funding_source_id: parseInt(id),
        funding_source_name: fundingSourceData?.name || 'Fonte de Recurso',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: parseInt(id),
        item_name: fundingSourceData?.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !isDeleted,
          new_status: isDeleted,
          is_deleted: isDeleted,
          deleted_at: isDeleted ? new Date().toISOString() : null,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  }
};
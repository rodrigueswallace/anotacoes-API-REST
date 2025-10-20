import { supabase } from '@/integrations/supabase/client';
import type { 
  AgreementLocal, 
  AgreementInsert, 
  AgreementUpdate,
  AgreementWithRelations
} from '@/types/agreement.types';
import { toLocalFormat } from '@/types/agreement.types';
import { logAgreementAction } from './agreement-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

class AgreementsService {
  private tableName = 'm_fin_t_agreement';

  async getAllAgreements(): Promise<AgreementLocal[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching agreements:', error);
      throw new Error(`Erro ao buscar convênios: ${error.message}`);
    }

    return (data as AgreementWithRelations[]).map(toLocalFormat);
  }

  async getAgreementById(id: string): Promise<AgreementLocal | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching agreement:', error);
      throw new Error(`Erro ao buscar convênio: ${error.message}`);
    }

    return data ? toLocalFormat(data as AgreementWithRelations) : null;
  }

  async createAgreement(agreementData: AgreementInsert): Promise<AgreementLocal> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(agreementData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating agreement:', error);
      if (error.code === '23505') {
        throw new Error('Já existe um convênio com este código.');
      }
      throw new Error(`Erro ao criar convênio: ${error.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAgreementAction({
        agreement_id: data.id,
        agreement_name: data.name,
        action_type: 'create',
        action_label: 'Convênio Criado',
        action_description: `Convênio "${data.name}" foi criado com código ${data.code}.`,
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          code: data.code,
          cnpj: data.cnpj,
          objeto: data.objeto,
          valor_total: data.valor_total,
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return toLocalFormat(data as AgreementWithRelations);
  }

  async updateAgreement(id: string, agreementData: AgreementUpdate): Promise<AgreementLocal> {
    // Buscar dados antigos para comparação
    const oldAgreement = await this.getAgreementById(id);
    
    const { data, error } = await supabase
      .from(this.tableName)
      .update(agreementData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating agreement:', error);
      if (error.code === '23505') {
        throw new Error('Já existe um convênio com este código.');
      }
      throw new Error(`Erro ao atualizar convênio: ${error.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const updatedAgreement = toLocalFormat(data as AgreementWithRelations);
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldAgreement) {
        if (agreementData.name && agreementData.name !== oldAgreement.nome) {
          changes.push('nome');
          oldValues.nome = oldAgreement.nome;
          newValues.nome = agreementData.name;
        }
        if (agreementData.code && agreementData.code !== oldAgreement.codigo) {
          changes.push('código');
          oldValues.codigo = oldAgreement.codigo;
          newValues.codigo = agreementData.code;
        }
        if (agreementData.cnpj && agreementData.cnpj !== oldAgreement.cnpj) {
          changes.push('CNPJ');
          oldValues.cnpj = oldAgreement.cnpj;
          newValues.cnpj = agreementData.cnpj;
        }
        if (agreementData.agreement_object && agreementData.agreement_object !== oldAgreement.objeto) {
          changes.push('objeto');
          oldValues.objeto = oldAgreement.objeto;
          newValues.objeto = agreementData.agreement_object;
        }
        if (agreementData.total !== undefined && agreementData.total?.toString() !== oldAgreement.valor_total) {
          changes.push('valor total');
          oldValues.valor_total = oldAgreement.valor_total;
          newValues.valor_total = agreementData.total;
        }
        if (agreementData.start_date && agreementData.start_date !== oldAgreement.data_inicio) {
          changes.push('data início');
          oldValues.data_inicio = oldAgreement.data_inicio;
          newValues.data_inicio = agreementData.start_date;
        }
        if (agreementData.end_date && agreementData.end_date !== oldAgreement.data_fim) {
          changes.push('data fim');
          oldValues.data_fim = oldAgreement.data_fim;
          newValues.data_fim = agreementData.end_date;
        }
      }
      
      await logAgreementAction({
        agreement_id: data.id,
        agreement_name: data.name,
        action_type: 'edit',
        action_label: 'editou o convênio',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do convênio foram atualizados.',
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

    return toLocalFormat(data as AgreementWithRelations);
  }

  async toggleAgreementStatus(id: string, isDeleted: boolean): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({
        is_deleted: isDeleted,
        deleted_at: isDeleted ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (error) {
      console.error('Error toggling agreement status:', error);
      throw new Error(`Erro ao alterar status do convênio: ${error.message}`);
    }

    // Buscar dados do convênio para o log
    const { data: agreementData } = await supabase
      .from(this.tableName)
      .select('id, name')
      .eq('id', id)
      .single();

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = isDeleted ? 'deactivate' : 'activate';
      const actionLabel = isDeleted ? 'inativou o convênio' : 'ativou o convênio';
      const actionDescription = isDeleted 
        ? `O convênio foi inativado.`
        : `O convênio foi ativado.`;
      
      await logAgreementAction({
        agreement_id: parseInt(id),
        agreement_name: agreementData?.name || 'Convênio',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: parseInt(id),
        item_name: agreementData?.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !isDeleted,
          new_status: isDeleted,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  }

  async checkCodeExists(code: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('id')
        .eq('code', code.trim());

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking code:', error);
        throw new Error(`Erro ao verificar código: ${error.message}`);
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkCodeExists:', error);
      throw error;
    }
  }

  async checkCNPJExists(cnpj: string, excludeId?: string): Promise<boolean> {
    try {
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      
      let query = supabase
        .from(this.tableName)
        .select('id')
        .eq('cnpj', cleanCNPJ);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking CNPJ:', error);
        throw new Error(`Erro ao verificar CNPJ: ${error.message}`);
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkCNPJExists:', error);
      throw error;
    }
  }
}

export const agreementsService = new AgreementsService();

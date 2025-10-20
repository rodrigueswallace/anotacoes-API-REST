import { supabase } from "@/integrations/supabase/client";
import { 
  Area, 
  AreaDatabase, 
  AreaInsert, 
  AreaUpdate, 
  toLocalFormat, 
  toSupabaseFormat, 
  toSupabaseUpdateFormat 
} from "@/types/area.types";
import { logAreaAction } from './area-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const areasService = {
  async getAllAreas(): Promise<Area[]> {
    const { data, error } = await supabase
      .from('m_org_t_area')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching areas:', error);
      throw new Error('Erro ao buscar áreas');
    }

    return (data as AreaDatabase[]).map(toLocalFormat);
  },

  async getAreaById(id: number): Promise<Area | null> {
    const { data, error } = await supabase
      .from('m_org_t_area')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching area:', error);
      throw new Error('Erro ao buscar área');
    }

    return data ? toLocalFormat(data as AreaDatabase) : null;
  },

  async createArea(areaData: Omit<Area, 'id' | 'status' | 'data_criacao'>): Promise<Area> {
    const insertData = toSupabaseFormat(areaData);
    
    const { data, error } = await supabase
      .from('m_org_t_area')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // Verificar se é erro de constraint unique
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Já existe uma área cadastrada com este nome');
        }
        throw new Error('Já existe uma área com estes dados');
      }
      
      console.error('Error creating area:', error);
      throw new Error('Erro ao criar área');
    }

    const newArea = toLocalFormat(data as AreaDatabase);

    // Registrar log de auditoria
    try {
      console.log('🔍 [CREATE AREA] Iniciando registro de log de auditoria');
      console.log('📝 [CREATE AREA] newArea:', JSON.stringify(newArea, null, 2));
      
      const currentUser = await getCurrentUser();
      console.log('👤 [CREATE AREA] currentUser:', JSON.stringify(currentUser, null, 2));
      
      const logPayload = {
        area_id: newArea.id,
        area_name: newArea.nome,
        action_type: 'create' as const,
        action_label: 'criou a área',
        action_description: `Nome: ${newArea.nome}\nDescrição: ${newArea.descricao || '-'}`,
        item_id: newArea.id,
        item_name: newArea.nome,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || currentUser?.email || 'Sistema',
        metadata: { 
          created_data: {
            nome: newArea.nome,
            descricao: newArea.descricao
          }
        }
      };
      
      console.log('📦 [CREATE AREA] logPayload:', JSON.stringify(logPayload, null, 2));
      
      await logAreaAction(logPayload);
      
      console.log('✅ [CREATE AREA] Log registrado com sucesso');
    } catch (logError) {
      console.error('❌ [CREATE AREA] Erro COMPLETO ao registrar log:', logError);
      console.error('❌ [CREATE AREA] Stack trace:', (logError as Error).stack);
    }

    return newArea;
  },

  async updateArea(id: number, areaData: Partial<Omit<Area, 'id' | 'data_criacao'>>): Promise<Area> {
    // Buscar dados antigos para comparação
    const oldArea = await this.getAreaById(id);
    
    const updateData = toSupabaseUpdateFormat(areaData);
    
    const { data, error } = await supabase
      .from('m_org_t_area')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Verificar se é erro de constraint unique
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Já existe uma área cadastrada com este nome');
        }
        throw new Error('Já existe uma área com estes dados');
      }
      
      console.error('Error updating area:', error);
      throw new Error('Erro ao atualizar área');
    }

    const updatedArea = toLocalFormat(data as AreaDatabase);

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changedFields: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldArea) {
        if (areaData.nome !== undefined && areaData.nome !== oldArea.nome) {
          changedFields.push('Nome');
          oldValues.nome = oldArea.nome;
          newValues.nome = areaData.nome;
        }
        if (areaData.descricao !== undefined && areaData.descricao !== oldArea.descricao) {
          changedFields.push('Descrição');
          oldValues.descricao = oldArea.descricao;
          newValues.descricao = areaData.descricao;
        }
      }

      await logAreaAction({
        area_id: updatedArea.id,
        area_name: updatedArea.nome,
        action_type: 'edit',
        action_label: 'editou a área',
        action_description: changedFields.length > 0 
          ? `Campos editados: ${changedFields.join(', ')}.` 
          : 'Dados da área foram atualizados.',
        item_id: updatedArea.id,
        item_name: updatedArea.nome,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || currentUser?.email || 'Sistema',
        metadata: { 
          old_values: oldValues,
          new_values: newValues,
          changed_fields: changedFields
        }
      });
    } catch (logError) {
      console.error('Erro ao registrar log de auditoria:', logError);
    }

    return updatedArea;
  },

  async toggleAreaStatus(id: number, isDeleted: boolean): Promise<Area> {
    // Buscar dados da área antes da alteração
    const oldArea = await this.getAreaById(id);
    
    const updateData: AreaUpdate = {
      is_deleted: isDeleted,
      deleted_at: isDeleted ? new Date().toISOString() : null
    };

    const { data, error } = await supabase
      .from('m_org_t_area')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling area status:', error);
      throw new Error('Erro ao alterar status da área');
    }

    const toggledArea = toLocalFormat(data as AreaDatabase);

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAreaAction({
        area_id: toggledArea.id,
        area_name: toggledArea.nome,
        action_type: isDeleted ? 'deactivate' : 'activate',
        action_label: isDeleted ? 'inativou a área' : 'ativou a área',
        action_description: isDeleted 
          ? `A área foi inativada.` 
          : `A área foi ativada.`,
        item_id: toggledArea.id,
        item_name: toggledArea.nome,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || currentUser?.email || 'Sistema',
        metadata: {
          previous_status: oldArea?.status,
          new_status: isDeleted ? 'Inativo' : 'Ativo'
        }
      });
    } catch (logError) {
      console.error('Erro ao registrar log de auditoria:', logError);
    }

    return toggledArea;
  }
};
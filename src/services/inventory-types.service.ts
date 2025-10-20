import { supabase } from '@/integrations/supabase/client';
import { InventoryType, InventoryTypeInsert, InventoryTypeUpdate } from '@/types/inventory-type.types';
import { logInventoryTypeAction } from './inventory-type-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const inventoryTypesService = {
  // Buscar todos os tipos de inventário ativos
  getAllInventoryTypes: async (): Promise<InventoryType[]> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_inventory_type')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tipos de inventário:', error);
      throw error;
    }

    return data || [];
  },

  // Buscar tipo de inventário por ID
  getInventoryTypeById: async (id: number): Promise<InventoryType | null> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_inventory_type')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar tipo de inventário:', error);
      throw error;
    }

    return data;
  },

  // Criar novo tipo de inventário
  createInventoryType: async (inventoryType: InventoryTypeInsert): Promise<InventoryType> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_inventory_type')
      .insert([inventoryType])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar tipo de inventário:', error);
      throw error;
    }

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logInventoryTypeAction({
        inventory_type_id: data.id,
        inventory_type_name: data.name,
        action_type: 'create',
        action_label: 'Tipo de Inventário Criado',
        action_description: `Tipo "${data.name}" foi criado com frequência ${data.frequency}.`,
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          frequency: data.frequency,
          requires_committee: data.requires_committee,
          description: data.description,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  // Atualizar tipo de inventário
  updateInventoryType: async (id: number, inventoryType: InventoryTypeUpdate): Promise<InventoryType> => {
    // Buscar dados antigos para comparação
    const oldType = await inventoryTypesService.getInventoryTypeById(id);
    
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_inventory_type')
      .update(inventoryType)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar tipo de inventário:', error);
      throw error;
    }

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldType) {
        if (inventoryType.name && inventoryType.name !== oldType.name) {
          changes.push('nome');
          oldValues.name = oldType.name;
          newValues.name = inventoryType.name;
        }
        if (inventoryType.frequency && inventoryType.frequency !== oldType.frequency) {
          changes.push('frequência');
          oldValues.frequency = oldType.frequency;
          newValues.frequency = inventoryType.frequency;
        }
        if (inventoryType.requires_committee !== undefined && inventoryType.requires_committee !== oldType.requires_committee) {
          changes.push('exige comissão');
          oldValues.requires_committee = oldType.requires_committee;
          newValues.requires_committee = inventoryType.requires_committee;
        }
        if (inventoryType.description !== undefined && inventoryType.description !== oldType.description) {
          changes.push('descrição');
          oldValues.description = oldType.description;
          newValues.description = inventoryType.description;
        }
      }
      
      await logInventoryTypeAction({
        inventory_type_id: data.id,
        inventory_type_name: data.name,
        action_type: 'edit',
        action_label: 'editou o tipo de inventário',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do tipo de inventário foram atualizados.',
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

  // Toggle status (soft delete)
  toggleInventoryTypeStatus: async (id: number): Promise<InventoryType> => {
    // Primeiro buscar o estado atual
    const current = await inventoryTypesService.getInventoryTypeById(id);
    
    if (!current) {
      throw new Error('Tipo de inventário não encontrado');
    }

    const newStatus = !current.is_deleted;

    const { data, error } = await (supabase as any)
      .from('m_ctr_t_inventory_type')
      .update({ 
        is_deleted: newStatus,
        deleted_at: newStatus ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status do tipo de inventário:', error);
      throw error;
    }

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o tipo de inventário' : 'ativou o tipo de inventário';
      const actionDescription = newStatus 
        ? `O tipo de inventário foi inativado.`
        : `O tipo de inventário foi ativado.`;
      
      await logInventoryTypeAction({
        inventory_type_id: data.id,
        inventory_type_name: data.name,
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
import { supabase } from "@/integrations/supabase/client";
import { Law, CreateLawInput, UpdateLawInput } from "@/types/law.types";
import { logLawAction } from './law-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

const TABLE_NAME = "m_leg_t_law";
const SCHEMA = "her";

export const lawsService = {
  async getAll(): Promise<Law[]> {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Law[];
  },

  async getById(id: number): Promise<Law | null> {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as Law | null;
  },

  async create(input: CreateLawInput): Promise<Law> {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .insert([input])
      .select()
      .single();

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logLawAction({
        law_id: data.id,
        law_name: data.name,
        action_type: 'create',
        action_label: 'Lei Criada',
        action_description: `Lei "${data.name}" (${data.number}) foi criada.`,
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          number: data.number,
          type: data.type,
          jurisdiction: data.jurisdiction,
          associated_process: data.associated_process,
          publication_date: data.publication_date,
          description: data.description,
          link: data.link,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data as Law;
  },

  async update(input: UpdateLawInput): Promise<Law> {
    const { id, ...updateData } = input;

    // Buscar dados antigos para comparação
    const oldLaw = await this.getById(id);
    
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating law:', error);
      throw new Error(`Erro ao atualizar lei: ${error.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldLaw) {
        if (updateData.name && updateData.name !== oldLaw.name) {
          changes.push('nome');
          oldValues.name = oldLaw.name;
          newValues.name = updateData.name;
        }
        if (updateData.number && updateData.number !== oldLaw.number) {
          changes.push('número');
          oldValues.number = oldLaw.number;
          newValues.number = updateData.number;
        }
        if (updateData.type && updateData.type !== oldLaw.type) {
          changes.push('tipo');
          oldValues.type = oldLaw.type;
          newValues.type = updateData.type;
        }
        if (updateData.jurisdiction && updateData.jurisdiction !== oldLaw.jurisdiction) {
          changes.push('jurisdição');
          oldValues.jurisdiction = oldLaw.jurisdiction;
          newValues.jurisdiction = updateData.jurisdiction;
        }
        if (updateData.associated_process && updateData.associated_process !== oldLaw.associated_process) {
          changes.push('processo associado');
          oldValues.associated_process = oldLaw.associated_process;
          newValues.associated_process = updateData.associated_process;
        }
        if (updateData.publication_date && updateData.publication_date !== oldLaw.publication_date) {
          changes.push('data publicação');
          oldValues.publication_date = oldLaw.publication_date;
          newValues.publication_date = updateData.publication_date;
        }
        if (updateData.description && updateData.description !== oldLaw.description) {
          changes.push('descrição');
          oldValues.description = oldLaw.description;
          newValues.description = updateData.description;
        }
        if (updateData.link && updateData.link !== oldLaw.link) {
          changes.push('link');
          oldValues.link = oldLaw.link;
          newValues.link = updateData.link;
        }
      }
      
      await logLawAction({
        law_id: data.id,
        law_name: data.name,
        action_type: 'edit',
        action_label: 'editou a lei',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}`
          : 'Dados da lei foram atualizados',
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
      console.error('Erro ao registrar log de auditoria:', logError);
    }

    return data as Law;
  },

  async softDelete(id: number): Promise<void> {
    const { error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) throw error;
  },

  async toggleStatus(id: number, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .update({ is_deleted: !currentStatus })
      .eq("id", id);

    if (error) throw error;

    // Buscar dados da lei para o log
    const { data: lawData } = await supabase
      .schema(SCHEMA)
      .from(TABLE_NAME)
      .select('id, name')
      .eq('id', id)
      .single();

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = !currentStatus ? 'activate' : 'deactivate';
      const actionLabel = !currentStatus ? 'ativou a lei' : 'inativou a lei';
      const actionDescription = !currentStatus 
        ? `A lei foi ativada.`
        : `A lei foi inativada.`;
      
      await logLawAction({
        law_id: id,
        law_name: lawData?.name || 'Lei',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: id,
        item_name: lawData?.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: currentStatus,
          new_status: !currentStatus,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  }
};

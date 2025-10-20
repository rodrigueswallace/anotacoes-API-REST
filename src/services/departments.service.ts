import { supabase } from "@/integrations/supabase/client";
import type {
  Department,
  DepartmentDatabase,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types/department.types";
import { toLocalFormat, toSupabaseFormat } from "@/types/department.types";
import { logDepartmentAction } from "./department-audit.service";
import { getCurrentUser } from "@/lib/auth-helpers";

export const departmentsService = {
  async getAllDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from("m_org_t_department")
      .select(`
        *,
        unit:s_her_m_org_t_unit_c_id(
          id,
          name,
          agency:s_her_m_org_t_agency_c_id(
            id,
            name
          )
        )
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching departments:", error);
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }

    return (data || []).map((item: any) => toLocalFormat(item));
  },

  async getDepartmentById(id: number): Promise<Department> {
    const { data, error } = await supabase
      .from("m_org_t_department")
      .select(`
        *,
        unit:s_her_m_org_t_unit_c_id(
          id,
          name,
          agency:s_her_m_org_t_agency_c_id(
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching department:", error);
      throw new Error(`Failed to fetch department: ${error.message}`);
    }

    return toLocalFormat(data);
  },

  async getDepartmentsByUnitId(unitId: number): Promise<Department[]> {
    const { data, error } = await supabase
      .from("m_org_t_department")
      .select(`
        *,
        unit:s_her_m_org_t_unit_c_id(
          id,
          name,
          agency:s_her_m_org_t_agency_c_id(
            id,
            name
          )
        )
      `)
      .eq("s_her_m_org_t_unit_c_id", unitId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching departments by unit:", error);
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }

    return (data || []).map((item: any) => toLocalFormat(item));
  },

  async createDepartment(input: CreateDepartmentInput): Promise<Department> {
    // Validate unit exists and is active
    const { data: unit, error: unitError } = await supabase
      .from("m_org_t_unit")
      .select("id, is_deleted")
      .eq("id", input.unitId)
      .single();

    if (unitError || !unit) {
      throw new Error("Unidade não encontrada");
    }

    if (unit.is_deleted) {
      throw new Error("Não é possível criar setor em uma unidade inativa");
    }

    const departmentData = toSupabaseFormat(input);

    const { data, error } = await supabase
      .from("m_org_t_department")
      .insert(departmentData)
      .select(`
        *,
        unit:s_her_m_org_t_unit_c_id(
          id,
          name,
          agency:s_her_m_org_t_agency_c_id(
            id,
            name
          )
        )
      `)
      .single();

    if (error) {
      console.error("Error creating department:", error);
      throw new Error(`Failed to create department: ${error.message}`);
    }

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logDepartmentAction({
        department_id: data.id!,
        department_name: data.name,
        action_type: 'create',
        action_label: 'Setor Criado',
        action_description: `Setor "${data.name}" foi criado com sucesso.`,
        item_id: data.id!,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          unit_id: input.unitId,
          unit_name: data.unit?.name,
          agency_id: data.unit?.agency?.id,
          agency_name: data.unit?.agency?.name,
          is_stockroom: input.isStockroom,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return toLocalFormat(data);
  },

  async updateDepartment(input: UpdateDepartmentInput): Promise<Department> {
    // Buscar dados antigos para comparação
    const oldDepartment = await this.getDepartmentById(input.id);
    
    // Validate unit exists and is active
    const { data: unit, error: unitError } = await supabase
      .from("m_org_t_unit")
      .select("id, is_deleted")
      .eq("id", input.unitId)
      .single();

    if (unitError || !unit) {
      throw new Error("Unidade não encontrada");
    }

    if (unit.is_deleted) {
      throw new Error("Não é possível vincular setor a uma unidade inativa");
    }

    const departmentData = toSupabaseFormat(input);
    const { id, ...updateData } = departmentData;

    const { data, error } = await supabase
      .from("m_org_t_department")
      .update(updateData)
      .eq("id", input.id)
      .select(`
        *,
        unit:s_her_m_org_t_unit_c_id(
          id,
          name,
          agency:s_her_m_org_t_agency_c_id(
            id,
            name
          )
        )
      `)
      .single();

    if (error) {
      console.error("Error updating department:", error);
      throw new Error(`Failed to update department: ${error.message}`);
    }

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldDepartment) {
        if (input.name && input.name !== oldDepartment.nome) {
          changes.push('nome');
          oldValues.nome = oldDepartment.nome;
          newValues.nome = input.name;
        }
        if (input.unitId && input.unitId !== oldDepartment.unidadeId) {
          changes.push('unidade');
          oldValues.unidade = oldDepartment.unidadeNome;
          newValues.unidade = data.unit?.name;
        }
        if (input.isStockroom !== undefined && input.isStockroom !== oldDepartment.ehAlmoxarifado) {
          changes.push('é almoxarifado');
          oldValues.ehAlmoxarifado = oldDepartment.ehAlmoxarifado;
          newValues.ehAlmoxarifado = input.isStockroom;
        }
      }
      
      await logDepartmentAction({
        department_id: data.id!,
        department_name: data.name,
        action_type: 'edit',
        action_label: 'editou o setor',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do setor foram atualizados.',
        item_id: data.id!,
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

    return toLocalFormat(data);
  },

  async toggleDepartmentStatus(
    id: number,
    currentStatus: boolean
  ): Promise<Department> {
    const newStatus = !currentStatus;
    const updateData: Partial<DepartmentDatabase> = {
      is_deleted: newStatus,
      deleted_at: newStatus ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("m_org_t_department")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        unit:s_her_m_org_t_unit_c_id(
          id,
          name,
          agency:s_her_m_org_t_agency_c_id(
            id,
            name
          )
        )
      `)
      .single();

    if (error) {
      console.error("Error toggling department status:", error);
      throw new Error(`Failed to toggle department status: ${error.message}`);
    }

    // Registrar log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o setor' : 'ativou o setor';
      const actionDescription = newStatus 
        ? `O setor foi inativado.`
        : `O setor foi ativado.`;
      
      await logDepartmentAction({
        department_id: data.id!,
        department_name: data.name,
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: data.id!,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !newStatus,
          new_status: newStatus,
          unit_name: data.unit?.name,
          agency_name: data.unit?.agency?.name,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return toLocalFormat(data);
  },
};

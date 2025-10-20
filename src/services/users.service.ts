import { supabase } from "@/integrations/supabase/client";
import type { UserComplete, CreateUserInput, UpdateUserInput } from "@/types/user.types";
import { logUserAction } from "./user-audit.service";

export const getAllUsers = async (): Promise<UserComplete[]> => {
  const { data, error } = await supabase.rpc("get_all_users_complete");

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return (data || []).map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phoneNumber: user.phone_number,
    employmentType: user.employment_type,
    registrationNumber: user.registration_number,
    isDeleted: user.is_deleted,
    createdAt: user.created_at,
    deletedAt: user.deleted_at,
    lastSignInAt: user.last_sign_in_at,
    accessProfileId: user.access_profile_id,
    accessProfileName: user.access_profile_name,
    departmentId: user.department_id,
    departmentName: user.department_name,
    unitId: user.unit_id,
    unitName: user.unit_name,
    agencyId: user.agency_id,
    agencyName: user.agency_name,
  }));
};

export const createUser = async (input: CreateUserInput): Promise<UserComplete> => {
  const { data, error } = await supabase.functions.invoke("create-user", {
    body: input,
  });

  if (error) {
    console.error("Error creating user:", error);
    throw error;
  }

  return data;
};

export const updateUser = async (input: UpdateUserInput): Promise<UserComplete> => {
  const { id, accessProfileId, ...userData } = input;

  // Fetch old user data for comparison
  const users = await getAllUsers();
  const oldUser = users.find((u) => u.id === id);
  
  if (!oldUser) {
    throw new Error("User not found");
  }

  // Get current authenticated user
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // Update users_data
  const { error: userError } = await supabase
    .from("users_data")
    .update({
      name: userData.name,
      phone_number: userData.phoneNumber,
      employment_type: userData.employmentType,
      registration_number: userData.registrationNumber,
      s_her_m_org_t_department_c_id: userData.departmentId,
    })
    .eq("id", id);

  if (userError) {
    console.error("Error updating user data:", userError);
    throw userError;
  }

  // Update m_org_t_users_profile
  const { error: profileError } = await supabase
    .from("m_org_t_users_profile")
    .update({
      s_her_m_org_t_access_profile_c_id: accessProfileId,
    })
    .eq("s_auth_t_users_c_id", id);

  if (profileError) {
    console.error("Error updating user profile:", profileError);
    throw profileError;
  }

  // Fetch updated user
  const updatedUsers = await getAllUsers();
  const updatedUser = updatedUsers.find((u) => u.id === id);

  if (!updatedUser) {
    throw new Error("User not found after update");
  }

  // Log user update action
  try {
    const changes: string[] = [];
    if (oldUser.name !== updatedUser.name) changes.push('nome');
    if (oldUser.phoneNumber !== updatedUser.phoneNumber) changes.push('telefone');
    if (oldUser.employmentType !== updatedUser.employmentType) changes.push('tipo de vínculo');
    if (oldUser.registrationNumber !== updatedUser.registrationNumber) changes.push('matrícula');
    if (oldUser.departmentId !== updatedUser.departmentId) changes.push('setor');
    if (oldUser.accessProfileId !== updatedUser.accessProfileId) changes.push('perfil de acesso');

    await logUserAction({
      user_id: updatedUser.id,
      user_name: updatedUser.name,
      action_type: 'edit',
      action_label: 'Editou Usuário',
      action_description: `Campos alterados: ${changes.join(', ')}`,
      item_id: updatedUser.id,
      item_name: updatedUser.name,
      performed_by: currentUser?.id || null,
      performed_by_name: currentUser?.user_metadata?.name || currentUser?.email || 'Sistema',
      metadata: {
        changes,
        old_values: {
          name: oldUser.name,
          phoneNumber: oldUser.phoneNumber,
          employmentType: oldUser.employmentType,
          registrationNumber: oldUser.registrationNumber,
          departmentId: oldUser.departmentId,
          accessProfileId: oldUser.accessProfileId,
        },
        new_values: {
          name: updatedUser.name,
          phoneNumber: updatedUser.phoneNumber,
          employmentType: updatedUser.employmentType,
          registrationNumber: updatedUser.registrationNumber,
          departmentId: updatedUser.departmentId,
          accessProfileId: updatedUser.accessProfileId,
        },
      },
    });
  } catch (error) {
    console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', error);
  }

  return updatedUser;
};

export const toggleUserStatus = async (
  id: string,
  currentStatus: boolean
): Promise<void> => {
  // Get user data before update
  const users = await getAllUsers();
  const user = users.find((u) => u.id === id);
  
  if (!user) {
    throw new Error("User not found");
  }

  // Get current authenticated user
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const isInactivating = !currentStatus;

  const { error } = await supabase
    .from("users_data")
    .update({
      is_deleted: !currentStatus,
      deleted_at: !currentStatus ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error toggling user status:", error);
    throw error;
  }

  // Log status change action
  try {
    await logUserAction({
      user_id: user.id,
      user_name: user.name,
      action_type: isInactivating ? 'deactivate' : 'activate',
      action_label: isInactivating ? 'Inativou Usuário' : 'Ativou Usuário',
      action_description: isInactivating 
        ? `Usuário "${user.name}" foi inativado`
        : `Usuário "${user.name}" foi ativado`,
      item_id: user.id,
      item_name: user.name,
      performed_by: currentUser?.id || null,
      performed_by_name: currentUser?.user_metadata?.name || currentUser?.email || 'Sistema',
      metadata: {
        previous_status: currentStatus,
        new_status: !currentStatus,
      },
    });
  } catch (error) {
    console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', error);
  }
};

/**
 * Verifica se um e-mail já existe no sistema de autenticação
 * Esta verificação é necessária porque auth.users é gerenciado pelo Supabase
 * e não pode ser consultado diretamente via RLS
 */
export const checkEmailExistsInAuth = async (email: string): Promise<boolean> => {
  try {
    // Tenta buscar usuário no auth através da tabela users_data
    // que tem sincronização automática com auth.users via trigger
    const { data, error } = await supabase
      .from('users_data')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erro ao verificar e-mail:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Erro na validação de e-mail:', err);
    return false;
  }
};

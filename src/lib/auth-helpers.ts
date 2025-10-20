import { supabase } from '@/integrations/supabase/client';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

/**
 * Obtém os dados do usuário autenticado
 * Busca dados complementares do perfil se disponível
 */
export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Buscar dados complementares do perfil se necessário
  try {
    const { data: profile } = await supabase
      .from('m_org_t_users_profile')
      .select('name, avatar_url')
      .eq('user_id', user.id)
      .single();
    
    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.email || 'Usuário',
      avatar_url: profile?.avatar_url,
    };
  } catch (error) {
    // Se falhar ao buscar perfil, retornar apenas dados básicos
    return {
      id: user.id,
      email: user.email || '',
      name: user.email || 'Usuário',
    };
  }
};

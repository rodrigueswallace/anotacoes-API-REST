// Tipos para Grupo de Bem (her.m_ast_t_asset_group)

export interface AssetGroup {
  id: number;
  name: string;
  accounting_code: string;
  annual_depreciation_rate: number | null;
  monthly_depreciation_rate: number | null;
  useful_life: number | null;
  residual_value: number | null;
  is_depreciable: boolean;
  qr_code_required: boolean;
  licensable_vehicle: boolean;
  vehicle_type: 'Terrestre' | 'Aquaviário' | 'Aeronáutico' | null;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface AssetGroupInsert {
  name: string;
  accounting_code: string;
  annual_depreciation_rate?: number | null;
  monthly_depreciation_rate?: number | null;
  useful_life?: number | null;
  residual_value?: number | null;
  is_depreciable: boolean;
  qr_code_required: boolean;
  licensable_vehicle: boolean;
  vehicle_type?: 'Terrestre' | 'Aquaviário' | 'Aeronáutico' | null;
  is_deleted?: boolean;
}

export interface AssetGroupUpdate {
  name?: string;
  accounting_code?: string;
  annual_depreciation_rate?: number | null;
  monthly_depreciation_rate?: number | null;
  useful_life?: number | null;
  residual_value?: number | null;
  is_depreciable?: boolean;
  qr_code_required?: boolean;
  licensable_vehicle?: boolean;
  vehicle_type?: 'Terrestre' | 'Aquaviário' | 'Aeronáutico' | null;
  is_deleted?: boolean;
}

// Interface para compatibilidade com o código existente
export interface AssetGroupLocal {
  id: string;
  nome: string;
  codigo_contabil: string;
  taxa_depreciacao_anual?: string;
  taxa_depreciacao_mensal?: string;
  vida_util?: string;
  valor_residual?: string;
  depreciacao_aplicavel: boolean;
  etiqueta_qrcode: boolean;
  veiculo_licenciavel: boolean;
  tipo_veiculo?: 'Terrestre' | 'Aquaviário' | 'Aeronáutico';
  status: 'ativo' | 'inativo';
}

// Função para converter de Supabase para formato local
export const toLocalFormat = (group: AssetGroup): AssetGroupLocal => ({
  id: group.id.toString(),
  nome: group.name,
  codigo_contabil: group.accounting_code,
  taxa_depreciacao_anual: group.annual_depreciation_rate?.toString() || '',
  taxa_depreciacao_mensal: group.monthly_depreciation_rate?.toString() || '',
  vida_util: group.useful_life?.toString() || '',
  valor_residual: group.residual_value?.toString() || '',
  depreciacao_aplicavel: group.is_depreciable,
  etiqueta_qrcode: group.qr_code_required,
  veiculo_licenciavel: group.licensable_vehicle,
  tipo_veiculo: group.vehicle_type || undefined,
  status: group.is_deleted ? 'inativo' : 'ativo',
});

// Função para converter de formato local para Supabase
export const toSupabaseFormat = (data: Partial<AssetGroupLocal>): AssetGroupInsert => ({
  name: data.nome || '',
  accounting_code: data.codigo_contabil || '',
  annual_depreciation_rate: data.taxa_depreciacao_anual ? parseFloat(data.taxa_depreciacao_anual) : null,
  monthly_depreciation_rate: data.taxa_depreciacao_mensal ? parseFloat(data.taxa_depreciacao_mensal) : null,
  useful_life: data.vida_util ? parseInt(data.vida_util) : null,
  residual_value: data.valor_residual ? parseFloat(data.valor_residual) : null,
  is_depreciable: data.depreciacao_aplicavel ?? false,
  qr_code_required: data.etiqueta_qrcode ?? false,
  licensable_vehicle: data.veiculo_licenciavel ?? false,
  vehicle_type: data.tipo_veiculo || null,
});

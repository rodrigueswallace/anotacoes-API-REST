import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  employmentType: string;
  registrationNumber: string;
  accessProfileId: number;
  departmentId: number;
  unitId: number;
  agencyId: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: 'her' }
    });

    const requestData: CreateUserRequest = await req.json();
    
    console.log("Creating user with data:", { ...requestData, cpf: "***" });

    // Normalize employment type to match database enum
    const employmentTypeMap: Record<string, string> = {
      'estagiario': 'Estagiário',
      'efetivo': 'Efetivo',
      'comissionado': 'Comissionado'
    };

    const normalizedEmploymentType = employmentTypeMap[requestData.employmentType.toLowerCase()];
    
    if (!normalizedEmploymentType) {
      throw new Error(`Invalid employment type: ${requestData.employmentType}. Valid values are: estagiario, efetivo, comissionado`);
    }

    // Generate hashes
    const cpfHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(requestData.cpf)
    );
    const emailHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(requestData.email.toLowerCase())
    );

    const cpfHashHex = Array.from(new Uint8Array(cpfHash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const emailHashHex = Array.from(new Uint8Array(emailHash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Step 1: Create auth user (auto-confirmed, no password yet)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: requestData.email,
      email_confirm: true,
      user_metadata: {
        name: requestData.name,
        cpf: requestData.cpf,
      },
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      
      // Tratar especificamente erro de e-mail duplicado
      if (authError.message.includes('already been registered') || 
          authError.message.includes('email_exists')) {
        return new Response(
          JSON.stringify({ 
            error: 'Este e-mail já está cadastrado no sistema.',
            code: 'EMAIL_EXISTS'
          }),
          {
            status: 409, // Conflict
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    console.log("Auth user created:", authData.user.id);

    // Step 2: Insert into users_data
    const { error: userDataError } = await supabaseAdmin
      .from("users_data")
      .insert({
        id: authData.user.id,
        name: requestData.name,
        email: requestData.email,
        cpf: requestData.cpf,
        cpf_hash: cpfHashHex,
        email_hash: emailHashHex,
        phone_number: requestData.phoneNumber,
        employment_type: normalizedEmploymentType,
        registration_number: requestData.registrationNumber,
        s_her_m_org_t_department_c_id: requestData.departmentId,
      });

    if (userDataError) {
      console.error("User data insertion error:", userDataError);
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create user data: ${userDataError.message}`);
    }

    console.log("User data inserted");

    // Step 3: Insert into m_org_t_users_profile
    const { error: profileError } = await supabaseAdmin
      .from("m_org_t_users_profile")
      .insert({
        s_auth_t_users_c_id: authData.user.id,
        s_her_m_org_t_access_profile_c_id: requestData.accessProfileId,
      });

    if (profileError) {
      console.error("User profile insertion error:", profileError);
      // Rollback: delete user data and auth user
      await supabaseAdmin.from("users_data").delete().eq("id", authData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    console.log("User profile inserted successfully");

    // Step 4: Log user creation in audit table
    console.log("🔍 Attempting to log user creation audit...");
    
    const auditData = {
      item_type: 'Usuario',
      item_id: authData.user.id,
      item_name: requestData.name,
      action_type: 'create',
      action_label: 'Usuário Criado',
      action_description: `Usuário ${requestData.name} foi criado com sucesso`,
      performed_by: null, // Sistema criou automaticamente
      performed_by_name: 'Sistema',
      metadata: {
        email: requestData.email,
        department_id: requestData.departmentId,
        access_profile_id: requestData.accessProfileId,
      },
    };

    console.log("📝 Audit data to insert:", JSON.stringify(auditData, null, 2));

    const { data: auditResult, error: auditError } = await supabaseAdmin
      .schema('her')
      .from("m_log_t_audit_configs_log")
      .insert(auditData)
      .select();

    if (auditError) {
      console.error("❌ AUDIT LOG ERROR:", {
        code: auditError.code,
        message: auditError.message,
        details: auditError.details,
        hint: auditError.hint
      });
      // Don't fail the whole operation if audit logging fails
    } else {
      console.log("✅ User creation audit logged successfully!");
      console.log("📊 Audit result:", auditResult);
    }

    // Fetch complete user data using the RPC function
    const { data: completeUser, error: fetchError } = await supabaseAdmin
      .rpc("get_all_users_complete");

    if (fetchError) {
      console.error("Error fetching complete user:", fetchError);
    }

    const createdUser = completeUser?.find((u: any) => u.id === authData.user.id);

    return new Response(
      JSON.stringify({
        id: authData.user.id,
        name: requestData.name,
        email: requestData.email,
        cpf: requestData.cpf,
        phoneNumber: requestData.phoneNumber,
        employmentType: requestData.employmentType,
        registrationNumber: requestData.registrationNumber,
        accessProfileId: requestData.accessProfileId,
        accessProfileName: createdUser?.access_profile_name,
        departmentId: requestData.departmentId,
        departmentName: createdUser?.department_name,
        unitId: requestData.unitId,
        unitName: createdUser?.unit_name,
        agencyId: requestData.agencyId,
        agencyName: createdUser?.agency_name,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in create-user function:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

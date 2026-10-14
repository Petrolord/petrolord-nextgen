
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "./cors.ts"

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create Supabase Client (Client Context)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Authenticate User & Verify Super Admin Role
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized: You must be logged in.')
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError || profile?.role !== 'super_admin') {
      throw new Error('Forbidden: Only Super Admins can perform this action.')
    }

    // 3. Parse Body
    const { email, redirectUrl } = await req.json()
    if (!email) throw new Error('Email is required')
    if (!redirectUrl) throw new Error('Redirect URL is required')

    // 4. Initialize Admin Client (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Inviting super admin: ${email}. Redirecting to: ${redirectUrl}`);

    // 5. Send Invitation via Supabase Auth
    // This uses the Project's SMTP settings and Email Templates automatically.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: redirectUrl,
      data: { 
        role: 'super_admin', 
        display_name: 'Super Admin',
        phase: 1,
        status: 'active'
      }
    });
    
    if (inviteError) throw inviteError;
    
    // 6. Audit Log
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'INVITE_SUPER_ADMIN',
      resource_type: 'user',
      resource_id: inviteData.user.id, 
      description: `Invited ${email} as Super Admin`,
      status: 'success',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    });

    return new Response(JSON.stringify({ 
      message: 'Super Admin invitation sent successfully via Supabase Auth',
      user: inviteData.user
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error in create-super-admin:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "./cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 1. Authenticate Requester
    const { data: { user: requester }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !requester) throw new Error('Unauthorized')

    // 2. Verify Requester is Super Admin
    const { data: requesterProfile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', requester.id)
      .single()
    
    if (requesterProfile?.role !== 'super_admin') {
      throw new Error('Forbidden: Only Super Admins can deactivate users.')
    }

    const { userId, reason } = await req.json()
    if (!userId) throw new Error('User ID is required')

    if (userId === requester.id) {
      throw new Error('You cannot deactivate your own account.')
    }

    // 3. Initialize Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 4. Deactivate in Auth (Ban for 100 years)
    // Banning prevents login and token refresh
    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: '876000h' // ~100 years
    })

    if (banError) throw banError

    // 5. Update Profile Status
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (profileError) throw profileError

    // 6. Audit Log
    await supabaseAdmin.from('audit_logs').insert({
      user_id: requester.id,
      action: 'DEACTIVATE_USER',
      resource_type: 'user',
      resource_id: userId,
      description: `Deactivated user ${userId}. Reason: ${reason || 'No reason provided'}`,
      status: 'success',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    })

    return new Response(JSON.stringify({ message: 'User deactivated successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

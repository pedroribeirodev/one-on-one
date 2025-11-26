import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const { data: existingMembership } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

      if (!existingMembership) {
        const userName = data.user.user_metadata?.full_name || 
                        data.user.user_metadata?.name || 
                        data.user.email?.split('@')[0] || 
                        'User'
        
        const companyName = `${userName}'s Workspace`
        const slug = companyName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
        const uniqueSlug = `${slug}-${Date.now()}`

        const { data: workspace, error: workspaceError } = await supabase
          .from('workspaces')
          .insert({
            name: companyName,
            slug: uniqueSlug,
          })
          .select()
          .single()

        if (!workspaceError && workspace) {
          await supabase
            .from('workspace_members')
            .insert({
              workspace_id: workspace.id,
              user_id: data.user.id,
              role: 'admin',
            })
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}

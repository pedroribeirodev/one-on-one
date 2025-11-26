'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
}

export interface SignupData {
  email: string
  password: string
  fullName: string
  companyName: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResult {
  error?: string
  success?: boolean
}

export async function signup(data: SignupData): Promise<AuthResult> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { error: 'An account with this email already exists' }
    }
    if (authError.message.includes('password')) {
      return { error: 'Password must be at least 6 characters' }
    }
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  const slug = generateSlug(data.companyName)
  const timestamp = Date.now()
  const uniqueSlug = `${slug}-${timestamp}`

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      name: data.companyName,
      slug: uniqueSlug,
    })
    .select()
    .single()

  if (workspaceError) {
    return { error: 'Failed to create workspace. Please try again.' }
  }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspace.id,
      user_id: authData.user.id,
      role: 'admin',
    })

  if (memberError) {
    return { error: 'Failed to set up workspace membership. Please try again.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function login(data: LoginData): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function loginWithGoogle(): Promise<AuthResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'Failed to initiate Google sign in' }
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserWithWorkspace() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('*, workspace:workspaces(*)')
    .eq('user_id', user.id)
    .single()

  return {
    user,
    membership,
    workspace: membership?.workspace,
  }
}

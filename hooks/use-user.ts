'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Workspace {
  id: string
  name: string
  slug: string
  subscription_status: string
}

interface WorkspaceMembership {
  id: string
  workspace_id: string
  user_id: string
  role: 'admin' | 'tech_lead'
  workspace?: Workspace
}

interface UseUserReturn {
  user: User | null
  membership: WorkspaceMembership | null
  workspace: Workspace | null
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [membership, setMembership] = useState<WorkspaceMembership | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = createClient()
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        throw authError
      }

      setUser(authUser)

      if (authUser) {
        const { data: membershipData, error: membershipError } = await supabase
          .from('workspace_members')
          .select('*, workspace:workspaces(*)')
          .eq('user_id', authUser.id)
          .single()

        if (membershipError && membershipError.code !== 'PGRST116') {
          console.error('Error fetching membership:', membershipError)
        }

        if (membershipData) {
          setMembership({
            id: membershipData.id,
            workspace_id: membershipData.workspace_id,
            user_id: membershipData.user_id,
            role: membershipData.role,
            workspace: membershipData.workspace,
          })
        }
      } else {
        setMembership(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserData()

    const supabase = createClient()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          await fetchUserData()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  return {
    user,
    membership,
    workspace: membership?.workspace || null,
    isLoading,
    error,
    refresh: fetchUserData,
  }
}

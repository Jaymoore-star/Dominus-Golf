import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { clearGrantDraft } from '@/lib/grantDraft'
import { clearPendingAction } from '@/lib/pendingAction'
import { clearPersistedCart, clearPersistedWishlist } from '@/lib/basketStorage'
import { flushAccountBaskets } from '@/lib/accountBaskets'

interface AuthUser {
  id: string
  email: string
  displayName?: string
  /** Raw user_metadata — where saved address and preferences live. */
  metadata: Record<string, unknown>
}

function toAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? '',
    displayName:
      (user.user_metadata?.displayName as string | undefined) ??
      (user.user_metadata?.display_name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined),
    metadata: user.user_metadata ?? {},
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Seed with the current session, then subscribe to changes.
    supabase.auth.getSession().then(({ data }) => {
      setUser(toAuthUser(data.session?.user))
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user))
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    // These outlive the tab now, so don't leave one person's half-written
    // application — or their pending checkout, or the products they saved —
    // for the next user of a shared machine.
    clearGrantDraft()
    clearPendingAction()

    // Land any debounced wishlist/cart write while the session is still valid,
    // otherwise an edit made in the last moment before signing out would never
    // reach the account. Only then clear the local copies: the account keeps
    // both lists, and signing back in restores them.
    await flushAccountBaskets()
    clearPersistedWishlist()
    clearPersistedCart()

    return supabase.auth.signOut()
  }

  return { user, isLoading, isAuthenticated: !!user, signOut }
}

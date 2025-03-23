import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            email: email,
          }
        }
      })

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error) {
      console.error('Signup error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting sign in for:', email) // Debug log
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('AuthContext: Sign in error:', error) // Debug log
        return { data: null, error }
      }

      if (!data.user) {
        console.error('AuthContext: No user returned after sign in') // Debug log
        return {
          data: null,
          error: { message: 'Invalid login credentials' }
        }
      }

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        console.log('AuthContext: Email not confirmed for user') // Debug log
        return {
          data,
          error: {
            message: 'Email not confirmed. Please check your email for the verification link.'
          }
        }
      }

      console.log('AuthContext: Sign in successful') // Debug log
      return { data, error: null }
    } catch (error) {
      console.error('AuthContext: Unexpected error during sign in:', error) // Debug log
      return { 
        data: null, 
        error: { 
          message: 'An unexpected error occurred during sign in.' 
        } 
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Signout error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
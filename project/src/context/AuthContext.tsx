import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, type Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isAdmin: boolean
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only initialize auth if Supabase is available
    if (!supabase) {
      setLoading(false)
      return
    }

    const initializeAuth = async () => {
      try {
        console.log('🔥 Initializing auth...')
        
        // First, try to get the session from Supabase
        // This will handle OAuth tokens in the URL automatically
        if (!supabase) {
          setLoading(false)
          return
        }
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('🔥 Error getting session:', error)
          // Check if we have OAuth error in URL
          if (window.location.hash.includes('error=')) {
            const params = new URLSearchParams(window.location.hash.substring(1))
            const errorCode = params.get('error')
            const errorDescription = params.get('error_description')
            console.error('🔥 OAuth error:', errorCode, errorDescription)
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } else if (session) {
          console.log('🔥 Session found:', session)
          setSession(session)
          setUser(session.user)
          await fetchProfile(session.user.id)
          
          // If we have OAuth tokens in URL, clean them up
          if (window.location.hash.includes('access_token')) {
            console.log('🔥 Cleaning OAuth tokens from URL...')
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } else {
          console.log('🔥 No session found')
        }
        
        setLoading(false)
      } catch (error) {
        console.error('🔥 Error initializing auth:', error)
        setLoading(false)
      }
    }

    // Initialize auth
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔥 Auth state change:', event)
      
      if (event === 'SIGNED_IN' && session) {
        console.log('🔥 User signed in:', session.user)
        setSession(session)
        setUser(session.user)
        await fetchProfile(session.user.id)
        
        // Clean up URL if we have OAuth tokens
        if (window.location.hash.includes('access_token')) {
          console.log('🔥 Cleaning OAuth tokens from URL after sign in...')
          window.history.replaceState({}, document.title, '/account')
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🔥 User signed out')
        setSession(null)
        setUser(null)
        setProfile(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔥 Token refreshed')
        setSession(session)
      } else if (event === 'USER_UPDATED' && session) {
        console.log('🔥 User updated:', session.user)
        setUser(session.user)
        await fetchProfile(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Create profile if it doesn't exist
      if (user?.email) {
        await createProfile(userId, user.email)
      }
    }
  }

  const createProfile = async (userId: string, email: string, fullName?: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName,
          role: 'user'
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Authentication not available')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    if (!supabase) throw new Error('Authentication not available')
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
    if (data.user) {
      await createProfile(data.user.id, email, fullName)
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Authentication not available')
    
    // Get the correct redirect URL based on environment
    let redirectUrl = window.location.origin
    
    // Check if we're in GitHub Codespaces
    if (window.location.hostname.includes('github.dev')) {
      // In Codespaces, we need to construct the preview URL correctly
      const codespaceId = window.location.hostname.split('.')[0]
      redirectUrl = `https://${codespaceId}-5174.app.github.dev`
    } else if (window.location.hostname === 'localhost') {
      // For local development
      redirectUrl = `http://localhost:${window.location.port || '5174'}`
    }
    
    // Append /account to the redirect URL
    redirectUrl = `${redirectUrl}/account`
    
    console.log('🔥 Starting Google OAuth with redirect to:', redirectUrl)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) {
      console.error('🔥 Google OAuth error:', error)
      throw error
    }
  }

  const signInWithFacebook = async () => {
    if (!supabase) throw new Error('Authentication not available')
    
    // Use the same redirect URL logic
    let redirectUrl = window.location.origin
    
    if (window.location.hostname.includes('github.dev')) {
      const codespaceId = window.location.hostname.split('.')[0]
      redirectUrl = `https://${codespaceId}-5174.app.github.dev`
    } else if (window.location.hostname === 'localhost') {
      redirectUrl = `http://localhost:${window.location.port || '5174'}`
    }
    
    redirectUrl = `${redirectUrl}/account`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      
      // Clear local state first
      setUser(null);
      
      // Then try to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        // Don't throw error - we've already cleared local state
      }
      
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log('Sign out completed');
    } catch (error) {
      console.error('Sign out error:', error);
      // Ensure state is cleared even on error
      setUser(null);
    }
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isAdmin,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithFacebook,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

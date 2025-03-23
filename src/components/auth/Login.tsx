import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('Attempting to sign in with:', email) // Debug log
      
      // Use the signIn function from AuthContext instead of direct Supabase call
      const { data, error: signInError } = await signIn(email, password)

      if (signInError) {
        throw signInError
      }

      if (data?.user) {
        console.log('Sign in successful:', data.user) // Debug log
        
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          setError('Please verify your email before signing in. Check your inbox for the verification link.')
          return
        }

        // If we get here, the user is verified and logged in
        console.log('User is verified, redirecting to dashboard') // Debug log
        navigate('/dashboard')
      } else {
        console.log('Sign in failed - no user returned') // Debug log
        setError('Invalid email or password. Please check your credentials and try again.')
      }
    } catch (err: any) {
      console.error('Login error:', err) // Debug log
      if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else {
        setError(err.message || 'An error occurred during login. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      setError('Verification email has been resent. Please check your inbox.')
    } catch (err) {
      console.error('Error resending verification:', err)
      setError('Failed to resend verification email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ApplyVault
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
                {error.includes('verify your email') && (
                  <button
                    type="button"
                    onClick={resendVerificationEmail}
                    className="ml-2 text-red-600 underline hover:text-red-800"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 
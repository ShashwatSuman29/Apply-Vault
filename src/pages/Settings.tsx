import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Bell, Shield, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ProfileData {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  created_at?: string
  updated_at: string
}

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profile, setProfile] = useState<ProfileData>({
    id: user?.id || '',
    first_name: '',
    last_name: '',
    email: user?.email || '',
    updated_at: new Date().toISOString()
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user, navigate])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Only check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (existingProfile) {
        console.log('Existing profile found:', existingProfile)
        setProfile({
          ...existingProfile,
          email: user.email || ''
        })
      } else {
        // Initialize empty profile without creating in database
        setProfile({
          id: user.id,
          first_name: '',
          last_name: '',
          email: user.email || '',
          updated_at: new Date().toISOString()
        })
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Error loading profile data. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value.trim()
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      setMessage(null)

      console.log('Updating profile with data:', {
        first_name: profile.first_name,
        last_name: profile.last_name
      })

      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      let updatedProfile
      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            first_name: profile.first_name?.trim() || null,
            last_name: profile.last_name?.trim() || null
          }])
          .select()
          .single()

        if (insertError) throw insertError
        updatedProfile = insertedProfile
      } else {
        // Update existing profile
        const { data: updated, error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: profile.first_name?.trim() || null,
            last_name: profile.last_name?.trim() || null
          })
          .eq('id', user.id)
          .select()
          .single()

        if (updateError) throw updateError
        updatedProfile = updated
      }

      if (updatedProfile) {
        console.log('Profile updated successfully:', updatedProfile)
        setProfile(prev => ({
          ...prev,
          ...updatedProfile
        }))

        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        })
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Error updating profile. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error: any) {
      console.error('Error signing out:', error)
      setMessage({
        type: 'error',
        text: 'Error signing out. Please try again.'
      })
    }
  }

  const handlePasswordChange = () => {
    navigate('/reset-password')
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your account preferences and settings</p>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-600" />
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={profile.first_name || ''}
                onChange={handleChange}
                maxLength={50}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={profile.last_name || ''}
                onChange={handleChange}
                maxLength={50}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed. Contact support for email updates.
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200 mt-6">
        <div className="p-6">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Notification Settings
            </h2>
          </div>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  name="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="email-notifications"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="application-updates"
                  name="application-updates"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="application-updates"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Application status updates
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Security Settings
            </h2>
          </div>
          <div className="mt-6">
            <button
              onClick={handlePasswordChange}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center">
            <LogOut className="h-6 w-6 text-red-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Account Actions
            </h2>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
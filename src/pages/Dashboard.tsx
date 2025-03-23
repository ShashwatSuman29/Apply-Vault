import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import RecentApplications from '../components/dashboard/RecentApplications'

interface ApplicationCounts {
  total: number
  inProgress: number
  accepted: number
  rejected: number
}

export default function Dashboard() {
  const [counts, setCounts] = useState<ApplicationCounts>({
    total: 0,
    inProgress: 0,
    accepted: 0,
    rejected: 0,
  })
  const { user } = useAuth()

  useEffect(() => {
    fetchApplicationCounts()

    // Set up real-time subscription for counts
    const subscription = supabase
      .channel('dashboard-counts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchApplicationCounts() // Refresh counts when changes occur
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchApplicationCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', user?.id)

      if (error) throw error

      const counts = {
        total: data.length,
        inProgress: data.filter((app) => app.status === 'In Progress').length,
        accepted: data.filter((app) => app.status === 'Accepted').length,
        rejected: data.filter((app) => app.status === 'Rejected').length,
      }

      setCounts(counts)
    } catch (error) {
      console.error('Error fetching application counts:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Track your job applications and stay organized
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Applications</h2>
              <p className="text-2xl font-semibold">{counts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">In Progress</h2>
              <p className="text-2xl font-semibold">{counts.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Accepted</h2>
              <p className="text-2xl font-semibold">{counts.accepted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Rejected</h2>
              <p className="text-2xl font-semibold">{counts.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <RecentApplications />
    </div>
  )
}
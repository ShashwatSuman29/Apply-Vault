import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface Application {
  id: string
  job_title: string
  company: string
  status: string
  applied_date: string
}

export default function RecentApplications() {
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Fetch initial recent applications
    fetchRecentApplications()

    // Set up real-time subscription
    const subscription = supabase
      .channel('recent-applications')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Real-time update:', payload)
          fetchRecentApplications() // Refresh the list when changes occur
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchRecentApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('applied_date', { ascending: false })
        .limit(5) // Show only the 5 most recent applications

      if (error) throw error

      setRecentApplications(data || [])
    } catch (error) {
      console.error('Error fetching recent applications:', error)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
      <div className="space-y-4">
        {recentApplications.map((application) => (
          <div
            key={application.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {application.company.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{application.job_title}</h3>
                <p className="text-gray-500 text-sm">{application.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-sm ${
                application.status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : application.status === 'Accepted'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {application.status}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(application.applied_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {recentApplications.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No applications yet. Start by adding your first application!
          </div>
        )}
      </div>
    </div>
  )
} 
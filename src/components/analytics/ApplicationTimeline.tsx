import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'

interface TimelineApplication {
  id: string
  job_title: string
  company: string
  status: string
  applied_date: string
  last_date_to_apply: string | null
  created_at: string
}

export default function ApplicationTimeline() {
  const [applications, setApplications] = useState<TimelineApplication[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Fetch initial data
    fetchApplications()

    // Set up real-time subscription
    const subscription = supabase
      .channel('timeline-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchApplications() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('applied_date', { ascending: false })

      if (error) throw error

      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flow-root">
      {applications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No applications yet. Start by adding your first application!
        </div>
      ) : (
        <ul role="list" className="-mb-8">
          {applications.map((application, index) => (
            <li key={application.id}>
              <div className="relative pb-8">
                {index !== applications.length - 1 && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        getStatusColor(application.status).split(' ')[0]
                      }`}
                    >
                      {application.company.charAt(0)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">
                        Applied to{' '}
                        <span className="font-medium">{application.job_title}</span>{' '}
                        at{' '}
                        <span className="font-medium">{application.company}</span>
                      </p>
                      {application.last_date_to_apply && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last date to apply:{' '}
                          {format(new Date(application.last_date_to_apply), 'PPP')}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm">
                      <time dateTime={application.applied_date}>
                        {format(new Date(application.applied_date), 'PPP')}
                      </time>
                      <div
                        className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 
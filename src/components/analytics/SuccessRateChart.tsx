import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  Title,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface CompanyTypeStats {
  companyType: string
  totalApplications: number
  acceptedApplications: number
  rejectedApplications: number
  inProgressApplications: number
  successRate: number
}

export default function SuccessRateChart() {
  const [companyStats, setCompanyStats] = useState<CompanyTypeStats[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Fetch initial data
    fetchSuccessRates()

    // Set up real-time subscription
    const subscription = supabase
      .channel('success-rate-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchSuccessRates() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchSuccessRates = async () => {
    try {
      setLoading(true)
      const { data: applications, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)

      if (error) throw error

      // Group applications by company type and calculate success rates
      const companyTypeMap = new Map<
        string,
        {
          total: number
          accepted: number
          rejected: number
          inProgress: number
        }
      >()

      applications?.forEach((app) => {
        const companyType = app.company_type || 'Unknown'
        const current = companyTypeMap.get(companyType) || {
          total: 0,
          accepted: 0,
          rejected: 0,
          inProgress: 0,
        }
        
        current.total++
        switch (app.status) {
          case 'Accepted':
            current.accepted++
            break
          case 'Rejected':
            current.rejected++
            break
          case 'In Progress':
            current.inProgress++
            break
        }
        
        companyTypeMap.set(companyType, current)
      })

      // Convert to array and calculate success rates
      const stats = Array.from(companyTypeMap.entries()).map(([companyType, stats]) => ({
        companyType,
        totalApplications: stats.total,
        acceptedApplications: stats.accepted,
        rejectedApplications: stats.rejected,
        inProgressApplications: stats.inProgress,
        successRate: (stats.accepted / stats.total) * 100,
      }))

      setCompanyStats(stats)
    } catch (error) {
      console.error('Error fetching success rates:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData: ChartData<'pie'> = {
    labels: companyStats.map((stat) => stat.companyType),
    datasets: [
      {
        data: companyStats.map((stat) => stat.successRate),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const stat = companyStats[context.dataIndex]
            return [
              `${stat.companyType}:`,
              `Success Rate: ${stat.successRate.toFixed(1)}%`,
              `Accepted: ${stat.acceptedApplications}`,
              `Rejected: ${stat.rejectedApplications}`,
              `In Progress: ${stat.inProgressApplications}`,
              `Total Applications: ${stat.totalApplications}`,
            ]
          },
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (companyStats.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No application data available. Start by adding applications with company types!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
      <div className="space-y-4 overflow-y-auto max-h-80">
        {companyStats.map((stat) => (
          <div
            key={stat.companyType}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">{stat.companyType}</h3>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Success Rate</p>
                <p className="font-medium text-green-600">
                  {stat.successRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Applications</p>
                <p className="font-medium">{stat.totalApplications}</p>
              </div>
              <div>
                <p className="text-gray-500">Accepted</p>
                <p className="font-medium text-green-600">
                  {stat.acceptedApplications}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Rejected</p>
                <p className="font-medium text-red-600">
                  {stat.rejectedApplications}
                </p>
              </div>
              <div>
                <p className="text-gray-500">In Progress</p>
                <p className="font-medium text-blue-600">
                  {stat.inProgressApplications}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Success Rate</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${stat.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
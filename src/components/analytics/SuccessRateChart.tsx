import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

interface CompanyTypeStats {
  companyType: string
  totalApplications: number
  acceptedApplications: number
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
      const companyTypeMap = new Map<string, { total: number; accepted: number }>()

      applications?.forEach((app) => {
        const companyType = app.company_type || 'Unknown'
        const current = companyTypeMap.get(companyType) || { total: 0, accepted: 0 }
        
        current.total++
        if (app.status === 'Accepted') {
          current.accepted++
        }
        
        companyTypeMap.set(companyType, current)
      })

      // Convert to array and calculate success rates
      const stats = Array.from(companyTypeMap.entries()).map(([companyType, stats]) => ({
        companyType,
        totalApplications: stats.total,
        acceptedApplications: stats.accepted,
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
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const stat = companyStats[context.dataIndex]
            return [
              `Success Rate: ${stat.successRate.toFixed(1)}%`,
              `Accepted: ${stat.acceptedApplications}`,
              `Total: ${stat.totalApplications}`,
            ]
          },
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
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
      <div className="space-y-4">
        {companyStats.map((stat) => (
          <div
            key={stat.companyType}
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <h3 className="font-medium text-gray-900">{stat.companyType}</h3>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Success Rate</p>
                <p className="font-medium text-green-600">
                  {stat.successRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">Accepted</p>
                <p className="font-medium">{stat.acceptedApplications}</p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-medium">{stat.totalApplications}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
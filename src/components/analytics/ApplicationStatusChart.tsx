import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface StatusCount {
  status: string
  count: number
}

export default function ApplicationStatusChart() {
  const [statusData, setStatusData] = useState<StatusCount[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Fetch initial data
    fetchStatusDistribution()

    // Set up real-time subscription
    const subscription = supabase
      .channel('status-distribution')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchStatusDistribution() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchStatusDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', user?.id)

      if (error) throw error

      // Count applications by status
      const counts = data.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1
        return acc
      }, {})

      // Convert to array format for chart
      const statusCounts = Object.entries(counts).map(([status, count]) => ({
        status,
        count,
      }))

      setStatusData(statusCounts)
    } catch (error) {
      console.error('Error fetching status distribution:', error)
    }
  }

  const chartData: ChartData<'bar'> = {
    labels: statusData.map((item) => item.status),
    datasets: [
      {
        label: 'Number of Applications',
        data: statusData.map((item) => item.count),
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)', // Yellow for In Progress
          'rgba(75, 192, 192, 0.5)', // Green for Accepted
          'rgba(255, 99, 132, 0.5)', // Red for Rejected
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
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
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Application Status Distribution',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
} 
import { Activity, TrendingUp } from 'lucide-react'
import ApplicationStatusChart from '../components/analytics/ApplicationStatusChart'
import ApplicationTimeline from '../components/analytics/ApplicationTimeline'
import SuccessRateChart from '../components/analytics/SuccessRateChart'

const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <p className="text-gray-600 mb-8">
        Track your application performance and insights
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Application Status Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <ApplicationStatusChart />
        </div>

        {/* Application Timeline */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Application Timeline
            </h2>
          </div>
          <ApplicationTimeline />
        </div>

        {/* Success Rate by Company Type */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Success Rate by Company Type
            </h2>
          </div>
          <SuccessRateChart />
        </div>
      </div>
    </div>
  )
}

export default Analytics
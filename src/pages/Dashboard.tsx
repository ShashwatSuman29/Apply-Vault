import React from 'react';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

const stats = [
  { name: 'Total Applications', value: '24', icon: Briefcase, color: 'bg-blue-500' },
  { name: 'In Progress', value: '12', icon: Clock, color: 'bg-yellow-500' },
  { name: 'Accepted', value: '8', icon: CheckCircle, color: 'bg-green-500' },
  { name: 'Rejected', value: '4', icon: XCircle, color: 'bg-red-500' },
];

const recentApplications = [
  {
    company: 'Google',
    position: 'Senior Software Engineer',
    status: 'In Progress',
    date: '2024-03-10',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // Add more mock data as needed
];

function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your job applications and stay organized
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {recentApplications.map((application) => (
              <li key={application.company}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={application.logo}
                        alt={application.company}
                      />
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">
                          {application.position}
                        </p>
                        <p className="text-sm text-gray-500">
                          {application.company}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0">
                      <div className="flex items-center space-x-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {application.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {application.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
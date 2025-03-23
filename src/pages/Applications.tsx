import React from 'react';
import { Plus } from 'lucide-react';

const applications = [
  {
    id: 1,
    company: 'Google',
    position: 'Senior Software Engineer',
    status: 'In Progress',
    date: '2024-03-10',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // Add more mock data
];

function Applications() {
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your job applications
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-5 w-5 mr-2" />
          New Application
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {applications.map((application) => (
            <li key={application.id}>
              <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 cursor-pointer">
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
  );
}

export default Applications;
import React from 'react';
import { User, Bell, Shield, LogOut } from 'lucide-react';

function Settings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Profile Settings
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

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
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Application {
  id: string;
  job_title: string;
  company: string;
  status: string;
  applied_date: string;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order('applied_date', { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return;
    }

    const apps = data || [];
    setApplications(apps);
    setFilteredApplications(apps);

    // Calculate stats
    setStats({
      total: apps.length,
      inProgress: apps.filter((app) => app.status === "In Progress").length,
      accepted: apps.filter((app) => app.status === "Accepted").length,
      rejected: apps.filter((app) => app.status === "Rejected").length,
    });
  };

  const handleStatClick = (filter: string | null) => {
    setActiveFilter(filter);
    if (!filter || filter === 'total') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => 
        filter === 'inProgress' ? app.status === 'In Progress' :
        app.status === filter
      );
      setFilteredApplications(filtered);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">Track your job applications and stay organized</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleStatClick('total')}
          className={`p-6 rounded-lg shadow-md transition-all ${
            activeFilter === 'total' || !activeFilter
              ? 'bg-blue-500 text-white'
              : 'bg-white hover:bg-blue-50'
          }`}
        >
          <div className="text-2xl font-bold mb-2">{stats.total}</div>
          <div className="text-sm">Total Applications</div>
        </button>

        <button
          onClick={() => handleStatClick('inProgress')}
          className={`p-6 rounded-lg shadow-md transition-all ${
            activeFilter === 'inProgress'
              ? 'bg-yellow-500 text-white'
              : 'bg-white hover:bg-yellow-50'
          }`}
        >
          <div className="text-2xl font-bold mb-2">{stats.inProgress}</div>
          <div className="text-sm">In Progress</div>
        </button>

        <button
          onClick={() => handleStatClick('Accepted')}
          className={`p-6 rounded-lg shadow-md transition-all ${
            activeFilter === 'Accepted'
              ? 'bg-green-500 text-white'
              : 'bg-white hover:bg-green-50'
          }`}
        >
          <div className="text-2xl font-bold mb-2">{stats.accepted}</div>
          <div className="text-sm">Accepted</div>
        </button>

        <button
          onClick={() => handleStatClick('Rejected')}
          className={`p-6 rounded-lg shadow-md transition-all ${
            activeFilter === 'Rejected'
              ? 'bg-red-500 text-white'
              : 'bg-white hover:bg-red-50'
          }`}
        >
          <div className="text-2xl font-bold mb-2">{stats.rejected}</div>
          <div className="text-sm">Rejected</div>
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {activeFilter ? `${activeFilter === 'inProgress' ? 'In Progress' : activeFilter} Applications` : 'All Applications'}
          </h2>
          {activeFilter && (
            <button
              onClick={() => handleStatClick(null)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Job Title</th>
                <th className="text-left py-3 px-4">Company</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{app.job_title}</td>
                  <td className="py-3 px-4">{app.company}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        app.status === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(app.applied_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No applications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
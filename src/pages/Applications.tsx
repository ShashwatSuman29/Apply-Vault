import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { supabase } from "../lib/supabase";
import AddApplication from "../components/AddApplication";

interface Application {
  id: string;
  job_title: string;
  company: string;
  status: string;
  applied_date: string;
  job_description?: string;
  tech_stack?: string;
  college_name?: string;
  contact_email?: string;
  contact_phone?: string;
  resume_url?: string;
  last_date_to_apply?: string;
  application_link?: string;
}

export default function Applications() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to view applications');
      }

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq('user_id', user.id)
        .order('applied_date', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAdded = () => {
    fetchApplications();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-gray-600">Manage and track all your job applications</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Application
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No applications yet. Click "New Application" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apply Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.job_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{application.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : application.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.last_date_to_apply 
                        ? new Date(application.last_date_to_apply).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.application_link ? (
                        <a
                          href={application.application_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Apply Link
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      <AddApplication
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onApplicationAdded={handleApplicationAdded}
      />
    </div>
  );
}
import { useState, useEffect } from "react";
import { Plus, FileText, Mail, Code } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import AddApplication from "../components/AddApplication";

interface Application {
  id: string;
  job_title: string;
  company: string;
  status: string;
  applied_date: string;
  last_date_to_apply: string;
  application_link: string;
  tech_stack: string;
  contact_email: string;
  resume_url: string;
  notes?: string;
  job_description?: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('applied_date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSignedUrl = async (path: string) => {
    try {
      // Extract filename from path if it contains the full URL
      const fileName = path.includes('/') ? path.split('/').pop() : path;
      
      if (!fileName) {
        console.error('Invalid resume path:', path);
        return null;
      }

      // Construct the correct path with user ID
      const fullPath = `${user?.id}/${fileName}`;
      console.log('Attempting to get signed URL for:', fullPath);

      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(fullPath, 60);

      if (error) {
        console.error('Supabase storage error:', error);
        return null;
      }

      console.log('Successfully generated signed URL');
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
      return null;
    }
  };

  const handleResumeClick = async (e: React.MouseEvent, resumePath: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Resume path:', resumePath);
    
    if (!resumePath) {
      alert('No resume URL provided');
      return;
    }

    const signedUrl = await getSignedUrl(resumePath);
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    } else {
      console.log('Failed to get signed URL for resume:', resumePath);
      alert('Unable to access resume. Please ensure the file exists and you have permission to view it.');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Applications</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all your job applications
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </button>
      </div>

      {/* Applications Table/List */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No applications found. Start by adding a new application.
                </div>
              ) : (
                <div className="min-w-full">
                  {/* Desktop Table View */}
                  <table className="hidden sm:table min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Job Title</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Date</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Apply Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {applications.map((application) => (
                        <>
                          <tr 
                            key={application.id}
                            onClick={() => toggleExpand(application.id)}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{application.job_title}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{application.company}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(application.applied_date).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {application.last_date_to_apply ? new Date(application.last_date_to_apply).toLocaleDateString() : '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {application.application_link ? (
                                <a
                                  href={application.application_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Apply Link
                                </a>
                              ) : '-'}
                            </td>
                          </tr>
                          {expandedId === application.id && (
                            <tr>
                              <td colSpan={6} className="px-3 py-4 bg-gray-50">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Resume</p>
                                      {application.resume_url ? (
                                        <a
                                          href="#"
                                          onClick={(e) => handleResumeClick(e, application.resume_url)}
                                          className="text-sm text-blue-600 hover:text-blue-900"
                                        >
                                          View Resume
                                        </a>
                                      ) : (
                                        <p className="text-sm text-gray-500">Not provided</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Contact Email</p>
                                      <p className="text-sm text-gray-500">
                                        {application.contact_email || 'Not provided'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Code className="h-4 w-4 text-gray-400" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Tech Stack</p>
                                      <p className="text-sm text-gray-500">
                                        {application.tech_stack || 'Not specified'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile List View */}
                  <div className="sm:hidden divide-y divide-gray-200">
                    {applications.map((application) => (
                      <div key={application.id}>
                        <div 
                          className="p-4 space-y-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpand(application.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{application.job_title}</h3>
                              <p className="text-sm text-gray-500">{application.company}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                              application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Applied Date</p>
                              <p className="font-medium">{new Date(application.applied_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Last Date</p>
                              <p className="font-medium">
                                {application.last_date_to_apply ? 
                                  new Date(application.last_date_to_apply).toLocaleDateString() : '-'}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            {application.application_link ? (
                              <a
                                href={application.application_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-900"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Apply Link
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">No link</span>
                            )}
                          </div>
                        </div>

                        {expandedId === application.id && (
                          <div className="px-4 py-3 bg-gray-50 space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Resume</p>
                                {application.resume_url ? (
                                  <a
                                    href="#"
                                    onClick={(e) => handleResumeClick(e, application.resume_url)}
                                    className="text-sm text-blue-600 hover:text-blue-900"
                                  >
                                    View Resume
                                  </a>
                                ) : (
                                  <p className="text-sm text-gray-500">Not provided</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Contact Email</p>
                                <p className="text-sm text-gray-500">
                                  {application.contact_email || 'Not provided'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Tech Stack</p>
                                <p className="text-sm text-gray-500">
                                  {application.tech_stack || 'Not specified'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Application Modal */}
      <AddApplication
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onApplicationAdded={fetchApplications}
      />
    </div>
  );
}
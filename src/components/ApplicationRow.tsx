import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, FileText, Mail, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
}

interface ApplicationRowProps {
  application: Application;
}

export default function ApplicationRow({ application }: ApplicationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  // Get the public URL for the resume when expanded
  const getResumeUrl = async () => {
    if (application.resume_url) {
      try {
        // Get the signed URL for private bucket access
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('resumes')
          .createSignedUrl(application.resume_url, 60 * 60); // 1 hour expiry

        if (signedUrlError) {
          console.error('Error getting resume URL:', signedUrlError);
          if (signedUrlError.message.includes('bucket not found')) {
            throw new Error('Resume storage system is not available.');
          }
          throw signedUrlError;
        }

        if (signedUrlData?.signedUrl) {
          setResumeUrl(signedUrlData.signedUrl);
        }
      } catch (error: any) {
        console.error('Resume access error:', error);
        // Don't throw the error, just log it and let the UI handle the failed state
      }
    }
  };

  // Get resume URL when row is expanded
  useEffect(() => {
    if (isExpanded && application.resume_url && !resumeUrl) {
      getResumeUrl();
    }
  }, [isExpanded, application.resume_url]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <tr
        className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {application.job_title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {application.company}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(application.applied_date)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(application.last_date_to_apply)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {application.application_link ? (
            <a
              href={application.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              Apply Link <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          ) : (
            '-'
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Resume</h4>
                  {application.resume_url ? (
                    resumeUrl ? (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Resume <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">Loading resume...</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No resume uploaded</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Contact Email</h4>
                  <p className="text-sm text-gray-600 mt-1">{application.contact_email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Code className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Tech Stack</h4>
                  <p className="text-sm text-gray-600 mt-1">{application.tech_stack || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
} 
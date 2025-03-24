import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface AddApplicationProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationAdded: () => void;
}

interface FormData {
  jobTitle: string;
  company: string;
  jobDescription: string;
  techStack: string;
  collegeName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  appliedDate: string;
  lastDateToApply: string;
  applicationLink: string;
  company_type: string;
}

export default function AddApplication({ isOpen, onClose, onApplicationAdded }: AddApplicationProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    company: "",
    jobDescription: "",
    techStack: "",
    collegeName: "",
    contactEmail: "",
    contactPhone: "",
    status: "In Progress",
    appliedDate: new Date().toISOString().split('T')[0],
    lastDateToApply: "",
    applicationLink: "",
    company_type: 'Other',
  });
  const [resume, setResume] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('You must be logged in to add an application');
      }

      let resumeUrl = null;
      if (resume) {
        try {
          const fileExt = resume.name.split('.').pop();
          const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

          const { error: uploadError, data } = await supabase.storage
            .from('resumes')
            .upload(fileName, resume, {
              cacheControl: '3600',
              upsert: false,
              contentType: resume.type
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            if (uploadError.message.includes('bucket not found')) {
              throw new Error('Resume storage system is not available. Please try again later or contact support.');
            } else {
              throw new Error(`Failed to upload resume: ${uploadError.message}`);
            }
          }

          if (data) {
            resumeUrl = fileName;
          }
        } catch (error: any) {
          console.error('Resume upload error:', error);
          throw new Error(error.message || 'Failed to upload resume. Please try again.');
        }
      }

      const { error } = await supabase.from("applications").insert([
        {
          user_id: user.id,
          job_title: formData.jobTitle,
          company: formData.company,
          job_description: formData.jobDescription,
          tech_stack: formData.techStack,
          college_name: formData.collegeName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          status: formData.status,
          applied_date: formData.appliedDate,
          last_date_to_apply: formData.lastDateToApply,
          application_link: formData.applicationLink,
          resume_url: resumeUrl,
          company_type: formData.company_type,
        },
      ]);

      if (error) throw error;

      // Reset form and close modal
      setFormData({
        jobTitle: "",
        company: "",
        jobDescription: "",
        techStack: "",
        collegeName: "",
        contactEmail: "",
        contactPhone: "",
        status: "In Progress",
        appliedDate: new Date().toISOString().split('T')[0],
        lastDateToApply: "",
        applicationLink: "",
        company_type: 'Other',
      });
      setResume(null);
      
      if (onApplicationAdded) {
        onApplicationAdded();
      }
      onClose();
    } catch (err: any) {
      console.error('Error adding application:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-lg my-4 relative">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Application</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1.5"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2.5 text-sm bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company*
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={2}
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack
                </label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, Python"
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                />
              </div>

              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status*
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="company_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Type
                  </label>
                  <select
                    id="company_type"
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  >
                    <option value="Startup">Startup</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Mid-size Company">Mid-size</option>
                    <option value="Large Enterprise">Large</option>
                    <option value="FAANG">FAANG</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                <div>
                  <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Applied Date*
                  </label>
                  <input
                    type="date"
                    id="appliedDate"
                    name="appliedDate"
                    required
                    value={formData.appliedDate}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  />
                </div>

                <div>
                  <label htmlFor="lastDateToApply" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Date
                  </label>
                  <input
                    type="date"
                    id="lastDateToApply"
                    name="lastDateToApply"
                    value={formData.lastDateToApply}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Apply Link
                </label>
                <input
                  type="url"
                  id="applicationLink"
                  name="applicationLink"
                  value={formData.applicationLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/apply"
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 h-9"
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-gray-500
                    file:mr-3 file:py-1.5 file:px-3
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-3 py-1.5 text-sm border border-transparent rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
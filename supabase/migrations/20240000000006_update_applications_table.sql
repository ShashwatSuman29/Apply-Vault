-- Add new columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS company_type text,
ADD COLUMN IF NOT EXISTS salary_range text,
ADD COLUMN IF NOT EXISTS job_location text,
ADD COLUMN IF NOT EXISTS requirements text,
ADD COLUMN IF NOT EXISTS interview_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS interview_notes text; 
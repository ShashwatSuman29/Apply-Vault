-- Add company_type column to applications table
ALTER TABLE applications
ADD COLUMN company_type TEXT DEFAULT 'Other';

-- Create an enum type for company types
CREATE TYPE company_type AS ENUM (
  'Startup',
  'Small Business',
  'Mid-size Company',
  'Large Enterprise',
  'FAANG',
  'Other'
);

-- Add check constraint to ensure valid company types
ALTER TABLE applications
ADD CONSTRAINT valid_company_type CHECK (
  company_type IN (
    'Startup',
    'Small Business',
    'Mid-size Company',
    'Large Enterprise',
    'FAANG',
    'Other'
  )
); 
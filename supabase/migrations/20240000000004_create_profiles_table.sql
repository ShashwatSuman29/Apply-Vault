-- Drop the table if it exists
DROP TABLE IF EXISTS profiles;

-- Create the profiles table with correct structure
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for users" ON profiles
    FOR SELECT USING (
        auth.uid() = id
    );

CREATE POLICY "Enable insert for users" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id
    );

CREATE POLICY "Enable update for users" ON profiles
    FOR UPDATE USING (
        auth.uid() = id
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER handle_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at(); 
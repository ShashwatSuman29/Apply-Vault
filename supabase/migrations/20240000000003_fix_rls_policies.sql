-- First, drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy for SELECT
CREATE POLICY "Enable read access for own profile"
    ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Create a policy for INSERT
CREATE POLICY "Enable insert access for own profile"
    ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create a policy for UPDATE
CREATE POLICY "Enable update access for own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Create a policy for DELETE
CREATE POLICY "Enable delete access for own profile"
    ON profiles
    FOR DELETE
    USING (auth.uid() = id); 
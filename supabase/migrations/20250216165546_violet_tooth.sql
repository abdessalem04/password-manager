/*
  # Create passwords table and setup security

  1. New Tables
    - `passwords`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `username` (text)
      - `password` (text, encrypted)
      - `url` (text, optional)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `passwords` table
    - Add policies for authenticated users to:
      - Read their own passwords
      - Create new passwords
      - Update their own passwords
      - Delete their own passwords
*/

CREATE TABLE IF NOT EXISTS passwords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own passwords
CREATE POLICY "Users can read own passwords"
  ON passwords
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own passwords
CREATE POLICY "Users can create passwords"
  ON passwords
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own passwords
CREATE POLICY "Users can update own passwords"
  ON passwords
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own passwords
CREATE POLICY "Users can delete own passwords"
  ON passwords
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
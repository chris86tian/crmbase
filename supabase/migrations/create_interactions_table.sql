/*
  # Create interactions table

  1. New Tables
    - `interactions`
      - `id` (uuid, primary key)
      - `contact_id` (uuid, foreign key to contacts.id)
      - `type` (text)
      - `outcome` (text)
      - `date` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `interactions` table
    - Add policies for authenticated users to manage their interactions
*/

CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  type text CHECK (type IN ('Call', 'Mail', 'Meeting', 'Follow-Up')),
  outcome text,
  date timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own interactions"
  ON interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interactions"
  ON interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
  ON interactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions"
  ON interactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
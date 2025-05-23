/*
  # Create webhooks table for n8n integration

  1. New Tables
    - `webhooks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `url` (text)
      - `event_type` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `webhooks` table
    - Add policies for authenticated users to manage their webhooks
*/

CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  event_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own webhooks"
  ON webhooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks"
  ON webhooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks"
  ON webhooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
/*
  # Create SEO Audits Table

  1. New Tables
    - `seo_audits`
      - `id` (uuid, primary key) - Unique identifier for each audit
      - `url` (text) - The webpage URL that was audited
      - `target_keyword` (text) - The target keyword for SEO analysis
      - `seo_score` (integer) - Overall SEO score (0-100)
      - `audit_results` (jsonb) - Complete audit results including all metrics
      - `created_at` (timestamptz) - When the audit was performed
      - `user_id` (uuid, nullable) - Optional user ID for authenticated users
  
  2. Security
    - Enable RLS on `seo_audits` table
    - Add policy for public read access (anyone can view audits)
    - Add policy for public insert (anyone can create audits)
  
  3. Important Notes
    - The audit_results column stores the complete analysis as JSON
    - This allows for flexible storage of various SEO metrics
    - Public access is enabled since this is a tool for anyone to use
*/

CREATE TABLE IF NOT EXISTS seo_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  target_keyword text NOT NULL,
  seo_score integer DEFAULT 0,
  audit_results jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view audits"
  ON seo_audits
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create audits"
  ON seo_audits
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for faster queries by URL
CREATE INDEX IF NOT EXISTS idx_seo_audits_url ON seo_audits(url);
CREATE INDEX IF NOT EXISTS idx_seo_audits_created_at ON seo_audits(created_at DESC);
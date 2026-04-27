/*
  # Create daily_finance table

  1. New Tables
    - `daily_finance`
      - `id` (uuid, primary key, auto-generated)
      - `date` (date, unique — one row per day)
      - `total_income` (numeric)
      - `cash_income` (numeric)
      - `online_income` (numeric)
      - `cash_in_hand` (numeric)
      - `salary_expense` (numeric, default 1400)
      - `kirana` (numeric, default 1100)
      - `sabji` (numeric, default 500)
      - `disposal` (numeric, default 0)
      - `extra` (numeric, default 0)
      - `created_at` (timestamptz, auto-set)

  2. Security
    - Enable RLS on `daily_finance`
    - Authenticated users can SELECT, INSERT, UPDATE their own records
    - All authenticated users share access (single-user restaurant scenario)

  3. Notes
    - Derived fields (total_expense, total_profit, profit_percentage) are NOT stored
    - They are computed dynamically on the frontend
*/

CREATE TABLE IF NOT EXISTS daily_finance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_income numeric NOT NULL DEFAULT 0,
  cash_income numeric NOT NULL DEFAULT 0,
  online_income numeric NOT NULL DEFAULT 0,
  cash_in_hand numeric NOT NULL DEFAULT 0,
  salary_expense numeric NOT NULL DEFAULT 1400,
  kirana numeric NOT NULL DEFAULT 1100,
  sabji numeric NOT NULL DEFAULT 500,
  disposal numeric NOT NULL DEFAULT 0,
  extra numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daily_finance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read finance data"
  ON daily_finance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert finance data"
  ON daily_finance
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update finance data"
  ON daily_finance
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS daily_finance_date_idx ON daily_finance (date DESC);

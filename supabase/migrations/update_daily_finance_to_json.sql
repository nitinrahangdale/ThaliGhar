/*
  # Update daily_finance table to store data as JSON

  1. Table Changes
    - Replace individual columns with single `data` JSONB column
    - Keep `id`, `date`, and `created_at` as regular columns
    - Drop unique constraint on date to allow updates

  2. JSON Structure
    {
      "income": {
        "cash_income": number,
        "online_income": number,
        "total_income": number,
        "cash_in_hand": number
      },
      "expenses": [
        {"category": string, "amount": number | null, "payment_mode": "cash" | "online" | null}
      ],
      "total_profit": number
    }
*/

-- Drop old table and recreate with new schema
DROP TABLE IF EXISTS daily_finance CASCADE;

CREATE TABLE daily_finance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Create indexes for better performance
CREATE INDEX idx_daily_finance_date ON daily_finance(date);
CREATE INDEX idx_daily_finance_created_at ON daily_finance(created_at);
CREATE INDEX idx_daily_finance_data_gin ON daily_finance USING gin(data);

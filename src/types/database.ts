export interface Database {
  public: {
    Tables: {
      daily_finance: {
        Row: DailyFinanceRow;
        Insert: DailyFinanceInsert;
        Update: DailyFinanceUpdate;
      };
    };
  };
}

export type ExpenseCategory =
  | "salary_expense"
  | "kirana"
  | "sabji"
  | "disposal"
  | "papad"
  | "waterbottle"
  | "cylinder"
  | "extra";

export const EXPENSE_CATEGORIES: Array<{
  key: ExpenseCategory;
  label: string;
}> = [
  { key: "salary_expense", label: "Salary" },
  { key: "kirana", label: "Kirana" },
  { key: "sabji", label: "Sabji" },
  { key: "disposal", label: "Disposal" },
  { key: "papad", label: "Papad" },
  { key: "waterbottle", label: "Water Bottle" },
  { key: "cylinder", label: "Cylinder" },
  { key: "extra", label: "Extra" },
];

export interface DailyFinanceData {
  income: {
    cash_income: number;
    online_income: number;
    total_income: number;
    cash_in_hand: number;
  };
  expenses: Array<{
    category: ExpenseCategory;
    amount: number | null;
    payment_mode: "cash" | "online" | null;
  }>;
  total_profit: number;
}

export interface DailyFinanceRow {
  id: string;
  date: string;
  data: DailyFinanceData;
  created_at: string;
  updated_at: string;
}

export type DailyFinanceInsert = Omit<
  DailyFinanceRow,
  "id" | "created_at" | "updated_at"
>;
export type DailyFinanceUpdate = Partial<DailyFinanceInsert>;

export interface DailyFinanceDerived extends DailyFinanceRow {
  total_expense: number;
  profit_percentage: number;
  total_income: number;
  cash_income: number;
  online_income: number;
  total_profit: number;
}

import { supabase } from './supabase';
import type { DailyFinanceInsert, DailyFinanceRow, DailyFinanceDerived, DailyFinanceData } from '../types/database';

export function deriveFinance(row: DailyFinanceRow): DailyFinanceDerived {
  // Ensure all values are properly converted to numbers (Supabase JSONB may return strings)
  const income = {
    cash_income: Number(row.data.income.cash_income) || 0,
    online_income: Number(row.data.income.online_income) || 0,
    total_income: Number(row.data.income.total_income) || 0,
    cash_in_hand: Number(row.data.income.cash_in_hand) || 0,
  };

  const expenses = row.data.expenses.map(exp => ({
    ...exp,
    amount: exp.amount ? Number(exp.amount) : null,
  }));

  const total_expense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const total_profit = Number(row.data.total_profit) || 0;
  const profit_percentage =
    income.total_income > 0 
      ? (total_profit / income.total_income) * 100 
      : 0;
  
  return { 
    ...row,
    data: {
      ...row.data,
      income,
      expenses,
      total_profit,
    },
    total_expense, 
    profit_percentage 
  };
}

// Database operations for Daily Finance
export const financeOps = {
  async getFinanceRecords(month?: string) {
    let query = supabase
      .from('daily_finance')
      .select('*')
      .order('date', { ascending: true });

    if (month) {
      const start = `${month}-01`;
      const [year, m] = month.split('-').map(Number);
      const end = new Date(year, m, 0).toISOString().split('T')[0];
      query = query.gte('date', start).lte('date', end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as DailyFinanceRow[]).map(deriveFinance);
  },

  async getFinanceByDate(date: string) {
    const { data, error } = await supabase
      .from('daily_finance')
      .select('*')
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return data ? deriveFinance(data as DailyFinanceRow) : null;
  },

  async upsertFinance(payload: DailyFinanceInsert) {
    const { data, error } = await supabase
      .from('daily_finance')
      .upsert(payload as any, { onConflict: 'date' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};



import type { DailyFinanceDerived, DailyFinanceData } from '../types/database';

/**
 * Chart Data Processors
 * Extract and transform JSON data for different chart types
 */

// Income Pie Chart - Cash vs Online
export function getIncomeDistribution(records: DailyFinanceDerived[]) {
  const totalCash = records.reduce((sum, r) => sum + r.data.income.cash_income, 0);
  const totalOnline = records.reduce((sum, r) => sum + r.data.income.online_income, 0);

  return [
    { name: 'Cash', value: totalCash },
    { name: 'Online', value: totalOnline },
  ];
}

// Expense Breakdown by Category
export function getExpenseByCategory(records: DailyFinanceDerived[]) {
  const categoryTotals: Record<string, number> = {
    salary_expense: 0,
    kirana: 0,
    sabji: 0,
    disposal: 0,
    extra: 0,
  };

  records.forEach((record) => {
    record.data.expenses.forEach((exp) => {
      if (exp.amount) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });
  });

  return [
    { category: 'Salary', value: categoryTotals.salary_expense },
    { category: 'Kirana', value: categoryTotals.kirana },
    { category: 'Sabji', value: categoryTotals.sabji },
    { category: 'Disposal', value: categoryTotals.disposal },
    { category: 'Extra', value: categoryTotals.extra },
  ].filter((item) => item.value > 0);
}

// Expense by Payment Mode (Cash vs Online)
export function getExpenseByMode(records: DailyFinanceDerived[]) {
  const modeTotal = {
    cash: 0,
    online: 0,
  };

  records.forEach((record) => {
    record.data.expenses.forEach((exp) => {
      if (exp.amount && exp.payment_mode) {
        modeTotal[exp.payment_mode] = (modeTotal[exp.payment_mode] || 0) + exp.amount;
      }
    });
  });

  return [
    { name: 'Cash Expense', value: modeTotal.cash },
    { name: 'Online Expense', value: modeTotal.online },
  ];
}

// Daily Profit Trend - Data for Stacked Bar Chart
export function getDailyProfitTrend(records: DailyFinanceDerived[]) {
  return records.map((record) => ({
    date: record.date,
    income: record.data.income.total_income,
    expenses: record.total_expense,
    profit: record.data.total_profit,
    cashIncome: record.data.income.cash_income,
    onlineIncome: record.data.income.online_income,
  }));
}

// Cash vs Online Profit Trend
export function getCashVsOnlineProfitTrend(records: DailyFinanceDerived[]) {
  return records.map((record) => {
    const expenseByMode = {
      cashExpense: 0,
      onlineExpense: 0,
    };

    record.data.expenses.forEach((exp) => {
      if (exp.amount && exp.payment_mode === 'cash') {
        expenseByMode.cashExpense += exp.amount;
      } else if (exp.amount && exp.payment_mode === 'online') {
        expenseByMode.onlineExpense += exp.amount;
      }
    });

    return {
      date: record.date,
      cashProfit: record.data.income.cash_income - expenseByMode.cashExpense,
      onlineProfit: record.data.income.online_income - expenseByMode.onlineExpense,
    };
  });
}

// Finance Table Data
export function getFinanceTableData(records: DailyFinanceDerived[]) {
  return records.map((record) => ({
    date: record.date,
    cashIncome: record.data.income.cash_income,
    onlineIncome: record.data.income.online_income,
    totalIncome: record.data.income.total_income,
    totalExpense: record.total_expense,
    profit: record.data.total_profit,
    profitPercentage: record.profit_percentage,
  }));
}

// KPI Summary
export function getKPISummary(records: DailyFinanceDerived[]) {
  const totalIncome = records.reduce((sum, r) => sum + r.data.income.total_income, 0);
  const totalExpense = records.reduce((sum, r) => sum + r.total_expense, 0);
  const totalProfit = totalIncome - totalExpense;
  const avgProfit = records.length > 0 ? totalProfit / records.length : 0;
  const avgProfitMargin = totalIncome > 0 ? (totalProfit / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpense,
    totalProfit,
    avgProfit,
    avgProfitMargin,
    recordCount: records.length,
  };
}

import type { DailyFinanceDerived } from '../../types/database';
import { EXPENSE_CATEGORIES } from '../../types/database';

interface Props {
  data: DailyFinanceDerived[];
}

interface ExpenseDetail {
  category: string;
  label: string;
  amount: number;
  paymentMode: 'cash' | 'online' | null;
}

export default function ExpensePieChart({ data }: Props) {
  // Aggregate expenses by category with payment mode
  const categoryDetails: Record<string, ExpenseDetail> = {};

  EXPENSE_CATEGORIES.forEach((cat) => {
    categoryDetails[cat.key] = {
      category: cat.key,
      label: cat.label,
      amount: 0,
      paymentMode: null,
    };
  });

  // Aggregate expenses from all records
  data.forEach((record) => {
    record.data.expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      if (amount > 0) {
        if (!categoryDetails[exp.category]) {
          categoryDetails[exp.category] = {
            category: exp.category,
            label: exp.category,
            amount: 0,
            paymentMode: null,
          };
        }
        categoryDetails[exp.category].amount += amount;
        // Use the payment mode from the latest entry for this category
        if (exp.payment_mode) {
          categoryDetails[exp.category].paymentMode = exp.payment_mode;
        }
      }
    });
  });

  const expenses = Object.values(categoryDetails).filter((d) => d.amount > 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getPaymentBadge = (mode: 'cash' | 'online' | null) => {
    if (mode === 'cash') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-500/20 text-teal-300 text-xs font-medium rounded-full border border-teal-500/30">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          Cash
        </span>
      );
    }
    if (mode === 'online') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          Online
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-400 text-xs font-medium rounded-full border border-slate-600/50">
        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
        Not done yet
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Expense Breakdown</h3>
        <p className="text-slate-400 text-xs mt-0.5">MTD spend by category with payment method</p>
      </div>
      {expenses.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">No expense data</div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto">
          {expenses.map((exp) => {
            const percentage = totalExpense > 0 ? (exp.amount / totalExpense) * 100 : 0;
            return (
              <div key={exp.category} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-medium">{exp.label}</p>
                    <p className="text-slate-500 text-xs">₹{exp.amount.toLocaleString('en-IN')} ({percentage.toFixed(1)}%)</p>
                  </div>
                  <div className="ml-3">
                    {getPaymentBadge(exp.paymentMode)}
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      exp.paymentMode === 'cash'
                        ? 'bg-teal-500'
                        : exp.paymentMode === 'online'
                          ? 'bg-blue-500'
                          : 'bg-slate-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-slate-700/50 mt-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-xs font-medium">TOTAL EXPENSES</p>
              <p className="text-amber-400 font-semibold text-sm">₹{totalExpense.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

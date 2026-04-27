import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Percent, Loader2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import KPICard from '../components/dashboard/KPICard';
import DailyIncomeChart from '../components/dashboard/DailyIncomeChart';
import IncomeSplitChart from '../components/dashboard/IncomeSplitChart';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import ProfitTrendChart from '../components/dashboard/ProfitTrendChart';
import FinanceTable from '../components/dashboard/FinanceTable';
import { financeOps } from '../lib/queries';

export default function Dashboard() {
  const { selectedMonth } = useAppStore();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const records = await financeOps.getFinanceRecords(selectedMonth);
        setData(records);
      } catch (err) {
        console.error('Error loading finance records:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedMonth]);

  const mtdIncome = data.reduce((s, r) => s + (Number(r.data.income.total_income) || 0), 0);
  const mtdExpense = data.reduce((s, r) => s + (Number(r.total_expense) || 0), 0);
  const mtdProfit = mtdIncome - mtdExpense;
  const mtdProfitPct = mtdIncome > 0 ? (mtdProfit / mtdIncome) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-rose-400">Failed to load data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mtdProfit < 0 && data.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-rose-300 text-sm font-medium">
            Month-to-date profit is negative (₹{Math.abs(mtdProfit).toLocaleString('en-IN')}). Review expenses.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Income (MTD)" value={mtdIncome}
          icon={DollarSign}
          subtitle={`${data.length} days recorded`}
        />
        <KPICard
          title="Total Expenses (MTD)" value={mtdExpense}
          icon={TrendingDown}
          subtitle="All categories combined"
        />
        <KPICard
          title="Net Profit (MTD)" value={mtdProfit}
          icon={TrendingUp}
          trend={mtdProfit >= 0 ? 'up' : 'down'}
          highlight={mtdProfit >= 0}
        />
        <KPICard
          title="Profit Margin" value={mtdProfitPct}
          icon={Percent}
          format="percent"
          subtitle="Of total income"
        />
      </div>

      {data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DailyIncomeChart data={data} />
            <IncomeSplitChart data={data} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProfitTrendChart data={data} />
            <ExpensePieChart data={data} />
          </div>
        </>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No data for this month</h3>
          <p className="text-slate-400 text-sm mb-4">Start by adding your daily finance entries to see insights and analytics.</p>
        </div>
      )}
    </div>
  );
}

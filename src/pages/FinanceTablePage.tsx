import { useEffect, useState } from 'react';
import { IndianRupee, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppStore } from '../lib/store';
import FinanceTable from '../components/dashboard/FinanceTable';
import { financeOps } from '../lib/queries';

export default function FinanceTablePage() {
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

  const totalIncome = data.reduce((s, r) => s + (Number(r.data.income.total_income) || 0), 0);
  const totalExpense = data.reduce((s, r) => s + (Number(r.total_expense) || 0), 0);
  const totalProfit = totalIncome - totalExpense;

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
        <p className="text-rose-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.length > 0 ? (
        <FinanceTable data={data} />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <IndianRupee className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No data for this month</h3>
          <p className="text-slate-400 text-sm">Start by adding your daily finance entries to see your finance table.</p>
        </div>
      )}
    </div>
  );
}

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DailyFinanceDerived } from '../../types/database';
import { EXPENSE_CATEGORIES } from '../../types/database';

interface Props {
  data: DailyFinanceDerived[];
}

const COLORS = ['#14b8a6', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f87171'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{name}</p>
      <p className="text-white font-semibold">₹{value?.toLocaleString('en-IN')}</p>
    </div>
  );
};

export default function ExpensePieChart({ data }: Props) {
  const categoryTotals: Record<string, number> = Object.fromEntries(
    EXPENSE_CATEGORIES.map((cat) => [cat.key, 0])
  );

  // Aggregate expenses from all records
  data.forEach((record) => {
    record.data.expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      if (amount > 0) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amount;
      }
    });
  });

  const totals = EXPENSE_CATEGORIES.map(({ key, label }) => ({
    name: label,
    value: categoryTotals[key],
  })).filter((d) => d.value > 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Expense Breakdown</h3>
        <p className="text-slate-400 text-xs mt-0.5">MTD spend by category</p>
      </div>
      {totals.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No expense data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={totals} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value" labelLine={false} label={renderCustomLabel}
            >
              {totals.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }}
              formatter={(val) => <span style={{ color: '#94a3b8' }}>{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

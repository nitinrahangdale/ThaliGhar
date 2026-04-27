import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { DailyFinanceDerived } from "../../types/database";

interface Props {
  data: DailyFinanceDerived[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      <p className="text-teal-400 font-semibold">
        ₹{payload[0]?.value?.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function DailyIncomeChart({ data }: Props) {
  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      income: Number(r.data.income.total_income) || 0,
    }));

  const avg = data.length
    ? data.reduce((s, r) => s + (Number(r.data.income.total_income) || 0), 0) /
      data.length
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Daily Income</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Revenue trend over the month
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs">Avg / day</p>
          <p className="text-teal-400 font-semibold text-sm">
            ₹{avg.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          {avg > 0 && (
            <ReferenceLine
              y={avg}
              stroke="#14b8a6"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
          )}
          <Line
            type="monotone"
            dataKey="income"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={{ fill: "#14b8a6", r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: "#14b8a6",
              strokeWidth: 2,
              stroke: "#0f172a",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

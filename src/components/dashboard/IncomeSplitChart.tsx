import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
      {payload.map((p: any) => (
        <p
          key={p.name}
          style={{ color: p.fill }}
          className="font-medium text-sm"
        >
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

export default function IncomeSplitChart({ data }: Props) {
  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      Cash: Number(r.data.income.cash_income) || 0,
      Online: Number(r.data.income.online_income) || 0,
    }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Income Split</h3>
        <p className="text-slate-400 text-xs mt-0.5">Cash vs Online per day</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          barSize={8}
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
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 8 }}
            formatter={(val) => <span style={{ color: "#94a3b8" }}>{val}</span>}
          />
          <Bar
            dataKey="Cash"
            fill="#14b8a6"
            stackId="a"
            radius={[0, 0, 3, 3]}
          />
          <Bar
            dataKey="Online"
            fill="#6366f1"
            stackId="a"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

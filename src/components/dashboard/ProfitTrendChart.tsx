import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      <p
        className={`font-semibold ${val < 0 ? "text-rose-400" : "text-emerald-400"}`}
      >
        ₹{val?.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function ProfitTrendChart({ data }: Props) {
  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      profit: Number(r.data.total_profit) || 0,
    }));

  const hasNegative = chartData.some((d) => d.profit < 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Profit Trend</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Daily net profit / loss
          </p>
        </div>
        {hasNegative && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-500/20 text-rose-400">
            Loss days detected
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
        >
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#profitGradient)"
            dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: "#10b981",
              strokeWidth: 2,
              stroke: "#0f172a",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  Pencil as Edit2,
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
} from "lucide-react";
import type { DailyFinanceDerived } from "../../types/database";
import { useAppStore } from "../../lib/store";

interface Props {
  data: DailyFinanceDerived[];
}

const fmt = (v: number) =>
  `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtPct = (v: number) => `${v.toFixed(1)}%`;

// Mobile Card Row Component
function MobileCardRow({ r, isBest, isWorst }: any) {
  const { setPage, setEditDate } = useAppStore();
  return (
    <div
      className={`rounded-xl border p-4 space-y-3 ${
        isBest
          ? "bg-amber-500/5 border-amber-500/30"
          : isWorst
            ? "bg-rose-500/5 border-rose-500/30"
            : "bg-slate-800 border-slate-700"
      }`}
    >
      {/* Date Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          {isBest && <Star className="w-3 h-3 text-amber-400 shrink-0" />}
          {isWorst && (
            <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
          )}
          <span className="text-white font-semibold">
            {new Date(r.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          </span>
        </div>
        <button
          onClick={() => {
            setEditDate(r.date);
            setPage("entry");
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Income Section */}
      <div className="space-y-2">
        <p className="text-slate-400 text-xs font-medium uppercase">Income</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-slate-500 text-xs">Total</p>
            <p className="text-white font-semibold">{fmt(r.total_income)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Cash / Online</p>
            <p className="text-teal-400 text-sm font-medium">
              {fmt(r.cash_income)} / {fmt(r.online_income)}
            </p>
          </div>
        </div>
      </div>

      {/* Expense & Profit Section */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-slate-500 text-xs">Cash In Hand</p>
          <p className="text-purple-400 font-semibold">{fmt(r.cash_in_hand)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Expenses</p>
          <p className="text-amber-400 font-semibold">{fmt(r.total_expense)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Profit</p>
          <span
            className={`flex items-center gap-1 font-semibold ${r.total_profit < 0 ? "text-rose-400" : "text-emerald-400"}`}
          >
            {r.total_profit < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            {fmt(r.total_profit)}
          </span>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="flex items-center gap-2 pt-2">
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${r.profit_percentage < 0 ? "bg-rose-500" : "bg-emerald-500"}`}
            style={{
              width: `${Math.min(Math.abs(r.profit_percentage), 100)}%`,
            }}
          />
        </div>
        <span
          className={`text-xs font-medium ${r.profit_percentage < 0 ? "text-rose-400" : "text-emerald-400"}`}
        >
          {fmtPct(r.profit_percentage)}
        </span>
      </div>
    </div>
  );
}

export default function FinanceTable({ data }: Props) {
  const { setPage, setEditDate } = useAppStore();

  if (!data.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <p className="text-slate-400">No entries for this month yet.</p>
        <button
          onClick={() => setPage("entry")}
          className="mt-3 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
        >
          Add your first entry
        </button>
      </div>
    );
  }

  // 🔥 Sort data by date (latest first)
  const sorted = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // ✅ Normalize data (FLAT structure for UI)
  const normalized = sorted.map((r) => ({
    ...r,
    total_income: r.data.income.total_income || 0,
    cash_income: r.data.income.cash_income || 0,
    online_income: r.data.income.online_income || 0,
    cash_in_hand: r.data.income.cash_in_hand || 0,
    total_profit: r.data.total_profit || 0,
  }));

  // 🔥 Best & Worst day calculation
  const maxProfit = Math.max(...normalized.map((r) => r.total_profit));
  const minProfit = Math.min(...normalized.map((r) => r.total_profit));

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Daily Entries</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {data.length} records this month
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400" /> Best day
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" /> Worst day
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  "Date",
                  "Income",
                  "Cash",
                  "Online",
                  "Cash In Hand",
                  "Expenses",
                  "Profit",
                  "Margin",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-slate-400 font-medium text-xs whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {normalized.map((r) => {
                const isBest = r.total_profit === maxProfit && maxProfit > 0;
                const isWorst = r.total_profit === minProfit && minProfit < 0;

                return (
                  <tr
                    key={r.id}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors ${
                      isBest ? "bg-amber-500/5" : isWorst ? "bg-rose-500/5" : ""
                    }`}
                  >
                    {/* DATE */}
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap font-medium">
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <Star className="w-3 h-3 text-amber-400 shrink-0" />
                        )}
                        {isWorst && (
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        )}
                        {new Date(r.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* INCOME */}
                    <td className="px-4 py-3 text-white font-semibold">
                      {fmt(r.total_income)}
                    </td>

                    {/* CASH */}
                    <td className="px-4 py-3 text-teal-400">
                      {fmt(r.cash_income)}
                    </td>

                    {/* ONLINE */}
                    <td className="px-4 py-3 text-blue-400">
                      {fmt(r.online_income)}
                    </td>

                    {/* CASH IN HAND */}
                    <td className="px-4 py-3 text-purple-400">
                      {fmt(r.cash_in_hand)}
                    </td>

                    {/* EXPENSE */}
                    <td className="px-4 py-3 text-amber-400">
                      {fmt(r.total_expense)}
                    </td>

                    {/* PROFIT */}
                    <td className="px-4 py-3">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          r.total_profit < 0
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {r.total_profit < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        {fmt(r.total_profit)}
                      </span>
                    </td>

                    {/* MARGIN */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              r.profit_percentage < 0
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(Math.abs(r.profit_percentage), 100)}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs ${
                            r.profit_percentage < 0
                              ? "text-rose-400"
                              : "text-slate-300"
                          }`}
                        >
                          {fmtPct(r.profit_percentage)}
                        </span>
                      </div>
                    </td>

                    {/* EDIT */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setEditDate(r.date);
                          setPage("entry");
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-white font-semibold">Daily Entries</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {data.length} records this month
            </p>
          </div>
        </div>
        {normalized.map((r) => {
          const isBest = r.total_profit === maxProfit && maxProfit > 0;
          const isWorst = r.total_profit === minProfit && minProfit < 0;
          return (
            <MobileCardRow key={r.id} r={r} isBest={isBest} isWorst={isWorst} />
          );
        })}
      </div>
    </>
  );
}

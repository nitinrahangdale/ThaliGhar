import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Save,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { financeOps } from "../lib/queries";
import { useAppStore } from "../lib/store";
import type { DailyFinanceInsert, DailyFinanceData, ExpenseCategory } from "../types/database";
import { EXPENSE_CATEGORIES } from "../types/database";

type ExpenseFormValues = {
  category: ExpenseCategory;
  amount: number | null;
  payment_mode: "cash" | "online" | null;
};

type FormValues = {
  date: string;
  cash_income: number;
  online_income: number;
  total_income: number;
  cash_in_hand: number;
  expenses: ExpenseFormValues[];
};

function Field({
  label,
  name,
  register,
  error,
  type = "number",
  readOnly = false,
  hint,
}: {
  label: string;
  name: string;
  register: any;
  error?: string;
  type?: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-slate-300 text-xs font-medium mb-1">
        {label}
        {hint && (
          <span className="text-slate-500 font-normal ml-1 text-xs">
            ({hint})
          </span>
        )}
      </label>
      <input
        {...register}
        type={type}
        readOnly={readOnly}
        className={`w-full bg-slate-800 border rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
          error
            ? "border-rose-500/60 focus:ring-rose-500/30"
            : readOnly
              ? "border-slate-700 opacity-60 cursor-default"
              : "border-slate-700 focus:border-teal-500 focus:ring-teal-500/20"
        }`}
      />
      {error && (
        <p className="text-rose-400 text-xs mt-0.5 flex items-center gap-1">
          <AlertCircle className="w-2 h-2" />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  register,
  error,
  options,
}: {
  label: string;
  name: string;
  register: any;
  error?: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label className="block text-slate-300 text-xs font-medium mb-1">
        {label}
      </label>
      <select
        {...register}
        className={`w-full bg-slate-800 border rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 transition-all text-sm ${
          error
            ? "border-rose-500/60 focus:ring-rose-500/30"
            : "border-slate-700 focus:border-teal-500 focus:ring-teal-500/20"
        }`}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-rose-400 text-xs mt-0.5 flex items-center gap-1">
          <AlertCircle className="w-2 h-2" />
          {error}
        </p>
      )}
    </div>
  );
}

const today = new Date().toISOString().split("T")[0];

const expenseCategories: ExpenseFormValues[] = EXPENSE_CATEGORIES.map((cat) => ({
  category: cat.key,
  amount: ["salary_expense", "kirana", "sabji"].includes(cat.key) 
    ? (cat.key === "salary_expense" ? 0 : cat.key === "kirana" ? 0 : 0)
    : null,
  payment_mode: null,
}));

const categoryLabels = Object.fromEntries(EXPENSE_CATEGORIES.map((cat) => [cat.key, cat.label]));

const defaults: FormValues = {
  date: today,
  cash_income: 0,
  online_income: 0,
  total_income: 0,
  cash_in_hand: 0,
  expenses: expenseCategories,
};

export default function EntryPage() {
  const { editDate, setEditDate, setPage } = useAppStore();
  const { selectedMonth } = useAppStore();
  const targetDate = editDate ?? today;

  const [existing, setExisting] = useState<any>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: defaults });

  const cashIncome = watch("cash_income");
  const onlineIncome = watch("online_income");
  const expenses = watch("expenses");

  // Update total income when cash or online income changes
  useEffect(() => {
    const cash = Number(cashIncome) || 0;
    const online = Number(onlineIncome) || 0;
    const total = cash + online;
    if (total > 0) {
      setValue("total_income", total, { shouldValidate: false });
    }
  }, [cashIncome, onlineIncome, setValue]);

  // Load existing data when target date changes
  useEffect(() => {
    const loadData = async () => {
      setLoadingExisting(true);
      try {
        const data = await financeOps.getFinanceByDate(targetDate);
        setExisting(data);
        if (data) {
          reset({
            date: data.date,
            cash_income: data.data.income.cash_income,
            online_income: data.data.income.online_income,
            total_income: data.data.income.total_income,
            cash_in_hand: data.data.income.cash_in_hand,
            expenses: data.data.expenses,
          });
        } else {
          reset({ ...defaults, date: targetDate });
        }
      } catch (err) {
        console.error("Error loading finance data:", err);
        reset({ ...defaults, date: targetDate });
      } finally {
        setLoadingExisting(false);
      }
    };
    loadData();
  }, [targetDate, reset]);

  const onSubmit = async (values: FormValues, nextDay = false) => {
    setIsPending(true);
    try {
      const cashInc = Number(values.cash_income) || 0;
      const onlineInc = Number(values.online_income) || 0;
      const totalInc = Number(values.total_income) || 0;

      const totalExp = values.expenses.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0,
      );
      const totalProfit = totalInc - totalExp;

      const payload: DailyFinanceInsert = {
        date: values.date,
        data: {
          income: {
            cash_income: cashInc,
            online_income: onlineInc,
            total_income: totalInc,
            cash_in_hand: Number(values.cash_in_hand) || 0,
          },
          expenses: values.expenses.map((exp) => ({
            category: exp.category,
            amount: exp.amount ? Number(exp.amount) : null,
            payment_mode: exp.payment_mode,
          })),
          total_profit: totalProfit,
        } as DailyFinanceData,
      };

      await financeOps.upsertFinance(payload);
      setIsSuccess(true);

      // Reset form for new entry after save
      if (!nextDay) {
        setEditDate(null);
        reset({ ...defaults, date: today });
      }

      setTimeout(() => setIsSuccess(false), 3000);

      if (nextDay) {
        const next = new Date(values.date);
        next.setDate(next.getDate() + 1);
        const nextStr = next.toISOString().split("T")[0];
        setEditDate(nextStr);
        reset({ ...defaults, date: nextStr });
      }
    } catch (err) {
      console.error("Error saving finance data:", err);
      alert("Error saving data. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const totalExpense = expenses.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0,
  );
  const totalIncome = Number(watch("total_income")) || 0;
  const profit = totalIncome - totalExpense;

  if (loadingExisting) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-6">
          {editDate && (
            <button
              onClick={() => {
                setEditDate(null);
                setPage("dashboard");
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <h2 className="text-white text-xl font-bold">
              {existing ? "Edit Entry" : "New Daily Entry"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {existing
                ? `Editing record for ${new Date(targetDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`
                : "(Record today's financial data)"}
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-emerald-300 text-sm">
              Entry saved successfully!
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="ml-auto text-emerald-400/60 hover:text-emerald-400 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit((v) => onSubmit(v))} className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <Field
              label="Date"
              name="date"
              type="date"
              register={register("date", { required: "Date is required" })}
              error={errors.date?.message}
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Income
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <Field
                  label="Cash Income"
                  name="cash_income"
                  register={register("cash_income")}
                />
                <Field
                  label="Online Income"
                  name="online_income"
                  register={register("online_income")}
                />
                <Field
                  label="Total Income"
                  name="total_income"
                  hint="auto"
                  register={register("total_income")}
                  readOnly
                />
                <Field
                  label="Cash in Hand"
                  name="cash_in_hand"
                  register={register("cash_in_hand")}
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Expenses
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {expenses.map((expense, idx) => (
                  <div key={idx} className="pb-3 last:pb-0">
                    <div className="flex items-center gap-1 justify-between">
                      <Field
                        label={
                          categoryLabels[expense.category] || expense.category
                        }
                        name={`expenses.${idx}.amount`}
                        register={register(`expenses.${idx}.amount` as any)}
                      />

                      <SelectField
                        label="Mode"
                        name={`expenses.${idx}.payment_mode`}
                        register={register(
                          `expenses.${idx}.payment_mode` as any,
                        )}
                        options={[
                          { value: "cash", label: "Cash" },
                          { value: "online", label: "Online" },
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${profit < 0 ? "bg-rose-500/5 border-rose-500/30" : "bg-teal-500/5 border-teal-500/20"}`}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-slate-400 text-xs mb-1">Total Expenses</p>
                <p className="text-amber-400 font-bold text-lg">
                  ₹{totalExpense.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Total Income</p>
                <p className="text-white font-bold text-lg">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Net Profit</p>
                <p
                  className={`font-bold text-lg ${profit < 0 ? "text-rose-400" : "text-emerald-400"}`}
                >
                  ₹{profit.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Entry
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit((v) => onSubmit(v, true))}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-medium py-3 px-5 rounded-xl transition-all border border-slate-700"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">Save & Next Day</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

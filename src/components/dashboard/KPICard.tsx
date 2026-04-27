import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  format?: 'currency' | 'percent';
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  highlight?: boolean;
}

const formatValue = (value: number, format: 'currency' | 'percent' = 'currency') => {
  if (format === 'percent') return `${value.toFixed(1)}%`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
};

export default function KPICard({ title, value, icon: Icon, format = 'currency', trend, subtitle, highlight }: KPICardProps) {
  const isNegative = value < 0;
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
      highlight
        ? 'bg-gradient-to-br from-teal-500/20 to-teal-600/10 border-teal-500/30'
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          highlight ? 'bg-teal-500/30' : 'bg-slate-800'
        }`}>
          <Icon className={`w-5 h-5 ${highlight ? 'text-teal-400' : 'text-slate-400'}`} />
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <TrendIcon className="w-3 h-3" />
            {trend === 'up' ? 'Profit' : 'Loss'}
          </div>
        )}
      </div>

      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <p className={`text-2xl font-bold tracking-tight ${
        isNegative ? 'text-rose-400' : highlight ? 'text-teal-300' : 'text-white'
      }`}>
        {formatValue(value, format)}
      </p>
      {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}

      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
        highlight ? 'bg-gradient-to-r from-teal-500 to-teal-300' : 'bg-slate-800'
      }`} />
    </div>
  );
}

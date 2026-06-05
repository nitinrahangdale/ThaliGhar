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
    <div className={`relative overflow-hidden rounded-xl border p-3 transition-all hover:scale-[1.02] ${
      highlight
        ? 'bg-gradient-to-br from-teal-500/20 to-teal-600/10 border-teal-500/30'
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-center justify-between gap-3">
        {/* Left Column: Icon & Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              highlight ? 'bg-teal-500/30' : 'bg-slate-800'
            }`}>
              <Icon className={`w-4 h-4 ${highlight ? 'text-teal-400' : 'text-slate-400'}`} />
            </div>
            {trend && trend !== 'neutral' && (
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                <TrendIcon className="w-2.5 h-2.5" />
                {trend === 'up' ? 'Profit' : 'Loss'}
              </div>
            )}
          </div>
          <p className="text-slate-400 text-xs font-medium leading-tight">{title}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5 leading-tight">{subtitle}</p>}
        </div>

        {/* Right Column: Value */}
        <div className="text-right shrink-0">
          <p className={`text-xl font-bold tracking-tight ${
            isNegative ? 'text-rose-400' : highlight ? 'text-teal-300' : 'text-white'
          }`}>
            {formatValue(value, format)}
          </p>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
        highlight ? 'bg-gradient-to-r from-teal-500 to-teal-300' : 'bg-slate-800'
      }`} />
    </div>
  );
}

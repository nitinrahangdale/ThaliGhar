import { ChefHat, LayoutDashboard, PlusCircle, Calendar, Table2 } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export default function Header() {
  const { page, setPage, selectedMonth, setSelectedMonth } = useAppStore();

  // All months
  const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];

  // Parse current selected month
  const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);

  const handleMonthChange = (year: number, monthNum: number) => {
    const formattedMonth = `${year}-${String(monthNum).padStart(2, '0')}`;
    setSelectedMonth(formattedMonth);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm sm:text-base leading-none">Kamdhenu Thali Kitchen</h1>
              <p className="text-slate-400 text-xs mt-0.5 hidden sm:block">Finance Dashboard</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => setPage('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === 'dashboard'
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => { setPage('entry'); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === 'entry'
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Entry</span>
            </button>
            <button
              onClick={() => setPage('finance')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === 'finance'
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span className="hidden sm:inline">Finance</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 hidden sm:block" />
     
            <select
              value={selectedMonthNum}
              onChange={(e) => handleMonthChange(selectedYear, Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {months.map((m) => (
                <option key={m.num} value={m.num}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

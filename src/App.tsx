import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import EntryPage from './pages/Entrypage';
import FinanceTablePage from './pages/FinanceTablePage';
import { useAppStore } from './lib/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
});

function AppContent() {
  const { page } = useAppStore();
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {page === 'dashboard' && <Dashboard />}
        {page === 'entry' && <EntryPage />}
        {page === 'finance' && <FinanceTablePage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

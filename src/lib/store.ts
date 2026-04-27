import { create } from 'zustand';

type Page = 'dashboard' | 'entry' | 'finance';

interface AppStore {
  page: Page;
  editDate: string | null;
  selectedMonth: string;
  setPage: (page: Page) => void;
  setEditDate: (date: string | null) => void;
  setSelectedMonth: (month: string) => void;
}

const currentMonth = new Date().toISOString().slice(0, 7);

export const useAppStore = create<AppStore>((set) => ({
  page: 'dashboard',
  editDate: null,
  selectedMonth: currentMonth,
  setPage: (page) => set({ page }),
  setEditDate: (date) => set({ editDate: date }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));

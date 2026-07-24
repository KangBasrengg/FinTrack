import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const translations = {
  en: {
    // Settings
    Settings: 'Settings',
    Customize: 'Customize your FinTrack experience.',
    SaveChanges: 'Save Changes',
    Saved: 'Saved!',
    Appearance: 'Appearance',
    AppearanceDesc: 'Choose how the app looks.',
    DarkMode: 'Dark Mode',
    DarkModeDesc: 'Enable dark theme for the entire app.',
    Notifications: 'Notifications',
    NotificationsDesc: 'Manage what alerts you receive.',
    EmailNotif: 'Email Notifications',
    EmailNotifDesc: 'Receive weekly financial summaries via email.',
    PushNotif: 'Push Notifications',
    PushNotifDesc: 'Get notified when a bill is due.',
    Localization: 'Localization',
    LocalizationDesc: 'Set your region and currency.',
    Currency: 'Currency',
    Language: 'Language',
    // Sidebar
    Dashboard: 'Dashboard',
    Transactions: 'Transactions',
    Wallets: 'Wallets',
    Categories: 'Categories',
    Bills: 'Bills & Paylater',
    AdminConsole: 'Admin Console',
    SupportChat: 'Support Chat',
    Menu: 'Menu',
    Logout: 'Logout',
    // Header
    SearchTransactions: 'Search transactions...',
    MyProfile: 'My Profile',
    Billing: 'Billing',
    FreeUser: 'Free User',
    PremiumUser: 'Premium User',
    SuperAdmin: 'Super Admin',
    NoNotifications: 'No new notifications',
    OpenSupportChat: 'Open Support Chat',
    // Pages
    DashboardOverview: 'Dashboard Overview',
    DashboardDesc: "Welcome back! Here's your financial summary this week.",
    TotalBalance: 'Total Balance',
    TotalIncome: 'Total Income',
    TotalOutcome: 'Total Outcome',
    CashflowTrend: 'Cashflow Trend',
    ExpenseBreakdown: 'Expense Breakdown',
    AddTransaction: 'Add Transaction',
    TransactionsTitle: 'Transactions',
    TransactionsDesc: 'Manage and view all your income and expenses.',
    AllTransactions: 'All Transactions',
    SearchDescription: 'Search description...',
    Date: 'DATE',
    Description: 'DESCRIPTION',
    Category: 'CATEGORY',
    Wallet: 'WALLET',
    Amount: 'AMOUNT',
    NoTransactions: 'No transactions found.',
    MyWallets: 'My Wallets',
    MyWalletsDesc: 'Manage your bank accounts, e-wallets, and cash.',
    AddWallet: 'Add Wallet',
    ConnectNewWallet: 'Connect New Wallet',
    CategoriesBudgets: 'Categories & Budgets',
    CategoriesDesc: 'Organize your spending and set monthly limits.',
    AddCategory: 'Add Category',
    BillsTitle: 'Bills & Paylater',
    BillsDesc: 'Never miss a due date. Track all your upcoming bills and installments.',
    AddBill: 'Add Bill',
    UpcomingThisMonth: 'Upcoming This Month',
    TotalUnpaid: 'Total Unpaid',
    PaidThisMonth: 'Paid This Month',
    ActiveBills: 'Active Bills & Installments',
    SearchBills: 'Search bills...',
    BillName: 'BILL NAME',
    Type: 'TYPE',
    DueDate: 'DUE DATE',
    Status: 'STATUS',
    NoBills: 'No bills found.',
    BillsCount: 'Bills',
  },
  id: {
    // Settings
    Settings: 'Pengaturan',
    Customize: 'Sesuaikan pengalaman FinTrack Anda.',
    SaveChanges: 'Simpan Perubahan',
    Saved: 'Tersimpan!',
    Appearance: 'Penampilan',
    AppearanceDesc: 'Pilih tampilan aplikasi.',
    DarkMode: 'Mode Gelap',
    DarkModeDesc: 'Aktifkan tema gelap untuk seluruh aplikasi.',
    Notifications: 'Notifikasi',
    NotificationsDesc: 'Atur peringatan yang Anda terima.',
    EmailNotif: 'Notifikasi Email',
    EmailNotifDesc: 'Terima ringkasan keuangan mingguan via email.',
    PushNotif: 'Notifikasi Push',
    PushNotifDesc: 'Dapatkan peringatan saat tagihan jatuh tempo.',
    Localization: 'Lokalisasi',
    LocalizationDesc: 'Atur wilayah dan mata uang Anda.',
    Currency: 'Mata Uang',
    Language: 'Bahasa',
    // Sidebar
    Dashboard: 'Dasbor',
    Transactions: 'Transaksi',
    Wallets: 'Dompet',
    Categories: 'Kategori',
    Bills: 'Tagihan & Paylater',
    AdminConsole: 'Konsol Admin',
    SupportChat: 'Chat Bantuan',
    Menu: 'Menu',
    Logout: 'Keluar',
    // Header
    SearchTransactions: 'Cari transaksi...',
    MyProfile: 'Profil Saya',
    Billing: 'Penagihan',
    FreeUser: 'Pengguna Gratis',
    PremiumUser: 'Pengguna Premium',
    SuperAdmin: 'Super Admin',
    NoNotifications: 'Tidak ada notifikasi baru',
    OpenSupportChat: 'Buka Chat Bantuan',
    // Pages
    DashboardOverview: 'Ringkasan Dasbor',
    DashboardDesc: 'Selamat datang kembali! Ini ringkasan keuangan Anda minggu ini.',
    TotalBalance: 'Total Saldo',
    TotalIncome: 'Total Pemasukan',
    TotalOutcome: 'Total Pengeluaran',
    CashflowTrend: 'Tren Arus Kas',
    ExpenseBreakdown: 'Rincian Pengeluaran',
    AddTransaction: 'Tambah Transaksi',
    TransactionsTitle: 'Transaksi',
    TransactionsDesc: 'Kelola dan lihat semua pemasukan dan pengeluaran Anda.',
    AllTransactions: 'Semua Transaksi',
    SearchDescription: 'Cari deskripsi...',
    Date: 'TANGGAL',
    Description: 'DESKRIPSI',
    Category: 'KATEGORI',
    Wallet: 'DOMPET',
    Amount: 'JUMLAH',
    NoTransactions: 'Tidak ada transaksi ditemukan.',
    MyWallets: 'Dompet Saya',
    MyWalletsDesc: 'Kelola rekening bank, e-wallet, dan uang tunai Anda.',
    AddWallet: 'Tambah Dompet',
    ConnectNewWallet: 'Hubungkan Dompet Baru',
    CategoriesBudgets: 'Kategori & Anggaran',
    CategoriesDesc: 'Atur pengeluaran dan tetapkan batas bulanan Anda.',
    AddCategory: 'Tambah Kategori',
    BillsTitle: 'Tagihan & Paylater',
    BillsDesc: 'Jangan lewatkan jatuh tempo. Pantau semua tagihan dan cicilan Anda.',
    AddBill: 'Tambah Tagihan',
    UpcomingThisMonth: 'Mendatang Bulan Ini',
    TotalUnpaid: 'Total Belum Dibayar',
    PaidThisMonth: 'Dibayar Bulan Ini',
    ActiveBills: 'Tagihan & Cicilan Aktif',
    SearchBills: 'Cari tagihan...',
    BillName: 'NAMA TAGIHAN',
    Type: 'TIPE',
    DueDate: 'JATUH TEMPO',
    Status: 'STATUS',
    NoBills: 'Tidak ada tagihan ditemukan.',
    BillsCount: 'Tagihan',
  }
};

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currency: string;
  setCurrency: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  setDarkMode: () => {},
  currency: 'IDR',
  setCurrency: () => {},
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem('fintrack_darkMode');
    return saved !== null ? saved === 'true' : true;
  });
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('fintrack_currency') || 'IDR';
  });
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('fintrack_language') || 'en';
  });

  const setDarkMode = (val: boolean) => {
    setDarkModeState(val);
    localStorage.setItem('fintrack_darkMode', String(val));
  };

  const setCurrency = (val: string) => {
    setCurrencyState(val);
    localStorage.setItem('fintrack_currency', val);
  };

  const setLanguage = (val: string) => {
    setLanguageState(val);
    localStorage.setItem('fintrack_language', val);
  };

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']] || key;
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, currency, setCurrency, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

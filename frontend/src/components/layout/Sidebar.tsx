import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Tags, 
  ArrowRightLeft, 
  LogOut,
  ShieldAlert,
  CalendarClock,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Sidebar({ isOpen = true }: SidebarProps) {
  const location = useLocation();
  const { darkMode, t } = useTheme();

  const userStr = localStorage.getItem('user');
  let isSuperAdmin = false;
  if (userStr) {
    try {
      isSuperAdmin = JSON.parse(userStr).role === 'super_admin';
    } catch (e) {}
  }

  const navItems = [
    { name: t('Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('Transactions'), path: '/dashboard/transactions', icon: ArrowRightLeft },
    { name: t('Wallets'), path: '/dashboard/wallets', icon: Wallet },
    { name: t('Categories'), path: '/dashboard/categories', icon: Tags },
    { name: t('Bills'), path: '/dashboard/bills', icon: CalendarClock },
  ];

  if (isSuperAdmin) {
    navItems.unshift({ name: t('AdminConsole'), path: '/admin', icon: ShieldAlert });
    navItems.push({ name: t('SupportChat'), path: '/dashboard/admin-chat', icon: MessageSquare });
  }

  return (
    <div className={`w-64 border-r backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      darkMode 
        ? 'bg-[#0B1120]/80 border-slate-800 text-slate-300' 
        : 'bg-white/90 border-slate-200 text-slate-700'
    }`}>
      <div className={`h-16 flex items-center px-6 border-b ${darkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className={`font-semibold text-lg tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>FinTrack</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className={`text-xs font-semibold uppercase tracking-wider mb-4 px-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {t('Menu')}
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : darkMode 
                    ? 'hover:bg-slate-800/50 hover:text-slate-100' 
                    : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className={`p-4 border-t ${darkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors ${
            darkMode 
              ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400' 
              : 'text-slate-500 hover:bg-rose-50 hover:text-rose-500'
          }`}
        >
          <LogOut size={20} />
          <span className="font-medium">{t('Logout')}</span>
        </button>
      </div>
    </div>
  );
}

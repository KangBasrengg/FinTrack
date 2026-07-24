import { useState, useEffect } from 'react';
import { Plus, CreditCard, Wallet as WalletIcon, Smartphone, Building2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function Wallets() {
  const { darkMode, t } = useTheme();
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await api.get('/wallets');
        setWallets(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bank account': return Building2;
      case 'e-wallet': return Smartphone;
      case 'credit card': return CreditCard;
      default: return WalletIcon;
    }
  };

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bank account': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'e-wallet': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'credit card': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('MyWallets')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('MyWalletsDesc')}</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 w-full md:w-auto justify-center">
          <Plus size={18} />
          {t('AddWallet')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-slate-400 py-8">Loading wallets...</div>
        ) : wallets.map((wallet) => {
          const Icon = getIcon(wallet.type);
          const colorClass = getColor(wallet.type);
          return (
            <Card key={wallet.id} className="relative overflow-hidden group cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-700/50 border border-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {wallet.type}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{wallet.name}</h3>
                  <p className={`text-2xl font-bold ${wallet.balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {wallet.balance < 0 ? '-' : ''}Rp {Math.abs(wallet.balance).toLocaleString('id-ID')}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add New Wallet Card */}
        <div className="border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-3 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20">
            <Plus size={24} />
          </div>
          <p className="font-semibold">Connect New Wallet</p>
        </div>
      </div>
    </div>
  );
}

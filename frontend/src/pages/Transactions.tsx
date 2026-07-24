import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Search, Filter } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function Transactions() {
  const { darkMode, t } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>({});
  const [walletsMap, setWalletsMap] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch categories and wallets first to create a mapping for display
      const [catRes, walRes, trxRes] = await Promise.all([
        api.get('/categories'),
        api.get('/wallets'),
        api.post('/transactions/search', { limit: 50 })
      ]);

      const cMap: Record<string, any> = {};
      catRes.data?.data?.forEach((c: any) => cMap[c.id] = c);
      setCategoriesMap(cMap);

      const wMap: Record<string, any> = {};
      walRes.data?.data?.forEach((w: any) => wMap[w.id] = w);
      setWalletsMap(wMap);

      setTransactions(trxRes.data?.data?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    try {
      await api.post('/transactions', data);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to save transaction", err);
      alert("Failed to save transaction. Please ensure all fields are correctly filled.");
    }
  };

  const filteredTransactions = transactions.filter((trx: any) => {
    if (!searchQuery) return true;
    const note = trx.note || '';
    return note.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('TransactionsTitle')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('TransactionsDesc')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          {t('AddTransaction')}
        </button>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
      />

      <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
        <CardHeader className={`border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <CardTitle className={darkMode ? 'text-white' : 'text-slate-900'}>{t('AllTransactions')}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`flex items-center px-3 py-1.5 rounded-lg border focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors ${
              darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}>
              <Search size={16} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('SearchDescription')} 
                className={`bg-transparent border-none outline-none ml-2 text-sm w-full md:w-48 ${
                  darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
            <button className={`p-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}>
              <Filter size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase border-b ${
                darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <tr>
                  <th className="px-6 py-4 font-medium">{t('Date')}</th>
                  <th className="px-6 py-4 font-medium">{t('Description')}</th>
                  <th className="px-6 py-4 font-medium">{t('Category')}</th>
                  <th className="px-6 py-4 font-medium">{t('Wallet')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('Amount')}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading transactions...</td></tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr><td colSpan={5} className={`px-6 py-12 text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('NoTransactions')}</td></tr>
                ) : (
                  filteredTransactions.map((trx: any) => {
                    const isIncome = trx.type === 'income';
                    const category = categoriesMap[trx.category_id];
                    const wallet = walletsMap[trx.wallet_id];
                    const dateObj = new Date(trx.transaction_date);
                    
                    return (
                      <tr key={trx.id} className="hover:bg-slate-700/30 transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-slate-400">
                          {dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-200">{trx.note || 'No Description'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${category?.color || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                            {category?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{wallet?.name || 'Unknown'}</td>
                        <td className={`px-6 py-4 font-semibold text-right ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isIncome ? '+' : '-'}Rp {trx.amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!loading && filteredTransactions.length > 0 && (
            <div className="p-4 border-t border-slate-700 flex justify-between items-center text-sm text-slate-400">
              <span>Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} transactions</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-colors" disabled>Prev</button>
                <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-colors" disabled>Next</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import TransactionModal from '../components/TransactionModal';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const chartData = [
  { name: 'Mon', income: 4000, outcome: 2400 },
  { name: 'Tue', income: 3000, outcome: 1398 },
  { name: 'Wed', income: 2000, outcome: 9800 },
  { name: 'Thu', income: 2780, outcome: 3908 },
  { name: 'Fri', income: 1890, outcome: 4800 },
  { name: 'Sat', income: 2390, outcome: 3800 },
  { name: 'Sun', income: 3490, outcome: 4300 },
];

export default function Dashboard() {
  const { darkMode, t } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState({ total: 0, income: 0, outcome: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>({});
  const [walletsMap, setWalletsMap] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, walRes, trxRes] = await Promise.all([
        api.get('/categories'),
        api.get('/wallets'),
        api.post('/transactions/search', { limit: 100 }) // Fetch enough for calculations
      ]);

      const cMap: Record<string, any> = {};
      catRes.data?.data?.forEach((c: any) => cMap[c.id] = c);
      setCategoriesMap(cMap);

      const wMap: Record<string, any> = {};
      let totalWalletBalance = 0;
      walRes.data?.data?.forEach((w: any) => {
        wMap[w.id] = w;
        totalWalletBalance += w.balance;
      });
      setWalletsMap(wMap);

      const trxs = trxRes.data?.data?.items || [];
      setRecentTransactions(trxs.slice(0, 5)); // show only top 5 recent

      let totalIncome = 0;
      let totalOutcome = 0;
      const expenseByCategory: Record<string, number> = {};

      trxs.forEach((t: any) => {
        if (t.type === 'income') {
          totalIncome += t.amount;
        } else {
          totalOutcome += t.amount;
          const cName = cMap[t.category_id]?.name || 'Other';
          expenseByCategory[cName] = (expenseByCategory[cName] || 0) + t.amount;
        }
      });

      setBalance({
        total: totalWalletBalance, // Or calculate dynamically based on history
        income: totalIncome,
        outcome: totalOutcome
      });

      const newPieData = Object.entries(expenseByCategory).map(([name, value], index) => {
        const colors = ['#f43f5e', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981'];
        return { name, value, color: colors[index % colors.length] };
      });
      setPieData(newPieData);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('DashboardOverview')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('DashboardDesc')}</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`col-span-1 md:col-span-1 border-emerald-500/20 bg-gradient-to-br ${darkMode ? 'from-emerald-900/40 to-[#0B1120]' : 'from-emerald-50 to-white'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{t('TotalBalance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rp {balance.total.toLocaleString('id-ID')}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-400 flex items-center font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={16} className="mr-1" /> +12.5%
              </span>
              <span className="text-slate-400 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
          <CardHeader className="pb-2">
            <CardTitle className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{t('TotalIncome')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rp {balance.income.toLocaleString('id-ID')}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/30">
                <TrendingUp size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
          <CardHeader className="pb-2">
            <CardTitle className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{t('TotalOutcome')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rp {balance.outcome.toLocaleString('id-ID')}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 border border-rose-500/30">
                <TrendingDown size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main Chart */}
        <Card className={`col-span-1 lg:col-span-2 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <CardHeader>
            <CardTitle className={darkMode ? 'text-white' : 'text-slate-900'}>{t('CashflowTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `Rp ${val/1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="outcome" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorOutcome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Chart */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[220px] w-full mt-4 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 space-y-3">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">Rp {item.value}.000</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Table */}
      <div className="mt-8">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700 pb-4">
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">View All</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Wallet</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading transactions...</td></tr>
                  ) : recentTransactions.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No transactions found.</td></tr>
                  ) : (
                    recentTransactions.map((trx) => {
                      const isIncome = trx.type === 'income';
                      const category = categoriesMap[trx.category_id];
                      const wallet = walletsMap[trx.wallet_id];
                      const dateObj = new Date(trx.transaction_date);
                      
                      return (
                        <tr key={trx.id} className="hover:bg-slate-700/30 transition-colors">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Search, CalendarClock, BellRing, Receipt, Calendar, X, Save } from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function Bills() {
  const { darkMode, t } = useTheme();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('Subscription');

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bills');
      setBills(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bills', {
        name,
        amount: parseFloat(amount),
        due_date: dueDate,
        type
      });
      setIsModalOpen(false);
      setName('');
      setAmount('');
      setDueDate('');
      fetchBills();
    } catch (err) {
      alert('Failed to add bill. Make sure all fields are correct.');
    }
  };

  const handlePayBill = async (id: string) => {
    try {
      await api.post(`/bills/${id}/pay`);
      fetchBills();
    } catch (err) {
      alert('Failed to pay bill.');
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingCount = bills.filter(b => b.status === 'Pending').length;
  const totalUnpaid = bills.filter(b => b.status === 'Pending').reduce((acc, b) => acc + b.amount, 0);
  const totalPaid = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('BillsTitle')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('BillsDesc')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          {t('AddBill')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 border border-indigo-500/30">
                <CalendarClock size={24} />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('UpcomingThisMonth')}</p>
                <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{upcomingCount} {t('BillsCount')}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 border border-rose-500/30">
                <BellRing size={24} />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('TotalUnpaid')}</p>
                <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rp {totalUnpaid.toLocaleString('id-ID')}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                <Receipt size={24} />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('PaidThisMonth')}</p>
                <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rp {totalPaid.toLocaleString('id-ID')}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        
      <Card className={darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
        <CardHeader className={`border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <CardTitle className={darkMode ? 'text-white' : 'text-slate-900'}>{t('ActiveBills')}</CardTitle>
          <div className={`flex items-center px-3 py-1.5 rounded-lg border focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors ${
            darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-300'
          }`}>
            <Search size={16} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
            <input 
              type="text" 
              placeholder={t('SearchBills')} 
              className={`bg-transparent border-none outline-none ml-2 text-sm w-full md:w-48 ${
                darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase border-b ${
                darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <tr>
                  <th className="px-6 py-4 font-medium">{t('BillName')}</th>
                  <th className="px-6 py-4 font-medium">{t('Type')}</th>
                  <th className="px-6 py-4 font-medium">{t('DueDate')}</th>
                  <th className="px-6 py-4 font-medium">{t('Status')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('Amount')}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
                {loading ? (
                   <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                ) : filteredBills.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">{t('NoBills')}</td></tr>
                ) : (
                  filteredBills.map((bill) => {
                    const dateObj = new Date(bill.due_date);
                    const isPaid = bill.status === 'Paid';
                    return (
                      <tr key={bill.id} className="hover:bg-slate-700/30 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-200">
                          {bill.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                            {bill.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Calendar size={14} className="text-slate-500" />
                            {dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-right text-slate-200 flex items-center justify-end gap-4">
                          Rp {bill.amount.toLocaleString('id-ID')}
                          {!isPaid && (
                            <button onClick={() => handlePayBill(bill.id)} className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded transition-all text-xs border border-indigo-500/20">
                              Pay Now
                            </button>
                          )}
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

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Receipt className="text-indigo-400" />
                Add New Bill
              </h3>
            </div>
            <form onSubmit={handleAddBill} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Bill Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white" placeholder="Netflix, Rent, Paylater..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">Rp</span>
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={amount ? parseInt(amount, 10).toLocaleString('id-ID') : ''} 
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      setAmount(rawValue);
                    }} 
                    className="w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white" 
                    placeholder="0" 
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">*Isi dengan nominal yang harus dibayar pada siklus/bulan ini, bukan total sisa utang keseluruhan.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white [&>option]:bg-slate-800">
                    <option value="Subscription">Subscription</option>
                    <option value="Utility">Utility</option>
                    <option value="Rent">Rent</option>
                    <option value="Paylater">Paylater</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                  <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white" />
                  <p className="text-[11px] text-slate-500 mt-1.5">*Batas akhir pembayaran.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-indigo-500/20">
                  <Save size={18} />
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

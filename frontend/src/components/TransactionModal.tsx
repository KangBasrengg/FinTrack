import { useState, useEffect } from 'react';
import { X, Save, ArrowRightLeft, CreditCard, Tags, Calendar, FileText } from 'lucide-react';
import api from '../api/axios';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function TransactionModal({ isOpen, onClose, onSave }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'outcome'>('outcome');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [wallet, setWallet] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [newWalletName, setNewWalletName] = useState('');
  const [isAddingWallet, setIsAddingWallet] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch wallets
      api.get('/wallets').then(res => {
        setWallets(res.data?.data || []);
        if (res.data?.data?.length > 0) setWallet(res.data.data[0].id);
      }).catch(console.error);
      
      // Fetch categories
      api.get('/categories').then(res => {
        setCategories(res.data?.data || []);
        if (res.data?.data?.length > 0) setCategory(res.data.data[0].id);
      }).catch(console.error);

      // Reset form
      setAmount('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'ADD_NEW') {
      setIsAddingCategory(true);
      setCategory('');
    } else {
      setCategory(val);
    }
  };

  const saveNewCategory = async () => {
    if (!newCategoryName.trim()) {
      setIsAddingCategory(false);
      return;
    }
    try {
      const res = await api.post('/categories', {
        name: newCategoryName,
        type: type === 'income' ? 'Income' : 'Expense',
        icon: 'ShoppingBag',
        color: 'bg-emerald-500/20 text-emerald-400'
      });
      const newCat = res.data.data;
      setCategories([...categories, newCat]);
      setCategory(newCat.id);
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    } finally {
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'ADD_NEW') {
      setIsAddingWallet(true);
      setWallet('');
    } else {
      setWallet(val);
    }
  };

  const saveNewWallet = async () => {
    if (!newWalletName.trim()) {
      setIsAddingWallet(false);
      return;
    }
    try {
      const res = await api.post('/wallets', {
        name: newWalletName,
        type: 'Cash',
        balance: 0
      });
      const newWallet = res.data.data;
      setWallets([...wallets, newWallet]);
      setWallet(newWallet.id);
    } catch (err) {
      console.error(err);
      alert("Failed to create wallet");
    } finally {
      setIsAddingWallet(false);
      setNewWalletName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ 
        type, 
        amount: parseFloat(amount), 
        category_id: category, 
        wallet_id: wallet, 
        transaction_date: new Date(date).toISOString(), 
        note 
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="text-emerald-400" />
            Add Transaction
          </h2>
          <p className="text-sm text-slate-400 mt-1">Record a new income or expense.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Transaction Type */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setType('outcome')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'outcome' ? 'bg-slate-900 text-rose-400 shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'income' ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-medium">Rp</span>
              </div>
              <input
                type="text"
                required
                value={amount ? parseInt(amount, 10).toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setAmount(rawValue);
                }}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white font-semibold placeholder:text-slate-600"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="New category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveNewCategory(); } }}
                    className="flex-1 px-3 py-2.5 border border-emerald-500 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-slate-500 text-sm"
                  />
                  <button type="button" onClick={saveNewCategory} className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Add
                  </button>
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tags size={16} className="text-slate-500" />
                  </div>
                  <select
                    required
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white [&>option]:bg-slate-800"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    <option value="ADD_NEW" className="text-emerald-400 font-bold">+ Add New Category</option>
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Wallet</label>
              {isAddingWallet ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="New wallet name..."
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveNewWallet(); } }}
                    className="flex-1 px-3 py-2.5 border border-emerald-500 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-slate-500 text-sm"
                  />
                  <button type="button" onClick={saveNewWallet} className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Add
                  </button>
                  <button type="button" onClick={() => setIsAddingWallet(false)} className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={16} className="text-slate-500" />
                  </div>
                  <select
                    required
                    value={wallet}
                    onChange={handleWalletChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white [&>option]:bg-slate-800"
                  >
                    <option value="" disabled>Select wallet</option>
                    {wallets.map((w: any) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                    <option value="ADD_NEW" className="text-emerald-400 font-bold">+ Add New Wallet</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-slate-500" />
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FileText size={16} className="text-slate-500" />
              </div>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white resize-none placeholder:text-slate-600"
                placeholder="What was this for?"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-emerald-500/20"
            >
              <Save size={18} />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

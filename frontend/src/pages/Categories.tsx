import { useState, useEffect } from 'react';
import { Plus, Coffee, Car, ShoppingBag, Lightbulb, MonitorPlay, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, t } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const rawCategories = res.data?.data || [];
        
        // Let's add some mock 'spent' values for visual purposes 
        // until backend tracks spent budget properly per category.
        const mappedCategories = rawCategories.map((c: any) => ({
          ...c,
          budget: c.type === 'Expense' ? 3000000 : 0, 
          spent: c.type === 'Expense' ? Math.floor(Math.random() * 2000000) : 15000000
        }));
        setCategories(mappedCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return Coffee;
      case 'Car': return Car;
      case 'ShoppingBag': return ShoppingBag;
      case 'Lightbulb': return Lightbulb;
      case 'MonitorPlay': return MonitorPlay;
      case 'PiggyBank': return PiggyBank;
      default: return ShoppingBag;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('CategoriesBudgets')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('CategoriesDesc')}</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 w-full md:w-auto justify-center">
          <Plus size={18} />
          {t('AddCategory')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
           <div className={`col-span-full text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading...</div>
        ) : categories.map((cat) => {
          const Icon = getIcon(cat.icon);
          const isOverBudget = cat.type === 'Expense' && cat.spent > cat.budget;
          const progress = cat.type === 'Expense' ? Math.min((cat.spent / cat.budget) * 100, 100) : 100;
          
          return (
            <Card key={cat.id} className={`relative overflow-hidden cursor-pointer transition-all ${darkMode ? 'border-slate-700 bg-slate-800/50 hover:border-emerald-500/30' : 'border-slate-200 bg-white shadow-sm hover:border-emerald-500/30'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{cat.type}</p>
                  </div>
                </div>

                {cat.type === 'Expense' ? (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className={`font-semibold ${isOverBudget ? 'text-rose-400' : 'text-slate-200'}`}>
                        Rp {cat.spent.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-slate-500">
                        of Rp {cat.budget.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] ${isOverBudget ? 'bg-rose-500 shadow-rose-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    {isOverBudget && (
                      <p className="text-xs text-rose-400 font-medium mt-2 text-right">
                        Exceeded by Rp {(cat.spent - cat.budget).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total Received</p>
                    <p className="font-semibold text-emerald-400">Rp {cat.spent.toLocaleString('id-ID')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

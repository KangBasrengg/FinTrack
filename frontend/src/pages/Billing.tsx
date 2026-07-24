import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { CreditCard, CheckCircle2, Zap, ArrowUpCircle, X } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

export default function Billing() {
  const [role, setRole] = useState('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTheme();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 'user');
      } catch (e) {}
    }
  }, []);

  const isPremium = role === 'premium' || role === 'super_admin';

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">{t('Billing')}</h1>
        <p className="text-slate-400 mt-1">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`border-emerald-500/20 md:col-span-2 ${isPremium ? 'bg-gradient-to-br from-emerald-900/40 to-slate-900' : 'bg-slate-800/50'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`flex items-center gap-2 ${isPremium ? 'text-emerald-400' : 'text-white'}`}>
              {isPremium ? <Zap size={20} /> : <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs border border-slate-600">B</div>}
              {isPremium ? 'Premium Plan' : 'Basic Plan (Free)'}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isPremium ? 'You are currently on the Premium plan.' : 'You are currently on the free Basic plan.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-white">{isPremium ? 'Rp 29.000' : 'Rp 0'}<span className="text-lg text-slate-400 font-normal"> / month</span></p>
                {isPremium && <p className="text-sm text-slate-400 mt-1">Next billing date: August 23, 2026</p>}
              </div>
              <div className="flex gap-3">
                {isPremium ? (
                  <>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700">Cancel Plan</button>
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm shadow-emerald-500/20">Upgrade to Annual</button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <ArrowUpCircle size={18} />
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {isPremium ? (
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-900">
                  VISA
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">•••• •••• •••• 4242</p>
                  <p className="text-xs text-slate-400">Expires 12/28</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400 text-center py-4 bg-slate-900/30 rounded-lg border border-slate-800 border-dashed">
                No payment method added yet.
              </div>
            )}
            <button className="w-full py-2 text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors flex items-center justify-center gap-2">
              <CreditCard size={16} /> Add New Method
            </button>
          </CardContent>
        </Card>
      </div>

      {isPremium && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="text-white">Billing History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-slate-300">Jul 23, 2026</td>
                    <td className="px-6 py-4 text-slate-200 font-medium">Premium Plan - Monthly</td>
                    <td className="px-6 py-4 text-slate-300">Rp 29.000</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Download</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-slate-300">Jun 23, 2026</td>
                    <td className="px-6 py-4 text-slate-200 font-medium">Premium Plan - Monthly</td>
                    <td className="px-6 py-4 text-slate-300">Rp 29.000</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Download</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 relative">Choose Your Plan</h2>
              <p className="text-slate-400 mb-8 relative">Upgrade to Premium to unlock advanced analytics and unlimited wallets.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left relative">
                {/* Basic Plan */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-1">Basic Plan</h3>
                  <p className="text-sm text-slate-400 mb-6">Essential features for beginners.</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">Rp 0</span>
                    <span className="text-slate-400"> / month</span>
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">Up to 2 Wallets</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">Basic categorizations</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">Standard support</p>
                    </div>
                  </div>
                  
                  <button 
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-medium border border-slate-700 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                    POPULAR
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={20} className="text-emerald-400" />
                    <h3 className="text-xl font-bold text-white">Premium Plan</h3>
                  </div>
                  <p className="text-sm text-emerald-100/70 mb-6">For power users who need it all.</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">Rp 29.000</span>
                    <span className="text-slate-400"> / month</span>
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">Unlimited Wallets & Categories</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">Advanced Analytics & Export</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">Automated Recurring Bills</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">Priority 24/7 Support</p>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, PieChart, LayoutDashboard, ArrowRightLeft, Wallet, Tags, TrendingUp, Activity, Bell, User, CheckCircle2, X } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';
import Hero3D from '../components/Hero3D';

export default function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const openAuth = (mode: 'login' | 'register') => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
      return;
    }
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-50 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/FinTrack.webp" alt="FinTrack Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-emerald-500/10" />
          <span className="text-white font-bold text-2xl tracking-tight">FinTrack</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => openAuth('login')} className="px-5 py-2.5 text-slate-300 hover:text-white font-medium transition-colors">
            Log In
          </button>
          <button onClick={() => openAuth('register')} className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-200 font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Get Started
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes float-image {
          0% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(2deg); }
        }
        .animate-float {
          animation: float-image 6s ease-in-out infinite;
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="relative z-10 px-8 pt-24 pb-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-left relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            The New Standard of Personal Finance
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter leading-[1.1]">
            Wealth Management, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
              Simplified.
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            FinTrack adalah platform kelas enterprise untuk melacak arus kas Anda secara real-time. Dirancang untuk profesional yang menghargai akurasi, kecepatan, dan privasi.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-start gap-4">
            <button onClick={() => openAuth('register')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 text-lg group w-full sm:w-auto">
              Start Tracking Free 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Real 3D Interactive & Scroll-Animated Visuals Area */}
        <div className="flex-1 relative w-full min-h-[400px] lg:min-h-[600px] z-10">
          <Hero3D />
        </div>
      </section>

      {/* DETAILED Dashboard Mockup */}
      <section className="relative z-10 px-4 md:px-8 max-w-6xl mx-auto pb-32">
        <div className="relative rounded-2xl bg-white text-slate-900 border border-slate-700/50 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] overflow-hidden flex flex-col transform md:scale-105 origin-top transition-all hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.4)]">
          {/* Mac window controls */}
          <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="ml-4 text-xs font-medium text-slate-400 flex-1 text-center pr-12">fintrack-app.com/dashboard</div>
          </div>
          
          {/* App UI Mockup */}
          <div className="flex h-[350px] md:h-[600px] overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-200 shrink-0">
              <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <img src="/FinTrack.webp" alt="FinTrack Logo" className="w-8 h-8 object-contain rounded mr-2" />
                <span className="text-white font-semibold tracking-wide">FinTrack</span>
              </div>
              <div className="p-4 space-y-2 text-sm mt-4">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-emerald-600 text-white rounded-lg"><LayoutDashboard size={18}/> Dashboard</div>
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 rounded-lg"><ArrowRightLeft size={18}/> Transactions</div>
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 rounded-lg"><Wallet size={18}/> Wallets</div>
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 rounded-lg"><Tags size={18}/> Categories</div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div className="w-64 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center px-4 text-xs text-slate-400">Search transactions...</div>
                <div className="flex items-center gap-4 text-slate-400">
                  <Bell size={18} />
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><User size={16}/></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 flex-1 overflow-hidden flex flex-col gap-6 select-none pointer-events-none">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                    <p className="text-sm text-slate-500">Welcome back! Here's your financial summary.</p>
                  </div>
                  <div className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-emerald-200">
                    + Add Transaction
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <p className="text-sm text-slate-500 mb-1">Total Income</p>
                    <h3 className="text-2xl font-bold text-slate-800">Rp 12.500.000</h3>
                    <div className="mt-3 text-xs text-emerald-600 font-medium bg-emerald-50 w-fit px-2 py-1 rounded flex items-center"><TrendingUp size={12} className="mr-1"/> +15% this month</div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <p className="text-sm text-slate-500 mb-1">Total Outcome</p>
                    <h3 className="text-2xl font-bold text-slate-800">Rp 4.200.000</h3>
                    <div className="mt-3 text-xs text-rose-600 font-medium bg-rose-50 w-fit px-2 py-1 rounded flex items-center"><Activity size={12} className="mr-1"/> -2.4% this month</div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden hidden sm:block">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <p className="text-sm text-slate-500 mb-1">Net Balance</p>
                    <h3 className="text-2xl font-bold text-slate-800">Rp 8.300.000</h3>
                    <div className="mt-3 text-xs text-slate-500 font-medium w-fit px-2 py-1 rounded">Across 3 wallets</div>
                  </div>
                </div>

                {/* Chart & History Area */}
                <div className="flex gap-6 flex-1 min-h-0">
                  <div className="flex-1 bg-white border border-slate-100 rounded-xl shadow-sm p-5 flex flex-col">
                    <h4 className="font-semibold text-slate-800 mb-4">Cashflow Trend</h4>
                    <div className="flex-1 w-full bg-slate-50 rounded-lg border border-slate-100 relative overflow-hidden flex items-end">
                      {/* Fake SVG Chart */}
                      <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none" className="absolute bottom-0">
                        <defs>
                          <linearGradient id="g-green" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="g-red" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,150 L0,80 Q50,50 100,70 T200,40 T300,90 T400,30 T500,50 L500,150 Z" fill="url(#g-green)" stroke="#10b981" strokeWidth="2" />
                        <path d="M0,150 L0,120 Q50,130 100,100 T200,110 T300,140 T400,90 T500,110 L500,150 Z" fill="url(#g-red)" stroke="#f43f5e" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-72 bg-white border border-slate-100 rounded-xl shadow-sm p-5 flex-col hidden lg:flex">
                    <h4 className="font-semibold text-slate-800 mb-4">Recent Transactions</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">☕</div>
                          <div><p className="text-xs font-semibold text-slate-700">Starbucks</p><p className="text-[10px] text-slate-400">Food & Beverage</p></div>
                        </div>
                        <span className="text-xs font-semibold text-rose-600">-Rp 55.000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">💰</div>
                          <div><p className="text-xs font-semibold text-slate-700">Salary</p><p className="text-[10px] text-slate-400">Income</p></div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">+Rp 12M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs">🎬</div>
                          <div><p className="text-xs font-semibold text-slate-700">Netflix</p><p className="text-[10px] text-slate-400">Entertainment</p></div>
                        </div>
                        <span className="text-xs font-semibold text-rose-600">-Rp 186.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="px-8 py-24 bg-slate-900 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Enterprise-Grade Features</h2>
            <p className="mt-4 text-slate-400 text-lg">Keamanan setara bank, dengan antarmuka yang elegan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 group-hover:bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Keamanan Maksimal</h3>
              <p className="text-slate-400 leading-relaxed">
                Data finansial Anda dilindungi dengan enkripsi tingkat tinggi (Bcrypt) dan JWT Autentikasi yang mencegah kebocoran data.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 group-hover:bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <PieChart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Analitik Pintar</h3>
              <p className="text-slate-400 leading-relaxed">
                Lacak pemasukan dan pengeluaran Anda dengan visualisasi grafik interaktif. Cari tahu ke mana uang Anda pergi dengan cepat.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 group-hover:bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Automasi Cerdas</h3>
              <p className="text-slate-400 leading-relaxed">
                Atur tagihan berulang (Netflix, Listrik, Cicilan) dan biarkan sistem Cron Job kami yang mencatatnya secara otomatis setiap bulan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-8 py-24 bg-[#0B1120] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-slate-400 text-lg">Pilih paket yang sesuai dengan kebutuhan finansial Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <p className="text-slate-400">Untuk pemula yang ingin mulai mencatat.</p>
              </div>
              <div className="mb-8 flex-1">
                <p className="text-4xl font-bold text-white mb-6">Gratis</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    Pencatatan transaksi manual
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    Maksimal 2 Wallet (Dompet)
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    Analitik dasar (Income vs Expense)
                  </li>
                  <li className="flex items-center gap-3 text-slate-500">
                    <X size={20} className="shrink-0" />
                    <span className="line-through">Pengingat Tagihan & Paylater</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-500">
                    <X size={20} className="shrink-0" />
                    <span className="line-through">Live Chat Admin Support</span>
                  </li>
                </ul>
              </div>
              <button onClick={() => openAuth('register')} className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors">
                Mulai Gratis
              </button>
            </div>

            {/* Premium Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-900/40 to-slate-900 border border-emerald-500/50 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">Premium</h3>
                <p className="text-slate-300">Untuk pengelolaan finansial pro & otomatis.</p>
              </div>
              <div className="mb-8 flex-1">
                <div className="flex items-baseline gap-2 mb-6">
                  <p className="text-4xl font-bold text-white">Rp 29.000</p>
                  <p className="text-slate-400">/bulan</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    Unlimited Wallet & Categories
                  </li>
                  <li className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    Fitur Bills & Paylater Reminder
                  </li>
                  <li className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    Automasi pencatatan rutin (Cron Job)
                  </li>
                  <li className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    Analitik Lanjutan & Export PDF
                  </li>
                  <li className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    Prioritas Live Chat CS 24/7
                  </li>
                </ul>
              </div>
              <button onClick={() => openAuth('register')} className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]">
                Berlangganan Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1120] border-t border-slate-800 py-12 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} FinTrack Enterprise. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        defaultMode={authMode} 
      />
    </div>
  );
}

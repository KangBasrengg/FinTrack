import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, X, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        onClose();
        navigate(response.data.data.user.role === 'super_admin' ? '/admin' : '/dashboard');
      } else {
        const fullPhone = `${countryCode}${phone}`;
        await api.post('/auth/register', { name, email, password, phone: fullPhone });
        // After register, automatically login
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        onClose();
        navigate(response.data.data.user.role === 'super_admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `${mode === 'login' ? 'Login' : 'Registration'} failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-md">
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl shadow-[0_0_50px_-15px_rgba(16,185,129,0.2)] w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img src="/FinTrack.webp" alt="FinTrack Logo" className="w-14 h-14 object-contain rounded-xl shadow-lg shadow-emerald-500/20" />
          </div>

          <h2 className="text-center text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400 mb-8">
            {mode === 'login'
              ? 'Please sign in to access your dashboard'
              : 'Start taking control of your financial future'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-medium border border-rose-100 text-center">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-white bg-slate-800/50 placeholder-slate-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                  <div className="flex shadow-sm rounded-lg relative border border-slate-700 bg-slate-800/50 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
                    <select
                      className="bg-slate-800 border-none rounded-l-lg py-2.5 pl-3 pr-8 text-white font-medium focus:ring-0 cursor-pointer"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+62">🇮🇩 Indonesia (+62)</option>
                      <option value="+1">🇺🇸 United States (+1)</option>
                      <option value="+44">🇬🇧 United Kingdom (+44)</option>
                      <option value="+65">🇸🇬 Singapore (+65)</option>
                      <option value="+60">🇲🇾 Malaysia (+60)</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.startsWith('0')) {
                          val = val.substring(1);
                        }
                        // Only allow numbers
                        val = val.replace(/\D/g, '');
                        setPhone(val);
                      }}
                      className="flex-1 min-w-0 block w-full px-3 py-2.5 border-none bg-transparent text-white focus:ring-0 placeholder-slate-500"
                      placeholder="8123456789"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-medium">Contoh: 8123456789 (tanpa angka 0 di depan)</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-white bg-slate-800/50 placeholder-slate-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-white bg-slate-800/50 placeholder-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all hover:-translate-y-0.5 disabled:opacity-70 mt-4"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

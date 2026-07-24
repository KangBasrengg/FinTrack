import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setName(u.name || '');
        setEmail(u.email || '');
      } catch (e) {}
    }
  }, []);

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl font-bold border-2 border-emerald-500/30">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{name || 'User'}</h3>
            <p className="text-sm text-slate-400 mt-1">Premium Member</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm md:col-span-2">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-900/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-500" />
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-900/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-sm font-medium text-white mb-3">Security</h4>
              <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <Shield size={16} />
                Change Password
              </button>
            </div>

            <div className="pt-6 flex justify-end">
              <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-emerald-500/20">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Bell, Moon, Globe, Save, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { darkMode, setDarkMode, currency, setCurrency, language, setLanguage, t } = useTheme();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('Settings')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('Customize')}</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            saved 
              ? 'bg-emerald-500 text-white' 
              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
          }`}
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? t('Saved') : t('SaveChanges')}
        </button>
      </div>

      <div className="space-y-6">
        <Card className={`${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-sm`}>
          <CardHeader className={`border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Moon className="text-emerald-400" size={20} />
              <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('Appearance')}</CardTitle>
            </div>
            <CardDescription className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t('AppearanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t('DarkMode')}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('DarkModeDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <div className={`w-11 h-6 ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-sm`}>
          <CardHeader className={`border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Bell className="text-emerald-400" size={20} />
              <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('Notifications')}</CardTitle>
            </div>
            <CardDescription className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t('NotificationsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t('EmailNotif')}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('EmailNotifDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                <div className={`w-11 h-6 ${emailNotif ? 'bg-emerald-500' : darkMode ? 'bg-slate-600' : 'bg-slate-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t('PushNotif')}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('PushNotifDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
                <div className={`w-11 h-6 ${pushNotif ? 'bg-emerald-500' : darkMode ? 'bg-slate-600' : 'bg-slate-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-sm`}>
          <CardHeader className={`border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Globe className="text-emerald-400" size={20} />
              <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('Localization')}</CardTitle>
            </div>
            <CardDescription className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t('LocalizationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('Currency')}</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)} 
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode 
                      ? 'border-slate-700 bg-slate-900/50 text-white [&>option]:bg-slate-800' 
                      : 'border-slate-300 bg-white text-slate-900 [&>option]:bg-white'
                  }`}
                >
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="MYR">MYR - Malaysian Ringgit</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('Language')}</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)} 
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode 
                      ? 'border-slate-700 bg-slate-900/50 text-white [&>option]:bg-slate-800' 
                      : 'border-slate-300 bg-white text-slate-900 [&>option]:bg-white'
                  }`}
                >
                  <option value="en">English</option>
                  <option value="id">Bahasa Indonesia</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

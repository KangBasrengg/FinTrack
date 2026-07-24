import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Menu, LogOut, Settings, CreditCard, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/axios';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { darkMode, t } = useTheme();

  const userStr = localStorage.getItem('user');
  let userName = 'My Account';
  let role = t('FreeUser');
  let isSuperAdmin = false;
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (u.name) userName = u.name;
      if (u.role === 'super_admin') {
        role = t('SuperAdmin');
        isSuperAdmin = true;
      } else if (u.role === 'premium') {
        role = t('PremiumUser');
      } else {
        role = t('FreeUser');
      }
    } catch (e) {}
  }

  // Poll for unread chat count (admin only)
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchUnread = () => {
      api.get('/chat/unread')
        .then(res => {
          const count = res.data?.data?.count || 0;
          setUnreadChats(count);
          if (count > 0) {
            // Also fetch conversation summaries for notifications
            api.get('/chat/conversations')
              .then(convRes => {
                const convs = convRes.data?.data || [];
                const unreadNotifs = convs
                  .filter((c: any) => c.unread_count > 0)
                  .slice(0, 5)
                  .map((c: any) => ({
                    id: c.user_id,
                    title: `New message from ${c.user_name}`,
                    body: c.last_message,
                    time: c.last_message_at,
                    unread: c.unread_count,
                  }));
                setNotifications(unreadNotifs);
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [isSuperAdmin]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const totalNotifs = isSuperAdmin ? unreadChats : 0;

  return (
    <header className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300 ${
      darkMode 
        ? 'bg-[#0B1120]/80 border-slate-800' 
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className={`p-2 -ml-4 rounded-lg transition-colors ${
            darkMode 
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}>
            <Menu size={20} />
          </button>
        )}
        <div className={`flex items-center rounded-full px-4 py-2 w-72 md:w-96 border transition-all ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500' 
            : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500'
        }`}>
          <Search size={18} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
          <input 
            type="text" 
            placeholder={t('SearchTransactions')}
            className={`bg-transparent border-none outline-none ml-3 w-full text-sm ${
              darkMode 
                ? 'placeholder:text-slate-500 text-slate-200' 
                : 'placeholder:text-slate-400 text-slate-800'
            }`}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
            }} 
            className={`relative p-2 rounded-full transition-colors ${
              showNotifMenu 
                ? darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800' 
                : darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-300' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Bell size={20} />
            {totalNotifs > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 rounded-full ring-2 ring-[#0B1120] flex items-center justify-center text-[10px] text-white font-bold px-1">
                {totalNotifs > 99 ? '99+' : totalNotifs}
              </span>
            )}
          </button>
          
          {showNotifMenu && (
            <div className={`absolute right-0 mt-3 w-80 rounded-xl shadow-2xl border py-2 animate-in fade-in slide-in-from-top-2 ${
              darkMode 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-white border-slate-200'
            }`}>
              <div className={`px-4 py-2 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t('Notifications')}</span>
                {totalNotifs > 0 && (
                  <span className="bg-rose-500/10 text-rose-500 text-xs font-bold px-2 py-0.5 rounded-full">{totalNotifs}</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    onClick={() => {
                      setShowNotifMenu(false);
                      navigate('/dashboard/admin-chat');
                    }}
                    className={`px-4 py-3 cursor-pointer border-l-2 border-emerald-500 ${
                      darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{notif.title}</p>
                        <p className={`text-xs mt-0.5 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{notif.body}</p>
                        <p className={`text-[10px] mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className={`px-4 py-6 text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Bell size={24} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">{t('NoNotifications')}</p>
                  </div>
                )}
              </div>
              {isSuperAdmin && notifications.length > 0 && (
                <div className={`px-4 py-2 border-t text-center ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button 
                    onClick={() => { setShowNotifMenu(false); navigate('/dashboard/admin-chat'); }}
                    className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                  >
                    {t('OpenSupportChat')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div className={`relative border-l pl-6 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} ref={profileRef}>
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
            className={`flex items-center gap-3 cursor-pointer p-1.5 rounded-lg transition-colors ${
              showProfileMenu 
                ? darkMode ? 'bg-slate-800/50' : 'bg-slate-100' 
                : darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{userName}</p>
              <p className="text-xs text-emerald-500 font-medium">{role}</p>
            </div>
          </div>

          {showProfileMenu && (
            <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl border py-2 animate-in fade-in slide-in-from-top-2 ${
              darkMode 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-white border-slate-200'
            }`}>
              <div className={`px-4 py-2 mb-2 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <p className={`text-sm font-semibold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{userName}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{role}</p>
              </div>
              
              <button onClick={() => { setShowProfileMenu(false); navigate('/dashboard/profile'); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}>
                <User size={16} /> {t('MyProfile')}
              </button>
              <button onClick={() => { setShowProfileMenu(false); navigate('/dashboard/settings'); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Settings size={16} /> {t('Settings')}
              </button>
              <button onClick={() => { setShowProfileMenu(false); navigate('/dashboard/billing'); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}>
                <CreditCard size={16} /> {t('Billing')}
              </button>
              
              <div className={`my-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors font-medium"
              >
                <LogOut size={16} /> {t('Logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

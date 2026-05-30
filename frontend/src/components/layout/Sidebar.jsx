import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    Home, FileText, CheckCircle, MessageSquare, Menu, User, 
    LogOut, Settings, Sun, Moon, Globe, Video, Bell, Trash2, X, Sparkles, BookOpen,
    BarChart3, Map, Globe2, History
} from 'lucide-react';
import api from '../../lib/axios';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import BrandLogo from '../BrandLogo';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Home },
    { key: 'cv_builder', label: 'CV Builder', path: '/cv-builder', icon: FileText },
    { key: 'cv_intelligence', label: 'CV Intelligence', path: '/cv-intelligence', icon: Sparkles },
    { key: 'career_quiz', label: 'Quiz RIASEC', path: '/quiz', icon: CheckCircle },
    { key: 'roadmap', label: 'Roadmap', path: '/roadmap', icon: Map },
    { key: 'interview_prep', label: 'Interview Prep', path: '/interview-prep', icon: Video },
    { key: 'interview_history', label: 'Historique', path: '/interview/history', icon: History },
    { key: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { key: 'portfolio', label: 'Portfolio', path: '/portfolio', icon: Globe2 },
    { key: 'cover_letter', label: 'Cover Letter', path: '/cover-letter', icon: BookOpen },
    { key: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (e) {
            console.error("Notifications fetch failed", e);
        }
    };

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (e) { console.error(e); }
    };

    const deleteNotif = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (e) { console.error(e); }
    };

    const handleLogout = async () => {
        try { await api.post('/logout'); } catch(e){}
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe z-50 transition-colors">
                <div className="flex justify-around items-center h-16">
                    {NAV_ITEMS.slice(0, 4).map((item) => (
                        <NavLink
                            key={item.key}
                            to={item.path}
                            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] uppercase font-black">{t(`nav.${item.key}`, item.label).substring(0, 8)}</span>
                        </NavLink>
                    ))}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                        <Menu className="w-6 h-6" />
                        <span className="text-[10px] uppercase font-black">{t('menu', 'Menu')}</span>
                    </button>
                </div>
            </nav>

            {/* Main Sidebar Desktop + Mobile Drawer */}
            <aside className={`fixed inset-y-0 ${i18n.language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} z-[60] w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-100 dark:border-gray-800 transition-all duration-300 transform ${isOpen || isMobileMenuOpen ? 'translate-x-0' : (i18n.language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <BrandLogo />
                        <button onClick={() => { setIsMobileMenuOpen(false); onClose?.(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><X className="w-5 h-5"/></button>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${isActive ? 'bg-gray-950 dark:bg-white text-white dark:text-gray-950 shadow-lg shadow-gray-950/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{t(`nav.${item.key}`, item.label)}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-4 pt-6 border-t dark:border-gray-800">
                        <button 
                            onClick={() => setShowNotifications(true)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-all font-bold text-sm relative"
                        >
                            <div className="flex items-center gap-4">
                                <Bell className="w-5 h-5" />
                                <span>{t('notifications') || 'Notifications'}</span>
                            </div>
                            {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce">{unreadCount}</span>}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={toggleTheme}
                            className="flex items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-primary-600 transition-all active:scale-95 shadow-sm"
                          >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                          </button>
                          
                          <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                             {['en', 'fr', 'ar'].map(lng => (
                               <button 
                                 key={lng}
                                 onClick={() => {
                                    i18n.changeLanguage(lng);
                                 }}
                                 className={`flex-1 text-[10px] font-black rounded-xl transition-all ${i18n.language === lng ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                               >
                                 {lng.toUpperCase()}
                               </button>
                             ))}
                          </div>
                        </div>

                        <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-black text-sm group"
                        >
                          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                          <span>{t('sign_out')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Floating Notification Drawer */}
            {showNotifications && (
                <div className={`fixed inset-y-0 ${i18n.language === 'ar' ? 'left-0 lg:left-72' : 'right-0'} z-[100] w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl border-x border-gray-100 dark:border-gray-800 animate-in slide-in-from-right duration-300 flex flex-col`}>
                    <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">{t('activity_center')}</h3>
                        </div>
                        <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {notifications.length === 0 ? (
                            <div className="py-20 text-center opacity-30">
                                <Bell className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-black text-sm">{t('no_activity')}</p>
                            </div>
                        ) : notifications.map(n => (
                            <div key={n.id} className={`p-5 rounded-3xl border transition-all ${n.is_read ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800 ring-1 ring-primary-100 dark:ring-primary-900/20 shadow-lg shadow-primary-500/5'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${n.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>{n.type}</span>
                                    <div className="flex items-center gap-3">
                                        {!n.is_read && <button onClick={() => markRead(n.id)} className="w-2 h-2 bg-primary-500 rounded-full"></button>}
                                        <button onClick={() => deleteNotif(n.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                                    </div>
                                </div>
                                <h4 className={`font-black text-sm leading-tight mb-1 ${n.is_read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>{n.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
                                <div className="mt-3 text-[10px] font-bold text-gray-300 dark:text-gray-600">
                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Backdrop for mobile menu and notification drawer */}
            {(isMobileMenuOpen || showNotifications || isOpen) && (
                <div 
                    onClick={() => { setIsMobileMenuOpen(false); setShowNotifications(false); onClose?.(); }} 
                    className="fixed inset-0 bg-gray-950/40 backdrop-blur-md z-[55] animate-in fade-in transition-all lg:bg-transparent lg:pointer-events-none lg:backdrop-blur-0"
                ></div>
            )}
        </>
    );
}

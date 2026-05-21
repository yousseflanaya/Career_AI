import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans selection:bg-primary-500/30">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">C</div>
            <span className="text-xl font-black tracking-tight">CareerAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 mr-4">
              {['en', 'fr', 'ar'].map((lng) => (
                <button 
                  key={lng} 
                  onClick={() => changeLanguage(lng)}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${i18n.language === lng ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
            
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 transition-all border border-gray-100 dark:border-gray-800">
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
            <Link to="/login" className="px-6 py-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
              {t('login')}
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-sm shadow-lg shadow-primary-500/20 transition-all active:scale-95">
              {t('register')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> AI-Powered Career Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                   {t('hero_title', "Build your future with AI")}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                   {t('hero_subtitle', "CareerAI helps students and young graduates find their perfect path. Generate professional CVs, take our career quiz, and discover tailored job offers.")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/register" className="px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                        {t('get_started')} <ArrowRight className="w-6 h-6" />
                    </Link>
                    <Link to="/login" className="px-10 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                        {t('cta_jobs')}
                    </Link>
                </div>
            </div>
            
            <div className="relative group animate-in zoom-in-95 duration-1000">
                <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full group-hover:bg-primary-500/30 transition-all duration-700"></div>
                <div className="relative bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-700 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4"></div>
                        <div className="h-20 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-800"></div>
                        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2"></div>
                        <div className="h-32 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { title: "Smart CV Builder", icon: Zap, desc: "ATS-optimized templates powered by real-time AI suggestions." },
                { title: "Interview Ready", icon: ShieldCheck, desc: "Practice with our AI simulator and master every question." }
            ].map((f, i) => (
                <div key={i} className="p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black mb-3">{f.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{f.desc}</p>
                </div>
            ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-sm">C</div>
                <span className="font-black">CareerAI</span>
            </div>
            <p className="text-sm text-gray-400 font-bold">© 2026 CareerAI. {t('all_rights_reserved', "Transforming futures with AI.")}</p>
            <div className="flex gap-6">
                <Globe className="w-5 h-5 text-gray-300" />
                {t('support')}
            </div>
        </div>
      </footer>
    </div>
  );
}

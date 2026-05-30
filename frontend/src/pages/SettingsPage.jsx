import { useEffect, useState } from 'react';
import { Bell, CheckCircle, Globe2, Loader2, Lock, Palette, Save, Type, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';

const defaultPreferences = {
  firstName: '',
  lastName: '',
  title: '',
  location: '',
  bio: '',
  accent: '#7C3AED',
  fontSize: 'comfortable',
  emailNotifications: true,
  badgeNotifications: true,
  securityNotifications: true,
};

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [portfolio, setPortfolio] = useState(null);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('careerai_user_preferences');
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      } catch (event) {
        console.error('Preferences restore failed', event);
      }
    }

    const fetchData = async () => {
      try {
        const [portfolioResponse, profileResponse] = await Promise.all([
          api.get('/portfolio'),
          api.get('/profile'),
        ]);
        setPortfolio(portfolioResponse.data);
        setEmail(profileResponse.data?.user?.email || '');
        const [firstName = '', ...rest] = (profileResponse.data?.user?.name || '').split(' ');
        setPreferences((current) => ({
          ...current,
          firstName: current.firstName || firstName,
          lastName: current.lastName || rest.join(' '),
          title: current.title || profileResponse.data?.profile?.title || '',
          location: current.location || profileResponse.data?.profile?.address || '',
          bio: current.bio || profileResponse.data?.profile?.summary || '',
        }));
      } catch (event) {
        console.error('Settings fetch failed', event);
      }
    };

    fetchData();
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const showSuccess = () => {
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 2500);
  };

  const savePreferences = (event) => {
    event.preventDefault();
    localStorage.setItem('careerai_user_preferences', JSON.stringify(preferences));
    showSuccess();
  };

  const savePortfolio = async () => {
    if (!portfolio) return;
    setSaving(true);
    setError('');
    try {
      const response = await api.put('/portfolio', {
        is_public: portfolio.is_public,
        custom_url: portfolio.custom_url,
      });
      setPortfolio(response.data);
      showSuccess();
    } catch (event) {
      setError(event.response?.data?.message || t('settings_page.save_failed'));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: t('settings_tabs.profile') },
    { id: 'portfolio', icon: Globe2, label: t('settings_tabs.portfolio') },
    { id: 'security', icon: Lock, label: t('settings_tabs.security') },
    { id: 'appearance', icon: Palette, label: t('settings_tabs.appearance') },
    { id: 'notifications', icon: Bell, label: t('settings_tabs.notifications') },
    { id: 'language', icon: Globe2, label: t('settings_tabs.language') },
  ];

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          <User className="h-4 w-4" />
          {t('settings')}
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">{t('settings_page.title')}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${activeTab === tab.id ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950' : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-950 dark:bg-gray-900 dark:ring-gray-800 dark:hover:text-white'}`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="min-h-[420px] rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {activeTab === 'profile' && (
            <form onSubmit={savePreferences} className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('settings_page.profile_title')}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  ['firstName', t('auth.first_name')],
                  ['lastName', t('auth.last_name')],
                  ['title', t('settings_page.professional_title')],
                  ['location', t('settings_page.location')],
                ].map(([key, label]) => (
                  <label key={key}>
                    <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{label}</span>
                    <input value={preferences[key]} onChange={(event) => updatePreference(key, event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none focus:border-primary-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
                  </label>
                ))}
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{t('settings_page.bio')}</span>
                <textarea rows="4" value={preferences.bio} onChange={(event) => updatePreference('bio', event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none focus:border-primary-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{t('cv.email')}</span>
                <input type="email" value={email} disabled className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 p-3 font-bold text-gray-500 outline-none dark:border-gray-800 dark:bg-gray-950" />
              </label>
              <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-gray-950">
                <Save className="h-4 w-4" />
                {t('common.save')}
              </button>
            </form>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('portfolio.public_portfolio')}</h2>
              {!portfolio ? (
                <Loader2 className="h-7 w-7 animate-spin text-primary-500" />
              ) : (
                <>
                  <button onClick={() => setPortfolio({ ...portfolio, is_public: !portfolio.is_public })} className={`flex w-full items-center justify-between rounded-3xl border p-5 text-left ${portfolio.is_public ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950'}`}>
                    <div>
                      <p className="font-black text-gray-950 dark:text-white">{portfolio.is_public ? t('portfolio.public') : t('portfolio.private')}</p>
                      <p className="mt-1 text-sm font-bold text-gray-500 dark:text-gray-400">{t('portfolio.link_label')}: /portfolio/{portfolio.custom_url}</p>
                    </div>
                    <div className={`h-7 w-12 rounded-full p-1 ${portfolio.is_public ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                      <div className={`h-5 w-5 rounded-full bg-white transition ${portfolio.is_public ? 'translate-x-5' : ''}`} />
                    </div>
                  </button>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{t('portfolio.custom_url')}</span>
                    <input value={portfolio.custom_url} onChange={(event) => setPortfolio({ ...portfolio, custom_url: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none focus:border-primary-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
                  </label>
                  <button onClick={savePortfolio} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {t('common.save')}
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('settings_tabs.security')}</h2>
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">{t('settings_page.security_note')}</div>
              <input type="password" placeholder={t('settings_page.current_password')} className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
              <input type="password" placeholder={t('settings_page.new_password')} className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('settings_tabs.appearance')}</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['#7C3AED', t('theme.purple')],
                  ['#3B82F6', t('theme.blue')],
                  ['#10B981', t('theme.green')],
                  ['#EF4444', t('theme.red')],
                  ['#F97316', t('theme.orange')],
                  ['#111827', t('theme.black')],
                ].map(([color, label]) => (
                  <button key={color} onClick={() => updatePreference('accent', color)} className={`flex items-center gap-3 rounded-3xl border p-4 text-left font-black dark:border-gray-800 ${preferences.accent === color ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''}`}>
                    <span className="h-8 w-8 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </button>
                ))}
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-gray-700 dark:text-gray-300"><Type className="h-4 w-4" /> {t('settings_page.font_size')}</div>
                <div className="grid gap-3 md:grid-cols-3">
                  {['compact', 'comfortable', 'large'].map((size) => (
                    <button key={size} onClick={() => updatePreference('fontSize', size)} className={`rounded-2xl border px-4 py-3 text-sm font-black dark:border-gray-800 ${preferences.fontSize === size ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950' : 'bg-gray-50 text-gray-500 dark:bg-gray-950'}`}>
                      {t(`settings_page.font_${size}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('settings_tabs.notifications')}</h2>
              {[
                ['emailNotifications', t('settings_page.job_matches')],
                ['badgeNotifications', t('settings_page.badges')],
                ['securityNotifications', t('settings_page.security_alerts')],
              ].map(([key, item]) => (
                <button key={key} onClick={() => updatePreference(key, !preferences[key])} className="flex w-full items-center justify-between rounded-3xl border border-gray-100 p-5 text-left dark:border-gray-800">
                  <p className="font-black text-gray-800 dark:text-gray-100">{item}</p>
                  <div className={`h-7 w-12 rounded-full p-1 ${preferences[key] ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`h-5 w-5 rounded-full bg-white transition ${preferences[key] ? 'translate-x-5' : ''}`} />
                  </div>
                </button>
              ))}
              <button onClick={savePreferences} className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-gray-950">
                <Save className="h-4 w-4" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('settings_tabs.language')}</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['fr', 'Français'],
                  ['en', 'English'],
                  ['ar', 'العربية'],
                ].map(([lng, label]) => (
                  <button key={lng} onClick={() => i18n.changeLanguage(lng)} className={`rounded-3xl border p-5 text-left text-lg font-black dark:border-gray-800 ${i18n.language === lng ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-200'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-sm font-bold leading-7 text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                {t('settings_page.rtl_preview')}
              </div>
            </div>
          )}

          {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-600 dark:bg-red-950/20">{error}</p>}
          {success && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle className="h-4 w-4" />
              {t('settings_page.saved')}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

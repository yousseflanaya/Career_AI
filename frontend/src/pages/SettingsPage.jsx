import { useEffect, useState } from 'react';
import { Bell, CheckCircle, Globe2, Loader2, Lock, Save, User } from 'lucide-react';
import api from '../lib/axios';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [portfolio, setPortfolio] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/portfolio');
        setPortfolio(response.data);
      } catch (error) {
        console.error('Portfolio settings fetch failed', error);
      }
    };

    fetchPortfolio();
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const savePortfolio = async () => {
    if (!portfolio) return;
    setSaving(true);
    setSuccess(false);
    try {
      const response = await api.put('/portfolio', {
        is_public: portfolio.is_public,
        custom_url: portfolio.custom_url,
      });
      setPortfolio(response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      console.error('Portfolio settings save failed', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'portfolio', icon: Globe2, label: 'Portfolio' },
    { id: 'security', icon: Lock, label: 'Securite' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          <User className="h-4 w-4" />
          Parametres
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">Compte et preferences</h1>
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
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Details personnels</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">Prenom</span>
                  <input type="text" defaultValue="Alex" className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none focus:border-emerald-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">Nom</span>
                  <input type="text" defaultValue="Johnson" className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none focus:border-emerald-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">Email</span>
                <input type="email" defaultValue="alex@example.com" disabled className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 p-3 font-bold text-gray-500 outline-none dark:border-gray-800 dark:bg-gray-950" />
              </label>
              <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-gray-950">
                <Save className="h-4 w-4" />
                Enregistrer
              </button>
            </form>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Portfolio public</h2>
              {!portfolio ? (
                <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
              ) : (
                <>
                  <button
                    onClick={() => setPortfolio({ ...portfolio, is_public: !portfolio.is_public })}
                    className={`flex w-full items-center justify-between rounded-3xl border p-5 text-left ${portfolio.is_public ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950'}`}
                  >
                    <div>
                      <p className="font-black text-gray-950 dark:text-white">{portfolio.is_public ? 'Visible publiquement' : 'Portfolio prive'}</p>
                      <p className="mt-1 text-sm font-bold text-gray-500 dark:text-gray-400">Lien: /portfolio/{portfolio.custom_url}</p>
                    </div>
                    <div className={`h-7 w-12 rounded-full p-1 ${portfolio.is_public ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                      <div className={`h-5 w-5 rounded-full bg-white transition ${portfolio.is_public ? 'translate-x-5' : ''}`} />
                    </div>
                  </button>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">URL</span>
                    <input value={portfolio.custom_url} onChange={(event) => setPortfolio({ ...portfolio, custom_url: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none focus:border-emerald-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
                  </label>
                  <button onClick={savePortfolio} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Securite</h2>
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                Un changement de mot de passe deconnectera les sessions actives.
              </div>
              <input type="password" placeholder="Mot de passe actuel" className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
              <input type="password" placeholder="Nouveau mot de passe" className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 font-bold outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Notifications</h2>
              {['Job matches', 'Badges', 'Alertes securite'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-3xl border border-gray-100 p-5 dark:border-gray-800">
                  <p className="font-black text-gray-800 dark:text-gray-100">{item}</p>
                  <div className="h-7 w-12 rounded-full bg-emerald-500 p-1">
                    <div className="h-5 w-5 translate-x-5 rounded-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {success && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle className="h-4 w-4" />
              Modifications enregistrees.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

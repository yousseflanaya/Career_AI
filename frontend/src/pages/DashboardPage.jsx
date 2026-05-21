import { useEffect, useMemo, useState } from 'react';
import { Award, BarChart3, CheckCircle2, FileSearch, FileText, Loader2, Map, Sparkles, Target, Video } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function MetricCard({ title, value, subtitle, icon: Icon, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40',
    blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/40',
    amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40',
    rose: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40',
  };

  return (
    <div className={`rounded-[1.75rem] border p-5 shadow-sm ${tones[tone]}`}>
      <div className="mb-5 flex items-center justify-between">
        <Icon className="h-6 w-6" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</span>
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-2 text-sm font-bold opacity-70">{subtitle}</p>
    </div>
  );
}

function BadgeIcon({ earned }) {
  return (
    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${earned ? 'bg-amber-400 text-gray-950 shadow-lg shadow-amber-400/20' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
      <Award className="h-5 w-5" />
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [badges, setBadges] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, notifRes, badgeRes, analyticsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/notifications'),
          api.get('/badges'),
          api.get('/analytics'),
        ]);
        setData(profileRes.data);
        setNotifications(notifRes.data);
        setBadges(badgeRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const firstName = (data?.user?.name || 'User').split(' ')[0];
  const completion = badges?.profile_completion || 0;
  const latestAts = analytics?.ats_scores?.slice(-1)?.[0]?.score || 0;
  const latestInterview = analytics?.interview_scores?.slice(-1)?.[0]?.score || 0;
  const earnedBadges = useMemo(() => (badges?.badges || []).filter((badge) => badge.earned), [badges]);

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Career cockpit
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-gray-950 dark:text-white md:text-5xl">
              {t('welcome', 'Bienvenue')}, {firstName}. Votre profil prend forme.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
              Score ATS, simulations, roadmap et portfolio sont maintenant reunis dans un tableau de bord plus lisible.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => navigate('/cv-intelligence')} className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-gray-950/10 transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100">
                <FileSearch className="h-5 w-5" />
                Analyser un CV
              </button>
              <button onClick={() => navigate('/roadmap')} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-black text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
                <Map className="h-5 w-5" />
                Voir roadmap
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Niveau</p>
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-4xl font-black text-gray-950 dark:text-white">{badges?.level || 'Debutant'}</p>
            <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">{badges?.points || 0} points</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(((badges?.points || 0) / Math.max(badges?.next_level_points || 150, 1)) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Profil" value={`${completion}%`} subtitle="Informations completees" icon={CheckCircle2} tone="emerald" />
        <MetricCard title="ATS" value={`${latestAts}/100`} subtitle="Dernier score CV" icon={FileText} tone="blue" />
        <MetricCard title="Entretien" value={`${latestInterview}%`} subtitle="Dernier score STAR" icon={Video} tone="amber" />
        <MetricCard title="Badges" value={`${earnedBadges.length}/${badges?.badges?.length || 0}`} subtitle="Progression gamifiee" icon={Award} tone="rose" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Badges</h2>
              <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions terminees et prochains objectifs.</p>
            </div>
            <Target className="h-6 w-6 text-emerald-500" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {(badges?.badges || []).map((badge) => (
              <div key={badge.id} className={`flex items-center gap-4 rounded-3xl border p-4 transition ${badge.earned ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20' : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950'}`}>
                <BadgeIcon earned={badge.earned} />
                <div className="min-w-0">
                  <p className="truncate font-black text-gray-950 dark:text-white">{badge.name}</p>
                  <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">{badge.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Activite recente</h2>
              <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">Notifications et evenements IA.</p>
            </div>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>

          <div className="space-y-4">
            {notifications.length === 0 && (
              <p className="rounded-3xl bg-gray-50 p-6 text-center text-sm font-bold text-gray-400 dark:bg-gray-950">Aucune activite recente.</p>
            )}
            {notifications.slice(0, 6).map((notification) => (
              <div key={notification.id} className="flex gap-4 rounded-3xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div className={`mt-1 h-3 w-3 rounded-full ${notification.is_read ? 'bg-gray-300 dark:bg-gray-700' : 'bg-emerald-500'}`} />
                <div className="min-w-0">
                  <p className="truncate font-black text-gray-950 dark:text-white">{notification.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

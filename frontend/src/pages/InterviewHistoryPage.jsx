import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Loader2, Play, RotateCcw, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/interviews');
        setSessions(response.data);
        if (response.data[0]) {
          openSession(response.data[0].id);
        }
      } catch (error) {
        console.error('Interviews fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const openSession = async (id) => {
    setLoadingSession(true);
    try {
      const response = await api.get(`/interviews/${id}`);
      setActiveSession(response.data);
    } catch (error) {
      console.error('Interview session fetch failed', error);
    } finally {
      setLoadingSession(false);
    }
  };

  const replay = (session) => {
    sessionStorage.setItem('careerai_replay_job', session.job_title);
    navigate('/interview-prep');
  };

  const chart = useMemo(() => sessions.slice().reverse(), [sessions]);

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
            <Video className="h-4 w-4" />
            Historique entretiens
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">Sessions, feedback et progression</h1>
        </div>
        <button onClick={() => navigate('/interview-prep')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-gray-950/10 hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100">
          <Play className="h-5 w-5" />
          Nouvelle simulation
        </button>
      </div>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-black text-gray-950 dark:text-white">Evolution du score</h2>
        <div className="flex h-44 items-end gap-3">
          {chart.length === 0 && <p className="text-sm font-bold text-gray-400">Aucune simulation sauvegardee.</p>}
          {chart.map((session) => (
            <div key={session.id} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-end rounded-t-2xl bg-gray-100 dark:bg-gray-800" style={{ height: 128 }}>
                <div className="w-full rounded-t-2xl bg-emerald-500 transition-all" style={{ height: `${Math.max(session.overall_score, 6)}%` }} />
              </div>
              <span className="text-xs font-black text-gray-400">{session.overall_score}%</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-5 text-xl font-black text-gray-950 dark:text-white">Sessions passees</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => openSession(session.id)}
                className={`w-full rounded-3xl border p-4 text-left transition ${activeSession?.id === session.id ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20' : 'border-gray-100 bg-gray-50 hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black text-gray-950 dark:text-white">{session.job_title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-gray-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">{session.overall_score}%</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {loadingSession ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
          ) : activeSession ? (
            <div>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white">{activeSession.job_title}</h2>
                  <p className="mt-1 text-sm font-bold text-gray-400">Score global {activeSession.overall_score}%</p>
                </div>
                <button onClick={() => replay(activeSession)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">
                  <RotateCcw className="h-4 w-4" />
                  Rejouer
                </button>
              </div>

              <div className="space-y-4">
                {(activeSession.questions || []).map((item, index) => (
                  <article key={item.id || index} className="rounded-3xl border border-gray-100 p-5 dark:border-gray-800">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h3 className="text-lg font-black leading-7 text-gray-950 dark:text-white">{index + 1}. {item.question}</h3>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{item.star_score}%</span>
                    </div>
                    <p className="rounded-2xl bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-700 dark:bg-gray-950 dark:text-gray-300">{item.user_answer || 'Aucune reponse sauvegardee.'}</p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">{item.ai_feedback || 'Feedback IA non disponible.'}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-sm font-bold text-gray-400">Selectionnez une session.</div>
          )}
        </section>
      </div>
    </div>
  );
}

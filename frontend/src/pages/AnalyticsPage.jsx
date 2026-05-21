import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { BarChart3, Download, Loader2, TrendingUp } from 'lucide-react';
import api from '../lib/axios';

function MiniLine({ data = [], valueKey = 'score', color = '#10b981' }) {
  const width = 520;
  const height = 150;
  const points = data.length
    ? data.map((item, index) => {
        const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
        const y = height - ((item[valueKey] || 0) / 100) * height;
        return `${x},${y}`;
      }).join(' ')
    : '';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full overflow-visible">
      <line x1="0" y1={height} x2={width} y2={height} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="2" />
      {points && <polyline fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />}
      {data.map((item, index) => {
        const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
        const y = height - ((item[valueKey] || 0) / 100) * height;
        return <circle key={`${item.date}-${index}`} cx={x} cy={y} r="5" fill={color} className="drop-shadow" />;
      })}
    </svg>
  );
}

function Stat({ label, value, tone = 'emerald' }) {
  const toneClass = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40',
    blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/40',
    amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40',
  }[tone];

  return (
    <div className={`rounded-3xl border p-5 ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get('/analytics', { params: { period } });
        setData(response.data);
      } catch (error) {
        console.error('Analytics fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  const exportPdf = () => {
    if (!reportRef.current) return;
    html2pdf().from(reportRef.current).set({
      margin: 0.4,
      filename: 'careerai-analytics.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save();
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  const atsScores = data?.ats_scores || [];
  const interviewScores = data?.interview_scores || [];
  const badgeProgress = data?.badges_progress || {};

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <BarChart3 className="h-4 w-4" />
            Analytics personnel
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">Progression et signaux carriere</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {['7d', '30d', '90d'].map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${period === item ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950' : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-950 dark:bg-gray-900 dark:ring-gray-800 dark:hover:text-white'}`}
            >
              {item === '7d' ? '7j' : item === '30d' ? '30j' : '3 mois'}
            </button>
          ))}
          <button onClick={exportPdf} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Score entretien moyen" value={`${data?.average_interview_score || 0}%`} tone="emerald" />
          <Stat label="Badges debloques" value={`${badgeProgress.earned || 0}/${badgeProgress.total || 0}`} tone="blue" />
          <Stat label="Niveau" value={badgeProgress.level || 'Debutant'} tone="amber" />
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-950 dark:text-white">Evolution ATS</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{atsScores.length} analyse(s)</p>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <MiniLine data={atsScores} color="#10b981" />
          </section>

          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-950 dark:text-white">Entretiens simules</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{interviewScores.length} session(s)</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <MiniLine data={interviewScores} color="#3b82f6" />
          </section>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-6 text-xl font-black text-gray-950 dark:text-white">Simulations par semaine</h2>
            <div className="space-y-4">
              {(data?.simulations_by_week || []).length === 0 && (
                <p className="rounded-2xl bg-gray-50 p-5 text-sm font-bold text-gray-400 dark:bg-gray-950">Aucune simulation sur cette periode.</p>
              )}
              {(data?.simulations_by_week || []).map((item) => (
                <div key={item.week}>
                  <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                    <span>{item.week}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(item.count * 20, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-6 text-xl font-black text-gray-950 dark:text-white">Competences mentionnees</h2>
            <div className="space-y-3">
              {(data?.top_skills || []).length === 0 && (
                <p className="rounded-2xl bg-gray-50 p-5 text-sm font-bold text-gray-400 dark:bg-gray-950">Ajoutez des competences pour alimenter ce graphique.</p>
              )}
              {(data?.top_skills || []).map((skill) => (
                <div key={skill.name} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                  <span className="text-sm font-black text-gray-800 dark:text-gray-100">{skill.name}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500 dark:bg-gray-800">{skill.mentions}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

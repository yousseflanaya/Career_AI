import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FileSearch, Loader2, UploadCloud, XCircle, GraduationCap } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

function ScoreRing({ score = 0, label = 'Score' }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} strokeWidth="10" className="fill-none stroke-gray-100 dark:stroke-gray-800" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="fill-none stroke-emerald-500 transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-950 dark:text-white">{score}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      </div>
    </div>
  );
}

function PillList({ items = [], tone = 'emerald' }) {
  const toneClass = tone === 'rose'
    ? 'border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300'
    : tone === 'amber'
      ? 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
      : 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300';

  return (
    <div className="flex flex-wrap gap-2">
      {(items.length ? items : ['Aucune donnee pour le moment']).map((item, index) => (
        <span key={`${item}-${index}`} className={`rounded-full border px-3 py-1 text-xs font-black ${toneClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function CVIntelligencePage() {
  const { i18n } = useTranslation();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [jobOffer, setJobOffer] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const analysisReadiness = useMemo(() => {
    if (!analysis) return 'En attente';
    if (analysis.score >= 80) return 'Tres solide';
    if (analysis.score >= 65) return 'Bon potentiel';
    return 'A renforcer';
  }, [analysis]);

  const analyzeCv = async () => {
    if (!file) {
      setError('Selectionnez un PDF avant de lancer l analyse.');
      return;
    }

    setError('');
    setAnalysis(null);
    setLoadingAnalysis(true);
    setProgress(12);

    const timer = setInterval(() => {
      setProgress((value) => Math.min(value + 9, 88));
    }, 420);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('lang', i18n.language);
      const response = await api.post('/cv/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(response.data);
      setProgress(100);
    } catch (err) {
      setError(err.response?.data?.message || 'Analyse ATS indisponible pour le moment.');
    } finally {
      clearInterval(timer);
      setLoadingAnalysis(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const compareCv = async () => {
    if (!jobOffer.trim()) {
      setError('Collez une offre d emploi avant de comparer.');
      return;
    }

    setError('');
    setComparison(null);
    setLoadingComparison(true);

    try {
      const response = await api.post('/cv/compare', {
        job_offer_text: jobOffer,
        lang: i18n.language,
      });
      setComparison(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparaison indisponible pour le moment.');
    } finally {
      setLoadingComparison(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-950 text-white shadow-2xl shadow-gray-950/10 dark:border-gray-800">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-200">
              <FileSearch className="h-4 w-4" />
              CV Intelligence
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Score ATS, compatibilite offre et recommandations actionnables.
            </h1>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Dernier statut</p>
                <p className="mt-1 text-2xl font-black">{analysisReadiness}</p>
              </div>
              <ScoreRing score={analysis?.score || 0} label="/100" />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">Analyse ATS</h2>
              <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">PDF vers score, forces, faiblesses et suggestions.</p>
            </div>
            <UploadCloud className="h-7 w-7 text-emerald-500" />
          </div>

          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20">
            <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
            <span className="text-sm font-black text-gray-800 dark:text-gray-100">{file ? file.name : 'Uploader un CV en PDF'}</span>
            <span className="mt-1 text-xs font-bold text-gray-400">PDF, max 8 MB</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>

          {loadingAnalysis && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                <span>Analyse en cours</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <button
            onClick={analyzeCv}
            disabled={loadingAnalysis}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-gray-950/10 transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
          >
            {loadingAnalysis ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileSearch className="h-5 w-5" />}
            Analyser mon CV
          </button>

          {analysis && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-5 rounded-3xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <ScoreRing score={analysis.score} label="ATS" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Rapport</p>
                  <h3 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">{analysis.score}/100</h3>
                  <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Derniere analyse: {new Date(analysis.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Forces
                  </h4>
                  <ul className="space-y-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                    {(analysis.strengths || []).map((item, index) => <li key={index}>- {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-3xl border border-rose-100 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-rose-700 dark:text-rose-300">
                    <XCircle className="h-4 w-4" />
                    Faiblesses
                  </h4>
                  <ul className="space-y-2 text-sm font-semibold text-rose-900 dark:text-rose-100">
                    {(analysis.weaknesses || []).map((item, index) => <li key={index}>- {item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  <GraduationCap className="h-4 w-4" />
                  Suggestions
                </h4>
                <PillList items={analysis.suggestions || []} tone="amber" />
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">CV vs Offre</h2>
              <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Score de compatibilite et gap analysis.</p>
            </div>
            <CheckCircle2 className="h-7 w-7 text-blue-500" />
          </div>

          <textarea
            value={jobOffer}
            onChange={(event) => setJobOffer(event.target.value)}
            rows="11"
            placeholder="Collez l offre d emploi ici..."
            className="w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 p-5 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-700"
          />

          <button
            onClick={compareCv}
            disabled={loadingComparison}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loadingComparison ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileSearch className="h-5 w-5" />}
            Analyser la compatibilite
          </button>

          {comparison && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between rounded-3xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-500">Match</p>
                  <p className="mt-1 text-4xl font-black text-blue-700 dark:text-blue-300">{comparison.match_score}%</p>
                </div>
                <div className="h-16 w-40 overflow-hidden rounded-full bg-white shadow-inner dark:bg-gray-900">
                  <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${comparison.match_score}%` }} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 p-5 dark:border-emerald-900/40">
                  <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-emerald-600">Competences matchees</h4>
                  <PillList items={comparison.matched_skills || []} tone="emerald" />
                </div>
                <div className="rounded-3xl border border-rose-100 p-5 dark:border-rose-900/40">
                  <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-rose-600">Competences manquantes</h4>
                  <PillList items={comparison.missing_skills || []} tone="rose" />
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-gray-500">Formations et actions</h4>
                <ul className="space-y-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {(comparison.recommendations || []).map((item, index) => <li key={index}>- {item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

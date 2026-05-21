import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Check, Download, Loader2, Map, Sparkles } from 'lucide-react';
import api from '../lib/axios';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const response = await api.get('/roadmap');
        setRoadmap(response.data);
      } catch (error) {
        console.error('Roadmap fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const toggleStep = async (step) => {
    if (!roadmap) return;
    const completed = !step.completed;
    setRoadmap({
      ...roadmap,
      steps: roadmap.steps.map((item) => item.id === step.id ? { ...item, completed } : item),
    });

    try {
      await api.patch('/roadmap/progress', {
        roadmap_id: roadmap.id,
        step_id: step.id,
        completed,
      });
    } catch (error) {
      console.error('Roadmap progress update failed', error);
    }
  };

  const exportPdf = () => {
    if (!reportRef.current) return;
    html2pdf().from(reportRef.current).set({
      margin: 0.45,
      filename: 'careerai-roadmap.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save();
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  const steps = roadmap?.steps || [];
  const completed = steps.filter((step) => step.completed).length;
  const progress = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
              <Map className="h-4 w-4" />
              Roadmap interactive
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">{roadmap?.riasec_type || 'Career roadmap'}</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500 dark:text-gray-400">Timeline personnalisee, progression cochee et export PDF.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Progression</p>
              <p className="mt-1 text-3xl font-black text-gray-950 dark:text-white">{progress}%</p>
            </div>
            <button onClick={exportPdf} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-gray-950/10 hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100">
              <Download className="h-5 w-5" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section ref={reportRef} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="relative space-y-6 before:absolute before:left-6 before:top-8 before:bottom-8 before:w-px before:bg-gray-200 dark:before:bg-gray-800">
          {steps.map((step, index) => (
            <article key={step.id} className="relative grid gap-4 pl-16 md:grid-cols-[0.8fr_1.2fr]">
              <button
                onClick={() => toggleStep(step)}
                className={`absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-black transition ${step.completed ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-gray-200 bg-white text-gray-400 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950'}`}
                title={step.completed ? 'Marquer comme en cours' : 'Marquer comme terminee'}
              >
                {step.completed ? <Check className="h-5 w-5" /> : index + 1}
              </button>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-500">{step.timeline}</p>
                <h2 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">{step.title}</h2>
                <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500 dark:bg-gray-800 dark:text-gray-300">{step.focus}</p>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <p className="text-sm font-semibold leading-7 text-gray-700 dark:text-gray-300">{step.details}</p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                      <Sparkles className="h-4 w-4" />
                      Ressources
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(step.resources || []).map((resource, resourceIndex) => (
                        <span key={`${resource}-${resourceIndex}`} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">{resource}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Projets pratiques</h3>
                    <ul className="space-y-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {(step.projects || []).map((project, projectIndex) => <li key={`${project}-${projectIndex}`}>- {project}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

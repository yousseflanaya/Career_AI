import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

const QUESTIONS = [
  { id: 1, key: "q1", category: "R" },
  { id: 2, key: "q2", category: "R" },
  { id: 3, key: "q3", category: "I" },
  { id: 4, key: "q4", category: "I" },
  { id: 5, key: "q5", category: "A" },
  { id: 6, key: "q6", category: "A" },
  { id: 7, key: "q7", category: "S" },
  { id: 8, key: "q8", category: "S" },
  { id: 9, key: "q9", category: "E" },
  { id: 10, key: "q10", category: "E" },
  { id: 11, key: "q11", category: "C" },
  { id: 12, key: "q12", category: "C" }
];

export default function CareerQuizPage() {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/quiz', { 
        answers: finalAnswers,
        lang: i18n.language
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assessment results.");
    } finally {
      setLoading(false);
    }
  };

  const handleLevelSelect = (level) => {
    const q = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [q.id]: { text: t(`quiz.${q.key}`), score: level, cat: q.category } };
    setAnswers(newAnswers);
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  if (result) {
    const riasec = result.score_data?.riasec_scores || {};
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500" dir="auto">
        <div className="text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-bold mb-4 uppercase tracking-widest">
                {t('quiz.results_title')}
            </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100">{t('quiz.results_personality', { type: result.personality_type })}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">{result.score_data?.analysis}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(riasec).map(([key, val]) => (
                <div key={key} className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-400 font-bold mb-1">{key}</p>
                    <div className="h-16 w-full bg-gray-50 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-primary-500 transition-all duration-1000" 
                            style={{ height: `${val}%` }}
                        ></div>
                    </div>
                    <p className="mt-2 font-bold dark:text-gray-200">{val}%</p>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.recommended_jobs.map((job, idx) => (
            <div key={idx} className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="w-16 h-16" />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold dark:text-gray-100">{job.title}</h3>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">{job.match_percentage}% {t('quiz.score_label')}</span>
                </div>
                
                <p className="text-primary-600 font-bold text-sm mb-6">{job.salary_range}</p>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2 italic">
                            <span className="w-4 h-px bg-gray-300"></span> {t('quiz.roadmap_label')}
                        </p>
                        <ul className="space-y-2">
                            {job.roadmap?.map((step, i) => (
                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {job.required_skills?.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-md border border-gray-100 dark:border-gray-700">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
            <button 
                onClick={() => { setResult(null); setCurrentStep(0); setAnswers({}); }}
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
                {t('quiz.retake')}
            </button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4" dir="auto">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">{t('quiz.title')}</h1>
            <span className="text-xs font-bold text-gray-400">{t('quiz.step', { current: currentStep + 1, total: QUESTIONS.length })}</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-300 shadow-[0_0_8px_rgba(124,58,237,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary-500/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-right-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-10 text-center">
            {t(`quiz.${QUESTIONS[currentStep].key}`)}
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
            {[
                { label: t('quiz.absolutely_not'), val: 1, color: "hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 hover:border-red-200" },
                { label: t('quiz.not_really'), val: 2, color: "hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 hover:border-orange-200" },
                { label: t('quiz.neutral'), val: 3, color: "hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 hover:border-gray-200" },
                { label: t('quiz.somewhat'), val: 4, color: "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 hover:border-blue-200" },
                { label: t('quiz.exactly'), val: 5, color: "hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600 hover:border-green-200" }
            ].map((btn) => (
                <button
                    key={btn.val}
                    onClick={() => handleLevelSelect(btn.val)}
                    disabled={loading}
                    className={`p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-left font-bold transition-all group relative overflow-hidden ${btn.color} ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm">
                            {btn.val}
                        </div>
                        <span className="dark:text-gray-100 group-hover:text-inherit">{btn.label}</span>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center animate-pulse">
          <p className="text-primary-600 font-bold">{t('quiz.analyzing')}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl border border-red-100 dark:border-red-800 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
}

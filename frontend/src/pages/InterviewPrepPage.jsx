import { useEffect, useState } from 'react';
import { Video, Loader2, MessageSquare, Lightbulb, Target, ArrowRight, Save } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function InterviewPrepPage() {
    const { t, i18n } = useTranslation();
    const [jobTitle, setJobTitle] = useState('');
    const [level, setLevel] = useState('Junior');
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [savingHistory, setSavingHistory] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const replayJob = sessionStorage.getItem('careerai_replay_job');
        if (replayJob) {
            setJobTitle(replayJob);
            sessionStorage.removeItem('careerai_replay_job');
        }
    }, []);

    const generateQuestions = async () => {
        if (!jobTitle) return;
        setLoading(true);
        setQuestions(null);
        try {
            const response = await api.post('/interview/generate', { job_title: jobTitle, level, lang: i18n.language });
            setQuestions(response.data);
            setActiveIdx(0);
            setAnswers({});
            setSaved(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const scoreAnswer = (answer) => {
        if (!answer?.trim()) return 35;
        return Math.min(95, 52 + Math.round(answer.trim().length / 10));
    };

    const saveSession = async () => {
        if (!questions || saved) return;
        setSavingHistory(true);
        const payloadQuestions = questions.map((question, index) => {
            const answer = answers[index] || '';
            return {
                question: question.question,
                user_answer: answer,
                ai_feedback: `${question.rationale || ''}\nSTAR: ${question.sample_outline || ''}`,
                star_score: scoreAnswer(answer),
            };
        });
        const overallScore = Math.round(payloadQuestions.reduce((sum, question) => sum + question.star_score, 0) / payloadQuestions.length);

        try {
            await api.post('/interviews', {
                job_title: `${level} ${jobTitle}`,
                overall_score: overallScore,
                questions: payloadQuestions,
            });
            setSaved(true);
        } catch (error) {
            console.error(error);
        } finally {
            setSavingHistory(false);
        }
    };

    const nextQuestion = async () => {
        if (!questions) return;
        if (activeIdx === questions.length - 1) {
            await saveSession();
            return;
        }
        setActiveIdx(prev => prev + 1);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">{t('interview_prep')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('interview_desc', 'Master your next interview with personalized questions and AI coaching.')}</p>
                </div>
                <div className="flex gap-2 p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    {['Junior', 'Senior', 'Lead'].map(l => (
                        <button 
                            key={l}
                            onClick={() => setLevel(l)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${level === l ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        >
                            {t(l.toLowerCase()) || l.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {!questions ? (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-primary-500/5 border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                    <div className="mx-auto w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-8">
                        <Video className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-gray-100 mb-4">What's the job you're targeting?</h2>
                    <div className="max-w-md mx-auto space-y-6">
                        <input 
                            type="text" 
                            placeholder="e.g. Software Engineer, Marketing Manager..."
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 dark:text-gray-100 rounded-2xl outline-none transition-all text-lg font-medium shadow-inner"
                        />
                        <button 
                            onClick={generateQuestions}
                            disabled={loading || !jobTitle}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin"/> : <ArrowRight className="w-6 h-6"/>}
                            {loading ? 'Preparing Session...' : 'Start Training Session'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Session Progress */}
                    <div className="flex gap-2">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i === activeIdx ? 'bg-primary-600 shadow-[0_0_8px_rgba(124,58,237,0.4)]' : i < activeIdx ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl min-h-[400px] flex flex-col justify-center animate-in slide-in-from-right-8 duration-500">
                                <div className="text-primary-600 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5"/> Question {activeIdx + 1}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black dark:text-gray-100 leading-tight">
                                    {questions[activeIdx].question}
                                </h3>

                                <textarea
                                    rows="5"
                                    value={answers[activeIdx] || ''}
                                    onChange={(event) => setAnswers({ ...answers, [activeIdx]: event.target.value })}
                                    placeholder="Redigez votre reponse STAR ici..."
                                    className="mt-8 w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 p-5 text-sm font-semibold text-gray-800 outline-none transition focus:border-primary-400 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                                />
                                
                                <div className="mt-12 flex justify-between items-center border-t dark:border-gray-800 pt-8">
                                    <button 
                                        onClick={() => setQuestions(null)}
                                        className="text-gray-400 font-bold hover:text-red-500 transition-colors"
                                    >
                                        End Session
                                    </button>
                                    <button 
                                        onClick={nextQuestion}
                                        disabled={savingHistory || saved}
                                        className="px-8 py-4 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {savingHistory ? <Loader2 className="w-4 h-4 animate-spin" /> : activeIdx === questions.length - 1 ? <Save className="w-4 h-4" /> : null}
                                        {saved ? 'Session Saved' : activeIdx === questions.length - 1 ? 'Save Session' : 'Next Question'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-primary-50/50 dark:bg-primary-900/10 p-6 rounded-3xl border border-primary-100/50 dark:border-primary-800/50">
                                <h4 className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-black text-xs uppercase tracking-widest mb-4">
                                    <Lightbulb className="w-4 h-4" /> Coaching Tip
                                </h4>
                                <p className="text-sm text-primary-800/80 dark:text-primary-300 leading-relaxed font-semibold italic">
                                    "{questions[activeIdx].rationale}"
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest mb-4">
                                    <Target className="w-4 h-4" /> Recommended Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {questions[activeIdx].keywords?.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-[10px] font-black dark:text-gray-300">
                                            {kw.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100/50 dark:border-green-800/50">
                                <h4 className="text-green-700 dark:text-green-400 font-black text-xs uppercase tracking-widest mb-2">Answer Strategy (STAR)</h4>
                                <p className="text-xs text-green-800/80 dark:text-green-300 leading-relaxed font-bold">
                                    {questions[activeIdx].sample_outline}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { X, ChevronRight, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OnboardingTour() {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem('onboarding_done');
        if (!done) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const complete = () => {
        localStorage.setItem('onboarding_done', 'true');
        setIsVisible(false);
    };

    const STEPS = [
        {
            title: "Welcome to CareerAI",
            desc: "Your AI-powered career co-pilot is ready. Let's take a quick look at your new workspace.",
            icon: Sparkles,
            color: "text-primary-600 bg-primary-100"
        },
        {
            title: "AI Personality Drill",
            desc: "Start with the Orientation Quiz. We use the RIASEC framework to map your personality to high-paying careers.",
            icon: Target,
            color: "text-indigo-600 bg-indigo-100"
        },
        {
            title: "Smart CV Builder",
            desc: "Build your resume and get real-time AI feedback on ATS optimization and action verbs.",
            icon: Zap,
            color: "text-yellow-600 bg-yellow-100"
        },
        {
            title: "Interview Simulator",
            desc: "Practice with our AI coach. Get tailored questions and STAR-method answer strategies.",
            icon: ShieldCheck,
            color: "text-green-600 bg-green-100"
        }
    ];

    if (!isVisible) return null;

    const CurrentIcon = STEPS[step].icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1.5 flex">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-primary-600' : 'bg-gray-100 dark:bg-gray-800'}`}></div>
                    ))}
                </div>

                <div className="p-10 pt-16 text-center">
                    <div className={`mx-auto w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 ${STEPS[step].color} shadow-lg`}>
                        <CurrentIcon className="w-10 h-10" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tight leading-tight">
                        {STEPS[step].title}
                    </h2>
                    
                    <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed px-4">
                        {STEPS[step].desc}
                    </p>

                    <div className="mt-12 flex items-center justify-between">
                        <button onClick={complete} className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            Skip Tour
                        </button>
                        
                        <div className="flex gap-2">
                             {step < STEPS.length - 1 ? (
                                <button 
                                    onClick={() => setStep(step + 1)}
                                    className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    Next <ChevronRight className="w-5 h-5" />
                                </button>
                             ) : (
                                <button 
                                    onClick={complete}
                                    className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Get Started
                                </button>
                             )}
                        </div>
                    </div>
                </div>
                
                <button onClick={complete} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

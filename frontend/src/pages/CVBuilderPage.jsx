import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, CheckCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function CVBuilderPage() {
  const { t, i18n } = useTranslation();
  const STEPS = [
    t('cv.step_personal', 'Personal Info'),
    t('cv.step_education', 'Education'),
    t('cv.step_experience', 'Experience'),
    t('cv.step_skills', 'Skills'),
    t('cv.step_preview', 'Preview & Download')
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const cvRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', summary: '',
    degree: '', school: '', year: '',
    jobTitle: '', company: '', duration: '', jobDesc: '',
    skills: ''
  });

  const [feedback, setFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const getAIFeedback = async () => {
    setAnalyzing(true);
    setFeedback(null);
    try {
      const response = await api.post('/cv/feedback', { 
        cv_data: formData,
        lang: i18n.language
      });
      setFeedback(response.data);
    } catch (error) {
      console.error("CV feedback error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = () => {
    const element = cvRef.current;
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: `${formData.fullName.replace(/\s+/g, '_') || 'My'}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
    api.post('/notifications', {
        title: 'CV Downloaded',
        message: `Your professional CV (${formData.fullName}) has been successfully generated and downloaded as PDF.`,
        type: 'success'
    }).catch(e => console.error("Notification trigger failed", e));
    api.post('/badges/check', { action: 'cv_created' }).catch(e => console.error("Badge trigger failed", e));
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 transition-colors uppercase tracking-tight">{t('cv.builder_title', 'CV Builder')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{t('cv.builder_subtitle', 'Complete the steps below to generate and download your professional PDF CV.')}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((step, idx) => (
            <span key={idx} className={`text-xs font-black uppercase tracking-widest hidden sm:block ${idx <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`}>
              {step}
            </span>
          ))}
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary-600 transition-all duration-500 shadow-[0_0_8px_rgba(124,58,237,0.4)]" style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 min-h-[500px]">
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-800 pb-2 dark:text-gray-100">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label><input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address Location</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm transition-all" /></div>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Professional Summary</label><textarea rows="4" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm transition-all"></textarea></div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-800 pb-2 dark:text-gray-100">Education Background</h2>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Degree / Certification</label><input type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} placeholder="e.g. BSc Computer Science" className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm" /></div>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">School / University</label><input type="text" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm" /></div>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Graduation Year</label><input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm" /></div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-800 pb-2 dark:text-gray-100">Work Experience</h2>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Title</label><input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm" /></div>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Company</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm" /></div>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Jan 2022 - Present" className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm" /></div>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description / Responsibilities</label><textarea rows="4" value={formData.jobDesc} onChange={e => setFormData({...formData, jobDesc: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm"></textarea></div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-800 pb-2 dark:text-gray-100">Core Skills</h2>
            <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label><textarea rows="4" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. JavaScript, React, Leadership, Project Management" className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:text-gray-100 shadow-sm"></textarea></div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                   <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-gray-100"><CheckCircle className="text-green-500" /> Ready to Download</h2>
                   <p className="text-gray-500 dark:text-gray-400">Review your generated CV layout and get AI feedback below.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={getAIFeedback} 
                        disabled={analyzing}
                        className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-indigo-100 disabled:opacity-50"
                    >
                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin"/> : <Sparkles className="w-5 h-5"/>}
                        AI Feedback
                    </button>
                    <button onClick={handleDownload} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg flex items-center gap-2 font-bold transition-all active:scale-95">
                       <Download className="w-5 h-5"/> Save as PDF
                    </button>
                </div>
             </div>

             {feedback && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4">
                    <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-3xl border border-primary-100 dark:border-primary-800 flex flex-col items-center justify-center text-center">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * feedback.overall_score) / 100} className="text-primary-600" />
                            </svg>
                            <span className="absolute text-2xl font-black text-gray-900 dark:text-gray-100">{feedback.overall_score}%</span>
                        </div>
                        <p className="mt-4 font-bold text-primary-700 dark:text-primary-400">Overall CV Score</p>
                    </div>
                    
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h4 className="text-sm font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Strengths
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {feedback.strengths?.map((s, i) => <li key={i}>- {s}</li>)}
                                </ul>
                            </div>
                            <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h4 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Improvements
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {feedback.improvements?.map((s, i) => <li key={i}>- {s}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                            <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-2">ATS Strategy</h4>
                            <p className="text-sm text-indigo-600 dark:text-indigo-300 leading-relaxed italic">"{feedback.ats_suggestions}"</p>
                        </div>
                    </div>
                </div>
             )}

             {/* CV Template Section */}
             <div className="bg-gray-50 dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-x-auto shadow-inner">
               <div ref={cvRef} className="bg-white p-10 w-[800px] mx-auto text-gray-800 font-sans shadow-2xl border border-gray-200" style={{minHeight: "1056px"}}>
                  <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-primary-600 pb-2 mb-4 uppercase tracking-tight">{formData.fullName || 'YOUR NAME'}</h1>
                  <div className="flex gap-4 text-sm text-gray-600 mb-8 font-medium">
                     <span>{formData.email || 'email@example.com'}</span> |
                     <span>{formData.phone || '+1 234 567 890'}</span> |
                     <span>{formData.address || 'City, Country'}</span>
                  </div>

                  {formData.summary && (
                     <div className="mb-8">
                       <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Summary</h2>
                       <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
                     </div>
                  )}

                  <div className="mb-8">
                     <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-1">Experience</h2>
                     <div>
                        <div className="flex justify-between font-bold text-lg text-gray-900">
                           <span>{formData.jobTitle || 'Job Title'}</span>
                           <span className="text-primary-600">{formData.duration || 'Duration'}</span>
                        </div>
                        <div className="text-gray-600 font-medium text-md mb-2">{formData.company || 'Company Name'}</div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.jobDesc || 'Job responsibilities and achievements go here.'}</p>
                     </div>
                  </div>

                  <div className="mb-8">
                     <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-1">Education</h2>
                     <div className="flex justify-between font-bold text-lg text-gray-900">
                           <span>{formData.degree || 'Degree Name'}</span>
                           <span className="text-primary-600">{formData.year || 'Graduation Year'}</span>
                     </div>
                     <div className="text-gray-600 font-medium">{formData.school || 'University Name'}</div>
                  </div>

                  <div className="mb-8">
                     <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-1">Skills</h2>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.skills ? formData.skills.split(',') : ['Skill 1', 'Skill 2', 'Skill 3']).map((skill, i) => (
                           <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200">{skill.trim()}</span>
                        ))}
                     </div>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button 
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all font-medium active:scale-95"
        >
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={currentStep === STEPS.length - 1}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl disabled:opacity-50 hover:bg-primary-700 transition-all font-medium active:scale-95 shadow-md flex items-center justify-center min-w-[120px]"
        >
          {currentStep === STEPS.length - 2 ? 'Generate CV' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}

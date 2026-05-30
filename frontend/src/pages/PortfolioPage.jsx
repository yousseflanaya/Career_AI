import { useEffect, useState } from 'react';
import { ExternalLink, Eye, Globe2, Loader2, Lock, Save } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [portfolio, setPortfolio] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cvDraft, setCvDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [portfolioRes, profileRes] = await Promise.all([
          api.get('/portfolio'),
          api.get('/profile'),
        ]);
        setPortfolio(portfolioRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Portfolio fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const draft = localStorage.getItem('careerai_cv_builder_draft');
    if (draft) {
      try {
        setCvDraft(JSON.parse(draft));
      } catch (error) {
        console.error('Portfolio CV draft restore failed', error);
      }
    }
  }, []);

  const save = async () => {
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
      setTimeout(() => setSuccess(false), 2400);
    } catch (error) {
      console.error('Portfolio save failed', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  const publicPath = `/portfolio/${portfolio?.custom_url}`;
  const user = profile?.user || {};
  const draftSkills = cvDraft?.skills ? cvDraft.skills.split(',').map((name, index) => ({ id: `draft-${index}`, name: name.trim() })).filter((skill) => skill.name) : [];
  const skills = draftSkills.length ? draftSkills : (profile?.skills || []);
  const experiences = cvDraft?.jobTitle || cvDraft?.company ? [{ id: 'cv-draft', job_title: cvDraft.jobTitle, company: cvDraft.company, description: cvDraft.jobDesc, duration: cvDraft.duration }] : (profile?.experiences || []);
  const educations = cvDraft?.degree || cvDraft?.school ? [{ id: 'cv-draft', degree: cvDraft.degree, school: cvDraft.school, year: cvDraft.year }] : (profile?.educations || []);
  const displayName = cvDraft?.fullName || user.name || t('portfolio.your_name');
  const summary = cvDraft?.summary || profile?.profile?.summary || t('portfolio.cv_builder_hint');
  const email = cvDraft?.email || user.email;
  const phone = cvDraft?.phone || profile?.profile?.phone;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Globe2 className="h-4 w-4" />
            {t('portfolio.public_portfolio')}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">{t('portfolio.shareable_page')}</h1>
        </div>
        <a href={publicPath} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-gray-950/10 hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100">
          <ExternalLink className="h-5 w-5" />
          {t('portfolio.view_page')}
        </a>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-6 text-xl font-black text-gray-950 dark:text-white">{t('portfolio.visibility')}</h2>

          <button
            onClick={() => setPortfolio({ ...portfolio, is_public: !portfolio.is_public })}
            className={`flex w-full items-center justify-between rounded-3xl border p-5 text-left transition ${portfolio?.is_public ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${portfolio?.is_public ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'}`}>
                {portfolio?.is_public ? <Eye className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-black text-gray-950 dark:text-white">{portfolio?.is_public ? t('portfolio.public') : t('portfolio.private')}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{portfolio?.is_public ? t('portfolio.public_desc') : t('portfolio.private_desc')}</p>
              </div>
            </div>
            <div className={`h-7 w-12 rounded-full p-1 transition ${portfolio?.is_public ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
              <div className={`h-5 w-5 rounded-full bg-white transition ${portfolio?.is_public ? 'translate-x-5' : ''}`} />
            </div>
          </button>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{t('portfolio.custom_url')}</span>
            <input
              value={portfolio?.custom_url || ''}
              onChange={(event) => setPortfolio({ ...portfolio, custom_url: event.target.value })}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-800 outline-none focus:border-emerald-400 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>

          <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            careerai.com{publicPath}
          </div>

          <button onClick={save} disabled={saving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {t('common.save')}
          </button>
          {success && <p className="mt-3 text-center text-sm font-black text-emerald-600">{t('portfolio.updated')}</p>}
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="bg-gray-950 p-8 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-300">{t('portfolio.preview')}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">{displayName}</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-300">{summary}</p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 && <span className="text-sm font-bold text-gray-400">{t('portfolio.no_skills')}</span>}
                {skills.map((skill) => (
                  <span key={skill.id} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">{skill.name}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.contact')}</h3>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{email}</p>
              <p className="mt-1 text-sm font-bold text-gray-500">{phone}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.experience')}</h3>
              <div className="space-y-3">
                {experiences.length === 0 && <p className="rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-400 dark:bg-gray-950">{t('portfolio.no_experience')}</p>}
                {experiences.map((experience) => (
                  <div key={experience.id} className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                    <p className="font-black text-gray-900 dark:text-white">{experience.job_title}</p>
                    <p className="text-sm font-bold text-gray-500">{experience.company}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.education')}</h3>
              <div className="space-y-3">
                {educations.length === 0 && <p className="rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-400 dark:bg-gray-950">{t('portfolio.no_education')}</p>}
                {educations.map((education) => (
                  <div key={education.id} className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                    <p className="font-black text-gray-900 dark:text-white">{education.degree}</p>
                    <p className="text-sm font-bold text-gray-500">{education.school} - {education.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

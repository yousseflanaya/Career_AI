import { useEffect, useState } from 'react';
import { Download, Loader2, Mail } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function PublicPortfolioPage() {
  const { t } = useTranslation();
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/portfolio/${username}`);
        setData(response.data);
      } catch (error) {
        console.error('Public portfolio fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    const savedDraft = localStorage.getItem('careerai_cv_builder_draft');
    if (savedDraft) {
      try {
        setDraft(JSON.parse(savedDraft));
      } catch (error) {
        console.error('Public portfolio draft restore failed', error);
      }
    }
  }, [username]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-950"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /></div>;
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-center text-white">
        <div>
          <h1 className="text-3xl font-black">{t('portfolio.unavailable')}</h1>
          <p className="mt-2 text-gray-400">{t('portfolio.unavailable_desc')}</p>
        </div>
      </div>
    );
  }

  const { user, profile, skills, experiences, educations, latest_cv_analysis: ats } = data;
  const draftSkills = draft?.skills ? draft.skills.split(',').map((name, index) => ({ id: `draft-${index}`, name: name.trim() })).filter((skill) => skill.name) : [];
  const displayName = draft?.fullName || user.name;
  const displaySummary = draft?.summary || profile?.summary || t('portfolio.default_summary');
  const displayEmail = draft?.email || user.email;
  const displayPhone = draft?.phone || profile?.phone;
  const displaySkills = draftSkills.length ? draftSkills : (skills || []);
  const displayExperiences = draft?.jobTitle || draft?.company ? [{ id: 'draft', job_title: draft.jobTitle, company: draft.company, description: draft.jobDesc, start_date: '', end_date: draft.duration }] : (experiences || []);
  const displayEducations = draft?.degree || draft?.school ? [{ id: 'draft', degree: draft.degree, school: draft.school, year: draft.year }] : (educations || []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-emerald-300">{t('portfolio.careerai_portfolio')}</p>
              <h1 className="text-5xl font-black tracking-tight md:text-7xl">{displayName}</h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-gray-300">{displaySummary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${displayEmail}`} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-gray-950 hover:bg-emerald-400">
                  <Mail className="h-4 w-4" />
                  {t('portfolio.contact')}
                </a>
                <a href="/cv-builder" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
                  <Download className="h-4 w-4" />
                  {t('portfolio.download_cv')}
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">{t('portfolio.ats_score')}</p>
              <p className="mt-2 text-6xl font-black">{ats?.score || 0}<span className="text-2xl text-gray-400">/100</span></p>
              <p className="mt-2 text-sm font-bold text-gray-400">{data.portfolio.views_count} {t('portfolio.views')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 text-gray-950 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-8">
            <div>
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.skills')}</h2>
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill) => (
                  <span key={skill.id} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{skill.name}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.education')}</h2>
              <div className="space-y-3">
                {displayEducations.map((education) => (
                  <div key={education.id} className="rounded-2xl border border-gray-100 p-4">
                    <p className="font-black">{education.degree}</p>
                    <p className="text-sm font-bold text-gray-500">{education.school} - {education.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400">{t('portfolio.experience')}</h2>
            <div className="space-y-4">
              {displayExperiences.map((experience) => (
                <article key={experience.id} className="rounded-3xl border border-gray-100 p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-black">{experience.job_title}</h3>
                    <span className="text-sm font-bold text-gray-400">{experience.start_date} - {experience.end_date || 'Present'}</span>
                  </div>
                  <p className="mt-1 text-sm font-black text-emerald-700">{experience.company}</p>
                  <p className="mt-4 text-sm font-semibold leading-7 text-gray-600">{experience.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

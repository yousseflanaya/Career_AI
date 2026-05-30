import { useEffect, useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Award, Download, Mail, MapPin, Phone, Plus, Sparkles, Trash2, Upload, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';

const templates = ['modern', 'executive', 'minimal'];
const themes = [
  ['purple', '#7C3AED'],
  ['blue', '#3B82F6'],
  ['green', '#10B981'],
  ['red', '#EF4444'],
  ['orange', '#F97316'],
  ['black', '#111827'],
];

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const emptyEducation = { degree: '', school: '', year: '' };
const emptyExperience = { jobTitle: '', company: '', duration: '', jobDesc: '' };

const emptyForm = {
  photo: '',
  fullName: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  summary: '',
  educations: [emptyEducation],
  experiences: [emptyExperience],
  skills: '',
  languages: '',
  certifications: '',
};

function normalizeDraft(draft = {}) {
  const educations = Array.isArray(draft.educations) && draft.educations.length
    ? draft.educations
    : [{ degree: draft.degree || '', school: draft.school || '', year: draft.year || '' }];
  const experiences = Array.isArray(draft.experiences) && draft.experiences.length
    ? draft.experiences
    : [{ jobTitle: draft.jobTitle || '', company: draft.company || '', duration: draft.duration || '', jobDesc: draft.jobDesc || '' }];

  return { ...emptyForm, ...draft, educations, experiences };
}

function splitList(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function filledExperiences(data) {
  return (data.experiences || []).filter((item) => item.jobTitle || item.company || item.duration || item.jobDesc);
}

function filledEducations(data) {
  return (data.educations || []).filter((item) => item.degree || item.school || item.year);
}

function Section({ title, children, color }) {
  if (!children) return null;
  return (
    <section className="mb-6">
      {title && (
        <h3 className="mb-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color }}>
          {title}
          <span className="h-px flex-1" style={{ backgroundColor: `${color}40` }} />
        </h3>
      )}
      {children}
    </section>
  );
}

function ContactLine({ data, color }) {
  const items = [
    [Mail, data.email],
    [Phone, data.phone],
    [MapPin, data.address],
    [User, data.linkedin],
  ].filter(([, value]) => value);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-gray-600">
      {items.map(([Icon, value]) => (
        <span key={value} className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          {value}
        </span>
      ))}
    </div>
  );
}

function Photo({ src, color, className = '' }) {
  if (!src) return null;
  return <img src={src} alt="" className={`rounded-full border-4 object-cover ${className}`} style={{ borderColor: color }} />;
}

function ExperienceList({ experiences, color }) {
  return (
    <div className="space-y-4">
      {experiences.map((experience, index) => {
        const bullets = experience.jobDesc.split('\n').map((item) => item.trim()).filter(Boolean);
        return (
          <div key={`${experience.jobTitle}-${experience.company}-${index}`} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between gap-4">
              <div>
                {experience.jobTitle && <p className="font-black">{experience.jobTitle}</p>}
                {experience.company && <p className="text-sm font-bold" style={{ color }}>{experience.company}</p>}
              </div>
              {experience.duration && <p className="text-xs font-black text-gray-400">{experience.duration}</p>}
            </div>
            <ul className="mt-3 space-y-1.5 text-sm leading-6 text-gray-700">
              {bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span style={{ color }}>{'>'}</span>{bullet}</li>)}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function EducationList({ educations, color }) {
  return (
    <div className="space-y-3">
      {educations.map((education, index) => (
        <div key={`${education.degree}-${education.school}-${index}`} className="flex justify-between gap-4 text-sm">
          <div>
            {education.degree && <p className="font-black">{education.degree}</p>}
            {education.school && <p className="font-bold text-gray-500">{education.school}</p>}
          </div>
          {education.year && <p className="font-black" style={{ color }}>{education.year}</p>}
        </div>
      ))}
    </div>
  );
}

function CvContent({ data, color, t, variant }) {
  const skills = splitList(data.skills);
  const languages = splitList(data.languages);
  const certifications = splitList(data.certifications);
  const experiences = filledExperiences(data);
  const educations = filledEducations(data);

  if (variant === 'modern') {
    return (
      <div className="grid bg-white text-gray-900" style={{ minHeight: A4_HEIGHT, width: A4_WIDTH, gridTemplateColumns: '1fr 260px' }}>
        <main className="p-10">
          <h1 className="text-[28px] font-black uppercase tracking-tight">{data.fullName}</h1>
          {data.title && <p className="mt-1 text-sm font-bold" style={{ color }}>{data.title}</p>}
          <div className="my-5 h-1 w-24 rounded-full" style={{ backgroundColor: color }} />
          <ContactLine data={data} color={color} />
          {data.summary && <Section title={t('cv.preview.summary')} color={color}><p className="border-l-4 pl-4 text-sm leading-7 text-gray-700" style={{ borderColor: color }}>{data.summary}</p></Section>}
          {experiences.length > 0 && <Section title={t('cv.preview.experience')} color={color}><ExperienceList experiences={experiences} color={color} /></Section>}
          {educations.length > 0 && <Section title={t('cv.preview.education')} color={color}><EducationList educations={educations} color={color} /></Section>}
        </main>
        <aside className="p-8 text-white" style={{ backgroundColor: color }}>
          <Photo src={data.photo} color="#fff" className="mx-auto mb-7 h-28 w-28" />
          {skills.length > 0 && <SidebarList title={t('cv.preview.skills')} items={skills} />}
          {languages.length > 0 && <SidebarList title={t('cv.preview.languages')} items={languages} />}
          {certifications.length > 0 && <SidebarList title={t('cv.preview.certifications')} items={certifications} />}
        </aside>
      </div>
    );
  }

  if (variant === 'executive') {
    return (
      <div className="grid bg-white text-gray-900" style={{ minHeight: A4_HEIGHT, width: A4_WIDTH, gridTemplateColumns: '280px 1fr' }}>
        <aside className="p-8 text-white" style={{ background: `linear-gradient(160deg, ${color}, #111827)` }}>
          <Photo src={data.photo} color="#fff" className="mx-auto mb-5 h-28 w-28" />
          <h1 className="text-center text-2xl font-black">{data.fullName}</h1>
          {data.title && <p className="mt-2 text-center text-sm font-bold text-white/80">{data.title}</p>}
          <div className="my-6 h-px bg-white/30" />
          <SidebarList title={t('cv.preview.contact')} items={[data.email, data.phone, data.address, data.linkedin].filter(Boolean)} />
          <SidebarList title={t('cv.preview.skills')} items={skills} />
          <SidebarList title={t('cv.preview.languages')} items={languages} />
        </aside>
        <main className="p-10">
          {data.summary && <Section title={t('cv.preview.summary')} color={color}><p className="text-sm leading-7 text-gray-700">{data.summary}</p></Section>}
          {experiences.map((experience, index) => <Timeline key={`${experience.jobTitle}-${index}`} title={index === 0 ? t('cv.preview.experience') : ''} color={color} date={experience.duration} heading={experience.jobTitle} subheading={experience.company} bullets={experience.jobDesc.split('\n').map((item) => item.trim()).filter(Boolean)} />)}
          {educations.map((education, index) => <Timeline key={`${education.degree}-${index}`} title={index === 0 ? t('cv.preview.education') : ''} color={color} date={education.year} heading={education.degree} subheading={education.school} bullets={[]} />)}
          {certifications.length > 0 && <Section title={t('cv.preview.certifications')} color={color}><div className="grid gap-2">{certifications.map((item) => <div key={item} className="rounded-xl border border-gray-100 p-3 text-sm font-bold"><Award className="mr-2 inline h-4 w-4" style={{ color }} />{item}</div>)}</div></Section>}
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white p-12 text-gray-900" style={{ minHeight: A4_HEIGHT, width: A4_WIDTH }}>
      <header className="flex items-center gap-5 border-b pb-6" style={{ borderColor: `${color}35` }}>
        <Photo src={data.photo} color={color} className="h-24 w-24" />
        <div>
          <h1 className="text-[32px] font-black uppercase tracking-[0.12em]">{data.fullName}</h1>
          {data.title && <p className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: `${color}16`, color }}>{data.title}</p>}
          <div className="mt-4"><ContactLine data={data} color={color} /></div>
        </div>
      </header>
      <main className="mt-8">
        {data.summary && <Section title={t('cv.preview.summary')} color={color}><p className="text-sm leading-7 text-gray-700">{data.summary}</p></Section>}
        {experiences.map((experience, index) => <MinimalBlock key={`${experience.jobTitle}-${index}`} title={index === 0 ? t('cv.preview.experience') : ''} color={color} date={experience.duration} heading={experience.jobTitle} subheading={experience.company} bullets={experience.jobDesc.split('\n').map((item) => item.trim()).filter(Boolean)} />)}
        {educations.map((education, index) => <MinimalBlock key={`${education.degree}-${index}`} title={index === 0 ? t('cv.preview.education') : ''} color={color} date={education.year} heading={education.degree} subheading={education.school} bullets={[]} />)}
        {skills.length > 0 && <TagSection title={t('cv.preview.skills')} color={color} items={skills} />}
        {languages.length > 0 && <TagSection title={t('cv.preview.languages')} color={color} items={languages} />}
        {certifications.length > 0 && <TagSection title={t('cv.preview.certifications')} color={color} items={certifications} />}
      </main>
      <footer className="mt-10 text-center text-[10px] font-bold uppercase tracking-widest text-gray-300">{t('cv.preview.watermark')}</footer>
    </div>
  );
}

function SidebarList({ title, items = [] }) {
  if (!items.length) return null;
  return (
    <section className="mb-7">
      <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-white/70">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => <p key={item} className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold text-white">{item}</p>)}
      </div>
    </section>
  );
}

function Timeline({ title, color, date, heading, subheading, bullets }) {
  return (
    <Section title={title} color={color}>
      <div className="relative border-l-2 pl-5" style={{ borderColor: `${color}55` }}>
        <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        {date && <span className="rounded-full px-3 py-1 text-[10px] font-black text-white" style={{ backgroundColor: color }}>{date}</span>}
        {heading && <p className="mt-3 font-black">{heading}</p>}
        {subheading && <p className="text-sm font-bold text-gray-500">{subheading}</p>}
        <ul className="mt-3 space-y-1 text-sm leading-6 text-gray-700">
          {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
    </Section>
  );
}

function MinimalBlock({ title, color, date, heading, subheading, bullets }) {
  return (
    <Section title={title} color={color}>
      <div className="mb-4">
        <div className="flex justify-between gap-4">
          {heading && <p className="font-black">{heading}</p>}
          {date && <p className="text-xs font-black text-gray-400">{date}</p>}
        </div>
        {subheading && <p className="text-sm font-semibold italic text-gray-500">{subheading}</p>}
        <ul className="mt-3 space-y-1 text-sm leading-6 text-gray-700">
          {bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0" style={{ backgroundColor: color }} />{bullet}</li>)}
        </ul>
      </div>
    </Section>
  );
}

function TagSection({ title, color, items }) {
  return (
    <Section title={title} color={color}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <span key={item} className="rounded-full border px-3 py-1 text-xs font-black" style={{ borderColor: color, color }}>{item}</span>)}
      </div>
    </Section>
  );
}

export default function CVBuilderPage() {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [formData, setFormData] = useState(emptyForm);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const cvRef = useRef(null);

  const steps = useMemo(() => [
    t('cv.step_personal'),
    t('cv.step_education'),
    t('cv.step_experience'),
    t('cv.step_skills'),
    t('cv.step_preview'),
  ], [t]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('careerai_cv_builder_draft');
    if (!savedDraft) return;
    try {
      setFormData(normalizeDraft(JSON.parse(savedDraft)));
    } catch (event) {
      console.error('CV draft restore failed', event);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careerai_cv_builder_draft', JSON.stringify(formData));
  }, [formData]);

  const updateField = (key, value) => setFormData((current) => ({ ...current, [key]: value }));
  const updateListItem = (listKey, index, key, value) => {
    setFormData((current) => ({
      ...current,
      [listKey]: current[listKey].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };
  const addListItem = (listKey, emptyItem) => setFormData((current) => ({ ...current, [listKey]: [...current[listKey], { ...emptyItem }] }));
  const removeListItem = (listKey, index) => {
    setFormData((current) => ({
      ...current,
      [listKey]: current[listKey].length === 1 ? [{ ...(listKey === 'educations' ? emptyEducation : emptyExperience) }] : current[listKey].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const getAIFeedback = async () => {
    setAnalyzing(true);
    try {
      const response = await api.post('/cv/feedback', { cv_data: formData, lang: i18n.language });
      setFeedback(response.data);
    } catch (event) {
      console.error('CV feedback error:', event);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!cvRef.current) return;
    html2pdf().from(cvRef.current).set({
      margin: 0,
      filename: `${formData.fullName.replace(/\s+/g, '_') || 'careerai'}_cv.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).save();
    api.post('/notifications', {
      title: t('cv.notifications.download_title'),
      message: t('cv.notifications.download_message'),
      type: 'success',
    }).catch((event) => console.error('Notification trigger failed', event));
    api.post('/badges/check', { action: 'cv_created' }).catch((event) => console.error('Badge trigger failed', event));
  };

  const color = selectedTheme[1];
  const canPreview = Boolean(formData.fullName || formData.title || formData.summary || formData.email || filledExperiences(formData).length || filledEducations(formData).length);

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-gray-100">{t('cv.builder_title')}</h1>
        <p className="mt-1 font-medium text-gray-500 dark:text-gray-400">{t('cv.builder_subtitle')}</p>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex justify-between gap-2">
          {steps.map((step, index) => (
            <span key={step} className={`hidden text-xs font-black uppercase tracking-widest sm:block ${index <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`}>{step}</span>
          ))}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {currentStep === 0 && (
            <div className="space-y-5">
              <PhotoInput data={formData} onChange={handlePhoto} t={t} />
              <FormGrid fields={[
                ['fullName', 'cv.full_name'],
                ['title', 'cv.professional_title'],
                ['email', 'cv.email'],
                ['phone', 'cv.phone'],
                ['address', 'cv.address'],
                ['linkedin', 'cv.linkedin'],
              ]} data={formData} updateField={updateField} t={t} />
              <TextArea label={t('cv.summary')} value={formData.summary} onChange={(value) => updateField('summary', value)} />
            </div>
          )}

          {currentStep === 1 && (
            <RepeatableGroup
              title={t('cv.educations_title')}
              addLabel={t('cv.add_education')}
              listKey="educations"
              items={formData.educations}
              fields={[
                ['degree', 'cv.degree'],
                ['school', 'cv.school'],
                ['year', 'cv.year'],
              ]}
              emptyItem={emptyEducation}
              updateListItem={updateListItem}
              addListItem={addListItem}
              removeListItem={removeListItem}
              t={t}
            />
          )}

          {currentStep === 2 && (
            <RepeatableGroup
              title={t('cv.experiences_title')}
              addLabel={t('cv.add_experience')}
              listKey="experiences"
              items={formData.experiences}
              fields={[
                ['jobTitle', 'cv.job_title'],
                ['company', 'cv.company'],
                ['duration', 'cv.duration'],
              ]}
              textArea={['jobDesc', 'cv.description', 'cv.description_helper']}
              emptyItem={emptyExperience}
              updateListItem={updateListItem}
              addListItem={addListItem}
              removeListItem={removeListItem}
              t={t}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <TextArea label={t('cv.skills_label')} value={formData.skills} onChange={(value) => updateField('skills', value)} helper={t('cv.comma_helper')} />
              <TextArea label={t('cv.languages')} value={formData.languages} onChange={(value) => updateField('languages', value)} helper={t('cv.comma_helper')} />
              <TextArea label={t('cv.certifications')} value={formData.certifications} onChange={(value) => updateField('certifications', value)} helper={t('cv.comma_helper')} />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">{t('cv.ready')}</h2>
              <p className="font-semibold text-gray-500 dark:text-gray-400">{t('cv.a4_ready_desc')}</p>
              {feedback && <div className="rounded-3xl bg-primary-50 p-5 text-sm font-bold text-primary-700 dark:bg-primary-950/20 dark:text-primary-300">{t('cv.overall_score')}: {feedback.overall_score}%</div>}
              <div className="flex flex-wrap gap-3">
                <button onClick={getAIFeedback} disabled={analyzing} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-5 py-3 text-sm font-black text-indigo-700 disabled:opacity-60 dark:bg-indigo-900/30 dark:text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                  {analyzing ? t('common.loading') : t('cv.ai_feedback')}
                </button>
                <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-black text-white">
                  <Download className="h-4 w-4" />
                  {t('cv.save_pdf')}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
            <button onClick={() => setCurrentStep((step) => Math.max(0, step - 1))} disabled={currentStep === 0} className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-600 disabled:opacity-40 dark:border-gray-800 dark:text-gray-300">{t('common.back')}</button>
            <button onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))} disabled={currentStep === steps.length - 1} className="rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white disabled:opacity-40 dark:bg-white dark:text-gray-950">{currentStep === steps.length - 2 ? t('cv.generate') : t('common.next')}</button>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400">{t('cv.template_switcher')}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {templates.map((template) => (
                <button key={template} onClick={() => setSelectedTemplate(template)} className={`rounded-2xl border p-3 text-left transition ${selectedTemplate === template ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-100 dark:border-gray-800'}`}>
                  <div className="mb-3 h-20 rounded-xl bg-gray-100 p-2 dark:bg-gray-950">
                    <div className="h-full rounded-lg" style={{ background: template === 'minimal' ? 'linear-gradient(90deg,#fff,#fff)' : `linear-gradient(90deg, ${color} 32%, #fff 32%)` }} />
                  </div>
                  <p className="font-black text-gray-900 dark:text-white">{t(`cv.templates.${template}`)}</p>
                </button>
              ))}
            </div>
            <h2 className="mb-3 mt-6 text-sm font-black uppercase tracking-widest text-gray-400">{t('cv.theme_picker')}</h2>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <button key={theme[0]} onClick={() => setSelectedTheme(theme)} aria-label={t(`theme.${theme[0]}`)} className={`h-9 w-9 rounded-full border-2 ${selectedTheme[0] === theme[0] ? 'border-gray-950 dark:border-white' : 'border-transparent'}`} style={{ backgroundColor: theme[1] }} />
              ))}
            </div>
          </div>

          <div className="overflow-auto rounded-[2rem] border border-gray-100 bg-gray-100 p-4 shadow-inner dark:border-gray-800 dark:bg-gray-950">
            {canPreview ? (
              <div ref={cvRef} className="mx-auto overflow-hidden bg-white shadow-2xl" style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}>
                <CvContent data={formData} color={color} t={t} variant={selectedTemplate} />
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-white text-center text-sm font-black text-gray-400 dark:bg-gray-900">
                {t('cv.preview_empty')}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function RepeatableGroup({ title, addLabel, listKey, items, fields, textArea, emptyItem, updateListItem, addListItem, removeListItem, t }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-gray-950 dark:text-white">{title}</h2>
        <button onClick={() => addListItem(listKey, emptyItem)} className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-sm font-black text-white">
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="rounded-3xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black text-gray-500">{t('cv.entry_label', { number: index + 1 })}</p>
            <button onClick={() => removeListItem(listKey, index)} className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" aria-label={t('cv.remove_entry')}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([key, labelKey]) => (
              <label key={key}>
                <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{t(labelKey)}</span>
                <input value={item[key]} onChange={(event) => updateListItem(listKey, index, key, event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold outline-none focus:border-primary-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100" />
              </label>
            ))}
          </div>
          {textArea && (
            <div className="mt-4">
              <TextArea label={t(textArea[1])} value={item[textArea[0]]} onChange={(value) => updateListItem(listKey, index, textArea[0], value)} helper={t(textArea[2])} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PhotoInput({ data, onChange, t }) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white dark:bg-gray-900">
        {data.photo ? <img src={data.photo} alt="" className="h-full w-full object-cover" /> : <Upload className="h-6 w-6 text-gray-400" />}
      </div>
      <div>
        <p className="font-black text-gray-900 dark:text-white">{t('cv.photo_upload')}</p>
        <p className="text-sm font-semibold text-gray-500">{t('cv.photo_hint')}</p>
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  );
}

function FormGrid({ fields, data, updateField, t }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map(([key, labelKey]) => (
        <label key={key}>
          <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{t(labelKey)}</span>
          <input value={data[key]} onChange={(event) => updateField(key, event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold outline-none focus:border-primary-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
        </label>
      ))}
    </div>
  );
}

function TextArea({ label, value, onChange, helper }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{label}</span>
      <textarea rows="4" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold outline-none focus:border-primary-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100" />
      {helper && <span className="mt-2 block text-xs font-bold text-gray-400">{helper}</span>}
    </label>
  );
}

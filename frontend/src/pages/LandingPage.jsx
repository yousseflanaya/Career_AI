import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, Check, ChevronDown, FileText, Menu, MessageSquare, Moon, Play, Sparkles, Sun, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrandLogo from '../components/BrandLogo';
import { useTheme } from '../context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Section({ id, children, className = '' }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6 }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState('quiz');
  const [openFaq, setOpenFaq] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('auth_token')));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setWordIndex((current) => (current + 1) % 3), 2200);
    return () => window.clearInterval(timer);
  }, []);

  const ctaPath = isAuthenticated ? '/dashboard' : '/register';
  const navLinks = t('landing_full.nav_links', { returnObjects: true });
  const stats = t('landing_full.stats', { returnObjects: true });
  const problems = t('landing_full.problems', { returnObjects: true });
  const solutions = t('landing_full.solutions', { returnObjects: true });
  const features = t('landing_full.features', { returnObjects: true });
  const steps = t('landing_full.steps', { returnObjects: true });
  const demos = t('landing_full.demos', { returnObjects: true });
  const testimonials = t('landing_full.testimonials', { returnObjects: true });
  const faqs = t('landing_full.faqs', { returnObjects: true });
  const footer = t('landing_full.footer_columns', { returnObjects: true });
  const landingTheme = {
    '--landing-bg': isDark ? '#0F0F1A' : '#F8FAFC',
    '--landing-nav': isDark ? 'rgba(15,15,26,0.72)' : 'rgba(255,255,255,0.78)',
    '--landing-panel': isDark ? '#11111F' : '#FFFFFF',
    '--landing-subpanel': isDark ? '#171727' : '#F8FAFC',
    '--landing-card': isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.86)',
    '--landing-card-strong': isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.055)',
    '--landing-border': isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)',
    '--landing-text': isDark ? '#FFFFFF' : '#0F172A',
    '--landing-muted': isDark ? 'rgba(255,255,255,0.62)' : 'rgba(15,23,42,0.68)',
    '--landing-soft': isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.50)',
  };

  return (
    <div style={landingTheme} className="min-h-screen overflow-hidden bg-[var(--landing-bg)] text-[var(--landing-text)] selection:bg-primary-500/30">
      <motion.div className="fixed left-0 top-0 z-[90] h-1 bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: progressWidth }} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-600/20 blur-[140px]" />
        <div className="absolute right-[-120px] top-[420px] h-[420px] w-[420px] rounded-full bg-secondary-500/15 blur-[120px]" />
        <div className="absolute bottom-[200px] left-[-160px] h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-[110px]" />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--landing-border)] bg-[var(--landing-nav)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link to="/" aria-label="CareerAI"><BrandLogo inverted={isDark} /></Link>
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => <a key={link.href} href={link.href} className="text-sm font-bold text-[var(--landing-muted)] transition hover:text-[var(--landing-text)]">{link.label}</a>)}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitch i18n={i18n} />
            <button onClick={toggleTheme} className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-3 text-[var(--landing-text)] transition hover:scale-105" aria-label={t('theme.toggle')}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="rounded-2xl border border-[var(--landing-border)] px-4 py-2 text-sm font-black text-[var(--landing-text)] hover:bg-[var(--landing-card)]">{t('dashboard')}</Link>
                <div className="flex items-center gap-2 rounded-2xl bg-[var(--landing-card)] px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-black">{t('landing_full.user_initials')}</span>
                  <span className="text-sm font-black">{t('landing_full.user_name')}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-2xl border border-[var(--landing-border)] px-4 py-2 text-sm font-black text-[var(--landing-text)] hover:bg-[var(--landing-card)]">{t('login')}</Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-5 py-2.5 text-sm font-black shadow-lg shadow-primary-500/20 transition hover:scale-105">{t('landing_full.get_started')} <ArrowRight className="h-4 w-4" /></Link>
              </>
            )}
          </div>
          <button onClick={() => setMobileOpen(true)} className="rounded-2xl border border-[var(--landing-border)] p-3 lg:hidden" aria-label={t('menu')}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-[var(--landing-border)] bg-[var(--landing-bg)] p-5 lg:hidden">
            <div className="mb-5 flex justify-end">
              <button onClick={() => setMobileOpen(false)} aria-label={t('sidebar.close')}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-3">
              {navLinks.map((link) => <a key={link.href} onClick={() => setMobileOpen(false)} href={link.href} className="rounded-2xl bg-[var(--landing-card)] px-4 py-3 text-sm font-black">{link.label}</a>)}
              <button onClick={toggleTheme} className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] px-4 py-3 text-sm font-black">{t('theme.toggle')}</button>
              <Link to={ctaPath} className="rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-4 py-3 text-center text-sm font-black">{isAuthenticated ? t('dashboard') : t('landing_full.get_started')}</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        {isAuthenticated && (
          <div className="mx-auto max-w-7xl px-5 pt-24">
            <div className="rounded-3xl border border-primary-400/20 bg-primary-500/10 px-5 py-3 text-sm font-bold text-primary-100">
              {t('landing_full.welcome_back')} <Link to="/dashboard" className="underline decoration-primary-300 underline-offset-4">{t('landing_full.go_dashboard')}</Link>
            </div>
          </div>
        )}

        <section className={`mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 pb-20 ${isAuthenticated ? 'pt-10' : 'pt-28'} lg:grid-cols-[1fr_0.92fr]`}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-card)] px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-100">
              <Sparkles className="h-4 w-4" />
              {t('landing_full.hero_badge')}
            </div>
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
                {t('landing_full.hero_title')}
              </h1>
              <p className="mt-5 min-h-8 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-2xl font-black text-transparent">
                {t(`landing_full.hero_rotating.${wordIndex}`)}
              </p>
            </div>
            <p className="max-w-2xl text-lg font-medium leading-8 text-[var(--landing-muted)]">{t('landing_full.hero_description')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={ctaPath} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-7 py-4 text-base font-black shadow-2xl shadow-primary-500/30 transition hover:scale-105">{t('landing_full.primary_cta')} <ArrowRight className="h-5 w-5" /></Link>
              <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] px-7 py-4 text-base font-black text-[var(--landing-text)] transition hover:bg-[var(--landing-card-strong)]"><Play className="h-5 w-5" /> {t('landing_full.demo_cta')}</a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[var(--landing-muted)]">
              <div className="flex -space-x-2">
                {['YL', 'SA', 'KM', 'ND', 'AM'].map((initials) => <span key={initials} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F0F1A] bg-white text-[10px] font-black text-gray-950">{initials}</span>)}
              </div>
              <span>{t('landing_full.social_proof')}</span>
              <span>{t('landing_full.rating')}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/30 to-secondary-500/30 blur-[90px]" />
            <div className="relative space-y-4 rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-5 shadow-2xl backdrop-blur-xl">
              <MockCard icon={FileText} title={t('landing_full.mock.cv_title')} value={t('landing_full.mock.cv_score')} />
              <MockCard icon={Brain} title={t('landing_full.mock.quiz_title')} value={t('landing_full.mock.quiz_result')} />
              <MockCard icon={MessageSquare} title={t('landing_full.mock.interview_title')} value={t('landing_full.mock.interview_score')} />
            </div>
          </motion.div>
        </section>

        <Section id="stats" className="mx-auto max-w-7xl px-5 py-10">
          <div className="rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-6 backdrop-blur-xl">
            <div className="mb-5 inline-flex rounded-full bg-primary-500/15 px-3 py-1 text-xs font-black text-primary-100">{t('landing_full.free_badge')}</div>
            <div className="grid gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-[var(--landing-border)] md:border-r last:border-r-0">
                  <p className="text-4xl font-black text-primary-300">{stat.value}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--landing-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="problem" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="mb-10 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">{t('landing_full.problem_title')}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <CompareCard title={t('landing_full.without_title')} items={problems} tone="red" />
            <CompareCard title={t('landing_full.with_title')} items={solutions} tone="green" />
          </div>
        </Section>

        <Section id="features" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="mb-10 text-center text-4xl font-black md:text-5xl">{t('landing_full.features_title')}</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {[Brain, FileText, MessageSquare].map((Icon, index) => (
              <FeatureCard key={features[index].title} feature={features[index]} Icon={Icon} ctaPath={ctaPath} />
            ))}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {t('landing_full.feature_pills', { returnObjects: true }).map((pill) => <div key={pill} className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] px-4 py-3 text-center text-sm font-black text-[var(--landing-muted)]">{pill}</div>)}
          </div>
        </Section>

        <Section id="how" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="mb-12 text-center text-4xl font-black md:text-5xl">{t('landing_full.how_title')}</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => <StepCard key={step.title} step={step} index={index} />)}
          </div>
        </Section>

        <Section id="demo" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="mb-8 text-center text-4xl font-black md:text-5xl">{t('landing_full.demo_title')}</h2>
          <div className="rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-5 backdrop-blur-xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {Object.keys(demos).map((key) => <button key={key} onClick={() => setActiveDemo(key)} className={`rounded-2xl px-4 py-2 text-sm font-black ${activeDemo === key ? 'bg-white text-gray-950' : 'bg-[var(--landing-card)] text-[var(--landing-muted)]'}`}>{demos[key].tab}</button>)}
            </div>
            <div className="grid gap-8 rounded-3xl bg-[var(--landing-panel)] p-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="text-2xl font-black">{demos[activeDemo].title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-[var(--landing-muted)]">{demos[activeDemo].description}</p>
                <Link to={ctaPath} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-5 py-3 text-sm font-black">{t('landing_full.try_free')} <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <DemoMockup type={activeDemo} demo={demos[activeDemo]} />
            </div>
          </div>
        </Section>

        <Section id="free" className="px-5 py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-primary-600 to-secondary-500 p-10 text-center shadow-2xl shadow-primary-500/25">
            <h2 className="text-4xl font-black md:text-5xl">{t('landing_full.free_title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-white/85">{t('landing_full.free_subtitle')}</p>
            <Link to={ctaPath} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-primary-700">{t('landing_full.free_cta')} <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </Section>

        <Section id="testimonials" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="mb-10 text-center text-4xl font-black md:text-5xl">{t('landing_full.testimonials_title')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => <Testimonial key={item.name} item={item} />)}
          </div>
        </Section>

        <Section id="faq" className="mx-auto max-w-4xl px-5 py-20">
          <h2 className="mb-8 text-center text-4xl font-black md:text-5xl">{t('landing_full.faq_title')}</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <button key={faq.q} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="w-full rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-5 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-black">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 transition ${openFaq === index ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === index && <p className="mt-4 text-sm font-medium leading-7 text-[var(--landing-muted)]">{faq.a}</p>}
              </button>
            ))}
          </div>
        </Section>

        <Section id="final" className="px-5 py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-primary-400/30 bg-[var(--landing-card)] p-10 text-center">
            <h2 className="text-4xl font-black md:text-5xl">{t('landing_full.final_title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--landing-muted)]">{t('landing_full.final_subtitle')}</p>
            <Link to={ctaPath} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-7 py-4 text-base font-black">{t('landing_full.final_cta')} <ArrowRight className="h-5 w-5" /></Link>
            <p className="mt-5 text-sm font-bold text-[var(--landing-soft)]">{t('landing_full.final_notes')}</p>
          </div>
        </Section>
      </main>

      <footer className="relative z-10 border-t border-[var(--landing-border)] px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <BrandLogo inverted />
            <p className="mt-4 text-sm font-medium leading-7 text-[var(--landing-soft)]">{t('landing_full.footer_description')}</p>
            <div className="mt-4 inline-flex rounded-full bg-[var(--landing-card-strong)] px-3 py-1 text-xs font-black text-[var(--landing-muted)]">{t('landing_full.free_badge')}</div>
          </div>
          {footer.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--landing-soft)]">{column.title}</h3>
              <div className="grid gap-2">
                {column.links.map((link) => <a key={link} href="#features" className="text-sm font-bold text-[var(--landing-muted)] hover:text-[var(--landing-text)]">{link}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-[var(--landing-border)] pt-6 text-sm font-bold text-[var(--landing-soft)] md:flex-row md:items-center md:justify-between">
          <p>{t('landing_full.copyright')}</p>
          <div className="flex items-center gap-2">
            <LanguageSwitch i18n={i18n} />
            <button onClick={toggleTheme} className="rounded-xl border border-[var(--landing-border)] p-2" aria-label={t('theme.toggle')}>{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LanguageSwitch({ i18n }) {
  return (
    <div className="flex rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-1">
      {['fr', 'en', 'ar'].map((lng) => (
        <button key={lng} onClick={() => i18n.changeLanguage(lng)} className={`rounded-xl px-3 py-1.5 text-xs font-black ${i18n.language === lng ? 'bg-white text-gray-950' : 'text-[var(--landing-soft)]'}`}>{lng.toUpperCase()}</button>
      ))}
    </div>
  );
}

function DemoMockup({ type, demo }) {
  if (type === 'quiz') {
    return (
      <div className="rounded-[1.75rem] border border-[var(--landing-border)] bg-[var(--landing-subpanel)] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-primary-500/15 px-3 py-1 text-xs font-black text-primary-200">{demo.mock.progress}</span>
          <span className="text-xs font-black text-[var(--landing-soft)]">{demo.mock.time}</span>
        </div>
        <h4 className="text-xl font-black">{demo.mock.question}</h4>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {demo.mock.answers.map((answer, index) => (
            <div key={answer} className={`rounded-2xl border px-4 py-3 text-sm font-black ${index === 1 ? 'border-primary-400 bg-primary-500/15 text-primary-100' : 'border-[var(--landing-border)] bg-[var(--landing-card)] text-[var(--landing-muted)]'}`}>{answer}</div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-6 gap-2">
          {demo.mock.scores.map((score) => (
            <div key={score.label} className="text-center">
              <div className="relative mx-auto h-20 w-full overflow-hidden rounded-xl bg-[var(--landing-card)]">
                <div className="absolute bottom-0 left-0 right-0 rounded-xl bg-gradient-to-t from-primary-500 to-secondary-400" style={{ height: `${score.value}%` }} />
              </div>
              <p className="mt-2 text-xs font-black text-[var(--landing-soft)]">{score.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cv') {
    return (
      <div className="grid gap-4 rounded-[1.75rem] border border-[var(--landing-border)] bg-[var(--landing-subpanel)] p-5 shadow-2xl lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-white p-5 text-gray-950">
          <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
          <div className="h-4 w-32 rounded-full bg-gray-900" />
          <div className="mt-2 h-3 w-24 rounded-full bg-primary-200" />
          <div className="my-5 h-px bg-gray-200" />
          {[70, 92, 56, 84].map((width) => <div key={width} className="mb-3 h-3 rounded-full bg-gray-100" style={{ width: `${width}%` }} />)}
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-200">{demo.mock.score_label}</p>
            <p className="mt-1 text-4xl font-black text-white">{demo.mock.score}</p>
          </div>
          {demo.mock.templates.map((template) => <div key={template} className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] px-4 py-3 text-sm font-black text-[var(--landing-muted)]">{template}</div>)}
        </div>
      </div>
    );
  }

  if (type === 'interview') {
    return (
      <div className="rounded-[1.75rem] border border-[var(--landing-border)] bg-[var(--landing-subpanel)] p-5 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--landing-soft)]">{demo.mock.interviewer}</p>
            <p className="font-black">{demo.mock.role}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-5">
          <p className="text-lg font-black">{demo.mock.question}</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {demo.mock.star.map((item) => <div key={item} className="rounded-2xl bg-[var(--landing-card)] px-3 py-3 text-center text-xs font-black text-[var(--landing-muted)]">{item}</div>)}
        </div>
        <div className="mt-4 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-200">{demo.mock.feedback}</div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-[var(--landing-border)] bg-[var(--landing-subpanel)] p-5 shadow-2xl">
      <div className="grid gap-3 sm:grid-cols-2">
        {demo.mock.cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-5">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--landing-soft)]">{card.label}</p>
            <p className="mt-2 text-3xl font-black">{card.value}</p>
            <div className="mt-4 h-2 rounded-full bg-[var(--landing-card-strong)]">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-400" style={{ width: card.progress }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--landing-soft)]">{demo.mock.activity_title}</p>
        {demo.mock.activities.map((activity) => <p key={activity} className="mb-2 rounded-2xl bg-[var(--landing-card)] px-3 py-2 text-sm font-bold text-[var(--landing-muted)]">{activity}</p>)}
      </div>
    </div>
  );
}

function MockCard({ icon: Icon, title, value }) {
  return (
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-card-strong)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary-200" />
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">{value}</span>
      </div>
      <p className="font-black">{title}</p>
      <div className="mt-4 h-2 rounded-full bg-[var(--landing-card-strong)]"><div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" /></div>
    </motion.div>
  );
}

function CompareCard({ title, items, tone }) {
  const good = tone === 'green';
  return (
    <div className="rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-6">
      <h3 className={`mb-5 text-xl font-black ${good ? 'text-emerald-300' : 'text-red-300'}`}>{title}</h3>
      <div className="space-y-3">
        {items.map((item) => <p key={item} className="flex gap-3 text-sm font-bold text-[var(--landing-muted)]">{good ? <Check className="h-5 w-5 text-emerald-300" /> : <X className="h-5 w-5 text-red-300" />}{item}</p>)}
      </div>
    </div>
  );
}

function FeatureCard({ feature, Icon, ctaPath }) {
  return (
    <div className="group rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary-400/40">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500"><Icon className="h-6 w-6" /></div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">{feature.badge}</span>
      </div>
      <h3 className="text-2xl font-black">{feature.title}</h3>
      <p className="mt-3 text-sm font-medium leading-7 text-[var(--landing-muted)]">{feature.description}</p>
      <div className="mt-5 space-y-2">
        {feature.items.map((item) => <p key={item} className="flex gap-2 text-sm font-bold text-[var(--landing-muted)]"><Check className="h-4 w-4 text-emerald-300" />{item}</p>)}
      </div>
      <Link to={ctaPath} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary-200">{feature.cta} <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <div className="relative rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-lg font-black">{index + 1}</div>
      <h3 className="font-black">{step.title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--landing-muted)]">{step.description}</p>
    </div>
  );
}

function Testimonial({ item }) {
  return (
    <div className="rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-card)] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-black text-gray-950">{item.initials}</div>
        <div>
          <p className="font-black">{item.name}</p>
          <p className="text-xs font-bold text-[var(--landing-soft)]">{item.role}</p>
        </div>
      </div>
      <p className="mb-4 text-sm font-black text-primary-200">{item.rating}</p>
      <p className="text-sm font-medium leading-7 text-[var(--landing-muted)]">{item.quote}</p>
    </div>
  );
}


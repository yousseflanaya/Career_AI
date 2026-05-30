import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BarChart3, Brain, Check, ChevronDown, FileText, Menu, MessageSquare, Moon, Play, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
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
  const { toggleTheme } = useTheme();
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

  return (
    <div className="min-h-screen overflow-hidden bg-[#0F0F1A] text-white selection:bg-primary-500/30">
      <motion.div className="fixed left-0 top-0 z-[90] h-1 bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: progressWidth }} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-600/20 blur-[140px]" />
        <div className="absolute right-[-120px] top-[420px] h-[420px] w-[420px] rounded-full bg-secondary-500/15 blur-[120px]" />
        <div className="absolute bottom-[200px] left-[-160px] h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-[110px]" />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0F0F1A]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link to="/" aria-label="CareerAI"><BrandLogo /></Link>
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => <a key={link.href} href={link.href} className="text-sm font-bold text-white/65 transition hover:text-white">{link.label}</a>)}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitch i18n={i18n} />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-black text-white/85 hover:bg-white/10">{t('dashboard')}</Link>
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-black">{t('landing_full.user_initials')}</span>
                  <span className="text-sm font-black">{t('landing_full.user_name')}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-black text-white/85 hover:bg-white/10">{t('login')}</Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-5 py-2.5 text-sm font-black shadow-lg shadow-primary-500/20 transition hover:scale-105">{t('landing_full.get_started')} <ArrowRight className="h-4 w-4" /></Link>
              </>
            )}
          </div>
          <button onClick={() => setMobileOpen(true)} className="rounded-2xl border border-white/10 p-3 lg:hidden" aria-label={t('menu')}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#0F0F1A] p-5 lg:hidden">
            <div className="mb-5 flex justify-end">
              <button onClick={() => setMobileOpen(false)} aria-label={t('sidebar.close')}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-3">
              {navLinks.map((link) => <a key={link.href} onClick={() => setMobileOpen(false)} href={link.href} className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-black">{link.label}</a>)}
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-100">
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
            <p className="max-w-2xl text-lg font-medium leading-8 text-white/62">{t('landing_full.hero_description')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={ctaPath} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-7 py-4 text-base font-black shadow-2xl shadow-primary-500/30 transition hover:scale-105">{t('landing_full.primary_cta')} <ArrowRight className="h-5 w-5" /></Link>
              <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-black text-white/90 transition hover:bg-white/10"><Play className="h-5 w-5" /> {t('landing_full.demo_cta')}</a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/55">
              <div className="flex -space-x-2">
                {['YL', 'SA', 'KM', 'ND', 'AM'].map((initials) => <span key={initials} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F0F1A] bg-white text-[10px] font-black text-gray-950">{initials}</span>)}
              </div>
              <span>{t('landing_full.social_proof')}</span>
              <span>{t('landing_full.rating')}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/30 to-secondary-500/30 blur-[90px]" />
            <div className="relative space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <MockCard icon={FileText} title={t('landing_full.mock.cv_title')} value={t('landing_full.mock.cv_score')} />
              <MockCard icon={Brain} title={t('landing_full.mock.quiz_title')} value={t('landing_full.mock.quiz_result')} />
              <MockCard icon={MessageSquare} title={t('landing_full.mock.interview_title')} value={t('landing_full.mock.interview_score')} />
            </div>
          </motion.div>
        </section>

        <Section id="stats" className="mx-auto max-w-7xl px-5 py-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <div className="mb-5 inline-flex rounded-full bg-primary-500/15 px-3 py-1 text-xs font-black text-primary-100">{t('landing_full.free_badge')}</div>
            <div className="grid gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-white/10 md:border-r last:border-r-0">
                  <p className="text-4xl font-black text-primary-300">{stat.value}</p>
                  <p className="mt-1 text-sm font-bold text-white/55">{stat.label}</p>
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
            {t('landing_full.feature_pills', { returnObjects: true }).map((pill) => <div key={pill} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center text-sm font-black text-white/70">{pill}</div>)}
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
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {Object.keys(demos).map((key) => <button key={key} onClick={() => setActiveDemo(key)} className={`rounded-2xl px-4 py-2 text-sm font-black ${activeDemo === key ? 'bg-white text-gray-950' : 'bg-white/5 text-white/65'}`}>{demos[key].tab}</button>)}
            </div>
            <div className="grid gap-8 rounded-3xl bg-[#11111f] p-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="text-2xl font-black">{demos[activeDemo].title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-white/55">{demos[activeDemo].description}</p>
                <Link to={ctaPath} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-5 py-3 text-sm font-black">{t('landing_full.try_free')} <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="grid gap-3">
                {[0, 1, 2].map((item) => <div key={item} className="h-16 rounded-2xl border border-white/10 bg-white/[0.06]" />)}
              </div>
            </div>
          </div>
        </Section>

        <Section id="free" className="px-5 py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-primary-600 to-secondary-500 p-10 text-center shadow-2xl shadow-primary-500/25">
            <h2 className="text-4xl font-black md:text-5xl">{t('landing_full.free_title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-white/80">{t('landing_full.free_subtitle')}</p>
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
              <button key={faq.q} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="w-full rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-black">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 transition ${openFaq === index ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === index && <p className="mt-4 text-sm font-medium leading-7 text-white/60">{faq.a}</p>}
              </button>
            ))}
          </div>
        </Section>

        <Section id="final" className="px-5 py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-primary-400/30 bg-white/[0.04] p-10 text-center">
            <h2 className="text-4xl font-black md:text-5xl">{t('landing_full.final_title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">{t('landing_full.final_subtitle')}</p>
            <Link to={ctaPath} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 px-7 py-4 text-base font-black">{t('landing_full.final_cta')} <ArrowRight className="h-5 w-5" /></Link>
            <p className="mt-5 text-sm font-bold text-white/45">{t('landing_full.final_notes')}</p>
          </div>
        </Section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <BrandLogo />
            <p className="mt-4 text-sm font-medium leading-7 text-white/50">{t('landing_full.footer_description')}</p>
            <div className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">{t('landing_full.free_badge')}</div>
          </div>
          {footer.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white/40">{column.title}</h3>
              <div className="grid gap-2">
                {column.links.map((link) => <a key={link} href="#features" className="text-sm font-bold text-white/55 hover:text-white">{link}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-sm font-bold text-white/40 md:flex-row md:items-center md:justify-between">
          <p>{t('landing_full.copyright')}</p>
          <div className="flex items-center gap-2">
            <LanguageSwitch i18n={i18n} />
            <button onClick={toggleTheme} className="rounded-xl border border-white/10 p-2" aria-label={t('theme.toggle')}><Moon className="h-4 w-4" /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LanguageSwitch({ i18n }) {
  return (
    <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
      {['fr', 'en', 'ar'].map((lng) => (
        <button key={lng} onClick={() => i18n.changeLanguage(lng)} className={`rounded-xl px-3 py-1.5 text-xs font-black ${i18n.language === lng ? 'bg-white text-gray-950' : 'text-white/50'}`}>{lng.toUpperCase()}</button>
      ))}
    </div>
  );
}

function MockCard({ icon: Icon, title, value }) {
  return (
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="rounded-3xl border border-white/10 bg-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary-200" />
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">{value}</span>
      </div>
      <p className="font-black">{title}</p>
      <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" /></div>
    </motion.div>
  );
}

function CompareCard({ title, items, tone }) {
  const good = tone === 'green';
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
      <h3 className={`mb-5 text-xl font-black ${good ? 'text-emerald-300' : 'text-red-300'}`}>{title}</h3>
      <div className="space-y-3">
        {items.map((item) => <p key={item} className="flex gap-3 text-sm font-bold text-white/65">{good ? <Check className="h-5 w-5 text-emerald-300" /> : <X className="h-5 w-5 text-red-300" />}{item}</p>)}
      </div>
    </div>
  );
}

function FeatureCard({ feature, Icon, ctaPath }) {
  return (
    <div className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary-400/40">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500"><Icon className="h-6 w-6" /></div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">{feature.badge}</span>
      </div>
      <h3 className="text-2xl font-black">{feature.title}</h3>
      <p className="mt-3 text-sm font-medium leading-7 text-white/58">{feature.description}</p>
      <div className="mt-5 space-y-2">
        {feature.items.map((item) => <p key={item} className="flex gap-2 text-sm font-bold text-white/65"><Check className="h-4 w-4 text-emerald-300" />{item}</p>)}
      </div>
      <Link to={ctaPath} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary-200">{feature.cta} <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-lg font-black">{index + 1}</div>
      <h3 className="font-black">{step.title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-white/55">{step.description}</p>
    </div>
  );
}

function Testimonial({ item }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-black text-gray-950">{item.initials}</div>
        <div>
          <p className="font-black">{item.name}</p>
          <p className="text-xs font-bold text-white/45">{item.role}</p>
        </div>
      </div>
      <p className="mb-4 text-sm font-black text-primary-200">{item.rating}</p>
      <p className="text-sm font-medium leading-7 text-white/62">{item.quote}</p>
    </div>
  );
}

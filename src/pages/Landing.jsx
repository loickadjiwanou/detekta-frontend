import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronRight, Globe, Smartphone, Server, Webhook,
  Check, ArrowRight, Zap, Lock, BarChart3, Clock, Users, Award,
  CheckCircle, Star, Info, Sun, Moon
} from 'lucide-react';
import useSettingsStore from '../store/settingsStore';
import useAuthStore from '../store/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { AvailableTestsModal } from '../components/audit/AvailableTestsModal';
import { ChangelogModal } from '../components/common/ChangelogModal';
import { ContactModal } from '../components/common/ContactModal';

const Landing = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['common', 'audit', 'report']);
  const { language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedAuditType, setSelectedAuditType] = useState('web');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Translated content
  const content = {
    en: {
      badge: 'Automated Security Audits',
      heroTitle1: 'See every flaw.',
      heroTitle2: 'Fix every risk.',
      heroDesc: 'Detekta automates security audits for web apps, mobile apps, APIs, and backend code. Get comprehensive reports powered by AI analysis.',
      getStarted: 'Get Started Free',
      learnMore: 'Learn More',
      auditTitle: 'Audit Any Target',
      auditDesc: 'Comprehensive security testing for all your applications.',
      features: {
        web: { name: 'Web Application', desc: 'Scan web apps for XSS, SQL injection, CSRF, and 50+ vulnerability types.' },
        mobile: { name: 'Mobile App', desc: 'Analyze APK/IPA files for insecure storage, hardcoded secrets, and more.' },
        backend: { name: 'Backend/Code', desc: 'Review code repositories for security flaws, outdated dependencies.' },
        api: { name: 'API REST', desc: 'Test APIs for broken auth, injection, rate limiting issues.' }
      },
      howItWorks: 'How It Works',
      howItWorksDesc: 'Three simple steps to secure your application.',
      steps: [
        { num: '01', title: 'Submit Target', desc: 'Enter your URL, upload APK/IPA, or connect your Git repository.' },
        { num: '02', title: 'Automated Scan', desc: 'Our security tools analyze your application for vulnerabilities in real-time.' },
        { num: '03', title: 'AI Report', desc: 'Get actionable insights and prioritized recommendations powered by Claude AI.' }
      ],
      whyTitle: 'Why Choose Detekta?',
      whyDesc: 'Enterprise-grade security testing made accessible.',
      whyFeatures: [
        { icon: Zap, title: 'Fast Results', desc: 'Get comprehensive reports in minutes, not days.' },
        { icon: Lock, title: 'Secure', desc: 'Your data is encrypted and never stored longer than needed.' },
        { icon: BarChart3, title: 'Actionable Insights', desc: 'AI-powered recommendations with code fix suggestions.' },
        { icon: Clock, title: 'Real-time Updates', desc: 'Watch the scan progress with live terminal logs.' },
        { icon: Users, title: 'For Everyone', desc: 'Technical reports for devs, executive summaries for managers.' },
        { icon: Award, title: 'Industry Standards', desc: 'Based on OWASP Top 10 and CWE classifications.' }
      ],
      statsTitle: 'Trusted by Security Teams',
      stats: [
        { value: '50+', label: 'Vulnerability Types' },
        { value: '< 5min', label: 'Average Scan Time' },
        { value: '99.9%', label: 'Uptime SLA' },
        { value: '24/7', label: 'Support' }
      ],
      pricingTitle: 'Pricing',
      pricingDesc: 'Start free, upgrade when you need more.',
      plans: [
        { name: 'Free', price: '$0', period: '/month', features: ['3 audits/month', 'Basic scanning', 'HTML reports', 'Email support'], cta: 'Start Free', highlight: false },
        { name: 'Lite', price: '$19.99', period: '/month', features: ['10 audits per month', 'Basic and Standard scanning', 'HTML and pdf reports', 'AI analysis', 'Email support'], cta: 'Get Lite', highlight: false },
        { name: 'Pro', price: '$49.99', period: '/month', features: ['Unlimited audits', 'Deep scanning', 'AI analysis & step-by-step resolution', 'PDF reports', 'Priority support'], cta: 'Get Pro', highlight: true },
        { name: 'Enterprise', price: '$99.99', period: '/month', features: ['Custom integrations', 'Dedicated support', 'SLA guarantee', 'On-premise option'], cta: 'Contact Sales', highlight: false }
      ],
      ctaTitle: 'Ready to Secure Your App?',
      ctaDesc: 'Start your first security audit in minutes. No credit card required.',
      ctaBtn: 'Start Free Audit',
      footer: 'See every flaw. Fix every risk.',
      login: 'Login',
      register: 'Register'
    },
    fr: {
      badge: 'Audits de Sécurité Automatisés',
      heroTitle1: 'Détectez chaque faille.',
      heroTitle2: 'Corrigez chaque risque.',
      heroDesc: 'Detekta automatise les audits de sécurité pour les applications web, mobiles, APIs et code backend. Obtenez des rapports complets alimentés par l\'IA.',
      getStarted: 'Commencer Gratuitement',
      learnMore: 'En Savoir Plus',
      auditTitle: 'Auditez Toute Cible',
      auditDesc: 'Tests de sécurité complets pour toutes vos applications.',
      features: {
        web: { name: 'Application Web', desc: 'Scannez les apps web pour XSS, injection SQL, CSRF et 50+ types de vulnérabilités.' },
        mobile: { name: 'Application Mobile', desc: 'Analysez les fichiers APK/IPA pour le stockage non sécurisé, secrets codés en dur.' },
        backend: { name: 'Backend/Code', desc: 'Examinez les dépôts de code pour les failles de sécurité, dépendances obsolètes.' },
        api: { name: 'API REST', desc: 'Testez les APIs pour l\'authentification cassée, injection, limitation de débit.' }
      },
      howItWorks: 'Comment Ça Marche',
      howItWorksDesc: 'Trois étapes simples pour sécuriser votre application.',
      steps: [
        { num: '01', title: 'Soumettez la Cible', desc: 'Entrez votre URL, téléchargez APK/IPA, ou connectez votre dépôt Git.' },
        { num: '02', title: 'Scan Automatisé', desc: 'Nos outils de sécurité analysent votre application en temps réel.' },
        { num: '03', title: 'Rapport IA', desc: 'Obtenez des insights actionnables et recommandations priorisées par Claude AI.' }
      ],
      whyTitle: 'Pourquoi Choisir Detekta ?',
      whyDesc: 'Tests de sécurité de niveau entreprise rendus accessibles.',
      whyFeatures: [
        { icon: Zap, title: 'Résultats Rapides', desc: 'Obtenez des rapports complets en minutes, pas en jours.' },
        { icon: Lock, title: 'Sécurisé', desc: 'Vos données sont chiffrées et jamais conservées plus que nécessaire.' },
        { icon: BarChart3, title: 'Insights Actionnables', desc: 'Recommandations IA avec suggestions de correction de code.' },
        { icon: Clock, title: 'Mises à Jour Temps Réel', desc: 'Suivez la progression du scan avec les logs terminal en direct.' },
        { icon: Users, title: 'Pour Tous', desc: 'Rapports techniques pour devs, résumés exécutifs pour managers.' },
        { icon: Award, title: 'Standards Industrie', desc: 'Basé sur OWASP Top 10 et classifications CWE.' }
      ],
      statsTitle: 'Approuvé par les Équipes Sécurité',
      stats: [
        { value: '50+', label: 'Types de Vulnérabilités' },
        { value: '< 5min', label: 'Temps de Scan Moyen' },
        { value: '99.9%', label: 'SLA Disponibilité' },
        { value: '24/7', label: 'Support' }
      ],
      pricingTitle: 'Tarification',
      pricingDesc: 'Commencez gratuitement, évoluez selon vos besoins.',
      plans: [
        { name: 'Gratuit', price: '0€', period: '/mois', features: ['3 audits/mois', 'Scan basique', 'Rapports HTML', 'Support email'], cta: 'Démarrer Gratuitement', highlight: false },
        { name: 'Lite', price: '19,99€', period: '/mois', features: ['10 audits par mois', 'Scan basique et standard', 'Rapports HTML et PDF', 'Analyse IA', 'Support email'], cta: 'Passer au Lite', highlight: false },
        { name: 'Pro', price: '49,99€', period: '/mois', features: ['Audits illimités', 'Scan approfondi', 'Analyse IA & résolution pas-à-pas', 'Rapports PDF', 'Support prioritaire'], cta: 'Obtenir Pro', highlight: true },
        { name: 'Entreprise', price: '99,99€', period: '/mois', features: ['Intégrations custom', 'Support dédié', 'Garantie SLA', 'Option on-premise'], cta: 'Contactez-nous', highlight: false }
      ],
      ctaTitle: 'Prêt à Sécuriser Votre App ?',
      ctaDesc: 'Lancez votre premier audit de sécurité en minutes. Aucune carte bancaire requise.',
      ctaBtn: 'Lancer un Audit Gratuit',
      footer: 'Détectez chaque faille. Corrigez chaque risque.',
      login: 'Connexion',
      register: 'Inscription'
    }
  };

  const c = content[language] || content.en;
  const featureKeys = ['web', 'mobile', 'backend', 'api'];
  const featureIcons = { web: Globe, mobile: Smartphone, backend: Server, api: Webhook };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0F14] text-zinc-900 dark:text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0D0F14]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Detekta" className="w-10 h-10 object-contain" />
            <span className="text-xl font-extrabold tracking-tight font-heading">DETEKTA</span>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" data-testid="landing-language-toggle">
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'EN' : 'FR'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
                <DropdownMenuItem 
                  onClick={() => handleLanguageChange('en')} 
                  className={`cursor-pointer ${language === 'en' ? 'text-cyan-400' : ''}`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleLanguageChange('fr')} 
                  className={`cursor-pointer ${language === 'fr' ? 'text-cyan-400' : ''}`}
                >
                  Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              data-testid="theme-toggle-landing"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="bg-blue-500 hover:bg-blue-400 text-white" data-testid="dashboard-nav-btn">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" data-testid="login-nav-btn">
                    {c.login}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-500 hover:bg-blue-400 text-white" data-testid="register-nav-btn">
                    {c.register}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6">
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1763926444195-a151d62b1003?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGN5YmVyJTIwc2VjdXJpdHklMjBiYWNrZ3JvdW5kJTIwbmVvbiUyMGJsdWV8ZW58MHx8fHwxNzc1NzUyNDEzfDA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#0D0F14] via-transparent to-white dark:to-[#0D0F14]" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-mono uppercase tracking-wider mb-6">
              {c.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4 font-heading"
          >
            {c.heroTitle1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-lime-400">
              {c.heroTitle2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            {c.heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              size="lg"
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-6 text-lg font-semibold"
              data-testid="get-started-btn"
            >
              {isAuthenticated ? 'Go to Dashboard' : c.getStarted}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white px-8 py-6 text-lg"
              data-testid="learn-more-btn"
            >
              {c.learnMore}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-white dark:bg-[#0D0F14] border-y border-zinc-200 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {c.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-[#0D0F14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 font-heading">
              {c.auditTitle}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {c.auditDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureKeys.map((key, index) => {
              const Icon = featureIcons[key];
              const feature = c.features[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'rgba(6,182,212,0.5)',
                    boxShadow: '0 0 20px rgba(6,182,212,0.2)'
                  }}
                  className="bg-zinc-50 dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-5 transition-all duration-200 rounded-lg shadow-sm dark:shadow-none flex flex-col h-full"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">{feature.desc}</p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => {
                        setSelectedAuditType(key);
                        setShowTestsModal(true);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider group"
                    >
                      {t('modals.seeAvailableTests', { ns: 'audit' })}
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AvailableTestsModal 
          isOpen={showTestsModal} 
          onClose={() => setShowTestsModal(false)} 
          auditType={selectedAuditType}
          depth="deep"
        />
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-zinc-50/50 dark:bg-[#0a0c10]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 font-heading">
              {c.howItWorks}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {c.howItWorksDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none"
              >
                <div className="text-5xl font-black text-cyan-500/20 absolute top-4 right-4 font-mono">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Detekta */}
      <section className="py-16 px-6 bg-white dark:bg-[#0D0F14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 font-heading">
              {c.whyTitle}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {c.whyDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.whyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-50 dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-5 flex gap-4 rounded-lg shadow-sm dark:shadow-none"
              >
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-zinc-50/50 dark:bg-[#0a0c10]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 font-heading">
              {c.pricingTitle}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {c.pricingDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {c.plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-[#13161D] border p-6 flex flex-col rounded-lg shadow-sm dark:shadow-none ${
                  plan.highlight 
                    ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] md:-translate-y-2' 
                    : 'border-zinc-200 dark:border-white/5'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="inline-block px-4 py-1 bg-cyan-500 text-black text-xs font-extrabold tracking-widest rounded-full shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-zinc-600 dark:text-zinc-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate('/register')}
                  className={`w-full ${
                    plan.highlight 
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black' 
                      : 'bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white dark:bg-[#0D0F14]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-blue-500/5 dark:from-blue-500/10 to-cyan-500/5 dark:to-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 p-10 text-center rounded-2xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 font-heading">
            {c.ctaTitle}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {c.ctaDesc}
          </p>
          <Button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8"
            data-testid="cta-btn"
          >
            {isAuthenticated ? 'Go to Dashboard' : c.ctaBtn}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0D0F14]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3 text-zinc-900 dark:text-white">
              <img src="/logo.png" alt="Detekta" className="w-8 h-8 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">DETEKTA</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Link to="/privacy" className="hover:text-blue-500 transition-colors uppercase tracking-wider">{t('footer.privacy')}</Link>
              <Link to="/terms" className="hover:text-blue-500 transition-colors uppercase tracking-wider">{t('footer.terms')}</Link>
              <button 
                onClick={() => setShowContactModal(true)}
                className="hover:text-blue-500 transition-colors uppercase tracking-wider"
              >
                {t('footer.contact')}
              </button>
            </div>

            <button 
              onClick={() => setShowChangelog(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full hover:border-blue-500/50 transition-all group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-blue-400 transition-colors">
                {t('footer.version')} 0.0.2
              </span>
            </button>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-100 dark:border-white/5">
            <p className="text-sm text-zinc-500">
              © 2026 Detekta. {c.footer}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-lime-500" />
                <span className="text-xs font-medium text-zinc-500">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ChangelogModal 
        isOpen={showChangelog} 
        onClose={() => setShowChangelog(false)} 
      />

      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
};

export default Landing;

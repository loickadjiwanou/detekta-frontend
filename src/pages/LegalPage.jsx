import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, ChevronLeft, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const LegalPage = ({ type }) => {
  const { t, i18n } = useTranslation(['legal', 'common']);
  const navigate = useNavigate();
  
  const content = type === 'privacy' ? t('privacy', { returnObjects: true }) : t('terms', { returnObjects: true });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  if (!content || !content.sections) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0F14] text-zinc-900 dark:text-white pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0D0F14]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-heading">DETEKTA</span>
            </Link>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('buttons.back', { ns: 'common' })}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              {type === 'privacy' ? (
                <Shield className="w-6 h-6 text-blue-400" />
              ) : (
                <FileText className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{content.title}</h1>
              <p className="text-zinc-500 text-sm mt-1">{content.lastUpdated}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-zinc dark:prose-invert max-w-none"
          >
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12 italic">
              {content.intro}
            </p>

            <div className="space-y-12">
              {content.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-l-4 border-blue-500 pl-4">
                    {section.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {section.content}
                  </p>
                  {section.items && (
                    <ul className="space-y-3 mt-4">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 pt-12 border-t border-zinc-200 dark:border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-zinc-500">
            Detekta © 2026 • {t('footer.privacy', { ns: 'common' })} • {t('footer.terms', { ns: 'common' })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;

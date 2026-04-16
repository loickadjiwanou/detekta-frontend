import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Rocket, CheckCircle2, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChangelogModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['common']);

  // We could fetch this or have it as a constant. 
  // For now, based on the translation structure.
  const versions = [
    {
      version: '0.0.2',
      date: 'April 2026',
      title: t('changelog.v002.title'),
      items: t('changelog.v002.items', { returnObjects: true }) || []
    },
    {
      version: '0.0.1',
      date: 'April 2026',
      title: t('changelog.v001.title'),
      items: t('changelog.v001.items', { returnObjects: true }) || []
    },
    {
      version: '0.0.0',
      date: 'March 2026',
      title: t('changelog.v000.title'),
      items: t('changelog.v000.items', { returnObjects: true }) || []
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                {t('changelog.title')}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                Detekta Evolution & Release Notes
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-8 space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {versions.map((v, idx) => (
            <div key={v.version} className="relative pl-8 border-l-2 border-zinc-200 dark:border-white/5">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-[#13161D]" />
              
              <div className="mb-2 flex items-center gap-3">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-2 py-0">
                  v{v.version}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {v.date}
                </div>
              </div>

              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                {v.title}
              </h4>

              <div className="space-y-3">
                {v.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t('buttons.close')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ChangelogModal };

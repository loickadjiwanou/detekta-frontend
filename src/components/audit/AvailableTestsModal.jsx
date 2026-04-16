import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Shield, CheckCircle2, Info } from 'lucide-react';
import { AUDIT_TESTS } from '../../constants/auditTests';
import { useTranslation } from 'react-i18next';

const AvailableTestsModal = ({ isOpen, onClose, auditType, depth }) => {
  const { t } = useTranslation(['audit', 'common']);
  const tests = AUDIT_TESTS[auditType] || [];

  // Filter tests based on depth if applicable
  const enabledTests = tests.filter(test => {
    if (!test.depth) return true;
    return test.depth.includes(depth);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                {t('modals.availableTestsTitle') || 'Certified Security Tests'}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                {t('modals.availableTestsDesc') || 'List of security checks that will be performed during this audit.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {enabledTests.map((test, index) => {
            const isOwasp = test.id.startsWith('A') && test.id.length <= 3;
            const displayName = isOwasp ? t(`owasp.${test.id}.name`) : test.name;
            const displayDesc = isOwasp ? t(`owasp.${test.id}.desc`) : test.description;
            
            return (
              <div 
                key={test.id}
                className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex gap-4"
              >
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-zinc-900 dark:text-white">{displayName}</h4>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-cyan-500/30 text-cyan-400">
                      {test.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {displayDesc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Depth info */}
          {depth === 'quick' && (
            <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300/80">
                {t('modals.depthNote') || 'Some advanced tests (like port scanning) are only available in Standard or Deep modes.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t('buttons.confirm', { ns: 'common' })}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AvailableTestsModal };

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step circle */}
            <motion.div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full font-mono text-sm font-bold transition-all ${
                isCompleted
                  ? 'bg-lime-500 text-black'
                  : isActive
                  ? 'bg-cyan-500 text-black border-2 border-cyan-400'
                  : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 border border-zinc-200 dark:border-white/10'
              }`}
              animate={isActive ? {
                boxShadow: ['0 0 0 0 rgba(6,182,212,0.4)', '0 0 0 10px rgba(6,182,212,0)', '0 0 0 0 rgba(6,182,212,0)']
              } : {}}
              transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </motion.div>

            {/* Step label */}
            <span className={`ml-3 text-sm font-medium ${
              isActive ? 'text-cyan-600 dark:text-cyan-400' : isCompleted ? 'text-lime-600 dark:text-lime-400' : 'text-zinc-500'
            }`}>
              {step}
            </span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                isCompleted ? 'bg-lime-500' : 'bg-zinc-200 dark:bg-white/10'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;

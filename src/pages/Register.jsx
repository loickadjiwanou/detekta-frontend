import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Controller } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';
import PageTransition from '../components/layout/PageTransition';

const registerSchema = z.object({
  full_name: z.string().min(2, 'nameMin'),
  email: z.string().email('emailInvalid'),
  password: z.string().min(8, 'passMin'),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'termsRequired'
  }),
  marketing_emails: z.boolean().optional().default(false)
});

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'common']);
  const { register: registerUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accept_terms: false,
      marketing_emails: false
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser(data.email, data.password, data.full_name, data.marketing_emails);
    setIsLoading(false);

    if (result.success) {
      toast.success(t('register.success'));
      navigate('/dashboard');
    } else {
      // Map known backend error strings to translation keys
      const errorMap = {
        'Email already registered': t('errors.emailExists'),
        'Registration failed': t('errors.registerFailed')
      };
      toast.error(errorMap[result.error] || result.error);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-[#0D0F14] flex items-center justify-center p-6 overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGN5YmVyJTIwc2VjdXJpdHklMjBiYWNrZ3JvdW5kJTIwbmVvbiUyMGJsdWV8ZW58MHx8fHwxNzc1NzUyNDEzfDA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-white/80 dark:bg-[#0D0F14]/80" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" alt="Detekta" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white font-heading">
              DETEKTA
            </span>
          </Link>

          {/* Card */}
          <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-8 rounded-lg shadow-md dark:shadow-none">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                {t('register.title')}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                {t('register.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-zinc-700 dark:text-zinc-300">
                  {t('labels.name', { ns: 'common' })}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-cyan-500"
                    {...register('full_name')}
                    data-testid="register-name-input"
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-red-400">{t(`errors.${errors.full_name.message}`)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
                  {t('labels.email', { ns: 'common' })}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-cyan-500"
                    {...register('email')}
                    data-testid="register-email-input"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400">{t(`errors.${errors.email.message}`)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">
                  {t('labels.password', { ns: 'common' })}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-cyan-500"
                    {...register('password')}
                    data-testid="register-password-input"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{t(`errors.${errors.password.message}`)}</p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <Controller
                    name="accept_terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox 
                        id="accept_terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    )}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor="accept_terms"
                      className="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                    >
                      {t('register.acceptTerms')}
                    </Label>
                    <div className="flex gap-2 text-xs">
                      <Link to="/privacy" className="text-blue-400 hover:underline">
                        {t('footer.privacy', { ns: 'common' })}
                      </Link>
                      <span className="text-zinc-600">&bull;</span>
                      <Link to="/terms" className="text-blue-400 hover:underline">
                        {t('footer.terms', { ns: 'common' })}
                      </Link>
                    </div>
                  </div>
                </div>
                {errors.accept_terms && (
                  <p className="text-xs text-red-400 ml-7">
                    {t(`errors.${errors.accept_terms.message}`)}
                  </p>
                )}

                <div className="flex items-start gap-3">
                  <Controller
                    name="marketing_emails"
                    control={control}
                    render={({ field }) => (
                      <Checkbox 
                        id="marketing_emails"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    )}
                  />
                  <Label 
                    htmlFor="marketing_emails"
                    className="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer leading-tight"
                  >
                    {t('register.marketing')}
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-6"
                data-testid="register-submit-btn"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('register.button')
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              {t('register.hasAccount')}{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                {t('register.signIn')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;

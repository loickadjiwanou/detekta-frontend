import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';
import PageTransition from '../components/layout/PageTransition';

const loginSchema = z.object({
  email: z.string().email('emailInvalid'),
  password: z.string().min(1, 'passMin')
});

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      toast.success(t('login.welcomeBack'));
      navigate('/dashboard');
    } else {
      // Map known backend error strings to translation keys
      const errorMap = {
        'Invalid email or password': t('errors.invalidCredentials'),
        'Login failed': t('errors.loginFailed')
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
                {t('login.title')}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                {t('login.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    data-testid="login-email-input"
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
                    data-testid="login-password-input"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{t(`errors.${errors.password.message}`)}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-6"
                data-testid="login-submit-btn"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('login.button')
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              {t('login.noAccount')}{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                {t('login.createAccount')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe, Bell, User, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ConfirmModal } from '../ui/ConfirmModal';

const Topbar = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, setLanguage, language } = useSettingsStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-[#0D0F14]/80 backdrop-blur-xl flex items-center justify-between px-6 transition-colors duration-300">
      {/* Search or breadcrumb area */}
      <div className="flex-1">
        {/* Can add search here */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all"
              data-testid="language-toggle"
            >
              <Globe className="w-5 h-5" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
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

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all"
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all relative"
          data-testid="notifications-btn"
        >
          <Bell className="w-5 h-5" />
        </motion.button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
              data-testid="user-menu-trigger"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.full_name}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10 w-48">
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <User className="w-4 h-4 mr-2" />
              {t('nav.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-white/10" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t('modals.logoutTitle')}
        description={t('modals.logoutDesc')}
        confirmText={t('modals.logoutConfirm')}
        variant="destructive"
      />
    </header>
  );
};

export default Topbar;

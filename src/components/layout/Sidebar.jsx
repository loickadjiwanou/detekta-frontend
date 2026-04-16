import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  FileSearch,
  FileText,
  Settings,
  LogOut,
  Archive
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'overview' },
  { path: '/audit/new', icon: PlusCircle, labelKey: 'newAudit' },
  { path: '/audits', icon: FileSearch, labelKey: 'myAudits' },
  { path: '/archives', icon: Archive, labelKey: 'archives' },
  { path: '/settings', icon: Settings, labelKey: 'settings' },
];

const Sidebar = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };



  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-50/60 dark:bg-[#0D0F14]/60 backdrop-blur-2xl border-r border-zinc-200 dark:border-white/5 z-40 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-200 dark:border-white/5">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <img src="/logo.png" alt="Detekta" className="w-10 h-10 object-contain" />
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-heading">
            DETEKTA
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-500 dark:text-cyan-400' : ''}`} />
                <span className="font-medium">{t(`nav.${item.labelKey}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-200 dark:border-white/5">
        <motion.button
          onClick={() => setShowLogoutModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
          data-testid="sidebar-logout-btn"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('nav.logout')}</span>
        </motion.button>
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
    </aside>
  );
};

export default Sidebar;

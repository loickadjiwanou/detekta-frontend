import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { Loader2 } from 'lucide-react';
import useSettingsStore from '../../store/settingsStore';
import { useTranslation } from 'react-i18next';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  variant = 'default', // 'default' or 'destructive'
}) => {
  const { theme } = useSettingsStore();
  const { t } = useTranslation('common');
  const isDark = theme === 'dark';

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onConfirm) onConfirm();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isDark ? 'bg-[#13161D] border-white/10' : 'bg-white'}>
        <AlertDialogHeader>
          <AlertDialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={isDark ? 'text-zinc-400' : 'text-gray-600'}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isLoading}
            className={isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : ''}
          >
            {cancelText || t('buttons.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              variant === 'destructive'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {confirmText || t('buttons.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Mail, Send, User, MessageSquare, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ContactModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['common']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`[Detekta Support] ${formData.subject}`);
    const body = encodeURIComponent(
      `${t('labels.mailName')}: ${formData.name}\n` +
      `${t('labels.mailEmail')}: ${formData.email}\n\n` +
      `${t('labels.mailMessage')}:\n${formData.message}`
    );
    
    window.location.href = `mailto:contact@detekta.com?subject=${subject}&body=${body}`;
    
    toast.success(t('labels.contactSuccess'));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                {t('labels.contactTitle')}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                {t('labels.contactDesc')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  {t('labels.name')}
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm transition-focus outline-none focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  {t('labels.email')}
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm transition-focus outline-none focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {t('labels.subject')}
              </label>
              <input
                required
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm transition-focus outline-none focus:border-blue-500"
                placeholder={t('labels.subjectPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" />
                {t('labels.message')}
              </label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm transition-focus outline-none focus:border-blue-500 resize-none"
                placeholder={t('labels.contactPlaceholder')}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-400 text-white py-6"
            >
              <Send className="w-4 h-4 mr-2" />
              {t('labels.contactAction')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ContactModal };

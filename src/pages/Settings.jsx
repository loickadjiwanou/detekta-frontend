import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  User, Key, Globe, Sun, Moon, Loader2, 
  Check, AlertCircle, Shield, Trash2, Eye, EyeOff
} from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import PageTransition from '../components/layout/PageTransition';
import useAuthStore from '../store/authStore';
import useSettingsStore from '../store/settingsStore';
import api from '../services/api';
import { toast } from 'sonner';

const Settings = () => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme, language, setLanguage } = useSettingsStore();

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    avatar_url: user?.avatar_url || '',
    preferred_language: user?.preferred_language || 'en',
    marketing_emails: user?.marketing_emails || false
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState(null);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [isDeletingKey, setIsDeletingKey] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchApiKeyStatus();
  }, []);

  const fetchApiKeyStatus = async () => {
    try {
      const response = await api.get('/users/me/api-key/status');
      setApiKeyStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch API key status:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const response = await api.patch('/users/me', profileData);
      updateUser(response.data);
      toast.success(t('common:success.saved'));
    } catch (error) {
      toast.error(t('apiKey.saveProfileError'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePreference = async (key, value) => {
    // Update local state immediately
    setProfileData(prev => ({ ...prev, [key]: value }));
    
    try {
      const response = await api.patch('/users/me', { [key]: value });
      updateUser(response.data);
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      toast.error(t('apiKey.saveProfileError'));
      // Rollback on failure
      setProfileData(prev => ({ ...prev, [key]: user?.[key] }));
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey) return;
    
    setIsSavingKey(true);
    try {
      await api.post('/users/me/api-key', {
        claude_api_key: apiKey,
        use_own: true
      });
      toast.success(t('apiKey.saveSuccess'));
      setApiKey('');
      fetchApiKeyStatus();
    } catch (error) {
      toast.error(t('apiKey.saveError'));
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleTestKey = async () => {
    setIsTestingKey(true);
    try {
      const response = await api.post('/users/me/api-key/test');
      if (response.data.valid) {
        toast.success(t('apiKey.testValid'));
      } else {
        toast.error(t('apiKey.testInvalid'));
      }
    } catch (error) {
      toast.error(t('common:errors.serverError', { defaultValue: 'Failed to test key' }));
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleDeleteKey = async () => {
    setIsDeletingKey(true);
    try {
      await api.delete('/users/me/api-key');
      toast.success(t('apiKey.deleteSuccess'));
      fetchApiKeyStatus();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(t('apiKey.deleteError'));
    } finally {
      setIsDeletingKey(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    handleUpdatePreference('preferred_language', lang);
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto" data-testid="settings-page">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-heading mb-8">
          {t('title')}
        </h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-zinc-100 dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-1 rounded-lg">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white text-zinc-600 dark:text-zinc-400">
              <User className="w-4 h-4 mr-2" />
              {t('tabs.profile')}
            </TabsTrigger>
            <TabsTrigger value="apiKey" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white text-zinc-600 dark:text-zinc-400">
              <Key className="w-4 h-4 mr-2" />
              {t('tabs.apiKey')}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white text-zinc-600 dark:text-zinc-400">
              <Globe className="w-4 h-4 mr-2" />
              {t('tabs.preferences')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t('profile.title')}</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-600 dark:text-zinc-400">{t('profile.name')}</Label>
                  <Input
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                    data-testid="profile-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-600 dark:text-zinc-400">{t('profile.email')}</Label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-600 dark:text-zinc-400">{t('profile.avatar')}</Label>
                  <Input
                    value={profileData.avatar_url}
                    onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                    placeholder="https://..."
                    className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                    data-testid="profile-avatar-input"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="bg-blue-500 hover:bg-blue-400 text-white"
                data-testid="save-profile-btn"
              >
                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {t('profile.save')}
              </Button>
            </div>
          </TabsContent>

          {/* API Key Tab */}
          <TabsContent value="apiKey" className="space-y-6">
            <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{t('apiKey.title')}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{t('apiKey.description')}</p>

              {/* The Option A and Option B cards have been removed as requested */}

              {/* Current Status */}
              {apiKeyStatus?.has_key ? (
                <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      <div>
                        <p className="text-cyan-900 dark:text-white font-medium">
                          {apiKeyStatus.use_own_api_key ? t('apiKey.usingOwn') : t('apiKey.usingPlatform')}
                        </p>
                        <p className="text-sm text-cyan-700 dark:text-zinc-400">{apiKeyStatus.key_preview}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestKey}
                        disabled={isTestingKey}
                        className="border-zinc-300 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white"
                      >
                        {isTestingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : t('apiKey.testKey')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isDeletingKey}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        data-testid="delete-key-btn"
                      >
                        {isDeletingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <p className="text-orange-800 dark:text-orange-300">{t('apiKey.noKey')}</p>
                  </div>
                </div>
              )}

              {/* Add New Key */}
              {!apiKeyStatus?.has_key && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-zinc-200 dark:border-white/5">
                    <div>
                      <Label className="text-zinc-900 dark:text-white">{t('apiKey.addOwnKey')}</Label>
                      <p className="text-sm text-zinc-500">{t('apiKey.addOwnKeyDesc')}</p>
                    </div>
                    <Switch
                      checked={showApiKeyForm}
                      onCheckedChange={setShowApiKeyForm}
                    />
                  </div>

                  {showApiKeyForm && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-2"
                     >
                      <Label className="text-zinc-600 dark:text-zinc-400">{t('apiKey.enterKey')}</Label>
                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <Input
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-ant-..."
                            className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white pr-10"
                            data-testid="api-key-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button
                          onClick={handleSaveApiKey}
                          disabled={!apiKey || isSavingKey}
                          className="bg-cyan-500 hover:bg-cyan-400 text-black"
                          data-testid="save-key-btn"
                        >
                          {isSavingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : t('apiKey.saveKey')}
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-500 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        {t('apiKey.encrypted')}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t('preferences.title')}</h2>

              {/* Language */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-200 dark:border-white/5">
                <div>
                  <Label className="text-zinc-900 dark:text-white">{t('preferences.language')}</Label>
                  <p className="text-sm text-zinc-500">{t('preferences.langDesc')}</p>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-40 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <Label className="text-zinc-900 dark:text-white">{t('preferences.theme')}</Label>
                  <p className="text-sm text-zinc-500">
                    {t('preferences.themeDesc')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-zinc-500" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    data-testid="theme-toggle-settings"
                  />
                  <Moon className="w-4 h-4 text-zinc-500" />
                </div>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between py-4 border-t border-zinc-200 dark:border-white/5">
                <div>
                  <Label className="text-zinc-900 dark:text-white">{t('register.marketing', { ns: 'auth' })}</Label>
                  <p className="text-sm text-zinc-500">
                    {t('preferences.marketingDesc', { defaultValue: 'Receive security alerts, updates, and news.' })}
                  </p>
                </div>
                <Switch
                  checked={profileData.marketing_emails}
                  onCheckedChange={(checked) => handleUpdatePreference('marketing_emails', checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteKey}
          title={t('modals.deleteKeyTitle', { ns: 'common' })}
          description={t('modals.deleteKeyDesc', { ns: 'common' })}
          confirmText={t('modals.deleteConfirm', { ns: 'common' })}
          isLoading={isDeletingKey}
          variant="destructive"
        />
      </div>
    </PageTransition>
  );
};

export default Settings;

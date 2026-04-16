import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Smartphone, Server, Webhook, 
  ChevronRight, ChevronLeft, Zap, Gauge, Search,
  Key, Shield, Loader2, Upload, File, X, CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import StepIndicator from '../components/audit/StepIndicator';
import { AvailableTestsModal } from '../components/audit/AvailableTestsModal';
import PageTransition from '../components/layout/PageTransition';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { toast } from 'sonner';

const auditTypes = [
  { key: 'web', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { key: 'mobile', icon: Smartphone, color: 'from-purple-500 to-pink-500' },
  { key: 'backend', icon: Server, color: 'from-orange-500 to-red-500' },
  { key: 'api', icon: Webhook, color: 'from-lime-500 to-emerald-500' }
];

const depthOptions = [
  { key: 'quick', icon: Zap },
  { key: 'standard', icon: Gauge },
  { key: 'deep', icon: Search }
];

const ALLOWED_EXTENSIONS = ['.apk', '.ipa', '.aab'];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

const NewAudit = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['audit', 'common', 'settings']);
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [auditName, setAuditName] = useState('');
  const [target, setTarget] = useState('');
  const [config, setConfig] = useState({
    depth: 'standard',
    include_ai_analysis: true,
    language: 'en'
  });
  const [apiKeyMode, setApiKeyMode] = useState(user?.use_own_api_key ? 'own' : 'platform');
  const [newApiKey, setNewApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const steps = [
    t('steps.type'),
    t('steps.target'),
    t('steps.apiKey')
  ];

  useEffect(() => {
    // Fetch API key status
    const fetchApiKeyStatus = async () => {
      try {
        const response = await api.get('/users/me/api-key/status');
        setApiKeyStatus(response.data);
        if (response.data.use_own_api_key) {
          setApiKeyMode('own');
        }
      } catch (error) {
        console.error('Failed to fetch API key status:', error);
      }
    };
    fetchApiKeyStatus();
  }, []);

  // File upload handlers
  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(t('validation.invalidFileType', { exts: ALLOWED_EXTENSIONS.join(', ') }));
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t('validation.fileTooLarge'));
      return false;
    }
    return true;
  };

  const uploadFile = async (file) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/audits/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setUploadedFile({
        name: file.name,
        size: file.size,
        path: response.data.file_path
      });
      setTarget(response.data.file_path);
      toast.success(t('toasts.uploadSuccess'));
    } catch (error) {
      const errorDetail = error.response?.data?.detail || t('toasts.uploadFailed');
      toast.error(errorDetail);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setTarget('');
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!selectedType) {
        toast.error(t('validation.selectType'));
        return;
      }
      // Validate name early if provided
      if (auditName) {
        try {
          await api.get(`/audits/validate-name?name=${encodeURIComponent(auditName)}&type=${selectedType}`);
        } catch (error) {
          const detail = error.response?.data?.detail || "Audit name already exists";
          toast.error(detail);
          return;
        }
      }
    }
    
    if (currentStep === 1 && !target) {
      toast.error(t('validation.enterTarget'));
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSaveApiKey = async () => {
    if (!newApiKey) return;
    
    setIsSavingKey(true);
    try {
      await api.post('/users/me/api-key', {
        claude_api_key: newApiKey,
        use_own: true
      });
      toast.success(t('apiKey.saveSuccess', { ns: 'settings' }));
      setApiKeyStatus({ has_key: true, use_own_api_key: true, key_preview: newApiKey.slice(0, 7) + '***' });
      setApiKeyMode('own');
      setNewApiKey('');
    } catch (error) {
      toast.error(t('apiKey.saveError', { ns: 'settings' }));
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const targetPayload = {};
      if (selectedType === 'web') targetPayload.url = target;
      else if (selectedType === 'api') targetPayload.api_endpoint = target;
      else if (selectedType === 'backend') targetPayload.git_repo = target;
      else if (selectedType === 'mobile') targetPayload.file_path = target;

      const response = await api.post('/audits/', {
        type: selectedType,
        name: auditName || null,
        target: targetPayload,
        scan_config: config,
        use_own_api_key: apiKeyMode === 'own'
      });

      toast.success(t('toasts.startSuccess'));
      navigate(`/audit/${response.data.id}`);
    } catch (error) {
      const errorDetail = error.response?.data?.detail || t('toasts.startFailed');
      toast.error(errorDetail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetPlaceholder = () => {
    switch (selectedType) {
      case 'web': return 'https://example.com';
      case 'api': return 'https://api.example.com/v1';
      case 'backend': return 'https://github.com/user/repo';
      case 'mobile': return 'File path from upload';
      default: return '';
    }
  };

  const getTargetLabel = () => {
    switch (selectedType) {
      case 'web': return t('target.url');
      case 'api': return t('target.apiEndpoint');
      case 'backend': return t('target.gitRepo');
      case 'mobile': return t('target.uploadFile');
      default: return 'Target';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto" data-testid="new-audit-page">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
            {t('new.title')}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {t('new.subtitle')}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Type Selection */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Audit Name */}
              <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
                <Label className="text-zinc-900 dark:text-white text-lg mb-4 block">
                  {t('new.auditName')}
                </Label>
                <Input
                  value={auditName}
                  onChange={(e) => setAuditName(e.target.value)}
                  placeholder={t('new.auditNamePlaceholder')}
                  className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-lg py-6"
                  data-testid="audit-name-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auditTypes.map((type) => (
                <motion.button
                  key={type.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type.key)}
                  className={`relative bg-white dark:bg-[#13161D] border p-6 text-left transition-all rounded-lg shadow-sm dark:shadow-none ${
                    selectedType === type.key
                      ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20'
                  }`}
                  data-testid={`audit-type-${type.key}`}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                    <type.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    {t(`types.${type.key}`)}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t(`typeDescriptions.${type.key}`)}
                  </p>
                  {selectedType === type.key && (
                    <motion.div
                      layoutId="selected"
                      className="absolute top-4 right-4 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Target & Config */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Target Input */}
              <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
                <Label className="text-zinc-900 dark:text-white text-lg mb-4 block">
                  {getTargetLabel()}
                </Label>
                
                {selectedType === 'mobile' ? (
                  // Drag & Drop File Upload
                  <div>
                    {!uploadedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                          isDragOver 
                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' 
                            : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                        }`}
                      >
                        {isUploading ? (
                          <div className="space-y-4">
                            <Loader2 className="w-12 h-12 text-cyan-400 mx-auto animate-spin" />
                            <div className="w-full max-w-xs mx-auto">
                              <div className="h-2 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-cyan-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{uploadProgress}% {t('progress.scanning')}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-cyan-400' : 'text-zinc-500'}`} />
                            <p className={`text-lg mb-2 ${isDragOver ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                              {isDragOver ? t('target.dropFile') : t('target.dragDrop')}
                            </p>
                            <p className="text-zinc-500 text-sm mb-4">{t('target.or')}</p>
                            <label>
                              <input
                                type="file"
                                accept=".apk,.ipa,.aab"
                                onChange={handleFileSelect}
                                className="hidden"
                                data-testid="file-input"
                              />
                              <Button variant="outline" className="cursor-pointer" asChild>
                                <span>
                                  <Upload className="w-4 h-4 mr-2" />
                                  {t('target.browse')}
                                </span>
                              </Button>
                            </label>
                            <p className="text-xs text-zinc-600 mt-4">
                              {t('target.maxSize')}
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      // Uploaded file preview
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 bg-lime-500/10 border border-lime-500/30 p-4 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center">
                          <File className="w-6 h-6 text-lime-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-900 dark:text-white font-medium truncate">{uploadedFile.name}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-lime-400" />
                          <button
                            onClick={removeFile}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            data-testid="remove-file-btn"
                          >
                            <X className="w-5 h-5 text-zinc-400 hover:text-red-400" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder={getTargetPlaceholder()}
                    className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-lg py-6"
                    data-testid="audit-target-input"
                  />
                )}
              </div>

              {/* Scan Config */}
              <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">{t('config.title', { ns: 'audit' })}</h3>
                
                {/* Depth Selection */}
                <div className="mb-6">
                  <Label className="text-zinc-500 dark:text-zinc-400 mb-3 block">{t('config.depth')}</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {depthOptions.map((depth) => (
                      <button
                        key={depth.key}
                        onClick={() => setConfig(prev => ({ ...prev, depth: depth.key }))}
                        className={`p-4 border rounded-lg transition-all ${
                          config.depth === depth.key
                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                            : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                        }`}
                        data-testid={`depth-${depth.key}`}
                      >
                        <depth.icon className={`w-6 h-6 mx-auto mb-2 ${
                          config.depth === depth.key ? 'text-cyan-400' : 'text-zinc-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          config.depth === depth.key ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {t(`config.${depth.key}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Analysis Toggle */}
                <div className="flex items-center justify-between py-4 border-t border-zinc-200 dark:border-white/5">
                  <div>
                    <Label className="text-zinc-900 dark:text-white">{t('config.aiAnalysis')}</Label>
                    <p className="text-sm text-zinc-500">{t('config.aiAnalysisDesc')}</p>
                  </div>
                  <Switch
                    checked={config.include_ai_analysis}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, include_ai_analysis: checked }))}
                    data-testid="ai-analysis-toggle"
                  />
                </div>

                {/* Language Selection */}
                <div className="flex items-center justify-between py-4 border-t border-zinc-200 dark:border-white/5">
                  <Label className="text-zinc-900 dark:text-white">{t('config.reportLanguage')}</Label>
                  <Select
                    value={config.language}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="w-32 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: API Key Setup */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {!config.include_ai_analysis ? (
                <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-12 text-center rounded-lg shadow-sm dark:shadow-none">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{t('apiKeySetup.aiDisabledTitle')}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {t('apiKeySetup.aiDisabledDesc')}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t('apiKeySetup.title')}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Own Key */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setApiKeyMode('own')}
                      className={`relative bg-white dark:bg-[#13161D] border p-6 text-left transition-all rounded-lg shadow-sm dark:shadow-none ${
                        apiKeyMode === 'own'
                          ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                          : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20'
                      }`}
                      data-testid="api-key-own"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Key className="w-6 h-6 text-cyan-400" />
                        <span className="font-semibold text-zinc-900 dark:text-white">{t('apiKeySetup.ownKey')}</span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{t('apiKeySetup.ownKeyDesc')}</p>
                      <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
                        {t('apiKey.optionA.badge', { ns: 'settings' })}
                      </span>
                    </motion.button>

                    {/* Platform Key */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setApiKeyMode('platform')}
                      className={`relative bg-white dark:bg-[#13161D] border p-6 text-left transition-all rounded-lg shadow-sm dark:shadow-none ${
                        apiKeyMode === 'platform'
                          ? 'border-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.3)]'
                          : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20'
                      }`}
                      data-testid="api-key-platform"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-lime-400" />
                        <span className="font-semibold text-zinc-900 dark:text-white">{t('apiKeySetup.platformKey')}</span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{t('apiKeySetup.platformKeyDesc')}</p>
                      <span className="inline-block px-3 py-1 bg-lime-500/10 text-lime-400 text-xs rounded-full">
                        {t('apiKey.optionB.badge', { ns: 'settings' })}
                      </span>
                    </motion.button>
                  </div>

                  {/* Own Key Input */}
                  {apiKeyMode === 'own' && !apiKeyStatus?.has_key && (
                    <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
                      <Label className="text-zinc-900 dark:text-white mb-3 block">{t('apiKeySetup.enterKey')}</Label>
                      <div className="flex gap-4">
                        <Input
                          type="password"
                          value={newApiKey}
                          onChange={(e) => setNewApiKey(e.target.value)}
                          placeholder={t('apiKeySetup.keyPlaceholder')}
                          className="flex-1 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                          data-testid="api-key-input"
                        />
                        <Button
                          onClick={handleSaveApiKey}
                          disabled={!newApiKey || isSavingKey}
                          className="bg-cyan-500 hover:bg-cyan-400 text-black"
                        >
                          {isSavingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : t('apiKeySetup.validateSave')}
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        {t('apiKeySetup.getKey')}
                      </p>
                    </div>
                  )}

                  {/* Show current key status */}
                  {apiKeyMode === 'own' && apiKeyStatus?.has_key && (
                    <div className="bg-cyan-50/50 dark:bg-[#13161D] border border-cyan-500/30 p-6 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                          <Key className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-zinc-900 dark:text-white font-medium">{t('apiKeySetup.usingOwn')}</p>
                          <p className="text-sm text-zinc-500">{apiKeyStatus.key_preview}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Available Tests Preview Link */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowTestsModal(true)}
                      className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                      type="button"
                    >
                      <Shield className="w-4 h-4" />
                      {t('common:buttons.viewAvailableTests')}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Tests Modal */}
        <AvailableTestsModal
          isOpen={showTestsModal}
          onClose={() => setShowTestsModal(false)}
          auditType={selectedType}
          depth={config.depth}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white"
            data-testid="step-back-btn"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('common:buttons.previous')}
          </Button>

          {currentStep < 2 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-400 text-white"
              data-testid="step-next-btn"
            >
              {t('common:buttons.next')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
              data-testid="start-audit-btn"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {t('common:buttons.startAudit')}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default NewAudit;

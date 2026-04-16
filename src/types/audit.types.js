export const AuditTypes = {
  WEB: 'web',
  MOBILE: 'mobile',
  BACKEND: 'backend',
  API: 'api'
};

export const AuditStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const ScanDepth = {
  QUICK: 'quick',
  STANDARD: 'standard',
  DEEP: 'deep'
};

// Type definitions for JSDoc
/**
 * @typedef {'web' | 'mobile' | 'backend' | 'api'} AuditType
 * @typedef {'pending' | 'running' | 'completed' | 'failed'} AuditStatusType
 * @typedef {'quick' | 'standard' | 'deep'} ScanDepthType
 */

/**
 * @typedef {Object} AuditTarget
 * @property {string} [url]
 * @property {string} [file_path]
 * @property {string} [git_repo]
 * @property {string} [api_endpoint]
 */

/**
 * @typedef {Object} ScanConfig
 * @property {ScanDepthType} depth
 * @property {boolean} include_ai_analysis
 * @property {'en' | 'fr'} language
 */

/**
 * @typedef {Object} Audit
 * @property {string} id
 * @property {string} user_id
 * @property {AuditType} type
 * @property {AuditTarget} target
 * @property {AuditStatusType} status
 * @property {'own' | 'platform'} api_key_mode
 * @property {ScanConfig} scan_config
 * @property {string} [error_message]
 * @property {string} created_at
 * @property {string} [started_at]
 * @property {string} [completed_at]
 */

/**
 * @typedef {Object} AuditListItem
 * @property {string} id
 * @property {AuditType} type
 * @property {string} target_display
 * @property {AuditStatusType} status
 * @property {string} created_at
 * @property {string} [completed_at]
 * @property {number} [score]
 */

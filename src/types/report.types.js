export const Severity = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info'
};

export const RiskLevel = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  SECURE: 'secure'
};

/**
 * @typedef {'critical' | 'high' | 'medium' | 'low' | 'info'} SeverityType
 * @typedef {'critical' | 'high' | 'medium' | 'low' | 'secure'} RiskLevelType
 */

/**
 * @typedef {Object} Finding
 * @property {string} id
 * @property {string} title
 * @property {SeverityType} severity
 * @property {string} category
 * @property {string} description
 * @property {string} affected_component
 * @property {string} [evidence]
 * @property {number} [cvss_score]
 * @property {string[]} [cve_ids]
 * @property {string} [recommendation]
 * @property {string} [code_fix]
 * @property {string[]} [references]
 */

/**
 * @typedef {Object} ReportSummary
 * @property {number} overall_score
 * @property {RiskLevelType} risk_level
 * @property {number} total_findings
 * @property {number} critical_count
 * @property {number} high_count
 * @property {number} medium_count
 * @property {number} low_count
 * @property {number} info_count
 * @property {string} executive_summary
 * @property {string} technical_summary
 */

/**
 * @typedef {Object} AIAnalysis
 * @property {string} model_used
 * @property {'own' | 'platform'} api_key_mode
 * @property {string} risk_narrative
 * @property {string[]} priority_actions
 * @property {string[]} quick_wins
 * @property {string[]} long_term_recommendations
 */

/**
 * @typedef {Object} ReportMetadata
 * @property {number} scan_duration_seconds
 * @property {string[]} tools_used
 * @property {string} scan_depth
 * @property {string} language
 */

/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} audit_id
 * @property {string} user_id
 * @property {ReportSummary} summary
 * @property {Finding[]} findings
 * @property {AIAnalysis} [ai_analysis]
 * @property {ReportMetadata} metadata
 * @property {string} generated_at
 */

export const AUDIT_TESTS = {
  web: [
    { id: 'A04', category: 'A04:2025', name: 'Cryptographic Failures', description: 'Tests SSL/TLS configuration, certificate validity, and HTTPS enforcement.', depth: ['quick', 'standard', 'deep'] },
    { id: 'A02', category: 'A02:2025', name: 'Security Misconfiguration', description: 'Analyzes security headers, server disclosures, and risky open ports.', depth: ['quick', 'standard', 'deep'] },
    { id: 'A01', category: 'A01:2025', name: 'Broken Access Control', description: 'Checks for directory listing, sensitive file exposure (.git, .env), and admin path access.', depth: ['standard', 'deep'] },
    { id: 'A05', category: 'A05:2025', name: 'Injection', description: 'Tests for SQL Injection and Reflected Cross-Site Scripting (XSS).', depth: ['standard', 'deep'] },
    { id: 'A07', category: 'A07:2025', name: 'Authentication Failures', description: 'Identifies weak authentication mechanisms and missing rate limiting.', depth: ['standard', 'deep'] },
    { id: 'A10', category: 'A10:2025', name: 'Mishandling of Exceptional Conditions', description: 'Detects verbose error messages, stack traces, and debug information leaks.', depth: ['standard', 'deep'] },
    { id: 'A03', category: 'A03:2025', name: 'Software Supply Chain Failures', description: 'Scans for outdated or vulnerable third-party frontend libraries.', depth: ['deep'] },
    { id: 'A06', category: 'A06:2025', name: 'Insecure Design', description: 'Evaluates high-level design flaws, including CORS policies and insecure redirect patterns.', depth: ['deep'] },
    { id: 'A08', category: 'A08:2025', name: 'Software or Data Integrity Failures', description: 'Verifies Subresource Integrity (SRI) for external scripts and resources.', depth: ['deep'] },
    { id: 'A09', category: 'A09:2025', name: 'Security Logging and Alerting Failures', description: 'Checks for publicly accessible log files and diagnostic endpoints.', depth: ['deep'] }
  ],
  api: [
    { id: 'connectivity', category: 'Infrastructure', name: 'Endpoint Accessibility', description: 'Verifies the API endpoint is reachable and responsive.' },
    { id: 'auth', category: 'Access Control', name: 'Authentication Check', description: 'Tests if endpoints are properly protected by auth mechanisms.' },
    { id: 'cors', category: 'Network Security', name: 'CORS Configuration', description: 'Analyzes Cross-Origin Resource Sharing policies for misconfigurations.' },
    { id: 'rate_limit', category: 'Availability', name: 'Rate Limiting', description: 'Tests protection against brute force and DoS attacks.' },
    { id: 'headers_api', category: 'Security Configuration', name: 'Security Headers', description: 'Checks for standard API protection headers.' }
  ],
  mobile: [
    { id: 'package', category: 'Manifest', name: 'Package Analysis', description: 'Inspects manifest files and application permissions.' },
    { id: 'secrets', category: 'Storage', name: 'Secret Scanning', description: 'Scans for hardcoded API keys and credentials in the binary.' },
    { id: 'storage', category: 'Encryption', name: 'Data Storage Check', description: 'Analyzes local storage practices for sensitive information.' },
    { id: 'network_cfg', category: 'Transport Security', name: 'Network Security Config', description: 'Checks for certificate pinning and cleartext traffic policies.' }
  ],
  backend: [
    { id: 'dependencies', category: 'Supply Chain', name: 'Dependency Analysis', description: 'Scans for outdated or vulnerable third-party packages.' },
    { id: 'static_analysis', category: 'Source Code', name: 'Static Code Analysis', description: 'Checks code patterns for common security vulnerabilities (SAST).' },
    { id: 'secrets_code', category: 'Storage', name: 'Secrets Detection', description: 'Scans source code for hardcoded passwords and keys.' },
    { id: 'config_scan', category: 'Configuration', name: 'Configuration Scan', description: 'Verifies security of Dockerfiles and environment setups.' }
  ]
};

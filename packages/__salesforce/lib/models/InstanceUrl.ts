export type InstanceUrlType = 'production' | 'sandbox' | 'custom';

export const GENERAL_INSTANCE_URLS = {
  PRODUCTION: 'https://login.salesforce.com',
  SANDBOX: 'https://test.salesforce.com',
} as const;

const LIGHTNING_HOST_SUFFIX = '.lightning.force.com';
const LIGHTNING_MY_HOST_SUFFIX = '.my.lightning.force.com';
const SETUP_HOST_SUFFIX = '.salesforce-setup.com';
const DEFAULT_DOMAIN_SUFFIX = '.my.salesforce.com';
const FORCE_DOMAIN_SUFFIX = 'force.com';

const replaceProtocolWithHttps = (value: string): string => {
  const protocolPattern = /^[a-z][a-z\d+\-.]*:\/\//i;
  if (!protocolPattern.test(value)) {
    return `https://${value}`;
  }

  return value.replace(protocolPattern, 'https://');
};

const attachSuffix = (prefix: string, suffix: string): string => {
  if (!suffix.startsWith('.')) {
    return prefix ? `${prefix}.${suffix}` : suffix;
  }

  return prefix ? `${prefix}${suffix}` : suffix.slice(1);
};

export const normalizeCustomInstanceUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const withHttps = replaceProtocolWithHttps(trimmed);

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(withHttps);
  } catch {
    return null;
  }

  let hostname = parsedUrl.hostname.toLowerCase();

  if (!hostname) {
    return null;
  }

  if (hostname.endsWith(LIGHTNING_MY_HOST_SUFFIX)) {
    const prefix = hostname.slice(0, -LIGHTNING_MY_HOST_SUFFIX.length);
    hostname = attachSuffix(prefix, DEFAULT_DOMAIN_SUFFIX);
  } else if (hostname.endsWith(LIGHTNING_HOST_SUFFIX)) {
    const prefix = hostname.slice(0, -LIGHTNING_HOST_SUFFIX.length);
    hostname = attachSuffix(prefix, DEFAULT_DOMAIN_SUFFIX);
  }

  if (hostname.endsWith(SETUP_HOST_SUFFIX)) {
    const prefix = hostname.slice(0, -SETUP_HOST_SUFFIX.length);
    hostname = attachSuffix(prefix, '.salesforce.com');
  }

  const portSegment = parsedUrl.port ? `:${parsedUrl.port}` : '';

  if (!hostname.includes('.')) {
    hostname = attachSuffix(hostname, DEFAULT_DOMAIN_SUFFIX);
  }

  if (!hostname.endsWith(FORCE_DOMAIN_SUFFIX)) {
    return null;
  }

  return `https://${hostname}${portSegment}`;
};

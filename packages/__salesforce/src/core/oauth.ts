import type { OAuthConfig, PKCEParams, SalesforceTokens } from '../models';

export const buildAuthorizationUrl = (config: OAuthConfig, pkce: PKCEParams): string => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code_challenge: pkce.code_challenge,
    code_challenge_method: pkce.code_challenge_method,
    scope: 'api refresh_token id',
  });

  return `${config.instanceUrl}/services/oauth2/authorize?${params.toString()}`;
};

export const exchangeCodeForTokens = async (
  code: string,
  verifier: string,
  config: OAuthConfig
): Promise<SalesforceTokens> => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch(`${config.instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`トークン交換に失敗しました: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    instance_url: data.instance_url,
  };
};

export const refreshAccessToken = async (
  refreshToken: string,
  config: OAuthConfig
): Promise<SalesforceTokens> => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
  });

  const response = await fetch(`${config.instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`トークンリフレッシュに失敗しました: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    instance_url: data.instance_url,
  };
};

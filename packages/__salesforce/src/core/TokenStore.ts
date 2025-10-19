import type { SalesforceTokens } from '../models';

export class TokenStore {
  private tokens: SalesforceTokens | null = null;

  setTokens = (tokens: SalesforceTokens): void => {
    this.tokens = tokens;
  };

  getTokens = (): SalesforceTokens | null => {
    return this.tokens;
  };

  clearTokens = (): void => {
    this.tokens = null;
  };
}

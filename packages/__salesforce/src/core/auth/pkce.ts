/*
 * Proof Key for Code Exchange
 */
import { createHash, randomBytes } from 'crypto';

export type PKCEParams = {
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: 'S256';
};

const base64URLEncode = (buffer: Buffer): string => {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const generateCodeChallenge = (verifier: string): string => {
  // SHA-256ハッシュを計算してBase64URLエンコード
  const hash = createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
};

export const PKCEParams = {
  generate: (): PKCEParams => {
    const code_verifier = base64URLEncode(randomBytes(32));
    const code_challenge = generateCodeChallenge(code_verifier);

    return {
      code_verifier,
      code_challenge,
      code_challenge_method: 'S256',
    };
  },
};

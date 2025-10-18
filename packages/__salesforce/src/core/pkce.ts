import { createHash, randomBytes } from 'crypto';

import type { PKCEParams } from '../models';

const base64URLEncode = (buffer: Buffer): string => {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const generateCodeVerifier = (): string => {
  // 43-128文字のランダム文字列を生成
  const verifier = base64URLEncode(randomBytes(32));
  return verifier;
};

export const generateCodeChallenge = (verifier: string): string => {
  // SHA-256ハッシュを計算してBase64URLエンコード
  const hash = createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
};

export const generatePKCEParams = (): PKCEParams => {
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);

  return {
    code_verifier,
    code_challenge,
    code_challenge_method: 'S256',
  };
};

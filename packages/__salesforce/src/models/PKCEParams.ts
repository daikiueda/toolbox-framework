export type PKCEParams = {
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: 'S256';
};

/**
 * for Client App
 */
export const getGlobalAPI = (): typeof window.api | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.api;
};

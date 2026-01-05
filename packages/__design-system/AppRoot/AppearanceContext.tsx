import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ThemeSource = 'system' | 'light' | 'dark';
export type AppearanceMode = 'light' | 'dark';

type AppearanceContextValue = AppearanceState & {
  setThemeSource: (next: ThemeSource) => void;
};

type AppearanceState = {
  mode: AppearanceMode;
  themeSource: ThemeSource;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

type AppearanceStatePayload = {
  themeSource: ThemeSource;
  shouldUseDarkColors: boolean;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

type AppearanceAPI = {
  getState: () => Promise<AppearanceStatePayload>;
  setThemeSource: (themeSource: ThemeSource) => Promise<AppearanceStatePayload>;
  subscribe: (listener: (state: AppearanceStatePayload) => void) => () => void;
};

type AppearanceProviderProps = {
  children: React.ReactNode;
};

const DEFAULT_MODE: AppearanceMode = 'light';
const prefersDark = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const computeMode = (themeSource: ThemeSource, systemPrefersDark: boolean) => {
  if (themeSource === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return themeSource;
};

const defaultValue: AppearanceContextValue = {
  mode: DEFAULT_MODE,
  themeSource: 'system',
  shouldUseHighContrastColors: false,
  shouldUseInvertedColorScheme: false,
  setThemeSource: () => undefined,
};

const AppearanceContext = createContext<AppearanceContextValue>(defaultValue);

const readAppearanceAPI = (): AppearanceAPI | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const bridge = (window as typeof window & { api?: { appearance?: AppearanceAPI } }).api;

  return bridge?.appearance;
};

const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  const appearanceAPIRef = useRef<AppearanceAPI | undefined>(undefined);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);
  const [state, setState] = useState<AppearanceState>(() => {
    const systemIsDark = prefersDark();
    return {
      mode: computeMode('system', systemIsDark),
      themeSource: 'system',
      shouldUseHighContrastColors: false,
      shouldUseInvertedColorScheme: false,
    };
  });

  const updateFromPayload = useCallback((payload: AppearanceStatePayload) => {
    setState({
      mode: payload.shouldUseDarkColors ? 'dark' : 'light',
      themeSource: payload.themeSource,
      shouldUseHighContrastColors: payload.shouldUseHighContrastColors,
      shouldUseInvertedColorScheme: payload.shouldUseInvertedColorScheme,
    });
  }, []);

  useEffect(() => {
    appearanceAPIRef.current = readAppearanceAPI();

    const systemMediaQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    mediaQueryRef.current = systemMediaQuery;

    let unsubscribeAppearance: (() => void) | undefined;

    if (appearanceAPIRef.current) {
      appearanceAPIRef.current
        .getState()
        .then(updateFromPayload)
        .catch(() => {
          // fallback to media query state if IPC is unavailable
          const systemIsDark = systemMediaQuery?.matches ?? prefersDark();
          setState((prev) => ({
            ...prev,
            mode: computeMode(prev.themeSource, systemIsDark),
          }));
        });

      unsubscribeAppearance = appearanceAPIRef.current.subscribe(updateFromPayload);
    }

    const handleSystemChange = () => {
      setState((prev) => ({
        ...prev,
        mode: computeMode(prev.themeSource, systemMediaQuery?.matches ?? prefersDark()),
      }));
    };

    systemMediaQuery?.addEventListener('change', handleSystemChange);

    return () => {
      unsubscribeAppearance?.();
      systemMediaQuery?.removeEventListener('change', handleSystemChange);
    };
  }, [updateFromPayload]);

  const setThemeSource = useCallback(
    (themeSource: ThemeSource) => {
      const api = appearanceAPIRef.current;
      if (api) {
        api
          .setThemeSource(themeSource)
          .then(updateFromPayload)
          .catch(() => {
            const systemIsDark = mediaQueryRef.current?.matches ?? prefersDark();
            setState({
              mode: computeMode(themeSource, systemIsDark),
              themeSource,
              shouldUseHighContrastColors: false,
              shouldUseInvertedColorScheme: false,
            });
          });
        return;
      }

      const systemIsDark = mediaQueryRef.current?.matches ?? prefersDark();
      setState({
        mode: computeMode(themeSource, systemIsDark),
        themeSource,
        shouldUseHighContrastColors: false,
        shouldUseInvertedColorScheme: false,
      });
    },
    [updateFromPayload]
  );

  const value = useMemo<AppearanceContextValue>(
    () => ({
      ...state,
      setThemeSource,
    }),
    [setThemeSource, state]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
};

export { AppearanceContext, AppearanceProvider };

import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getGlobalAPI } from '@toolbox/electron';

export type AppearanceSource = 'system' | 'light' | 'dark';
export type AppearanceMode = 'light' | 'dark';

type AppearanceContextValue = AppearanceState & {
  setSource: (next: AppearanceSource) => void;
};

type AppearanceState = {
  mode: AppearanceMode;
  source: AppearanceSource;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

type AppearanceStatePayload = {
  themeSource: AppearanceSource;
  shouldUseDarkColors: boolean;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

type AppearanceAPI = {
  getState: () => Promise<AppearanceStatePayload>;
  setThemeSource: (source: AppearanceSource) => Promise<AppearanceStatePayload>;
  subscribe: (listener: (state: AppearanceStatePayload) => void) => () => void;
};

type AppearanceProviderProps = {
  children: React.ReactNode;
};

const STORAGE_KEY = 'design-system:appearance-source';
const DEFAULT_MODE: AppearanceMode = 'light';
const DEFAULT_SOURCE: AppearanceSource = 'system';

const prefersDark = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const computeMode = (source: AppearanceSource, systemPrefersDark: boolean) => {
  if (source === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return source;
};

export const isAppearanceSource = (value: unknown): value is AppearanceSource =>
  value === 'system' || value === 'light' || value === 'dark';

const defaultValue: AppearanceContextValue = {
  mode: DEFAULT_MODE,
  source: DEFAULT_SOURCE,
  shouldUseHighContrastColors: false,
  shouldUseInvertedColorScheme: false,
  setSource: () => undefined,
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
  const isHydratedRef = useRef(false);

  const storage = useMemo(() => getGlobalAPI()?.persistence, []);

  const [state, setState] = useState<AppearanceState>(() => {
    const systemIsDark = prefersDark();
    return {
      mode: computeMode(DEFAULT_SOURCE, systemIsDark),
      source: DEFAULT_SOURCE,
      shouldUseHighContrastColors: false,
      shouldUseInvertedColorScheme: false,
    };
  });

  const updateFromPayload = useCallback((payload: AppearanceStatePayload) => {
    setState({
      mode: payload.shouldUseDarkColors ? 'dark' : 'light',
      source: payload.themeSource,
      shouldUseHighContrastColors: payload.shouldUseHighContrastColors,
      shouldUseInvertedColorScheme: payload.shouldUseInvertedColorScheme,
    });
  }, []);

  // 起動時に永続化された値を復元
  useEffect(() => {
    appearanceAPIRef.current = readAppearanceAPI();

    const systemMediaQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    mediaQueryRef.current = systemMediaQuery;

    let cancelled = false;
    let unsubscribeAppearance: (() => void) | undefined;

    const initializeSource = async () => {
      // 1. persistence から復元を試みる
      if (STORAGE_KEY && storage) {
        try {
          const stored = await storage.read(STORAGE_KEY);
          if (!cancelled && stored && isAppearanceSource(stored)) {
            const systemIsDark = systemMediaQuery?.matches ?? prefersDark();
            setState({
              mode: computeMode(stored, systemIsDark),
              source: stored,
              shouldUseHighContrastColors: false,
              shouldUseInvertedColorScheme: false,
            });

            // Electron API があれば nativeTheme も同期
            if (appearanceAPIRef.current) {
              appearanceAPIRef.current.setThemeSource(stored).catch(() => {
                // ignore
              });
            }

            isHydratedRef.current = true;
            return;
          }
        } catch {
          // ignore
        }
      }

      // 2. Electron API から取得
      if (appearanceAPIRef.current) {
        try {
          const payload = await appearanceAPIRef.current.getState();
          if (!cancelled) {
            updateFromPayload(payload);
          }
        } catch {
          // fallback to media query state if IPC is unavailable
          const systemIsDark = systemMediaQuery?.matches ?? prefersDark();
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              mode: computeMode(prev.source, systemIsDark),
            }));
          }
        }
      }

      isHydratedRef.current = true;
    };

    initializeSource();

    if (appearanceAPIRef.current) {
      unsubscribeAppearance = appearanceAPIRef.current.subscribe(updateFromPayload);
    }

    const handleSystemChange = () => {
      setState((prev) => ({
        ...prev,
        mode: computeMode(prev.source, systemMediaQuery?.matches ?? prefersDark()),
      }));
    };

    systemMediaQuery?.addEventListener('change', handleSystemChange);

    return () => {
      cancelled = true;
      unsubscribeAppearance?.();
      systemMediaQuery?.removeEventListener('change', handleSystemChange);
    };
  }, [updateFromPayload, storage]);

  // source が変更されたら永続化
  useEffect(() => {
    if (!STORAGE_KEY || !storage || !isHydratedRef.current) {
      return;
    }

    storage.write(STORAGE_KEY, state.source).catch((error) => {
      console.warn('[design-system] Failed to persist appearance source:', error);
    });
  }, [storage, state.source]);

  const setSource = useCallback(
    (source: AppearanceSource) => {
      const api = appearanceAPIRef.current;
      if (api) {
        api
          .setThemeSource(source)
          .then(updateFromPayload)
          .catch(() => {
            const systemIsDark = mediaQueryRef.current?.matches ?? prefersDark();
            setState({
              mode: computeMode(source, systemIsDark),
              source,
              shouldUseHighContrastColors: false,
              shouldUseInvertedColorScheme: false,
            });
          });
        return;
      }

      const systemIsDark = mediaQueryRef.current?.matches ?? prefersDark();
      setState({
        mode: computeMode(source, systemIsDark),
        source,
        shouldUseHighContrastColors: false,
        shouldUseInvertedColorScheme: false,
      });
    },
    [updateFromPayload]
  );

  const value = useMemo<AppearanceContextValue>(
    () => ({
      ...state,
      setSource,
    }),
    [setSource, state]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
};

export { AppearanceContext, AppearanceProvider };

'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'en' | 'ar';
type Preferences = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
};
const Context = createContext<Preferences>({
  locale: 'en', setLocale: () => {}, dark: false, setDark: () => {},
});
function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.dataset.theme = dark ? 'dark' : 'light';
  root.style.colorScheme = dark ? 'dark' : 'light';
}
function safeRead(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeWrite(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Storage may be blocked. UI still works. */ }
}
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const savedLocale = safeRead('tapndo-locale');
    const savedTheme = safeRead('tapndo-theme');
    const initialLocale = savedLocale === 'ar' ? 'ar' : 'en';
    const initialDark = savedTheme === 'dark';
    setLocale(initialLocale);
    setDark(initialDark);
    applyTheme(initialDark);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);
  useEffect(() => { applyTheme(dark); }, [dark]);
  const chooseLocale = (value: Locale) => {
    safeWrite('tapndo-locale', value);
    setLocale(value);
  };
  const chooseDark = (value: boolean) => {
    // Apply before React renders: consistent light/dark response without a stale root class.
    applyTheme(value);
    safeWrite('tapndo-theme', value ? 'dark' : 'light');
    setDark(value);
  };
  return <Context.Provider value={{
    locale, setLocale: chooseLocale, dark, setDark: chooseDark,
  }}>{children}</Context.Provider>;
}
export const usePreferences = () => useContext(Context);

'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type Locale = 'en' | 'ar';
type Preferences = { locale: Locale; setLocale: (locale: Locale) => void; dark: boolean; setDark: (dark: boolean) => void };
const Context = createContext<Preferences>({ locale: 'en', setLocale: () => {}, dark: false, setDark: () => {} });
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setLocale(localStorage.getItem('tapndo-locale') === 'ar' ? 'ar' : 'en');
    setDark(localStorage.getItem('tapndo-theme') === 'dark');
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', dark);
  }, [locale, dark]);
  const chooseLocale = (value: Locale) => { localStorage.setItem('tapndo-locale', value); setLocale(value); };
  const chooseDark = (value: boolean) => { localStorage.setItem('tapndo-theme', value ? 'dark' : 'light'); setDark(value); };
  return <Context.Provider value={{ locale, setLocale: chooseLocale, dark, setDark: chooseDark }}>{children}</Context.Provider>;
}
export const usePreferences = () => useContext(Context);

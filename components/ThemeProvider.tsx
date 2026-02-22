'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeStore();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [isDark]);

  return <>{children}</>;
}

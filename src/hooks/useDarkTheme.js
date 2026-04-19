import { useState, useCallback } from 'react';

export function useDarkTheme() {
  const [darkTheme, setDarkThemeState] = useState(
    () => localStorage.getItem('dark_theme') ?? 'blue'
  );

  const setDarkTheme = useCallback((theme) => {
    localStorage.setItem('dark_theme', theme);
    if (theme === 'black') {
      document.documentElement.classList.add('dark-black');
    } else {
      document.documentElement.classList.remove('dark-black');
    }
    setDarkThemeState(theme);
  }, []);

  return { darkTheme, setDarkTheme };
}

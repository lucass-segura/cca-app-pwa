import { useState, useCallback } from 'react';

const KEY = 'himno_font_size';
const DEFAULT = 22;
const MIN = 16;
const MAX = 40;

export function useFontSize() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return saved ? parseInt(saved) : DEFAULT;
  });

  const aumentarLetra = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.min(prev + 2, MAX);
      localStorage.setItem(KEY, next);
      return next;
    });
  }, []);

  const reducirLetra = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.max(prev - 2, MIN);
      localStorage.setItem(KEY, next);
      return next;
    });
  }, []);

  return { fontSize, aumentarLetra, reducirLetra };
}

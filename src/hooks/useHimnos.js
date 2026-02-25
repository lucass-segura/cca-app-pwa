import { useState, useEffect } from 'react';
import fallbackHimnos from '../data/himnos.json';
import fallbackCoritos from '../data/coritos.json';

const HIMNOS_KEY = 'himnos_data';
const CORITOS_KEY = 'coritos_data';
const VERSION_KEY = 'data_version';

function getFromCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage full — ignore
  }
}

export function useHimnos() {
  const [himnos, setHimnos] = useState(() => {
    return getFromCache(HIMNOS_KEY) || fallbackHimnos;
  });

  const [coritos, setCoritos] = useState(() => {
    return getFromCache(CORITOS_KEY) || fallbackCoritos;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkForUpdates() {
      try {
        const res = await fetch('/data/version.json', { cache: 'no-cache' });
        if (!res.ok) return;
        const { version: remoteVersion } = await res.json();
        const localVersion = getFromCache(VERSION_KEY) || 0;

        if (remoteVersion > localVersion) {
          const [himnosRes, coritosRes] = await Promise.all([
            fetch('/data/himnos.json', { cache: 'no-cache' }),
            fetch('/data/coritos.json', { cache: 'no-cache' }),
          ]);

          if (!himnosRes.ok || !coritosRes.ok) return;

          const newHimnos = await himnosRes.json();
          const newCoritos = await coritosRes.json();

          if (cancelled) return;

          saveToCache(HIMNOS_KEY, newHimnos);
          saveToCache(CORITOS_KEY, newCoritos);
          saveToCache(VERSION_KEY, remoteVersion);

          setHimnos(newHimnos);
          setCoritos(newCoritos);
        }
      } catch {
        // Offline or network error — use cached/fallback data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkForUpdates();
    return () => { cancelled = true; };
  }, []);

  return { himnos, coritos, loading };
}

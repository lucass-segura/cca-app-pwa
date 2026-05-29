import { useSyncExternalStore } from 'react';
import fallbackHimnos from '../data/himnos.json';
import fallbackCoritos from '../data/coritos.json';

const HIMNOS_KEY = 'himnos_data';
const CORITOS_KEY = 'coritos_data';
const VERSION_KEY = 'data_version';

function getFromCache(key) {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToCache(key, data) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage full — ignore
  }
}

let snapshot = {
  himnos: getFromCache(HIMNOS_KEY) || fallbackHimnos,
  coritos: getFromCache(CORITOS_KEY) || fallbackCoritos,
  loading: true,
};

const listeners = new Set();
let updateStarted = false;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

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

      saveToCache(HIMNOS_KEY, newHimnos);
      saveToCache(CORITOS_KEY, newCoritos);
      saveToCache(VERSION_KEY, remoteVersion);

      snapshot = {
        himnos: newHimnos,
        coritos: newCoritos,
        loading: snapshot.loading,
      };
      emitChange();
    }
  } catch {
    // Offline or network error — use cached/fallback data
  } finally {
    if (snapshot.loading) {
      snapshot = { ...snapshot, loading: false };
      emitChange();
    }
  }
}

function ensureUpdateStarted() {
  if (updateStarted || typeof fetch === 'undefined') return;
  updateStarted = true;
  checkForUpdates();
}

function subscribe(listener) {
  listeners.add(listener);
  ensureUpdateStarted();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

export function useHimnos() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

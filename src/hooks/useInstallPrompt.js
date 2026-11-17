import { useState, useEffect } from 'react';

function detectStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getOS() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

// Samsung Internet instala las PWA con un APK propio que Play Protect suele
// marcar como "aplicación no segura". No depende del manifest: la misma app
// instalada desde Chrome no muestra el aviso, así que ahí se ofrece Chrome.
function isSamsungInternet() {
  return /SamsungBrowser/i.test(navigator.userAgent);
}

export function useInstallPrompt() {
  const [isStandalone] = useState(detectStandalone);
  const [mobile] = useState(isMobile);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [os] = useState(getOS);
  const [samsungInternet] = useState(isSamsungInternet);
  // null | 'installing' | 'installed'. Android instala en segundo plano y sólo
  // avisa con una notificación, así que la pantalla tiene que decirlo ella.
  const [installState, setInstallState] = useState(null);

  // Only block on mobile browsers that aren't installed
  const shouldBlock = mobile && !isStandalone;

  useEffect(() => {
    if (!shouldBlock) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onInstalled = () => setInstallState('installed');

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [shouldBlock]);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    // `appinstalled` puede llegar antes que esta respuesta: no pisar 'installed'.
    if (outcome === 'accepted') {
      setInstallState((current) => current ?? 'installing');
    }
  };

  return { shouldBlock, os, install, canInstall: !!deferredPrompt, samsungInternet, installState };
}

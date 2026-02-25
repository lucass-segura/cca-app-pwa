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

export function useInstallPrompt() {
  const [isStandalone] = useState(detectStandalone);
  const [mobile] = useState(isMobile);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [os] = useState(getOS);

  // Only block on mobile browsers that aren't installed
  const shouldBlock = mobile && !isStandalone;

  useEffect(() => {
    if (!shouldBlock) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [shouldBlock]);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return { shouldBlock, os, install, canInstall: !!deferredPrompt };
}

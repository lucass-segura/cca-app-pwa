import { useState, useCallback } from 'react';

let isSweeping = false;

const SUN_SVG = `<svg viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="_ts_sun" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFEA00"/>
      <stop offset="100%" stop-color="#FF9500"/>
    </linearGradient>
  </defs>
  <g fill="#FF9500" opacity="0.9">
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(0 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(45 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(90 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(135 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(180 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(225 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(270 100 100)"/>
    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" transform="rotate(315 100 100)"/>
  </g>
  <circle cx="100" cy="100" r="55" fill="url(#_ts_sun)" stroke="white" stroke-width="6"/>
  <circle cx="120" cy="80" r="10" fill="white" fill-opacity="0.4"/>
  <circle cx="130" cy="95" r="5" fill="white" fill-opacity="0.2"/>
</svg>`;

const CLOUD_LIGHT = `<svg viewBox="0 0 240 200" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block">
  <defs>
    <linearGradient id="_ts_cloudL" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#80dfff"/>
    </linearGradient>
  </defs>
  <path d="M50 160 C20 160 20 120 40 110 C40 70 90 60 110 80 C130 50 200 50 210 100 C240 110 240 160 200 160 Z"
    fill="url(#_ts_cloudL)" stroke="white" stroke-width="8" stroke-linejoin="round"/>
  <path d="M60 145 Q110 135 200 145" stroke="rgba(0,0,0,0.05)" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M80 85 Q110 75 140 85" stroke="white" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8"/>
</svg>`;

const CLOUD_DARK = `<svg viewBox="0 0 240 200" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block">
  <defs>
    <linearGradient id="_ts_cloudD" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <path d="M50 160 C20 160 20 120 40 110 C40 70 90 60 110 80 C130 50 200 50 210 100 C240 110 240 160 200 160 Z"
    fill="url(#_ts_cloudD)" stroke="#64748b" stroke-width="8" stroke-linejoin="round"/>
  <path d="M60 145 Q110 135 200 145" stroke="rgba(0,0,0,0.15)" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M80 85 Q110 75 140 85" stroke="rgba(255,255,255,0.12)" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`;

export function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );

  const toggle = useCallback(() => {
    if (isSweeping) return;
    isSweeping = true;

    const html = document.documentElement;
    const goingDark = !html.classList.contains('dark');
    const DUR = 700;

    /* ── Build overlay scene ── */
    const scene = document.createElement('div');
    Object.assign(scene.style, {
      position: 'fixed', inset: '0', zIndex: '9998',
      pointerEvents: 'none', overflow: 'hidden',
    });

    const stars = document.createElement('div');
    Object.assign(stars.style, { position: 'absolute', inset: '0' });
    [[8,10],[25,5],[48,16],[72,8],[90,20],[12,35],[38,28],[62,40],
     [84,32],[5,55],[30,50],[54,60],[78,52],[18,70],[44,76],
     [68,66],[92,62],[3,84],[34,88],[58,80],[86,75]].forEach(([x, y]) => {
      const d = document.createElement('div');
      const r = 1.5 + Math.random() * 2;
      Object.assign(d.style, {
        position: 'absolute', left: x + '%', top: y + '%',
        width: r + 'px', height: r + 'px', borderRadius: '50%',
        background: 'white', opacity: String(0.3 + Math.random() * 0.55),
      });
      stars.appendChild(d);
    });
    scene.appendChild(stars);

    const sun = document.createElement('div');
    Object.assign(sun.style, {
      position: 'absolute', left: '50%', width: '90px', height: '90px',
      marginLeft: '-45px', zIndex: '2',
    });
    sun.innerHTML = SUN_SVG;
    scene.appendChild(sun);

    const cloudWrap = document.createElement('div');
    Object.assign(cloudWrap.style, {
      position: 'absolute', left: '50%', top: '46%',
      transform: 'translate(-50%,-50%)',
      width: 'min(65vw, 260px)', zIndex: '3',
    });
    const cLight = document.createElement('div');
    cLight.innerHTML = CLOUD_LIGHT;
    const cDark = document.createElement('div');
    cDark.innerHTML = CLOUD_DARK;
    Object.assign(cDark.style, { position: 'absolute', inset: '0' });
    cloudWrap.appendChild(cLight);
    cloudWrap.appendChild(cDark);
    scene.appendChild(cloudWrap);

    document.body.appendChild(scene);

    /* ── Animate overlay ── */
    const bg0 = goingDark ? '#F8FAFC' : '#0B1121';
    const bg1 = goingDark ? '#0B1121' : '#F8FAFC';

    scene.animate([
      { transform: 'translateX(-100%)', backgroundColor: bg0, offset: 0,    easing: 'cubic-bezier(0,0,0.2,1)' },
      { transform: 'translateX(0)',     backgroundColor: bg0, offset: 0.22,  easing: 'ease-in-out' },
      { transform: 'translateX(0)',     backgroundColor: bg1, offset: 0.78,  easing: 'cubic-bezier(0.4,0,1,1)' },
      { transform: 'translateX(100%)',  backgroundColor: bg1, offset: 1 },
    ], { duration: DUR, fill: 'forwards' });

    sun.animate(goingDark ? [
      { top: '15%', opacity: 1, offset: 0 },
      { top: '15%', opacity: 1, offset: 0.24, easing: 'ease-in' },
      { top: '38%', opacity: 0, offset: 0.55 },
      { top: '38%', opacity: 0, offset: 1 },
    ] : [
      { top: '38%', opacity: 0, offset: 0 },
      { top: '38%', opacity: 0, offset: 0.32, easing: 'ease-out' },
      { top: '15%', opacity: 1, offset: 0.65 },
      { top: '15%', opacity: 1, offset: 1 },
    ], { duration: DUR, fill: 'forwards' });

    stars.animate(goingDark ? [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.42 },
      { opacity: 1, offset: 0.65 },
      { opacity: 1, offset: 1 },
    ] : [
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: 0.20 },
      { opacity: 0, offset: 0.42 },
      { opacity: 0, offset: 1 },
    ], { duration: DUR, fill: 'forwards' });

    cDark.animate([
      { opacity: goingDark ? 0 : 1, offset: 0 },
      { opacity: goingDark ? 0 : 1, offset: 0.22, easing: 'ease-in-out' },
      { opacity: goingDark ? 1 : 0, offset: 0.65 },
      { opacity: goingDark ? 1 : 0, offset: 1 },
    ], { duration: DUR, fill: 'forwards' });

    /* ── Switch theme at midpoint via startViewTransition ── */
    const switchTheme = () => {
      html.classList.toggle('dark');
      const dark = html.classList.contains('dark');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      setIsDark(dark);
    };

    setTimeout(() => {
      if (!document.startViewTransition) {
        switchTheme();
      } else {
        document.startViewTransition(switchTheme);
      }
    }, DUR * 0.5);

    /* ── Cleanup ── */
    setTimeout(() => {
      scene.remove();
      isSweeping = false;
    }, DUR + 100);
  }, []);

  return { isDark, toggle };
}

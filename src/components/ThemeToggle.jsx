import { useDarkMode } from '../hooks/useDarkMode';

export function ThemeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="relative w-10 h-10 shrink-0 rounded-full flex items-center justify-center
                 hover:bg-black/5 dark:hover:bg-white/10
                 active:scale-90 transition-transform duration-150
                 focus:outline-none"
    >
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        {/* Sun */}
        <g style={{ opacity: isDark ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          <circle cx="50" cy="50" r="16" fill="#FDB813" />
          <g stroke="#FDB813" strokeWidth="3" strokeLinecap="round">
            <line x1="50" y1="22" x2="50" y2="12" />
            <line x1="50" y1="78" x2="50" y2="88" />
            <line x1="22" y1="50" x2="12" y2="50" />
            <line x1="78" y1="50" x2="88" y2="50" />
            <line x1="30" y1="30" x2="23" y2="23" />
            <line x1="70" y1="30" x2="77" y2="23" />
            <line x1="30" y1="70" x2="23" y2="77" />
            <line x1="70" y1="70" x2="77" y2="77" />
          </g>
        </g>

        {/* Moon + stars */}
        <g style={{ opacity: isDark ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <path d="M48 30 A18 18 0 1 0 68 50 A13 13 0 0 1 48 30" fill="#F0E68C" />
          <circle cx="32" cy="34" r="1.5" fill="#F0E68C" opacity="0.7" />
          <circle cx="76" cy="40" r="1" fill="#F0E68C" opacity="0.5" />
          <circle cx="28" cy="62" r="1" fill="#F0E68C" opacity="0.4" />
          <circle cx="72" cy="70" r="1.3" fill="#F0E68C" opacity="0.6" />
        </g>
      </svg>
    </button>
  );
}

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
      {/* Sol — light mode */}
      <svg
        viewBox="0 0 24 24"
        className="w-[22px] h-[22px] absolute"
        style={{ opacity: isDark ? 0 : 1, transition: 'opacity 0.25s ease' }}
        fill="#93C5FD"
      >
        <circle cx="12" cy="12" r="5" />
        <rect x="11" y="1"  width="2" height="3" rx="1" />
        <rect x="11" y="20" width="2" height="3" rx="1" />
        <rect x="1"  y="11" width="3" height="2" rx="1" />
        <rect x="20" y="11" width="3" height="2" rx="1" />
        <rect x="4.2"  y="4.2"  width="2" height="3" rx="1" transform="rotate(-45 4.2 4.2)" />
        <rect x="17.8" y="4.2"  width="2" height="3" rx="1" transform="rotate(45 17.8 4.2)" />
        <rect x="4.2"  y="17.8" width="2" height="3" rx="1" transform="rotate(45 4.2 17.8)" />
        <rect x="17.8" y="17.8" width="2" height="3" rx="1" transform="rotate(-45 17.8 17.8)" />
      </svg>

      {/* Luna — dark mode */}
      <svg
        viewBox="0 0 24 24"
        className="w-[22px] h-[22px] absolute"
        style={{ opacity: isDark ? 1 : 0, transition: 'opacity 0.25s ease' }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#93C5FD" />
      </svg>
    </button>
  );
}

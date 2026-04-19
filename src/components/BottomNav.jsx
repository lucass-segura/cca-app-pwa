import { Link, useLocation } from 'react-router-dom';
import { useRef, useLayoutEffect, useState } from 'react';

const tabs = [
  { path: '/',              icon: 'home',      label: 'Inicio'     },
  { path: '/categorias',    icon: 'bookmarks', label: 'Categorías' },
  { path: '/favoritos',     icon: 'favorite',  label: 'Favoritos'  },
  { path: '/configuracion', icon: 'settings',  label: 'Config'     },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const pillRefs = useRef([]);
  const [indicator, setIndicator] = useState(null);

  const activeIndex = tabs.findIndex((tab) =>
    tab.path === '/'
      ? pathname === '/'
      : pathname === tab.path || pathname.startsWith(tab.path + '/')
  );

  useLayoutEffect(() => {
    const pillEl = pillRefs.current[activeIndex];
    const navEl = navRef.current;
    if (!pillEl || !navEl) return;
    const navRect = navEl.getBoundingClientRect();
    const pillRect = pillEl.getBoundingClientRect();
    setIndicator({
      left: pillRect.left - navRect.left,
      width: pillRect.width,
    });
  }, [activeIndex]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 px-4"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
    >
      <nav
        ref={navRef}
        className="relative max-w-md mx-auto bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-xl border border-borderLight dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Sliding pill */}
        {indicator && (
          <div
            aria-hidden="true"
            className="absolute bg-primary/10 dark:bg-primaryDark/15 rounded-full pointer-events-none"
            style={{
              top: 12,
              left: indicator.left,
              width: indicator.width,
              height: 34,
              transition: 'left 0.44s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        )}

        <div className="flex items-center h-[58px] px-2">
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex-1 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                aria-label={tab.label}
              >
                <div
                  ref={(el) => { pillRefs.current[i] = el; }}
                  className="flex items-center justify-center w-10 h-[34px] rounded-full"
                >
                  <span
                    className={`material-icons-round transition-colors duration-200 ${
                      isActive
                        ? 'text-[22px] text-primary dark:text-primaryDark'
                        : 'text-[22px] text-textSecondary/40 dark:text-textSecondaryDark/35'
                    }`}
                  >
                    {tab.icon}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

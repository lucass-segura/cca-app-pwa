import { useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Himnos", icon: "home", path: "/" },
  // Los coros viven dentro de Categorías: /coros mantiene esa pestaña activa.
  { label: "Categorias", icon: "bookmarks", path: "/categorias", alsoMatch: ["/coros"] },
  { label: "Favoritos", icon: "favorite", path: "/favoritos" },
  { label: "Novedades", icon: "campaign", path: "/novedades", menu: "novedades" },
];

const novedadesItems = [
  { label: "Reuniones", icon: "groups", path: "/novedades/reuniones" },
  { label: "Ubicaciones", icon: "location_on", path: "/novedades/ubicaciones" },
  { label: "Relatorio", icon: "article", path: "/novedades/relatorio" },
];

export function BottomNavBar({ className, stickyBottom = true }) {
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [novedadesMenuPath, setNovedadesMenuPath] = useState(null);
  const [indicator, setIndicator] = useState(null);
  const navItemsContainerRef = useRef(null);
  const navItemRefs = useRef([]);
  const isNovedadesOpen = novedadesMenuPath === pathname;

  const activeIndex = navItems.findIndex((item) => {
    if (item.path === "/") return pathname === "/";
    const paths = [item.path, ...(item.alsoMatch ?? [])];
    return paths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );
  });
  const visualActiveIndex = isNovedadesOpen
    ? navItems.findIndex((item) => item.menu === "novedades")
    : activeIndex;

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeItem = navItemRefs.current[visualActiveIndex];
      const container = navItemsContainerRef.current;

      if (visualActiveIndex === -1 || !activeItem || !container) {
        setIndicator(null);
        return;
      }

      const nextIndicator = {
        left: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
      };

      setIndicator((currentIndicator) =>
        currentIndicator?.left === nextIndicator.left &&
        currentIndicator.width === nextIndicator.width
          ? currentIndicator
          : nextIndicator
      );
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [visualActiveIndex]);

  const menuTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 520, damping: 34, mass: 0.8 };
  const barTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 300, damping: 26 };
  const indicatorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 500, damping: 36, mass: 0.7 };

  return (
    <div
      className={cn(
        "left-0 right-0 z-[2000] px-1.5 sm:px-4",
        stickyBottom && "fixed bottom-0"
      )}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}
    >
      {isNovedadesOpen && (
        <div className="fixed bottom-[92px] right-3 z-[2100] w-[13.75rem] max-w-[calc(100vw-24px)] sm:bottom-[84px] sm:right-[calc(50%-13rem)]">
          <Motion.div
            id="novedades-menu"
            initial={{ opacity: 0, y: 18, scale: 0.88, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={menuTransition}
            style={{ transformOrigin: "85% 100%" }}
            className="floating-glass overflow-hidden rounded-lg p-1.5"
          >
            <div className="flex flex-col">
              {novedadesItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setNovedadesMenuPath(null)}
                    className={cn(
                      "group flex min-h-[58px] items-center gap-3.5 rounded-md px-3.5 py-3 text-[17px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "bg-primary/12 text-primary dark:bg-primaryDark/18 dark:text-primaryDark"
                        : "text-textPrimary hover:bg-black/[0.05] dark:text-textPrimaryDark dark:hover:bg-white/[0.07]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
                        isActive
                          ? "bg-primary text-white dark:bg-primaryDark dark:text-bgDark"
                          : "bg-black/[0.06] text-textSecondary group-hover:bg-black/[0.08] dark:bg-white/[0.08] dark:text-textSecondaryDark dark:group-hover:bg-white/[0.12]"
                      )}
                      aria-hidden
                    >
                      <span className="material-icons-round text-[22px]">
                        {item.icon}
                      </span>
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </Motion.div>
        </div>
      )}
      <Motion.nav
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={barTransition}
        role="navigation"
        aria-label="Bottom Navigation"
        className={cn(
          "floating-glass relative mx-auto w-full max-w-lg overflow-hidden rounded-lg sm:max-w-md",
          className
        )}
      >
        <div
          ref={navItemsContainerRef}
          className="relative flex h-[66px] items-center px-0.5 sm:h-[58px] sm:px-2"
        >
          <Motion.div
            aria-hidden="true"
            initial={false}
            animate={
              indicator
                ? { left: indicator.left, width: indicator.width, opacity: 1 }
                : { opacity: 0 }
            }
            transition={indicatorTransition}
            className="pointer-events-none absolute inset-y-1 rounded-full bg-primary/10 dark:bg-primaryDark/15"
          />
          {navItems.map((item, idx) => {
            const isActive = visualActiveIndex === idx;
            const itemClassName = cn(
              "relative z-10 flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md px-1 py-1 font-sans text-[11px] font-medium leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-[48px]",
              isActive
                ? "text-primary dark:text-primaryDark"
                : "text-textSecondary hover:text-textPrimary dark:text-textSecondaryDark dark:hover:text-textPrimaryDark"
            );
            const content = (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    "material-icons-round text-[29px] leading-none sm:text-[25px]",
                    isActive
                      ? "text-primary dark:text-primaryDark"
                      : "text-textSecondary/70 dark:text-textSecondaryDark/70"
                  )}
                >
                  {item.icon}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "max-w-full truncate whitespace-nowrap",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                  title={isActive ? item.label : undefined}
                >
                  {item.label}
                </span>
              </>
            );

            return item.menu === "novedades" ? (
              <button
                key={item.label}
                ref={(node) => {
                  navItemRefs.current[idx] = node;
                }}
                type="button"
                className={itemClassName}
                aria-label="Abrir novedades"
                aria-controls="novedades-menu"
                aria-expanded={isNovedadesOpen}
                onClick={() =>
                  setNovedadesMenuPath(isNovedadesOpen ? null : pathname)
                }
              >
                {content}
              </button>
            ) : (
              <Link
                key={item.label}
                ref={(node) => {
                  navItemRefs.current[idx] = node;
                }}
                to={item.path}
                className={itemClassName}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setNovedadesMenuPath(null)}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </Motion.nav>
    </div>
  );
}

export default BottomNavBar;

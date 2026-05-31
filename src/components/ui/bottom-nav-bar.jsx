"use client";

import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Himnos", icon: "home", path: "/" },
  { label: "Categorias", icon: "bookmarks", path: "/categorias" },
  { label: "Favoritos", icon: "favorite", path: "/favoritos" },
  { label: "Novedades", icon: "campaign", path: "/novedades", menu: "novedades" },
];

const novedadesItems = [
  { label: "Reuniones", icon: "groups", path: "/novedades/reuniones" },
  { label: "Ubicaciones", icon: "location_on", path: "/novedades/ubicaciones" },
  { label: "Relatorio", icon: "article", path: "/novedades/relatorio" },
];

const MOBILE_LABEL_WIDTH = 92;

export function BottomNavBar({ className, stickyBottom = true }) {
  const { pathname } = useLocation();
  const [novedadesMenuPath, setNovedadesMenuPath] = useState(null);
  const isNovedadesOpen = novedadesMenuPath === pathname;

  const activeIndex = navItems.findIndex((item) =>
    item.path === "/"
      ? pathname === "/"
      : pathname === item.path || pathname.startsWith(item.path + "/")
  );
  const visualActiveIndex = isNovedadesOpen
    ? navItems.findIndex((item) => item.menu === "novedades")
    : activeIndex;

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
            transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.8 }}
            style={{ transformOrigin: "85% 100%" }}
            className="overflow-hidden rounded-[22px] border border-white/70 bg-white/85 p-1.5 shadow-[0_18px_55px_rgba(15,23,42,0.22)] backdrop-blur-2xl dark:border-white/[0.10] dark:bg-surfaceDark/85 dark:shadow-[0_18px_60px_rgba(0,0,0,0.48)]"
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
                      "group flex min-h-[58px] items-center gap-3.5 rounded-[17px] px-3.5 py-3 text-[17px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        role="navigation"
        aria-label="Bottom Navigation"
        className={cn(
          "relative w-full max-w-lg sm:max-w-md mx-auto bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-xl border border-borderLight dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden",
          className
        )}
      >
        <div className="flex items-center justify-center h-[66px] px-0.5 sm:h-[58px] sm:px-2">
          {navItems.map((item, idx) => {
            const isActive = visualActiveIndex === idx;
            const itemClassName = cn(
              "flex items-center gap-0 px-2.5 py-2.5 rounded-full transition-colors duration-200 relative h-[50px] min-w-[52px] min-h-[48px] max-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-11 sm:min-w-[50px] sm:min-h-[44px] sm:max-h-[48px] sm:px-3.5",
              isActive
                ? "bg-primary/10 dark:bg-primaryDark/15 text-primary dark:text-primaryDark"
                : "bg-transparent text-textSecondary dark:text-textSecondaryDark hover:bg-black/5 dark:hover:bg-white/5"
            );
            const content = (
              <>
                <span
                  aria-hidden
                  className={cn(
                    "material-icons-round text-[29px] transition-colors duration-200 leading-none sm:text-[25px]",
                    isActive
                      ? "text-primary dark:text-primaryDark"
                      : "text-textSecondary/40 dark:text-textSecondaryDark/35"
                  )}
                >
                  {item.icon}
                </span>

                <Motion.div
                  initial={false}
                  animate={{
                    width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? "8px" : "0px",
                  }}
                  transition={{
                    width: { type: "spring", stiffness: 350, damping: 32 },
                    opacity: { duration: 0.19 },
                    marginLeft: { duration: 0.19 },
                  }}
                  className="overflow-hidden flex items-center max-w-[92px] sm:max-w-[104px]"
                >
                  <span
                    className={cn(
                      "font-sans font-medium text-[15px] whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis sm:text-sm",
                      isActive
                        ? "text-primary dark:text-primaryDark"
                        : "opacity-0"
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                </Motion.div>
              </>
            );

            return (
              <Motion.div key={item.label} whileTap={{ scale: 0.97 }}>
                {item.menu === "novedades" ? (
                  <button
                    type="button"
                    className={itemClassName}
                    aria-label="Abrir novedades"
                    aria-controls="novedades-menu"
                    aria-expanded={isNovedadesOpen}
                    onClick={() => setNovedadesMenuPath(isNovedadesOpen ? null : pathname)}
                  >
                    {content}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={itemClassName}
                    aria-label={item.label}
                    onClick={() => setNovedadesMenuPath(null)}
                  >
                    {content}
                  </Link>
                )}
              </Motion.div>
            );
          })}
        </div>
      </Motion.nav>
    </div>
  );
}

export default BottomNavBar;

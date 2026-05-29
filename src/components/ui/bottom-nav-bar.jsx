"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Himnos", icon: "home", path: "/" },
  { label: "Categorias", icon: "bookmarks", path: "/categorias" },
  { label: "Favoritos", icon: "favorite", path: "/favoritos" },
  { label: "Novedades", icon: "map", path: "/novedades" },
  { label: "Configuracion", icon: "settings", path: "/configuracion" },
];

const MotionNav = m.nav;
const MotionItem = m.div;

export function BottomNavBar({ className, stickyBottom = true }) {
  const { pathname } = useLocation();

  const activeIndex = navItems.findIndex((item) =>
    item.path === "/"
      ? pathname === "/"
      : pathname === item.path || pathname.startsWith(item.path + "/")
  );

  return (
    <div
      className={cn(
        "left-0 right-0 z-[2000]",
        stickyBottom && "fixed bottom-0"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <LazyMotion features={domAnimation}>
        <MotionNav
          initial={{ scale: 0.97, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          aria-label="Bottom Navigation"
          className={cn(
            "relative w-full bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-xl border-x border-t border-borderLight dark:border-white/[0.07] rounded-t-2xl shadow-sm overflow-hidden",
            className
          )}
        >
          <div className="flex items-center justify-center h-[66px] px-0.5 sm:h-[58px] sm:px-2">
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <MotionItem key={item.label} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-0 px-2 py-2.5 rounded-full transition-colors duration-200 relative h-[50px] min-w-[46px] min-h-[48px] max-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-11 sm:min-w-[50px] sm:min-h-[44px] sm:max-h-[48px] sm:px-3.5",
                      isActive
                        ? "bg-primary/10 dark:bg-primaryDark/15 text-primary dark:text-primaryDark"
                        : "bg-transparent text-textSecondary dark:text-textSecondaryDark hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                    aria-label={item.label}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "material-icons-round text-[27px] transition-colors duration-200 leading-none sm:text-[25px]",
                        isActive
                          ? "text-primary dark:text-primaryDark"
                          : "text-textSecondary/40 dark:text-textSecondaryDark/35"
                      )}
                    >
                      {item.icon}
                    </span>

                    <div
                      className={cn(
                        "overflow-hidden flex items-center",
                        isActive
                          ? "ml-2 opacity-100"
                          : "ml-0 w-0 opacity-0",
                        isActive && "w-[76px] max-w-[76px] sm:max-w-[104px]"
                      )}
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
                    </div>
                  </Link>
                </MotionItem>
              );
            })}
          </div>
        </MotionNav>
      </LazyMotion>
    </div>
  );
}

export default BottomNavBar;

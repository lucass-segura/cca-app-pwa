"use client";

import { motion as Motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Himnos", icon: "home", path: "/" },
  { label: "Categorias", icon: "bookmarks", path: "/categorias" },
  { label: "Favoritos", icon: "favorite", path: "/favoritos" },
  { label: "Configuracion", icon: "settings", path: "/configuracion" },
];

const MOBILE_LABEL_WIDTH = 92;

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
        "left-0 right-0 z-20 px-1.5 sm:px-4",
        stickyBottom && "fixed bottom-0"
      )}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}
    >
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
            const isActive = activeIndex === idx;

            return (
              <Motion.div key={item.label} whileTap={{ scale: 0.97 }}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-0 px-2.5 py-2.5 rounded-full transition-colors duration-200 relative h-[50px] min-w-[52px] min-h-[48px] max-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-11 sm:min-w-[50px] sm:min-h-[44px] sm:max-h-[48px] sm:px-3.5",
                    isActive
                      ? "bg-primary/10 dark:bg-primaryDark/15 text-primary dark:text-primaryDark"
                      : "bg-transparent text-textSecondary dark:text-textSecondaryDark hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                  aria-label={item.label}
                >
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
                    className={cn("overflow-hidden flex items-center max-w-[92px] sm:max-w-[104px]")}
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
                </Link>
              </Motion.div>
            );
          })}
        </div>
      </Motion.nav>
    </div>
  );
}

export default BottomNavBar;

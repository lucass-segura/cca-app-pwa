import { useCallback, useEffect, useRef, useState } from 'react';
import { NEWS_VERSION, NEWS_ITEMS } from '../data/news';

const SEEN_KEY = 'news_seen_version';

function getSeenVersion() {
  try {
    return Number(localStorage.getItem(SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function NewsModal() {
  const [open, setOpen] = useState(() => getSeenVersion() < NEWS_VERSION);
  const acceptRef = useRef(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, String(NEWS_VERSION));
    } catch {
      // localStorage no disponible — cerramos igual
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    acceptRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      <button
        type="button"
        aria-label="Cerrar novedades"
        onClick={dismiss}
        className="absolute inset-0 bg-black/50 motion-safe:animate-fade-in"
      />

      <div className="relative w-full max-w-md motion-safe:animate-slide-up rounded-t-lg border-x border-t border-borderLight bg-white px-5 pb-7 pt-3 dark:border-white/10 dark:bg-surfaceDark">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-borderLight dark:bg-white/15" />

        <div className="mb-5">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-primary dark:text-primaryDark">
            Novedades
          </p>
          <h2
            id="news-modal-title"
            className="font-serif text-2xl font-bold leading-tight text-textPrimary dark:text-textPrimaryDark"
          >
            Nuevo en la app
          </h2>
        </div>

        <ul className="space-y-4">
          {NEWS_ITEMS.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-primaryDark/15 dark:text-primaryDark">
                <span className="material-icons-round text-[20px]" aria-hidden>
                  {item.icon}
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-sans text-sm font-semibold text-textPrimary dark:text-textPrimaryDark">
                  {item.title}
                </p>
                <p className="mt-0.5 font-sans text-sm leading-6 text-textSecondary dark:text-textSecondaryDark">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button
          ref={acceptRef}
          type="button"
          onClick={dismiss}
          className="mt-6 w-full rounded-md bg-primary py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-primaryDark dark:hover:bg-blue-500 dark:focus-visible:ring-offset-surfaceDark"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

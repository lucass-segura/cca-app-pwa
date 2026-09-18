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
  const closeRef = useRef(null);

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

    // El foco queda encerrado entre el botón de cerrar y el de aceptar: sin
    // esto el lector de pantalla se escapa al contenido de atrás, que está
    // oculto con aria-hidden pero sigue siendo tabulable.
    const onKey = (event) => {
      if (event.key === 'Escape') {
        dismiss();
        return;
      }
      if (event.key !== 'Tab') return;

      const first = closeRef.current;
      const last = acceptRef.current;
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
      className="fixed inset-0 z-[5000] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      {/* Capa de fondo: decorativa, el cierre accesible vive en los botones */}
      <div
        aria-hidden
        onClick={dismiss}
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] motion-safe:animate-fade-in dark:bg-black/65"
      />

      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-t-lg border-x border-t border-borderLight bg-white shadow-sm motion-safe:animate-slide-up dark:border-white/10 dark:bg-surfaceDark sm:rounded-lg sm:border"
        style={{ maxHeight: 'min(85vh, 40rem)' }}
      >
        {/* Cabecera */}
        <div className="relative shrink-0 px-5 pt-3">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-borderLight dark:bg-white/15 sm:hidden" />

          <button
            ref={closeRef}
            type="button"
            onClick={dismiss}
            aria-label="Cerrar novedades"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-textSecondary transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-textSecondaryDark dark:hover:bg-white/10 sm:top-4"
          >
            <span className="material-icons-round text-[20px]" aria-hidden>
              close
            </span>
          </button>

          <div className="pb-5 pr-10">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-primary dark:text-primaryDark">
              Novedades
            </p>
            <h2
              id="news-modal-title"
              className="mt-1 font-serif text-2xl font-bold leading-tight tracking-tight text-textPrimary dark:text-textPrimaryDark"
            >
              Nuevo en la app
            </h2>
          </div>
        </div>

        {/* Lista de novedades: separadas por línea, como un índice impreso */}
        <ul className="min-h-0 flex-1 overflow-y-auto border-t border-borderLight px-5 dark:border-white/[0.07]">
          {NEWS_ITEMS.map((item, index) => (
            <li
              key={item.title}
              className="animate-card-enter flex gap-3.5 border-b border-borderLight/70 py-4 last:border-b-0 dark:border-white/[0.06]"
              style={{ animationDelay: `${120 + index * 70}ms` }}
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-primaryDark/15 dark:text-primaryDark">
                <span className="material-icons-round text-[20px]" aria-hidden>
                  {item.icon}
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-sans text-sm font-semibold text-textPrimary dark:text-textPrimaryDark">
                  {item.title}
                </p>
                <p className="mt-1 font-sans text-sm leading-6 text-textSecondary dark:text-textSecondaryDark">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Acción */}
        <div
          className="shrink-0 border-t border-borderLight px-5 pt-4 dark:border-white/[0.07]"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)' }}
        >
          <button
            ref={acceptRef}
            type="button"
            onClick={dismiss}
            className="w-full rounded-md bg-primary py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-primaryDark dark:hover:bg-blue-500 dark:focus-visible:ring-offset-surfaceDark"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

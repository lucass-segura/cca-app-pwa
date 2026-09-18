import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHimnos } from '../hooks/useHimnos';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatTitle } from '../utils/utils';
import { useFontSize } from '../hooks/useFontSize';

export default function CoritoDetail() {
  const { id } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  const { coritos } = useHimnos();
  const corito = coritos.find((c) => c.corito.toString() === id);
  const { fontSize, aumentarLetra, reducirLetra } = useFontSize();

  if (!corito) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-bgLight dark:bg-bgDark">
        <span className="text-red-500 dark:text-red-400 text-xl font-medium">Corito no encontrado</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased">
      {/* Header */}
      <header className="app-header sticky top-0 z-10 border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            to="/"
            aria-label="Volver a himnos"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-textSecondary dark:text-textSecondaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <h1 className="flex-1 font-serif font-bold text-lg truncate text-primary/85 dark:text-primaryDark">
            {corito.corito}. {formatTitle(corito.titulo)}
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Font size controls */}
      <div className="max-w-md mx-auto flex justify-end px-4 pt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reducirLetra}
            aria-label="Reducir tamaño de letra"
            className="px-3 py-1.5 rounded bg-transparent text-primary dark:text-primaryDark text-sm font-medium border border-primary/25 dark:border-primaryDark/25 hover:bg-primary/5 dark:hover:bg-primaryDark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            A-
          </button>
          <button
            type="button"
            onClick={aumentarLetra}
            aria-label="Aumentar tamaño de letra"
            className="px-3 py-1.5 rounded bg-transparent text-primary dark:text-primaryDark text-sm font-medium border border-primary/25 dark:border-primaryDark/25 hover:bg-primary/5 dark:hover:bg-primaryDark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            A+
          </button>
        </div>
      </div>

      {/* Corito content */}
      <div className="max-w-md mx-auto p-4">
        {corito.coro.split('\n').map((line, i) => (
          <span
            key={`${i}-${line}`}
            style={{ fontSize, lineHeight: `${fontSize * 1.5}px` }}
            className="block font-himn font-normal"
          >
            {line}
          </span>
        ))}
        <div className="h-10" />
      </div>
    </div>
  );
}

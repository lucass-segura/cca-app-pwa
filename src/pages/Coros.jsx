import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedHimnoPreview } from '../components/HimnoPreview';
import { ThemeToggle } from '../components/ThemeToggle';
import { useHimnos } from '../hooks/useHimnos';
import { useFavorites } from '../hooks/useFavorites';
import { normalizeText, textMatchesQuery } from '../utils/utils';

export default function Coros() {
  const { coros } = useHimnos();
  const { favorites, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedY = sessionStorage.getItem('coros_scroll');
    if (savedY) {
      window.scrollTo(0, parseInt(savedY));
      sessionStorage.removeItem('coros_scroll');
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const results = useMemo(() => {
    if (!searchQuery) return coros;

    const q = normalizeText(searchQuery);
    return coros.filter(
      (coro) =>
        textMatchesQuery(coro.titulo, q) ||
        Object.values(coro.letra).some((v) => textMatchesQuery(v, q))
    );
  }, [coros, searchQuery]);

  const noResults = searchQuery && results.length === 0;

  return (
    <div className="app-shell min-h-screen text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      <header className="app-header sticky top-0 z-10 border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            to="/categorias"
            aria-label="Volver a categorías"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-textSecondary dark:text-textSecondaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <h1 className="flex-1 font-serif font-bold text-2xl tracking-tight text-textPrimary dark:text-textPrimaryDark">
            Coros avulsos
          </h1>
          <ThemeToggle />
        </div>

        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-textSecondary dark:text-primaryDark opacity-70">
                search
              </span>
            </div>
            <input
              type="text"
              aria-label="Buscar coro avulso"
              className="block w-full pl-10 pr-10 py-3 border border-white/90 dark:border-white/[0.09] rounded-md leading-5 bg-white/75 dark:bg-surfaceDark/70 backdrop-blur-md placeholder-textSecondary dark:placeholder-textSecondaryDark/50 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark text-sm transition-[border-color,background-color,box-shadow]"
              placeholder="Buscar coro avulso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary dark:text-textSecondaryDark"
              >
                <span className="material-icons-round text-lg">close</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        {!searchQuery && (
          <p className="mb-4 text-sm text-textSecondary dark:text-textSecondaryDark">
            Coros sueltos, sin numeración de himnario.
          </p>
        )}

        {noResults ? (
          <div className="flex items-start justify-center p-4">
            <div className="flex items-center gap-3 border border-borderLight dark:border-white/10 bg-white/70 dark:bg-surfaceDark/65 px-4 py-3 rounded-md backdrop-blur-md">
              <span className="material-icons-round text-textSecondary dark:text-textSecondaryDark" aria-hidden>
                search_off
              </span>
              <span className="text-sm text-textSecondary dark:text-textSecondaryDark font-medium">
                No se encontraron resultados
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((coro, index) => (
              <AnimatedHimnoPreview
                key={coro.slug}
                himno={coro}
                index={index}
                isFavorite={favorites.has(`a_${coro.slug}`)}
                onToggleFavorite={() => toggleFavorite(`a_${coro.slug}`)}
                scrollKey="coros_scroll"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

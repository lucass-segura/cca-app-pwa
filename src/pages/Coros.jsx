import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedHimnoPreview } from '../components/HimnoPreview';
import { ThemeToggle } from '../components/ThemeToggle';
import { useHimnos } from '../hooks/useHimnos';
import { useFavorites } from '../hooks/useFavorites';

const normalizeText = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/,/g, '')
    .toLowerCase();

const textMatchesQuery = (text, query) => normalizeText(text).indexOf(query) !== -1;

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
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            to="/categorias"
            aria-label="Volver a categorías"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-textSecondary dark:text-textSecondaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <h1 className="flex-1 font-serif font-bold text-2xl tracking-tight text-primary/85 dark:text-primaryDark">
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
              className="block w-full pl-10 pr-10 py-3 border border-borderLight dark:border-white/[0.08] rounded-md leading-5 bg-white dark:bg-surfaceDark placeholder-textSecondary dark:placeholder-textSecondaryDark/50 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark text-sm transition-all"
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
            <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 p-4 rounded-xl shadow-sm">
              <span className="material-icons-round text-red-600 dark:text-red-400" aria-hidden>
                search_off
              </span>
              <span className="text-base text-red-600 dark:text-red-400 font-medium">
                No se encontraron resultados
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
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

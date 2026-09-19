import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedHimnoPreview } from '../components/HimnoPreview';
import { ThemeToggle } from '../components/ThemeToggle';
import { useHimnos } from '../hooks/useHimnos';
import { useFavorites } from '../hooks/useFavorites';

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/,/g, '')
    .toLowerCase();
};

const textMatchesQuery = (text, query) => normalizeText(text).indexOf(query) !== -1;

export default function Home() {
  const { himnos, coritos } = useHimnos();
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite } = useFavorites();

  // Restaurar posición de scroll al volver desde un himno/corito
  useEffect(() => {
    const savedY = sessionStorage.getItem('home_scroll');
    if (savedY) {
      window.scrollTo(0, parseInt(savedY));
      sessionStorage.removeItem('home_scroll');
    }
  }, []);

  const sections = useMemo(() => {
    const allSections = [
      { title: 'Coritos', data: coritos.map((c) => ({ ...c, type: 'corito' })) },
      { title: 'Himnos', data: himnos.map((h) => ({ ...h, type: 'himno' })) },
    ];

    if (!searchQuery) return allSections;

    const q = normalizeText(searchQuery);
    const filteredSections = [];

    for (const section of allSections) {
      const data = section.data.filter((item) => {
          if (item.type === 'corito') {
            return (
              textMatchesQuery(item.corito.toString(), q) ||
              textMatchesQuery(item.titulo, q) ||
              textMatchesQuery(item.coro, q)
            );
          }
          return (
            textMatchesQuery(item.himno.toString(), q) ||
            textMatchesQuery(item.titulo, q) ||
            Object.values(item.letra).some((v) => textMatchesQuery(v, q))
          );
      });

      if (data.length > 0) {
        filteredSections.push({ ...section, data });
      }
    }

    return filteredSections;
  }, [searchQuery, himnos, coritos]);

  const noResults = searchQuery && sections.length === 0;

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary/85 dark:text-primaryDark">
            Himnos
          </h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/configuracion"
              aria-label="Configuración"
              className="relative size-10 shrink-0 rounded-full flex items-center justify-center
                         text-textSecondary dark:text-textSecondaryDark
                         hover:bg-black/5 dark:hover:bg-white/10
                         active:scale-90 transition-transform duration-150
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="material-icons-round text-[22px]" aria-hidden>
                settings
              </span>
            </Link>
          </div>
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
              aria-label="Buscar himno o corito"
              className="block w-full pl-10 pr-10 py-3 border border-borderLight dark:border-white/[0.08] rounded-md leading-5 bg-white dark:bg-surfaceDark placeholder-textSecondary dark:placeholder-textSecondaryDark/50 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark text-sm transition-all"
              placeholder="Buscar himno o corito..."
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

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 pt-6">
        {noResults ? (
          <div className="flex items-start justify-center p-4">
            <div className="flex items-center bg-red-100 dark:bg-red-900/30 p-4 rounded-xl shadow-sm">
              <span className="text-2xl mr-2">😞</span>
              <span className="text-base text-red-600 dark:text-red-400 font-medium">
                No se encontraron resultados
              </span>
            </div>
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <div key={section.title} className="mb-6">
              <div
                className="animate-card-enter flex items-center justify-between mb-4"
                style={{ animationDelay: `${sectionIndex * 120}ms` }}
              >
                <h2 className="text-xl font-bold font-serif text-primary/85 dark:text-primaryDark">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3">
                {section.data.flatMap((item, index) => {
                  const key =
                    item.type === 'corito'
                      ? `c_${item.corito}`
                      : `h_${item.himno}`;
                  const elements = [];
                  const isFirstJovenes =
                    item.type === 'himno' &&
                    item.himno >= 431 &&
                    !section.data.slice(0, index).some((i) => i.type === 'himno' && i.himno >= 431);
                  if (isFirstJovenes) {
                    elements.push(
                      <div key="sep-jovenes" className="relative flex items-center py-2">
                        <div className="flex-1 border-t border-borderLight dark:border-white/10" />
                        <span className="px-3 text-xs font-sans font-medium text-textSecondary dark:text-textSecondaryDark uppercase tracking-wider text-center">
                          Reuniones de Jóvenes y Niños
                        </span>
                        <div className="flex-1 border-t border-borderLight dark:border-white/10" />
                      </div>
                    );
                  }
                  elements.push(
                    <AnimatedHimnoPreview
                      key={key}
                      himno={item}
                      index={index}
                      isFavorite={favorites.has(key)}
                      onToggleFavorite={() => toggleFavorite(key)}
                    />
                  );
                  return elements;
                })}
              </div>
            </div>
          ))
        )}
      </main>

    </div>
  );
}

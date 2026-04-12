import { useState, useMemo, useEffect } from 'react';
import { AnimatedHimnoPreview } from '../components/HimnoPreview';
import { BottomNav } from '../components/BottomNav';
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
    return allSections
      .map((section) => ({
        ...section,
        data: section.data.filter((item) => {
          if (item.type === 'corito') {
            return (
              normalizeText(item.corito.toString()).includes(q) ||
              normalizeText(item.titulo).includes(q) ||
              normalizeText(item.coro).includes(q)
            );
          }
          return (
            normalizeText(item.himno.toString()).includes(q) ||
            normalizeText(item.titulo).includes(q) ||
            Object.values(item.letra).some((v) => normalizeText(v).includes(q))
          );
        }),
      }))
      .filter((section) => section.data.length > 0);
  }, [searchQuery, himnos, coritos]);

  const noResults = searchQuery && sections.length === 0;

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary/85 dark:text-primaryDark">
            Himnos
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
              className="block w-full pl-10 pr-10 py-3 border border-borderLight dark:border-white/[0.08] rounded-md leading-5 bg-white dark:bg-surfaceDark placeholder-textSecondary dark:placeholder-textSecondaryDark/50 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark text-sm transition-all"
              placeholder="Buscar himno o corito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
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
          sections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-serif text-primary/85 dark:text-primaryDark">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3">
                {section.data.map((item, index) => {
                  const key =
                    item.type === 'corito'
                      ? `c_${item.corito}`
                      : `h_${item.himno}`;
                  return (
                    <AnimatedHimnoPreview
                      key={key}
                      himno={item}
                      index={index}
                      isFavorite={favorites.has(key)}
                      onToggleFavorite={() => toggleFavorite(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}

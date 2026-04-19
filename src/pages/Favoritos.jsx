import { useMemo } from 'react';
import { AnimatedHimnoPreview } from '../components/HimnoPreview';
import { BottomNav } from '../components/BottomNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { useHimnos } from '../hooks/useHimnos';
import { useFavorites } from '../hooks/useFavorites';

export default function Favoritos() {
  const { himnos, coritos } = useHimnos();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteItems = useMemo(() => {
    const items = [];
    for (const key of favorites) {
      if (key.startsWith('c_')) {
        const id = parseInt(key.substring(2));
        const corito = coritos.find((c) => c.corito === id);
        if (corito) items.push({ ...corito, type: 'corito', _key: key });
      } else if (key.startsWith('h_')) {
        const id = parseInt(key.substring(2));
        const himno = himnos.find((h) => h.himno === id);
        if (himno) items.push({ ...himno, type: 'himno', _key: key });
      }
    }
    return items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'corito' ? -1 : 1;
      const aNum = a.type === 'corito' ? a.corito : a.himno;
      const bNum = b.type === 'corito' ? b.corito : b.himno;
      return aNum - bNum;
    });
  }, [favorites, himnos, coritos]);

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary dark:text-primaryDark">
            Favoritos
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-textSecondary dark:text-textSecondaryDark">
            <span className="material-icons-round text-6xl mb-4 opacity-30">favorite_border</span>
            <p className="text-lg font-medium">No tienes favoritos</p>
            <p className="text-sm mt-1 opacity-70">Toca el corazón en un himno para guardarlo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteItems.map((item, index) => (
              <AnimatedHimnoPreview
                key={item._key}
                himno={item}
                index={index}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(item._key)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { AnimatedHimnoPreview } from '../components/HimnoPreview';
import { BottomNav } from '../components/BottomNav';
import { useHimnos } from '../hooks/useHimnos';
import { useFavorites } from '../hooks/useFavorites';
import { getCategoriaById } from '../data/categorias';

export default function CategoriaDetalle() {
  const { id } = useParams();
  const categoria = getCategoriaById(id);
  const { himnos } = useHimnos();
  const { favorites, toggleFavorite } = useFavorites();

  if (!categoria) {
    return (
      <div className="min-h-screen bg-bgLight dark:bg-bgDark flex items-center justify-center">
        <p className="text-textSecondary dark:text-textSecondaryDark font-sans text-sm">
          Categoría no encontrada
        </p>
      </div>
    );
  }

  const set = new Set(categoria.himnos);
  const items = himnos
    .filter((h) => set.has(h.himno))
    .sort((a, b) => a.himno - b.himno)
    .map((h) => ({ ...h, type: 'himno' }));

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/categorias"
            className="flex items-center justify-center w-8 h-8 -ml-1 rounded text-textSecondary dark:text-textSecondaryDark hover:text-textPrimary dark:hover:text-textPrimaryDark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Volver a categorías"
          >
            <span className="material-icons-round text-xl">arrow_back</span>
          </Link>

          {/* Accent dot */}
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${categoria.accent}`} />

          <h1 className="font-serif font-bold text-xl tracking-tight text-textPrimary dark:text-textPrimaryDark flex-1">
            {categoria.label}
          </h1>

          <span className="text-xs font-sans text-textSecondary dark:text-textSecondaryDark shrink-0">
            {items.length} himnos
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        <div className="space-y-3">
          {items.map((item, index) => {
            const key = `h_${item.himno}`;
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
      </main>

      <BottomNav />
    </div>
  );
}

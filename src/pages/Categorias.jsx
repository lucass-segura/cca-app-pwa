import { Link } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { CATEGORIAS_GROUPS } from '../data/categorias';

function CategoryCard({ cat, index }) {
  const shouldAnimate = index < 10;

  return (
    <div
      className={shouldAnimate ? 'animate-card-enter' : undefined}
      style={shouldAnimate ? { animationDelay: `${index * 40}ms` } : undefined}
    >
      <Link to={`/categorias/${cat.id}`} className="block no-underline text-inherit">
        <article className="group relative flex items-center p-4 bg-white dark:bg-surfaceDark rounded-xl border border-borderLight dark:border-white/[0.07] hover:border-primary/30 dark:hover:border-white/[0.15] transition-[border-color,transform] duration-200 active:scale-[0.99] cursor-pointer">

          {/* Acento de color — mismo espacio que el número en HimnoPreview */}
          <div className="shrink-0 w-12 h-12 flex items-center justify-center mr-4">
            <span className={`w-3 h-3 rounded-full ${cat.accent} opacity-80`} />
          </div>

          {/* Nombre + conteo */}
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-serif font-semibold text-base text-textPrimary dark:text-textPrimaryDark leading-snug group-hover:text-primary dark:group-hover:text-primaryDark transition-colors">
              {cat.label}
            </h3>
            <p className="font-sans text-xs text-textSecondary dark:text-textSecondaryDark mt-0.5">
              {cat.himnos.length} himnos
            </p>
          </div>

          {/* Flecha — mismo espacio que el favorito en HimnoPreview */}
          <div className="shrink-0 w-9 h-9 flex items-center justify-center">
            <span className="material-icons-round text-textSecondary/30 dark:text-textSecondaryDark/30 text-xl group-hover:text-textSecondary/60 dark:group-hover:text-textSecondaryDark/60 transition-colors">
              chevron_right
            </span>
          </div>

        </article>
      </Link>
    </div>
  );
}

export default function Categorias() {
  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">

      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary/85 dark:text-primaryDark">
            Categorías
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        {CATEGORIAS_GROUPS.map((group, groupIndex) => (
          <div key={group.group} className="mb-6">
            {/* Título de sección con la misma animación que las cards */}
            <div
              className="animate-card-enter flex items-center justify-between mb-4"
              style={{ animationDelay: `${groupIndex * 120}ms` }}
            >
              <h2 className="text-xl font-bold font-serif text-primary/85 dark:text-primaryDark">
                {group.group}
              </h2>
            </div>
            <div className="space-y-3">
              {group.items.map((cat) => {
                const idx = globalIndex++;
                return <CategoryCard key={cat.id} cat={cat} index={idx} />;
              })}
            </div>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}

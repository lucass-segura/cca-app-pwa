import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHimnos } from '../hooks/useHimnos';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatTitle } from '../utils/utils';
import { useFontSize } from '../hooks/useFontSize';

export default function CoroDetail() {
  const { slug } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  const { coros } = useHimnos();
  const coro = coros.find((c) => c.slug === slug);
  const { fontSize, aumentarLetra, reducirLetra } = useFontSize();

  if (!coro) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-bgLight dark:bg-bgDark">
        <span className="text-red-500 dark:text-red-400 text-xl font-medium">Coro no encontrado</span>
      </div>
    );
  }

  const { letra } = coro;

  // `letra` es una lista ordenada de bloques: se muestran en el mismo orden que
  // en el cuadernillo. Sólo los versos llevan número; el coro va sangrado.
  let versoCount = 0;
  const bloques = letra.map((bloque) => ({
    ...bloque,
    numero: bloque.tipo === 'coro' ? null : ++versoCount,
  }));

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            to="/coros"
            aria-label="Volver a coros avulsos"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-textSecondary dark:text-textSecondaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <h1 className="flex-1 font-serif font-bold text-lg truncate text-primary/85 dark:text-primaryDark">
            {formatTitle(coro.titulo)}
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
            className="px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primaryDark/10 text-primary dark:text-primaryDark text-sm font-medium border border-primary/20 dark:border-primaryDark/25 hover:bg-primary/20 dark:hover:bg-primaryDark/20 transition-colors"
          >
            A-
          </button>
          <button
            type="button"
            onClick={aumentarLetra}
            aria-label="Aumentar tamaño de letra"
            className="px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primaryDark/10 text-primary dark:text-primaryDark text-sm font-medium border border-primary/20 dark:border-primaryDark/25 hover:bg-primary/20 dark:hover:bg-primaryDark/20 transition-colors"
          >
            A+
          </button>
        </div>
      </div>

      {/* Coro content */}
      <div className="max-w-md mx-auto p-4">
        {bloques.map((bloque, index) =>
          bloque.tipo === 'coro' ? (
            <p
              key={index}
              style={{ fontSize: fontSize + 2, lineHeight: `${(fontSize + 2) * 1.5}px` }}
              className="ml-8 mt-4 font-himn font-bold whitespace-pre-line"
            >
              {bloque.texto}
            </p>
          ) : (
            <div key={index} className="flex items-start mt-3">
              <span
                style={{ fontSize, lineHeight: `${fontSize * 1.5}px` }}
                className="mr-2 font-himn font-medium text-primary dark:text-primaryDark shrink-0"
              >
                {bloque.numero}.
              </span>
              <p
                style={{ fontSize, lineHeight: `${fontSize * 1.5}px` }}
                className="flex-1 font-himn font-normal whitespace-pre-line"
              >
                {bloque.texto}
              </p>
            </div>
          )
        )}
        <div className="h-10" />
      </div>
    </div>
  );
}

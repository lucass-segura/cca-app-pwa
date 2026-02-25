import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHimnos } from '../hooks/useHimnos';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatTitle } from '../utils/utils';

export default function CoritoDetail() {
  const { id } = useParams();
  const { coritos } = useHimnos();
  const corito = coritos.find((c) => c.corito.toString() === id);

  const [fontSize, setFontSize] = useState(22);
  const aumentarLetra = () => setFontSize((prev) => Math.min(prev + 2, 40));
  const reducirLetra = () => setFontSize((prev) => Math.max(prev - 2, 20));

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
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            to="/"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-textSecondary dark:text-textSecondaryDark"
          >
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <h1 className="flex-1 font-serif font-bold text-lg truncate text-primary dark:text-primaryDark">
            {corito.corito}. {formatTitle(corito.titulo)}
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Font size controls */}
      <div className="max-w-md mx-auto flex justify-end px-4 pt-4">
        <div className="flex gap-2">
          <button
            onClick={reducirLetra}
            className="px-3 py-1.5 rounded-lg bg-primary dark:bg-primaryDark/20 text-white dark:text-primaryDark text-sm font-medium border border-transparent dark:border-primaryDark/30 hover:opacity-90 transition-all"
          >
            A-
          </button>
          <button
            onClick={aumentarLetra}
            className="px-3 py-1.5 rounded-lg bg-primary dark:bg-primaryDark/20 text-white dark:text-primaryDark text-sm font-medium border border-transparent dark:border-primaryDark/30 hover:opacity-90 transition-all"
          >
            A+
          </button>
        </div>
      </div>

      {/* Corito content */}
      <div className="max-w-md mx-auto p-4">
        {corito.coro.split('\n').map((line, i) => (
          <span
            key={i}
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

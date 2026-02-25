import { BottomNav } from '../components/BottomNav';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Configuracion() {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-20">
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary dark:text-primaryDark">
            Configuración
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white dark:bg-surfaceDark rounded-xl border border-borderLight dark:border-gray-800 shadow-sm overflow-hidden">
          <button
            onClick={toggle}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-xl text-textSecondary dark:text-textSecondaryDark">
                {isDark ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="font-medium">Modo oscuro</span>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isDark ? 'left-[22px]' : 'left-[2px]'}`} />
            </div>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

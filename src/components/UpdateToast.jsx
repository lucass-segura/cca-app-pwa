import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdateToast() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [show, setShow] = useState(needRefresh);

  useEffect(() => {
    if (needRefresh) {
      const t = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(t);
    }
  }, [needRefresh]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="bg-primary text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-himn text-xl">
        <span>Nueva versión disponible</span>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-white text-primary px-3 py-1 rounded-lg font-himn font-semibold text-lg cursor-pointer"
        >
          Actualizar
        </button>
        <button
          onClick={() => setShow(false)}
          className="text-white/70 hover:text-white text-lg cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

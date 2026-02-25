import { useState } from 'react';

/* ── SVG Icons ── */

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

/* ── iOS Wizard ── */

const iosSteps = [
  {
    content: (ShareIcon) => (
      <>
        <p className="text-[22px] font-himn text-white/80 text-center leading-snug mb-6">
          Toca el icono de <strong className="text-white">Compartir</strong> en la barra de Safari
        </p>
        <div className="flex justify-center mb-4">
          <div className="glass-tile rounded-2xl p-5 text-white/70">
            <ShareIcon />
          </div>
        </div>
        <p className="text-base font-himn text-white/35 text-center">
          Está en la parte inferior de la pantalla
        </p>
      </>
    ),
  },
  {
    content: () => (
      <>
        <p className="text-[22px] font-himn text-white/80 text-center leading-snug mb-6">
          Desplázate y selecciona:
        </p>
        <div className="glass-tile rounded-2xl px-5 py-4 flex items-center gap-4">
          <span className="text-2xl text-white/60">+</span>
          <span className="text-xl font-himn text-white font-medium">Agregar a inicio</span>
        </div>
      </>
    ),
  },
  {
    content: () => (
      <>
        <p className="text-[22px] font-himn text-white/80 text-center leading-snug mb-6">
          Confirma tocando <strong className="text-white">"Agregar"</strong> arriba a la derecha
        </p>
        <div className="flex justify-center mb-4">
          <div className="glass-tile rounded-2xl px-8 py-4">
            <span className="text-xl font-himn text-white font-semibold">Agregar</span>
          </div>
        </div>
        <p className="text-base font-himn text-white/35 text-center mt-2">
          Aparecerá en tu pantalla de inicio
        </p>
      </>
    ),
  },
];

/* ── Android Wizard ── */

const androidSteps = [
  {
    content: (_, MenuIcon) => (
      <>
        <p className="text-[22px] font-himn text-white/80 text-center leading-snug mb-6">
          Toca el menú <strong className="text-white">⋮</strong> en la esquina superior derecha
        </p>
        <div className="flex justify-center mb-4">
          <div className="glass-tile rounded-2xl p-5 text-white/70">
            <MenuIcon />
          </div>
        </div>
        <p className="text-base font-himn text-white/35 text-center">
          Los tres puntos verticales
        </p>
      </>
    ),
  },
  {
    content: () => (
      <>
        <p className="text-[22px] font-himn text-white/80 text-center leading-snug mb-6">
          Selecciona la opción:
        </p>
        <div className="glass-tile rounded-2xl px-5 py-4 flex items-center gap-4">
          <span className="text-2xl text-white/60">+</span>
          <span className="text-xl font-himn text-white font-medium">Instalar aplicación</span>
        </div>
        <p className="text-base font-himn text-white/35 text-center mt-4">
          o "Agregar a pantalla de inicio"
        </p>
      </>
    ),
  },
  {
    content: () => (
      <>
        <p className="text-[22px] font-himn text-white/80 text-center leading-snug mb-6">
          Confirma tocando <strong className="text-white">"Instalar"</strong>
        </p>
        <div className="flex justify-center mb-4">
          <div className="glass-tile rounded-2xl px-8 py-4">
            <span className="text-xl font-himn text-white font-semibold">Instalar</span>
          </div>
        </div>
        <p className="text-base font-himn text-white/35 text-center mt-2">
          Aparecerá en tu pantalla de inicio
        </p>
      </>
    ),
  },
];

function WizardStep({ step, onNext, onBack, onClose, os }) {
  const steps = os === 'ios' ? iosSteps : androidSteps;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="absolute inset-0 bg-[#0c1929]/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm">
        <p className="text-xs font-himn text-white/30 text-center mb-3 tracking-widest uppercase">
          Paso {step + 1} de {steps.length}
        </p>

        <div className="glass-panel rounded-3xl p-8 min-h-[260px] flex flex-col justify-center">
          <div className="animate-fade-in" key={step}>
            {current.content(ShareIcon, MenuIcon)}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-white/70' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Nav */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={onBack}
              className="flex-1 py-3.5 glass-tile rounded-full text-white/70 text-lg font-himn cursor-pointer"
            >
              Atrás
            </button>
          )}
          <button
            onClick={step < steps.length - 1 ? onNext : onClose}
            className="flex-1 py-3.5 bg-white/15 border border-white/20 rounded-full text-white text-lg font-himn font-semibold cursor-pointer active:scale-[0.97] transition-transform"
          >
            {step < steps.length - 1 ? 'Siguiente' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Install Screen ── */

export function InstallScreen({ os, install, canInstall }) {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const handleInstall = () => {
    if (os === 'ios') {
      // iOS siempre muestra el wizard porque no soporta beforeinstallprompt
      setWizardStep(0);
      setShowWizard(true);
    } else if (canInstall) {
      // Android con prompt nativo disponible
      install();
    } else {
      // Android sin prompt nativo - mostrar wizard manual
      setWizardStep(0);
      setShowWizard(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1929] via-[#132d4a] to-[#0c1929] flex items-center justify-center font-himn text-white overflow-hidden relative">

      <main className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center">
        {/* App icon */}
        <div className="mb-8">
          <img
            src="/icon-192.png"
            alt="Himnos"
            className="w-24 h-24 rounded-[22px] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-1">
            Himnos
          </h1>
          <p className="text-lg text-white/40 font-medium">
            Himnario de Música
          </p>
        </div>

        {/* Glass panel */}
        <div className="glass-panel w-full rounded-3xl p-5 space-y-3 mb-8">
          <div className="glass-tile rounded-2xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-[#7eb8e0] shrink-0">
              <BookIcon />
            </div>
            <div>
              <p className="font-bold text-white text-xl leading-snug">480 Himnos</p>
              <p className="text-base text-[#7eb8e0]">Colección completa y coritos</p>
            </div>
          </div>

          <div className="glass-tile rounded-2xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-[#7eb8e0] shrink-0">
              <WifiOffIcon />
            </div>
            <div>
              <p className="font-bold text-white text-xl leading-snug">Sin Conexión</p>
              <p className="text-base text-[#7eb8e0]">Disponible en cualquier lugar</p>
            </div>
          </div>

          <div className="glass-tile rounded-2xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-[#7eb8e0] shrink-0">
              <BoltIcon />
            </div>
            <div>
              <p className="font-bold text-white text-xl leading-snug">Rápida y Ligera</p>
              <p className="text-base text-[#7eb8e0]">Optimizada para tu dispositivo</p>
            </div>
          </div>
        </div>

        {/* Install button */}
        <button
          onClick={handleInstall}
          className="w-full py-4 bg-white/12 border border-white/15 rounded-full text-white font-semibold text-xl cursor-pointer active:scale-[0.97] transition-transform duration-150 flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <DownloadIcon />
          <span>Instalar</span>
        </button>

        <p className="mt-8 text-xs text-white/20">v1.0</p>
      </main>

      {/* Install Wizard */}
      {showWizard && (
        <WizardStep
          step={wizardStep}
          os={os}
          onNext={() => setWizardStep(s => s + 1)}
          onBack={() => setWizardStep(s => s - 1)}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}

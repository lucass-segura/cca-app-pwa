import himnos from '../data/himnos.json';
import coritos from '../data/coritos.json';

// Las letras viajan empaquetadas en el build y se entregan en cada deploy
// vía el service worker (registerType: 'autoUpdate'). Para actualizar el
// contenido, editá estos JSON y volvé a desplegar — no hay descarga aparte
// ni versiones que mantener en sync.
export function useHimnos() {
  return { himnos, coritos };
}

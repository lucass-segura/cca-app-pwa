import { useMemo } from 'react';
import himnos from '../data/himnos.json';
import coritos from '../data/coritos.json';
import corosAvulsos from '../data/coros-avulsos.json';
import { slugify } from '../utils/utils';

// Las letras viajan empaquetadas en el build y se entregan en cada deploy
// vía el service worker (registerType: 'autoUpdate'). Para actualizar el
// contenido, editá estos JSON y volvé a desplegar — no hay descarga aparte
// ni versiones que mantener en sync.

// Los coros avulsos no tienen número de himnario: el campo `himno` del JSON es
// sólo el orden del archivo. Lo descartamos acá para que ningún componente lo
// confunda con un himno y para que la identidad sea el slug del título, que
// sobrevive a un reordenamiento del archivo.
// Un título ausente rompía `slugify` (llama a `normalize`) y, como este hook lo
// ejecuta al importarse, el fallo tumbaba toda la app y no sólo la vista de
// coros. Descartamos la entrada inválida en vez de propagar la excepción.
const coros = corosAvulsos
  .filter(({ titulo }) => typeof titulo === 'string' && titulo.trim() !== '')
  .map(({ titulo, letra }) => ({
    slug: slugify(titulo),
    titulo,
    letra,
  }));

export function useHimnos() {
  return useMemo(() => ({ himnos, coritos, coros }), []);
}

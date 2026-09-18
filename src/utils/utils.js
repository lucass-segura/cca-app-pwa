// Stable, URL-safe identifier derived from a title. Used by coros avulsos,
// which have no hymnal number: their position in the JSON file is not an
// identity, so favorites and routes key off the slug instead.
export const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Búsqueda tolerante: sin acentos, sin comas, minúsculas. Compartida por la
// búsqueda de Home y la de Coros para que ambas se comporten igual.
export const normalizeText = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/,/g, '')
    .toLowerCase();

export const textMatchesQuery = (text, query) =>
  normalizeText(text).indexOf(query) !== -1;

export const formatTitle = (title) => {
    const specialWords = ['Jesús', 'Cordero', 'Dios', 'Maestro', 'Pastor', 'Cristo', 'Señor', 'Espíritu', 'Santo', 'Creador', 'Redentor', 'Salvador', 'Rey', 'Padre', 'Aleluya', 'Gloria', 'Roca'];
    const punctuation = new Set(['?', '¿', '¡', '!', ',', '.', ':', ';']);
  
    const capitalize = (word) => {
      let index = 0;
      while (index < word.length && punctuation.has(word[index])) {
        index++;
      }
      if (index < word.length) {
        return word.slice(0, index) + word[index].toUpperCase() + word.slice(index + 1);
      }
      return word;
    };
  
    const words = title.trim().replace(/\s\s+/g, ' ').toLowerCase().split(' ');
  
    const formattedWords = words.map((word, index) => {
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      if (index === 0 || specialWords.some(sw => cleanWord.toLowerCase().includes(sw.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase()))) {
        return capitalize(word);
      }
      return word;
    });
  
    return formattedWords.join(' ');
  };
  

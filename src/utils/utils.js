export const formatTitle = (title) => {
    const specialWords = ['Jesús', 'Cordero', 'Dios', 'Maestro', 'Pastor', 'Cristo', 'Señor', 'Espíritu', 'Santo', 'Creador', 'Redentor', 'Salvador', 'Rey', 'Padre', 'Aleluya', 'Gloria', 'Roca'];
    const punctuation = ['?', '¿', '¡', '!', ',', '.', ':', ';'];
  
    const capitalize = (word) => {
      let index = 0;
      while (index < word.length && punctuation.includes(word[index])) {
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
  
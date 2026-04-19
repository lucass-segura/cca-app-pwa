export const TAGS = [
  { id: 'apertura',     label: 'Apertura'     },
  { id: 'oracion',      label: 'Oración'      },
  { id: 'palabra',      label: 'Palabra'      },
  { id: 'finalizacion', label: 'Finalización' },
  { id: 'bautismo',     label: 'Bautismo'     },
  { id: 'santacena',    label: 'Santa Cena'   },
  { id: 'funeral',      label: 'Funeral'      },
];

export const HIMNO_TAGS = {
  apertura:     [84, 96, 101, 113, 116, 122, 147, 148, 152, 217, 258],
  oracion:      [4, 14, 49, 62, 63, 79, 88, 106, 110, 132, 142, 169, 177, 260, 282, 297, 351, 363, 371, 402, 469],
  palabra:      [3, 26, 31, 45, 48, 51, 52, 67, 73, 77, 94, 115, 119, 128, 138, 144, 168, 170, 173, 178, 179, 184, 196, 211, 238, 268, 293, 308, 310, 321, 375, 393, 401, 407, 452],
  finalizacion: [125, 136, 150, 172, 201, 230, 271, 115, 451],
  bautismo:     [85, 93, 167, 66, 318, 174, 161, 107, 175, 163, 316, 227, 41, 406, 155, 223, 67, 157, 323, 404, 60, 369, 68, 405, 181, 224, 308, 154, 64, 331, 75, 183],
  santacena:    [412, 415, 417, 425, 419, 408, 411, 416, 414, 420, 413, 422, 410, 424, 421, 423, 418],
  funeral:      [250, 158, 428, 426, 430, 429, 427],
};

export const himnoTagsMap = new Map();
for (const [tag, numeros] of Object.entries(HIMNO_TAGS)) {
  for (const num of numeros) {
    if (!himnoTagsMap.has(num)) himnoTagsMap.set(num, []);
    himnoTagsMap.get(num).push(tag);
  }
}

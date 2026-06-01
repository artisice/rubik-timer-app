const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
const modifiers = ['', "'", '2'];

export function generateScramble(cubeType) {
  const length = cubeType === '2x2' ? 8 : 20;
  let scramble = [];
  let lastFace = '';

  for (let i = 0; i < length; i++) {
    let face;
    do {
      face = faces[Math.floor(Math.random() * faces.length)];
    } while (face === lastFace);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(face + modifier);
    lastFace = face;
  }

  return scramble.join(' ');
}
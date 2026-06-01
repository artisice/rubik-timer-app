const SOLVED_STATE = {
  U: Array(9).fill('W'),
  R: Array(9).fill('R'),
  F: Array(9).fill('G'),
  D: Array(9).fill('Y'),
  L: Array(9).fill('O'),
  B: Array(9).fill('B'),
};

const rotateFace = (face) => [
  face[6], face[3], face[0],
  face[7], face[4], face[1],
  face[8], face[5], face[2],
];

function applyMove(state, move) {
  let newState = JSON.parse(JSON.stringify(state));
  
  const face = move.charAt(0);
  const modifier = move.charAt(1);

  const times = modifier === '2' ? 2 : (modifier === "'" ? 3 : 1);

  for (let i = 0; i < times; i++) {
    newState[face] = rotateFace(newState[face]);

    if (face === 'U') {
      const temp = [newState.F[0], newState.F[1], newState.F[2]];
      [newState.F[0], newState.F[1], newState.F[2]] = [newState.R[0], newState.R[1], newState.R[2]];
      [newState.R[0], newState.R[1], newState.R[2]] = [newState.B[0], newState.B[1], newState.B[2]];
      [newState.B[0], newState.B[1], newState.B[2]] = [newState.L[0], newState.L[1], newState.L[2]];
      [newState.L[0], newState.L[1], newState.L[2]] = temp;
    } else if (face === 'D') {
      const temp = [newState.F[6], newState.F[7], newState.F[8]];
      [newState.F[6], newState.F[7], newState.F[8]] = [newState.L[6], newState.L[7], newState.L[8]];
      [newState.L[6], newState.L[7], newState.L[8]] = [newState.B[6], newState.B[7], newState.B[8]];
      [newState.B[6], newState.B[7], newState.B[8]] = [newState.R[6], newState.R[7], newState.R[8]];
      [newState.R[6], newState.R[7], newState.R[8]] = temp;
    } else if (face === 'R') {
      const temp = [newState.F[2], newState.F[5], newState.F[8]];
      [newState.F[2], newState.F[5], newState.F[8]] = [newState.D[2], newState.D[5], newState.D[8]];
      [newState.D[2], newState.D[5], newState.D[8]] = [newState.B[6], newState.B[3], newState.B[0]];
      [newState.B[6], newState.B[3], newState.B[0]] = [newState.U[2], newState.U[5], newState.U[8]];
      [newState.U[2], newState.U[5], newState.U[8]] = temp;
    } else if (face === 'L') {
      const temp = [newState.F[0], newState.F[3], newState.F[6]];
      [newState.F[0], newState.F[3], newState.F[6]] = [newState.U[0], newState.U[3], newState.U[6]];
      [newState.U[0], newState.U[3], newState.U[6]] = [newState.B[8], newState.B[5], newState.B[2]];
      [newState.B[8], newState.B[5], newState.B[2]] = [newState.D[0], newState.D[3], newState.D[6]];
      [newState.D[0], newState.D[3], newState.D[6]] = temp;
    } else if (face === 'F') {
      const temp = [newState.U[6], newState.U[7], newState.U[8]];
      [newState.U[6], newState.U[7], newState.U[8]] = [newState.L[8], newState.L[5], newState.L[2]];
      [newState.L[8], newState.L[5], newState.L[2]] = [newState.D[2], newState.D[1], newState.D[0]];
      [newState.D[2], newState.D[1], newState.D[0]] = [newState.R[0], newState.R[3], newState.R[6]];
      [newState.R[0], newState.R[3], newState.R[6]] = temp;
    } else if (face === 'B') {
      const temp = [newState.U[2], newState.U[1], newState.U[0]];
      [newState.U[2], newState.U[1], newState.U[0]] = [newState.R[8], newState.R[5], newState.R[2]];
      [newState.R[8], newState.R[5], newState.R[2]] = [newState.D[6], newState.D[7], newState.D[8]];
      [newState.D[6], newState.D[7], newState.D[8]] = [newState.L[0], newState.L[3], newState.L[6]];
      [newState.L[0], newState.L[3], newState.L[6]] = temp;
    }
  }
  return newState;
}

export function getCubeState(scrambleString) {
  let state = JSON.parse(JSON.stringify(SOLVED_STATE));
  if (!scrambleString) return state;

  const moves = scrambleString.split(' ').filter(m => m.trim() !== '');
  
  for (const move of moves) {
    state = applyMove(state, move);
  }
  
  return state;
}
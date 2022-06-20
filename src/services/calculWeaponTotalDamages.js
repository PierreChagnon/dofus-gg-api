//Fonction de calcul des dégats totaux des lignes de dégats de l'arme
export default function (linesArr) {
  let fromTotal = 0;
  let toTotal = 0;

  for (let i = 0; i < linesArr.length; i++) {
    const line = linesArr[i];
    const from = line[0];
    const to = line[1];

    fromTotal += from;
    toTotal += to;
  }

  return [fromTotal, toTotal];
}

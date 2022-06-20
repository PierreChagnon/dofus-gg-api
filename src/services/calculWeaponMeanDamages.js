//Fonction de calcul des dégats moyens
export default function (totalNormalDamages, totalCritDamages, CC) {
  const from = Math.round(
    totalNormalDamages[0] * (1 - CC / 100) + (totalCritDamages[0] * CC) / 100
  );
  const to = Math.round(
    totalNormalDamages[1] * (1 - CC / 100) + (totalCritDamages[1] * CC) / 100
  );

  const meanDamages = [from, to];

  return meanDamages;
}

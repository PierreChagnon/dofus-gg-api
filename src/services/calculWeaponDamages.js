//Fonction de calcul des dégâts pour chaque ligne de dégât de l'arme
export default function (baseDamages, statName, totalStats, crit, dist) {
  //TO DO//
  //-25% pour les dégats de zones (marteau, pelles etc.)
  //Disabled les dégats mêlée pour Arc, Baguette
  /////////

  //"crit" est un booléen pour savoir si on calcul
  //des dégats normaux ou critiques
  //"dist" idem mais pour la distance

  const puissance =
    totalStats["Puissance"] !== undefined ? Number(totalStats["Puissance"]) : 0;
  let fixDamages =
    totalStats[`Dommages ${statName}`] !== undefined
      ? Number(totalStats[`Dommages ${statName}`])
      : 0;
  const critDamages =
    totalStats["Dommages Critiques"] !== undefined
      ? Number(totalStats["Dommages Critiques"])
      : 0;

  let primaryCarac;

  //On associe la bonne caractéristique primaire au nom de la stat
  if (statName === "Terre") {
    primaryCarac = totalStats["Force"] !== undefined ? totalStats["Force"] : 0;
  } else if (statName === "Feu") {
    primaryCarac =
      totalStats["Intelligence"] !== undefined ? totalStats["Intelligence"] : 0;
  } else if (statName === "Eau") {
    primaryCarac =
      totalStats["Chance"] !== undefined ? totalStats["Chance"] : 0;
  } else if (statName === "Air") {
    primaryCarac =
      totalStats["Agilité"] !== undefined ? totalStats["Agilité"] : 0;
  } else if (statName === "rendus") {
    primaryCarac =
      totalStats["Intelligence"] !== undefined ? totalStats["Intelligence"] : 0;
  }

  //Si c'est un CC on ajoute les dommages crit
  if (crit) {
    fixDamages += critDamages;
  }

  const damages = Math.round(
    baseDamages * ((puissance + primaryCarac + 100) / 100) + fixDamages
  );

  return damages;
}

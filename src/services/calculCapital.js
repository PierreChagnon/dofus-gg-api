export default function calculCapital(baseStats) {
  const currentVita = Number(baseStats["Vitalité"]);
  const currentSagesse = Number(baseStats["Sagesse"]);
  const currentForce = Number(baseStats["Force"]);
  const currentIntel = Number(baseStats["Intelligence"]);
  const currentChance = Number(baseStats["Chance"]);
  const currentAgi = Number(baseStats["Agilité"]);

  var points = 0;
  var palier = 0;
  const arr = [currentForce, currentIntel, currentChance, currentAgi];
  //Pour Vita et Sagesse qui ont des paliers fixes
  points += currentVita;
  points += currentSagesse * 3;
  //Pour les autres carac
  for (let i = 0; i < arr.length; i++) {
    //On définit le palier
    const stat = arr[i];
    palier = Math.floor(stat / 100) + 1;

    for (let i = 1; i < palier; i++) {
      //Puis on calcul le nombre de points pour chaque palier
      points += i * 100;
    }
    //Enfin, on s'occupe des points restant (pas multiple de 100) dans le dernier palier
    points += palier * (stat - (palier - 1) * 100);
  }
  return points;
}

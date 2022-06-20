//Permet de faire une liste de stat pour le filtre
//A partir de baseStats
export default function (baseStats) {
  var list = [];
  Object.keys(baseStats).forEach((stat) => {
    list.push(stat);
  });
  return list;
}

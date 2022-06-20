//Cette fonction doit renvoyer un objet simple des caractéristiques de l'item
//Utilisable dans le composant Weapon ou pour le calcul des dégats
export default function (weapon) {
  //On analyse d'abords les lignes de dégâts
  let damages = [];
  for (let i = 0; i < weapon.stats.length; i++) {
    const string = weapon.stats[i];
    if (string.includes("(")) {
      const stat = string.match(/\(([^)]+)\)/); //stat[1] retourne les caractères entre les parenthèses
      //console.log(stat);
      const bothValue = string.match(/-*\d+/g);
      //console.log(bothValue);
      const obj = {
        name: stat[1],
        value: [bothValue[0], bothValue[1]]
      };
      damages.push(obj);
    }
  }
  console.log(damages);
  return damages;
}

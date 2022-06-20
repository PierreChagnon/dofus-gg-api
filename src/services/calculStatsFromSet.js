import set from "../json/set.json";
export default function calculStatsFromSet(stuff) {
    //On crée un tableau qui énumère les id de pano
    //des différents items du stuff
    let arr = [];
    let setNames = [];
    Object.keys(stuff).forEach((item) => {
        const currentItem = stuff[item];
        const setID = currentItem.set.setID;
        if (setID !== undefined) {
            arr.push(setID);
        }
    });

    //le reducer nous renvoi le nombre d'occurences
    //de chaque panoplie dans le stuff
    var numberOfItemsByID = arr.reduce(function(obj, b) {
        obj[b] = ++obj[b] || 1;
        return obj;
    }, {});
    //console.log(numberOfItemsByID);

    //Maintenant on veut connaitre les bonus de  panoplie
    //d'après la  variable "numberOfItemsByID" obtenue (le nombre d'occurence de chaque id)
    //On énumère set et on regarde si les keys de "numberOfItemsByID"
    //correspondent à un set.id
    let bonus = [];
    set.forEach((set) => {
        const setID = set.id;
        const setName = set.name;
        Object.keys(numberOfItemsByID).forEach((id) => {
            const setIdFromStuff = id;
            const numberOfItems = numberOfItemsByID[id];

            //si set.id correspond à un id de pano du stuff
            if (setID === setIdFromStuff) {
                //on ajuste l'index pour faire correspondre le nombre d'items au bon bonus
                const bonusIndex = Number(numberOfItems - 2);
                //Si il y a au moins 2 items de la pano
                //car sinon pas de bonus
                if (numberOfItems >= 2) {
                    bonus.push(set.bonus[bonusIndex]);
                    setNames.push(setName);
                }
            }
        });
    });
    //On obtient un array d'object
    //(qu'on pourra renvoyer tel quel pour l'affichage des stats, on renverra deux formats de données)
    //il faut ensuite
    //manipuler pour obtenir le paires key:value des stats
    //console.log(bonus);

    let setStatRaw = [];
    var finalRes = {};

    for (let i = 0; i < bonus.length; i++) {
        const bonusFromASet = bonus[i];
        for (let j = 0; j < bonusFromASet.length; j++) {
            const string = bonusFromASet[j];
            const value = Number(string.match(/-*\d+/));
            const key = string.replace(/-*\d+ */, "");
            setStatRaw.push({ name: key, value: value });
        }
    }
    //console.log(setStatRaw);

    //Ici on additionne les stats identiques
    const res = Array.from(
        setStatRaw.reduce(
            (m, { name, value }) => m.set(name, (m.get(name) || 0) + value),
            new Map()
        ),
        ([name, value]) => ({ name, value })
    );
    //console.log(res);

    //Faisons un tableau simple des caracs:
    //ex : [Vitalité : 900, PA: 7, ...]
    for (let i = 0; i < res.length; i++) {
        const stat = res[i];
        const key = stat.name;
        const value = stat.value;

        finalRes = {...finalRes, [key]: value };
    }
    //On obtient le resultat final exploitable pour faire le totalStat par la suite
    //console.log(finalRes);

    //On peut remanier les variables "bonus" et "setNames"
    //pour avoir le nom de la panoplie correspondant au bonus
    //Pour faciliter l'affichage dans le DOM
    let bonusAndNames = [];
    for (let i = 0; i < bonus.length; i++) {
        const currentBonus = bonus[i];
        const currentName = setNames[i];
        const obj = { name: currentName, bonus: currentBonus };
        bonusAndNames.push(obj);
    }
    //console.log(finalRes, bonusAndNames);

    //On retourne deux résultats
    //Le premier est le résultat final du calcul des stats
    //Le deuxième est le tableau des bonus, pour l'affichage dans le DOM
    return [finalRes, bonusAndNames];
}